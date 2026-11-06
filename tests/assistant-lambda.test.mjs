import test from 'node:test';
import assert from 'node:assert/strict';
import {PassThrough} from 'node:stream';
import {createLambdaHandler} from '../server/assistantLambda.mjs';
import {createAssistantHandler} from '../server/assistant.mjs';

const event=(path='/status',body,extra={})=>({rawPath:'/api/assistant'+path,headers:{},requestContext:{http:{method:body===undefined?'GET':'POST',sourceIp:'203.0.113.1'}},...(body===undefined?{}:{body:JSON.stringify(body)}),...extra});
function sink(){const output=new PassThrough(),chunks=[];output.on('data',chunk=>chunks.push(chunk));output.on('error',()=>{});return {output,chunks};}
const wrapResponse=(output,metadata)=>{output.metadata=metadata;return output;};
async function request(handler,input){const {output,chunks}=sink();await handler(input,output);return {...output.metadata,body:Buffer.concat(chunks)};}

test('Lambda reads a private secret once per cache window and refreshes the handler only on rotation',async()=>{
  let now=0,loads=0,creates=0,key='private-key-one';
  const handler=createLambdaHandler({environment:{ASSISTANT_PROVIDER:'gemini',GEMINI_SECRET_ARN:'secret-arn'},clock:()=>now,loadSecret:async id=>{assert.equal(id,'secret-arn');loads++;return key;},createHandler:options=>{creates++;assert.equal(options.env.GEMINI_API_KEY,key);return createAssistantHandler(options);},wrapResponse});
  for(let i=0;i<2;i++){const response=await request(handler,event());assert.equal(response.statusCode,200);assert.equal(JSON.parse(response.body).provider,'gemini');assert.ok(!response.body.includes(key));}
  assert.equal(loads,1);assert.equal(creates,1);
  now=300001;await request(handler,event());assert.equal(loads,2);assert.equal(creates,1);
  now=600002;key='private-key-two';await request(handler,event());assert.equal(loads,3);assert.equal(creates,2);
});

test('Lambda streams the first chat delta before provider completion',async()=>{
  let release,first;const gate=new Promise(resolve=>{release=resolve;}),seen=new Promise(resolve=>{first=resolve;});
  const handler=createLambdaHandler({environment:{ASSISTANT_PROVIDER:'gemini',GEMINI_API_KEY:'private-placeholder'},createHandler:options=>createAssistantHandler({...options,generate:async function*(){yield{text:'DineDesk '};await gate;yield{text:'connects restaurant workflows.'};}}),wrapResponse});
  const {output,chunks}=sink();output.on('data',chunk=>{if(chunk.toString().includes('DineDesk'))first();});
  const completion=handler(event('/chat',{question:'Explain DineDesk'}),output);
  await seen;assert.match(Buffer.concat(chunks).toString(),/"delta":"DineDesk /);assert.equal(output.writableEnded,false);
  release();await completion;assert.match(Buffer.concat(chunks).toString(),/"result"/);assert.match(output.metadata.headers['Content-Type'],/text\/event-stream/);
});

test('Lambda decodes base64 POST bodies and sends binary WAV without JSON encoding',async()=>{
  const handler=createLambdaHandler({environment:{ASSISTANT_PROVIDER:'gemini',GEMINI_API_KEY:'private-placeholder'},createHandler:options=>createAssistantHandler({...options,generateSpeech:async()=>({candidates:[{content:{parts:[{inlineData:{mimeType:'audio/L16;codec=pcm;rate=24000',data:'AQACAA=='}}]}}]})}),wrapResponse});
  const response=await request(handler,event('/tts',{}, {isBase64Encoded:true,body:Buffer.from(JSON.stringify({text:'Hello Villiam.'})).toString('base64')}));
  assert.equal(response.statusCode,200);assert.equal(response.headers['Content-Type'],'audio/wav');assert.equal(response.body.toString('ascii',0,4),'RIFF');assert.equal(response.body.readUInt32LE(40),4);
});

test('Lambda retains origin validation, body limits and trusted source-IP rate limits',async()=>{
  const handler=createLambdaHandler({environment:{ASSISTANT_ALLOWED_ORIGINS:'https://portfolio.test'},wrapResponse});
  assert.equal((await request(handler,event('/status',undefined,{headers:{Origin:'https://other.test'}}))).statusCode,403);
  assert.equal((await request(handler,event('/chat',{}, {body:'x'.repeat(30001)}))).statusCode,413);
  for(let i=0;i<30;i++)await request(handler,event('/retrieve',{question:'DineDesk'},{headers:{'x-forwarded-for':String(i)}}));
  assert.equal((await request(handler,event('/retrieve',{question:'DineDesk'}))).statusCode,429);
});

test('Lambda secret failures return a generic error and never echo credentials',async()=>{
  const handler=createLambdaHandler({environment:{GEMINI_SECRET_ARN:'secret'},loadSecret:async()=>{throw new Error('private-key-do-not-echo');},wrapResponse});
  const response=await request(handler,event());assert.equal(response.statusCode,503);assert.doesNotMatch(response.body.toString(),/private-key|secret/);
});

test('Lambda disconnect closes the response and stops ongoing generation',async()=>{
  let started,closed=false;const ready=new Promise(resolve=>{started=resolve;});
  const handler=createLambdaHandler({environment:{},createHandler:()=>async(req,res)=>{await new Promise(resolve=>{res.on('close',()=>{closed=true;resolve();});res.write('first');started();});},wrapResponse});
  const {output}=sink();const completion=handler(event(),output);await ready;output.destroy();await completion;assert.equal(closed,true);
  let release,called=false;const secret=new Promise(resolve=>{release=resolve;});
  const pending=createLambdaHandler({environment:{GEMINI_SECRET_ARN:'secret'},loadSecret:()=>secret,createHandler:()=>()=>{called=true;},wrapResponse});
  const abandoned=sink().output,waiting=pending(event('/chat',{question:'DineDesk'}),abandoned);
  abandoned.destroy();await new Promise(resolve=>setImmediate(resolve));release('placeholder');await waiting;assert.equal(called,false);
});

test('Lambda errors after headers terminate the underlying stream',async()=>{
  const handler=createLambdaHandler({environment:{},createHandler:()=>async(req,res)=>{res.write('partial');throw new Error('private-error');},wrapResponse});
  const {output}=sink();await handler(event(),output);assert.equal(output.destroyed,true);
});
