import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable,PassThrough} from 'node:stream';
import {createAssistantHandler} from '../server/assistant.mjs';
import {speechWav} from '../server/assistantTts.mjs';

async function request(handler,route,body,method='POST'){
  const req=Readable.from(body===undefined?[]:[JSON.stringify(body)]);req.url='/api/assistant'+route;req.method=method;req.headers={};req.socket={remoteAddress:'test'};
  const res=new PassThrough(),chunks=[];res.on('data',chunk=>chunks.push(chunk));res.writeHead=(status,headers)=>{res.statusCode=status;res.headers=headers;res.headersSent=true;};res.setHeader=()=>{};
  await handler(req,res);return {status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)};
}
const audio=()=>({candidates:[{content:{parts:[{inlineData:{mimeType:'audio/L16;codec=pcm;rate=24000',data:Buffer.from([1,0,2,0]).toString('base64')}}]}}]});
test('TTS validates text and disabled providers never synthesize speech',async()=>{
  let calls=0;const handler=createAssistantHandler({env:{},generateSpeech:()=>{calls++;}});
  for(const text of ['',42,'x'.repeat(1601)])assert.equal((await request(handler,'/tts',{text})).status,400);
  assert.equal((await request(handler,'/tts',{text:'Hello.'})).status,503);assert.equal(calls,0);
  const status=JSON.parse((await request(handler,'/status',undefined,'GET')).body);assert.equal(status.tts,false);
});
test('configured TTS returns WAV, pins the male voice and preserves spoken name substitutions',async()=>{
  const handler=createAssistantHandler({env:{ASSISTANT_PROVIDER:'gemini',GEMINI_API_KEY:'test-key',VILL_VOICE_NAME:'Algieba'},generateSpeech:async options=>{
    assert.equal(options.config.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName,'Algieba');
    assert.match(options.contents[0].parts[0].text,/Will helps William/);assert.ok(options.config.abortSignal);return audio();
  }});
  const response=await request(handler,'/tts',{text:'WILL helps Villiam.'});
  assert.equal(response.status,200);assert.equal(response.headers['Content-Type'],'audio/wav');assert.equal(response.headers['Cache-Control'],'no-store');
  assert.equal(response.body.toString('ascii',0,4),'RIFF');assert.equal(response.body.readUInt32LE(24),24000);assert.equal(response.body.readUInt32LE(40),4);
  assert.ok(!response.body.includes('test-key'));
});
test('TTS rejects malformed provider audio and retains the shared request limit',async()=>{
  assert.throws(()=>speechWav([{inlineData:{mimeType:'audio/L16',data:'AQ=='}}]),/format/);
  assert.throws(()=>speechWav([{inlineData:{mimeType:'audio/wav',data:'AQI='}}]),/WAV/);
  const handler=createAssistantHandler({env:{}});
  for(let i=0;i<30;i++)await request(handler,'/tts',{text:'Hello.'});
  assert.equal((await request(handler,'/tts',{text:'Hello.'})).status,429);
});
