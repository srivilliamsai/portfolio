import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import {PassThrough} from 'node:stream';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {assistantProxyRules,updateAmplifyProxy} from '../server/amplifyProxy.mjs';
import {createAssistantTemplate} from '../scripts/package-assistant.mjs';

const target='https://abc123.lambda-url.ap-south-1.on.aws/api/assistant/<*>';
const spa={source:'/<*>',target:'/index.html',status:'200'};
function comparableTemplate(template){
  const copy=structuredClone(template);
  for(const resource of Object.values(copy.Resources)){
    const code=resource.Properties?.Code;
    if(!code?.ZipFile)continue;
    const payload=code.ZipFile.match(/Buffer\.from\('([A-Za-z0-9+/=]+)','base64'\)/)?.[1];
    assert.ok(payload,'Expected an embedded Lambda bundle');
    // zlib versions may emit different gzip bytes for identical code across Node/OS releases.
    const digest=createHash('sha256').update(gunzipSync(Buffer.from(payload,'base64'))).digest('hex');
    code.ZipFile=code.ZipFile.replace(payload,digest);
  }
  return copy;
}
test('assistant rewrite precedes and preserves existing SPA/custom routes; rollback removes only its own route',()=>{
  const existing=[{source:'/old',target:'/new',status:'301'},spa];
  const connected=assistantProxyRules(existing,target);assert.deepEqual(connected.slice(1),existing);assert.equal(connected[0].source,'/api/assistant/<*>');
  assert.deepEqual(assistantProxyRules(connected,target),connected);
  assert.deepEqual(assistantProxyRules(connected,target,{remove:true}),existing);
  const next=target.replace('abc123','def456');assert.equal(assistantProxyRules(connected,next,{previousTarget:target})[0].target,next);
  assert.throws(()=>assistantProxyRules(connected,next),/another backend/);
  assert.deepEqual(assistantProxyRules(connected,next,{remove:true}),connected);
  assert.throws(()=>assistantProxyRules(existing,'http://untrusted.test/<*>'),/Invalid/);
});

class GetAppCommand{constructor(input){this.input=input;}}
class UpdateAppCommand{constructor(input){this.input=input;}}
const commands={GetAppCommand,UpdateAppCommand};
const cfEvent={RequestType:'Create',ResourceProperties:{AppId:'d229cwpntq8yz1',TargetUrl:target},ResponseURL:'https://cloudformation-response.test',StackId:'stack',RequestId:'request',LogicalResourceId:'connection'};
test('custom resource updates only app rewrite rules and acknowledges the stack without exposing keys',async()=>{
  const calls=[],acks=[];
  const result=await updateAmplifyProxy(cfEvent,{commands,client:{send:async command=>{calls.push(command);return command instanceof GetAppCommand?{app:{customRules:[spa]}}:{};}},fetcher:async(url,options)=>{acks.push(JSON.parse(options.body));return {ok:true};}});
  assert.equal(result.status,'SUCCESS');assert.equal(calls.length,2);assert.deepEqual(Object.keys(calls[1].input).sort(),['appId','customRules']);assert.deepEqual(calls[1].input.customRules[1],spa);assert.equal(acks[0].Status,'SUCCESS');
});
test('custom resource safely handles an already-deleted app and reports access denial or conflicting routes',async()=>{
  for(const [RequestType,name,expected]of [['Delete','NotFoundException','SUCCESS'],['Create','NotFoundException','FAILED'],['Delete','AccessDeniedException','FAILED']]){
    let acknowledgement;await updateAmplifyProxy({...cfEvent,RequestType},{commands,client:{send:async()=>{throw Object.assign(new Error('private-provider-error'),{name});}},fetcher:async(url,options)=>{acknowledgement=JSON.parse(options.body);return {ok:true};}});
    assert.equal(acknowledgement.Status,expected);assert.doesNotMatch(acknowledgement.Reason,/private-provider-error/);
  }
});

test('upload template is reproducible, keeps the permanent key server-side, and deploys executable streaming code',async()=>{
  const template=await createAssistantTemplate(),saved=JSON.parse(await readFile(new URL('../deployment/will-assistant-stack.json',import.meta.url),'utf8'));
  assert.deepEqual(comparableTemplate(template),comparableTemplate(saved),'Regenerate the deployment file with npm run assistant:package after backend changes.');
  assert.ok(Buffer.byteLength(JSON.stringify(template,null,2))<1024*1024);assert.equal(template.Parameters.GeminiApiKey.NoEcho,true);
  const keyPattern=new RegExp('^(?:'+template.Parameters.GeminiApiKey.AllowedPattern+')$','u');
  // Synthetic format examples only. Never put actual provider credentials in tests.
  for(const key of ['AQ.synthetic-key_with.dot-123456','AIzaSynthetic_key-with-123456'])assert.equal(keyPattern.test(key),true);
  for(const value of [' AQ.synthetic-key-123456','AQ.synthetic key-123456','"AQ.synthetic-key-123456"','GEMINI_API_KEY=AQ.synthetic-key-123456'])assert.equal(keyPattern.test(value),false);
  const resources=template.Resources;assert.deepEqual(resources.GeminiSecret.Properties.SecretString,{Ref:'GeminiApiKey'});
  assert.equal(JSON.stringify(resources.AssistantFunction.Properties.Environment).includes('GeminiApiKey'),false);
  assert.equal(resources.AssistantUrl.Properties.InvokeMode,'RESPONSE_STREAM');assert.equal(resources.AssistantUrlPermission.Properties.Action,'lambda:InvokeFunctionUrl');assert.equal(resources.AssistantInvokePermission.Properties.InvokedViaFunctionUrl,true);
  assert.deepEqual(resources.AssistantRole.Properties.Policies[0].PolicyDocument.Statement[0].Resource,{Ref:'GeminiSecret'});
  assert.match(JSON.stringify(resources.ProxyRole.Properties.Policies),/apps\/\$\{AmplifyAppId\}/);
  // Execute exactly the compressed CommonJS entrypoint uploaded to AWS, without provider/network calls.
  const module={exports:{}},require=createRequire(import.meta.url);
  runInNewContext(resources.AssistantFunction.Properties.Code.ZipFile,{module,exports:module.exports,require,Buffer,console,setTimeout,clearTimeout,URL,URLSearchParams,AbortController,TextDecoder,TextEncoder,process:{env:{},argv:[]},awslambda:{streamifyResponse:handler=>handler,HttpResponseStream:{from:(output,metadata)=>{output.metadata=metadata;return output;}}}},{timeout:10000});
  assert.equal(typeof module.exports.handler,'function');
  const output=new PassThrough(),chunks=[];output.on('data',chunk=>chunks.push(chunk));
  await module.exports.handler({rawPath:'/api/assistant/status',requestContext:{http:{method:'GET',sourceIp:'test'}},headers:{}},output);
  assert.equal(output.metadata.statusCode,200);assert.equal(JSON.parse(Buffer.concat(chunks)).provider,'local');
  const proxy={exports:{}};runInNewContext(resources.ProxyFunction.Properties.Code.ZipFile,{module:proxy,exports:proxy.exports,require,Buffer,fetch:async()=>({ok:true}),process:{env:{}},console},{timeout:10000});assert.equal(typeof proxy.exports.handler,'function');

  // Load the real bundled Gemini SDK and exercise its wire format against a mocked provider.
  const configured={exports:{}},requests=[];
  const fetcher=async(url,options)=>{
    requests.push({url:String(url),options});
    const value=String(url).includes('auth_tokens')?{name:'ephemeral-test-token'}:{candidates:[{content:{role:'model',parts:[String(url).includes('streamGenerateContent')?{text:'DineDesk connects restaurant workflows.'}:{inlineData:{mimeType:'audio/L16;codec=pcm;rate=24000',data:'AQACAA=='}}]}}]};
    return new Response(String(url).includes('streamGenerateContent')?'data: '+JSON.stringify(value)+'\n\n':JSON.stringify(value),{headers:{'content-type':String(url).includes('streamGenerateContent')?'text/event-stream':'application/json'}});
  };
  runInNewContext(resources.AssistantFunction.Properties.Code.ZipFile,{module:configured,exports:configured.exports,require,Buffer,console,setTimeout,clearTimeout,URL,URLSearchParams,AbortController,TextDecoder,TextEncoder,Headers,Request,Response,ReadableStream,fetch:fetcher,process:{env:{ASSISTANT_PROVIDER:'gemini',GEMINI_API_KEY:'private-sdk-placeholder'},argv:[]},awslambda:{streamifyResponse:handler=>handler,HttpResponseStream:{from:(stream,metadata)=>{stream.metadata=metadata;return stream;}}}},{timeout:10000});
  for(const [route,body,expected]of [['chat',{question:'Explain DineDesk'},/"provider":"gemini"/],['tts',{text:'Hello Villiam'},/^RIFF/],['live-session',{},/ephemeral-test-token/]]){
    const stream=new PassThrough(),parts=[];stream.on('data',chunk=>parts.push(chunk));
    await configured.exports.handler({rawPath:'/api/assistant/'+route,body:JSON.stringify(body),headers:{},requestContext:{http:{method:'POST',sourceIp:'test'}}},stream);
    assert.equal(stream.metadata.statusCode,200,route);assert.match(Buffer.concat(parts).toString(),expected,route);assert.doesNotMatch(Buffer.concat(parts).toString(),/private-sdk-placeholder/);
  }
  assert.equal(requests.length,3);
});
