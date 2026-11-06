import {Readable,Writable} from 'node:stream';
import {finished} from 'node:stream/promises';
import {createAssistantHandler} from './assistant.mjs';

class LambdaResponse extends Writable {
  constructor(output,wrap){super();this.output=output;this.wrap=wrap;this.statusCode=200;this.headers={};}
  get headersSent(){return Boolean(this.stream);}
  setHeader(name,value){if(this.headersSent)throw new Error('Headers already sent');this.headers[name]=value;}
  writeHead(status,headers={}){this.statusCode=status;Object.assign(this.headers,headers);this.start();return this;}
  start(){return this.stream??=this.wrap(this.output,{statusCode:this.statusCode,headers:this.headers});}
  _write(chunk,encoding,done){this.start().write(chunk,encoding,done);}
  _final(done){this.start().end(done);}
  _destroy(error,done){if(error)this.stream?.destroy(error);done(error);}
}

async function readSecret(id){
  // Lambda Node.js runtimes supply AWS SDK v3. Keep this out of the browser bundle.
  const {SecretsManagerClient,GetSecretValueCommand}=await import('@aws-sdk/client-secrets-manager');
  const result=await new SecretsManagerClient({}).send(new GetSecretValueCommand({SecretId:id}));
  if(!result.SecretString)throw new Error('Assistant secret is unavailable');
  return result.SecretString;
}

export function createLambdaHandler({environment=process.env,loadSecret=readSecret,createHandler=createAssistantHandler,wrapResponse=globalThis.awslambda?.HttpResponseStream.from,clock=Date.now}={}){
  let handler,cachedKey,expires=0;
  return async(event,output)=>{
    const response=new LambdaResponse(output,wrapResponse);
    const completion=finished(response);void completion.catch(()=>{});
    const cancel=()=>{if(!response.writableEnded)response.destroy(new Error('Client disconnected'));};
    output.once('close',cancel);
    try{
      if(!handler||environment.GEMINI_SECRET_ARN&&clock()>=expires){
        const key=environment.GEMINI_SECRET_ARN?await loadSecret(environment.GEMINI_SECRET_ARN):environment.GEMINI_API_KEY;
        if(!handler||key!==cachedKey){handler=createHandler({env:{...environment,GEMINI_API_KEY:key}});cachedKey=key;}
        expires=clock()+300000;
      }
      if(response.destroyed)return;
      const body=Buffer.from(event.body||'',event.isBase64Encoded?'base64':'utf8');
      if(body.length>30000){response.writeHead(413,{'Content-Type':'application/json','Cache-Control':'no-store'});response.end(JSON.stringify({error:'Request is too large.'}));}
      else{
        const request=Readable.from(body.length?[body]:[]);
        request.method=event.requestContext?.http?.method||'GET';
        request.url=(event.rawPath||'/')+(event.rawQueryString?'?'+event.rawQueryString:'');
        request.headers=Object.fromEntries(Object.entries(event.headers||{}).map(([name,value])=>[name.toLowerCase(),value]));
        // Use the source IP supplied by Lambda; do not trust visitor X-Forwarded-For.
        request.socket={remoteAddress:event.requestContext?.http?.sourceIp||'unknown'};
        await handler(request,response);
      }
      await completion;
    }catch{
      if(!response.headersSent&&!response.destroyed){response.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'});response.end(JSON.stringify({error:'WILL is temporarily unavailable. Local answers are available.'}));await completion.catch(()=>{});}
      else if(!response.destroyed){response.destroy(new Error('Assistant response interrupted'));await completion.catch(()=>{});}
    }finally{output.removeListener('close',cancel);}
  };
}

export const handler=globalThis.awslambda?.streamifyResponse(createLambdaHandler());
