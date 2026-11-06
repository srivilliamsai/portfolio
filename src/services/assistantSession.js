import {displayOwnerName,withOwnerName} from './assistantIdentity.js';
import { assistantApiPath } from './assistantApi.js';
export const INPUT_LIMIT=1200;
export const MESSAGE_LIMIT=60;
export function appendMessages(messages,...incoming) {
  const next=[...messages];
  for(const item of incoming) {if(!item?.content?.trim())continue;const last=next.at(-1);if(last?.role===item.role&&last.content===item.content)continue;next.push({...item,content:item.content.slice(0,14000)});}
  return next.slice(-MESSAGE_LIMIT);
}
export function transcriptForProvider(messages) {return messages.slice(-12).filter(m=>['user','assistant'].includes(m.role)).map(({role,content})=>({role,content:content.slice(0,3000)}));}
export function parseSse() {
  let buffer='';
  return {push(chunk,final=false){buffer=(buffer+chunk).replace(/\r\n/g,'\n');const parts=buffer.split('\n\n');buffer=parts.pop()||'';if(final&&buffer){parts.push(buffer);buffer='';}return parts.flatMap(part=>{const data=part.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trim()).join('\n');if(!data||data==='[DONE]')return [];try{return [JSON.parse(data)];}catch{return [];}});}};
}
export async function streamChat(question,context,messages,{signal,onDelta,fetcher=fetch,timeoutMs=20000}={}) {
  const controller=new AbortController();
  const cancel=()=>controller.abort(signal.reason);
  if(signal?.aborted)cancel();else signal?.addEventListener('abort',cancel,{once:true});
  const timeout=setTimeout(()=>controller.abort(new Error('The connection timed out.')),timeoutMs);
  let reader;
  try {
    const response=await fetcher(assistantApiPath('/chat'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:question.slice(0,INPUT_LIMIT),context,messages:transcriptForProvider(messages)}),signal:controller.signal});
    if(!response.ok||!response.body)throw new Error(response.status===429?'WILL is taking a short break. Please try again shortly.':'The connection is unavailable.');
    reader=response.body.getReader();const decoder=new TextDecoder(),parser=parseSse();let text='',result={};
    const consume=events=>{for(const event of events){if(event.error)throw new Error(event.error);if(event.delta){text+=event.delta;onDelta?.(displayOwnerName(text));}if(event.result)result=event.result;}};
    while(true){const {done,value}=await reader.read();if(done)break;consume(parser.push(decoder.decode(value,{stream:true})));}
    consume(parser.push(decoder.decode(),true));
    return withOwnerName({...result,text:text||result.text||''});
  } finally {
    clearTimeout(timeout);signal?.removeEventListener('abort',cancel);
    if(reader){await reader.cancel().catch(()=>{});reader.releaseLock();}
  }
}
