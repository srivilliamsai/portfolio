import test from 'node:test';
import assert from 'node:assert/strict';
import {createSentenceBuffer,createSpeechQueue} from '../src/services/assistantSpeechQueue.js';
import {createBrowserSpeech} from '../src/services/assistantSpeech.js';
import {prepareSpeechAudio,createSpeechAudioPlayer} from '../src/services/assistantSpeechAudio.js';
import {sentenceMedia} from '../src/services/assistantSpotlight.js';

const turn=()=>new Promise(resolve=>setImmediate(resolve));
test('sentence buffering handles split punctuation, degree initials, and the final fragment once',()=>{
  const buffer=createSentenceBuffer();
  assert.deepEqual(buffer.update('He studies M.'),[]);
  assert.deepEqual(buffer.update('He studies M.Tech. at SRMIST. Next'),['He studies M.Tech. at SRMIST.']);
  assert.deepEqual(buffer.update('He studies M.Tech. at SRMIST. Next answer'),[]);
  assert.deepEqual(buffer.update('He studies M.Tech. at SRMIST. Next answer',true),['Next answer']);
  assert.deepEqual(buffer.update('He studies M.Tech. at SRMIST. Next answer',true),[]);
});
test('speech begins before SSE completion, prefetches the next sentence, and preserves playback order',async()=>{
  const spoken=[],prepared=[],started=[],releases=[];
  const queue=createSpeechQueue({prepare:text=>{prepared.push(text);return Promise.resolve(text);},speak:async(text,{audio,onStart})=>{assert.equal(await audio,text);spoken.push(text);onStart();await new Promise(resolve=>releases.push(resolve));},onSentence:text=>started.push(text)});
  queue.update('First sentence. Second');await turn();
  assert.deepEqual(spoken,['First sentence.']);
  queue.update('First sentence. Second sentence. Third');await turn();
  assert.deepEqual(prepared,['First sentence.','Second sentence.']);
  queue.end('First sentence. Second sentence. Third sentence.');
  releases.shift()();await turn();assert.deepEqual(spoken,['First sentence.','Second sentence.']);
  releases.shift()();await turn();releases.shift()();await queue.done;
  assert.deepEqual(started,['First sentence.','Second sentence.','Third sentence.']);
});
test('cancelling a queue aborts prefetched requests and prevents late audio and media callbacks',async()=>{
  const source=new AbortController(),preparedSignals=[],started=[];let lateStart,release,stops=0;
  const queue=createSpeechQueue({signal:source.signal,prepare:(_text,{signal})=>{preparedSignals.push(signal);return null;},speak:(_text,{onStart})=>{lateStart=onStart;return new Promise(resolve=>{release=resolve;});},stop:()=>{stops++;release?.();},onSentence:text=>started.push(text)});
  queue.update('First sentence. Second sentence. Tail');await turn();source.abort();await queue.done;
  lateStart();queue.end('First sentence. Second sentence. Tail');await turn();
  assert.equal(stops,1);assert.ok(preparedSignals.every(signal=>signal.aborted));assert.deepEqual(started,[]);
});
test('browser amplitude starts with playback and resets on pause, cancellation and disposal',async()=>{
  let utterance,id=0;const frames=new Map(),levels=[];
  const environment={performance:{now:()=>0},requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:key=>frames.delete(key),SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>[{name:'Aman',lang:'en-IN'}],speak:value=>{utterance=value;},cancel(){}}};
  const speech=createBrowserSpeech({environment,onLevel:value=>levels.push(value)});
  const done=speech.speak('Hello there.');assert.equal(levels.at(-1),0);
  utterance.onstart();assert.ok(levels.at(-1)>0);assert.equal(frames.size,1);
  utterance.onpause();assert.equal(levels.at(-1),0);assert.equal(frames.size,0);
  utterance.onresume();assert.ok(levels.at(-1)>0);
  speech.stopSpeaking();await done;assert.equal(levels.at(-1),0);assert.equal(frames.size,0);
  speech.dispose();assert.equal(frames.size,0);
});
test('TTS fetch failure and timeout return browser fallback without leaking cancellation',async()=>{
  assert.equal(await prepareSpeechAudio('Hi',{fetcher:async()=>new Response('{}',{status:503})}),null);
  let aborted=false;
  const fetcher=(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>{aborted=true;reject(new Error('aborted'));}));
  assert.equal(await prepareSpeechAudio('Hi',{fetcher,timeoutMs:2}),null);assert.equal(aborted,true);
  const bytes=await prepareSpeechAudio('Hi',{fetcher:async()=>new Response(new Uint8Array([1,2]),{headers:{'Content-Type':'audio/wav'}})});assert.equal(bytes.byteLength,2);
});
test('cancelling during audio decode never starts the decoded source',async()=>{
  let decode,starts=0;
  class AudioContext{resume(){return Promise.resolve();}decodeAudioData(){return new Promise(resolve=>{decode=resolve;});}createBufferSource(){starts++;}close(){return Promise.resolve();}}
  const player=createSpeechAudioPlayer({environment:{AudioContext}}),playing=player.play(new ArrayBuffer(4),'Hello.');
  await turn();player.stop();decode({duration:1});await playing;assert.equal(starts,0);player.dispose();
});
test('spotlights use approved media, preserve a selected section, and ignore unknown topics',()=>{
  assert.equal(sentenceMedia('DineDesk handles kitchen tickets.'),'dinedesk-kitchen');
  assert.equal(sentenceMedia('DineDesk also has analytics.','dinedesk-analytics'),'dinedesk-analytics');
  assert.equal(sentenceMedia('Naruto is one of his interests.'),'personal:naruto');
  assert.equal(sentenceMedia('A completely unrelated sentence.'),null);
});
