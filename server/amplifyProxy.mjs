const route='/api/assistant/<*>';

export function assistantProxyRules(current=[],target,{remove=false,previousTarget}={}){
  if(!/^https:\/\/[a-z0-9]+\.lambda-url\.[a-z0-9-]+\.on\.aws\/api\/assistant\/<\*>$/.test(target))throw new Error('Invalid assistant backend URL');
  const own=current.find(rule=>rule.source===route);
  if(own&&![target,previousTarget].includes(own.target)){
    if(remove)return current;
    throw new Error('An existing assistant proxy belongs to another backend. Review it before connecting.');
  }
  const others=current.filter(rule=>rule.source!==route);
  return remove?others:[{source:route,target,status:'200'},...others];
}

export async function updateAmplifyProxy(event,{client,commands,fetcher=fetch}={}){
  const properties=event.ResourceProperties;
  const physicalId=event.PhysicalResourceId||`will-assistant-proxy-${properties.AppId}`;
  let status='SUCCESS',reason='Assistant API proxy configured.';
  try{
    if(event.RequestType==='Update'&&event.OldResourceProperties?.AppId!==properties.AppId)throw new Error('Create a separate stack to connect a different Amplify app.');
    if(!client){const sdk=await import('@aws-sdk/client-amplify');client=new sdk.AmplifyClient({});commands=sdk;}
    const app=await client.send(new commands.GetAppCommand({appId:properties.AppId}));
    const before=app.app.customRules||[];
    const rules=assistantProxyRules(before,properties.TargetUrl,{remove:event.RequestType==='Delete',previousTarget:event.OldResourceProperties?.TargetUrl});
    if(JSON.stringify(before)!==JSON.stringify(rules))await client.send(new commands.UpdateAppCommand({appId:properties.AppId,customRules:rules}));
  }catch(error){
    if(event.RequestType==='Delete'&&error.name==='NotFoundException')reason='The Amplify app was already removed.';
    else{status='FAILED';reason=/^(An existing assistant proxy|Create a separate stack)/.test(error.message)?error.message:'Could not update the Amplify API proxy. Check app ID, region and stack role permissions.';}
  }
  const body=JSON.stringify({Status:status,Reason:reason,PhysicalResourceId:physicalId,StackId:event.StackId,RequestId:event.RequestId,LogicalResourceId:event.LogicalResourceId,NoEcho:false,Data:{Route:route}});
  const response=await fetcher(event.ResponseURL,{method:'PUT',headers:{'Content-Type':'','Content-Length':String(Buffer.byteLength(body))},body});
  if(!response.ok)throw new Error('Could not acknowledge the AWS stack request');
  return {status,physicalId};
}

export const handler=event=>updateAmplifyProxy(event);
