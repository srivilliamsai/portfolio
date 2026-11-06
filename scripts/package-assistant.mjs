import {build} from 'esbuild';
import {gzipSync} from 'node:zlib';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const ref=name=>({Ref:name});
const attr=(name,key)=>({'Fn::GetAtt':[name,key]});
const sub=value=>({'Fn::Sub':value});
const join=values=>({'Fn::Join':['',values]});

async function inlineBundle(entry){
  const result=await build({absWorkingDir:root,entryPoints:[entry],bundle:true,write:false,platform:'node',target:'node22',format:'cjs',minify:true,legalComments:'inline',external:['@aws-sdk/*'],define:{'import.meta.url':'undefined','import.meta.env':'{}'}});
  const compressed=gzipSync(result.outputFiles[0].contents,{level:9}).toString('base64');
  // CloudFormation's inline Lambda entrypoint is CommonJS. Ship dependencies without a separate S3/ZIP upload.
  return `new Function('require','module','exports',require('node:zlib').gunzipSync(Buffer.from('${compressed}','base64')).toString())(require,module,exports);\n`;
}

export async function createAssistantTemplate(){
  const [apiCode,proxyCode]=await Promise.all([inlineBundle('server/assistantLambda.mjs'),inlineBundle('server/amplifyProxy.mjs')]);
  const trust={Version:'2012-10-17',Statement:[{Effect:'Allow',Principal:{Service:'lambda.amazonaws.com'},Action:'sts:AssumeRole'}]};
  const role=policies=>({Type:'AWS::IAM::Role',Properties:{AssumeRolePolicyDocument:trust,ManagedPolicyArns:[sub('arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole')],Policies:policies}});
  const policy=(name,action,resource)=>({PolicyName:name,PolicyDocument:{Version:'2012-10-17',Statement:[{Effect:'Allow',Action:action,Resource:resource}]}});
  const target=join([attr('AssistantUrl','FunctionUrl'),'api/assistant/<*>']);
  const template={
    AWSTemplateFormatVersion:'2010-09-09',
    Description:'WILL portfolio assistant: Gemini secret, streamed Lambda API and automatic Amplify API rewrite. Creates billable AWS resources; Gemini usage is billed by Google.',
    Metadata:{'AWS::CloudFormation::Interface':{ParameterGroups:[{Label:{default:'Required: paste your existing Gemini key'},Parameters:['GeminiApiKey']},{Label:{default:'Portfolio connection: defaults match Villiam’s Amplify app'},Parameters:['AmplifyAppId','FrontendOrigin']},{Label:{default:'Optional: Gemini models and voice'},Parameters:['TextModel','TtsModel','LiveModel','VoiceName']}]}},
    Parameters:{
      GeminiApiKey:{Type:'String',NoEcho:true,MinLength:20,MaxLength:512,AllowedPattern:'[A-Za-z0-9_.-]+',ConstraintDescription:'Enter only the API key: letters, numbers, dots, underscores or hyphens, with no spaces or quotes.',Description:'Paste your Gemini API key here, without quotes or spaces. Dots in AQ-format keys are accepted. Stored only in Secrets Manager; never placed in the frontend.'},
      AmplifyAppId:{Type:'String',Default:'d229cwpntq8yz1',AllowedPattern:'d[a-z0-9]+',Description:'Existing Amplify app in the same AWS account and region. This stack adds its assistant rewrite.'},
      FrontendOrigin:{Type:'String',Default:'https://main.d229cwpntq8yz1.amplifyapp.com',AllowedPattern:'https://[A-Za-z0-9.-]+(?::[0-9]+)?',Description:'Exact HTTPS website origin with no trailing slash or path. For a custom domain, use that domain.'},
      TextModel:{Type:'String',Default:'gemini-3.1-flash-lite',Description:'Model ID available to your Gemini API key.'},
      TtsModel:{Type:'String',Default:'gemini-3.1-flash-tts-preview'},
      LiveModel:{Type:'String',Default:'gemini-3.8-live'},
      VoiceName:{Type:'String',Default:'Algieba'}
    },
    Resources:{
      GeminiSecret:{Type:'AWS::SecretsManager::Secret',Properties:{Description:'Permanent Gemini key used only by the WILL backend.',SecretString:ref('GeminiApiKey')}},
      AssistantRole:role([policy('ReadGeminiSecret','secretsmanager:GetSecretValue',ref('GeminiSecret'))]),
      AssistantFunction:{Type:'AWS::Lambda::Function',Properties:{Description:'WILL streamed chat, WAV speech and constrained Live session tokens.',Runtime:'nodejs22.x',Handler:'index.handler',Role:attr('AssistantRole','Arn'),MemorySize:512,Timeout:60,Code:{ZipFile:apiCode},Environment:{Variables:{ASSISTANT_PROVIDER:'gemini',GEMINI_SECRET_ARN:ref('GeminiSecret'),ASSISTANT_ALLOWED_ORIGINS:ref('FrontendOrigin'),GEMINI_TEXT_MODEL:ref('TextModel'),GEMINI_TTS_MODEL:ref('TtsModel'),GEMINI_LIVE_MODEL:ref('LiveModel'),VILL_VOICE_NAME:ref('VoiceName')}}}},
      AssistantLogs:{Type:'AWS::Logs::LogGroup',Properties:{LogGroupName:join(['/aws/lambda/',ref('AssistantFunction')]),RetentionInDays:7}},
      AssistantUrl:{Type:'AWS::Lambda::Url',Properties:{AuthType:'NONE',InvokeMode:'RESPONSE_STREAM',TargetFunctionArn:attr('AssistantFunction','Arn')}},
      AssistantUrlPermission:{Type:'AWS::Lambda::Permission',Properties:{FunctionName:ref('AssistantFunction'),Action:'lambda:InvokeFunctionUrl',Principal:'*',FunctionUrlAuthType:'NONE'}},
      AssistantInvokePermission:{Type:'AWS::Lambda::Permission',Properties:{FunctionName:ref('AssistantFunction'),Action:'lambda:InvokeFunction',Principal:'*',InvokedViaFunctionUrl:true}},
      ProxyRole:role([policy('ConnectThisAmplifyApp',['amplify:GetApp','amplify:UpdateApp'],sub('arn:${AWS::Partition}:amplify:${AWS::Region}:${AWS::AccountId}:apps/${AmplifyAppId}'))]),
      ProxyFunction:{Type:'AWS::Lambda::Function',Properties:{Description:'Adds/removes only this stack’s assistant rewrite, preserving other Amplify rules.',Runtime:'nodejs22.x',Handler:'index.handler',Role:attr('ProxyRole','Arn'),MemorySize:128,Timeout:60,Code:{ZipFile:proxyCode}}},
      ProxyLogs:{Type:'AWS::Logs::LogGroup',Properties:{LogGroupName:join(['/aws/lambda/',ref('ProxyFunction')]),RetentionInDays:7}},
      AmplifyApiConnection:{Type:'Custom::WillAmplifyProxy',DependsOn:['AssistantUrlPermission','AssistantInvokePermission','AssistantLogs','ProxyLogs'],Properties:{ServiceToken:attr('ProxyFunction','Arn'),ServiceTimeout:'120',AppId:ref('AmplifyAppId'),TargetUrl:target}}
    },
    Outputs:{
      StatusUrl:{Description:'Open after CREATE_COMPLETE. Must show JSON with provider gemini; this confirms configuration, not a successful paid model call.',Value:join([ref('FrontendOrigin'),'/api/assistant/status'])},
      BackendStatusUrl:{Description:'Direct backend status for diagnosing an Amplify proxy problem.',Value:join([attr('AssistantUrl','FunctionUrl'),'api/assistant/status'])},
      AssistantFunctionName:{Description:'Lambda function; use its CloudWatch logs for request failures.',Value:ref('AssistantFunction')},
      GeminiSecretArn:{Description:'Secret location for future key rotation; this output never includes the key.',Value:ref('GeminiSecret')}
    }
  };
  if(Buffer.byteLength(JSON.stringify(template,null,2))>1024*1024)throw new Error('Template exceeds the CloudFormation S3 upload limit');
  return template;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  const template=await createAssistantTemplate();
  const output=path.join(root,'deployment/will-assistant-stack.json');
  await mkdir(path.dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify(template,null,2)+'\n');
  console.log(`Created deployment/will-assistant-stack.json (${Math.ceil(Buffer.byteLength(JSON.stringify(template,null,2))/1024)} KiB). Contains code and parameter definitions, no API key. No AWS resources were created.`);
}
