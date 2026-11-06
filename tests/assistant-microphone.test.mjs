import test from 'node:test';
import assert from 'node:assert/strict';
import {createMicrophonePreview,microphoneLevel,microphoneNote} from '../src/services/assistantMicrophone.js';

function fixture({request}={}){
  const states=[],levels=[],jobs=new Map(),streams=[],contexts=[];let frame=0,requests=0,sample=128;
  const makeStream=()=>{const listeners=new Map();const track={stopped:0,stop(){this.stopped++;},addEventListener(name,listener){listeners.set(name,listener);},removeEventListener(name){listeners.delete(name);},end(){listeners.get('ended')?.();}};const stream={track,getTracks:()=>[track]};streams.push(stream);return stream;};
  class AudioContext{
    constructor(){this.state='running';this.closed=0;this.disconnected=0;contexts.push(this);}
    createAnalyser(){const analyser={fftSize:0,getByteTimeDomainData:bytes=>bytes.fill(sample),disconnect:()=>this.disconnected++};this.analyser=analyser;return analyser;}
    createMediaStreamSource(stream){this.stream=stream;return {connect:target=>{assert.equal(target,this.analyser);},disconnect:()=>this.disconnected++};}
    close(){this.closed++;return Promise.resolve();}
  }
  const environment={navigator:{mediaDevices:{getUserMedia:options=>{requests++;assert.equal(options.audio.channelCount,1);return request?request(makeStream):Promise.resolve(makeStream());}}},AudioContext,requestAnimationFrame:fn=>{jobs.set(++frame,fn);return frame;},cancelAnimationFrame:id=>jobs.delete(id)};
  const preview=createMicrophonePreview({environment,onState:value=>states.push(value),onLevel:value=>levels.push(value)});
  return {preview,states,levels,streams,contexts,jobs,set sample(value){sample=value;},get requests(){return requests;},tick(time){const callbacks=[...jobs.values()];jobs.clear();for(const fn of callbacks)fn(time);}};
}
test('the welcome check requests permission once, waits for the grant and meters actual input',async()=>{
  let resolve;const f=fixture({request:make=>new Promise(done=>{resolve=()=>done(make());})});
  const first=f.preview.start(),again=f.preview.start();assert.equal(first,again);assert.equal(f.requests,1);assert.equal(f.preview.state,'asking');assert.equal(f.jobs.size,0);assert.equal(microphoneNote(f.preview.state),'Allow the mic to talk');
  resolve();assert.equal(await first,true);assert.equal(f.preview.state,'ready');assert.equal(f.contexts.length,1);
  f.tick(0);assert.equal(f.levels.at(-1),0);assert.equal(microphoneNote(f.preview.state,f.levels.at(-1)),'Say something…');
  f.sample=150;f.tick(80);assert.ok(f.levels.at(-1)>.12);assert.equal(microphoneNote(f.preview.state,f.levels.at(-1)),'I can hear you');
  f.preview.dispose();assert.equal(f.streams[0].track.stopped,1);assert.equal(f.contexts[0].closed,1);assert.equal(f.jobs.size,0);
});
test('closing while permission is pending immediately releases a later grant without opening an analyser',async()=>{
  let resolve;const f=fixture({request:make=>new Promise(done=>{resolve=()=>done(make());})});
  const pending=f.preview.start();f.preview.dispose();const before=f.states.length;resolve();assert.equal(await pending,false);
  assert.equal(f.streams[0].track.stopped,1);assert.equal(f.contexts.length,0);assert.equal(f.jobs.size,0);assert.equal(f.states.length,before);
});
test('denial, missing devices and capture failures stay distinct and leave no running preview',async()=>{
  for(const [name,state]of [['NotAllowedError','blocked'],['SecurityError','blocked'],['NotFoundError','unavailable'],['NotReadableError','error']]){
    const f=fixture({request:()=>Promise.reject(Object.assign(new Error('device error'),{name}))});assert.equal(await f.preview.start(),false);assert.equal(f.preview.state,state);assert.equal(f.contexts.length,0);assert.equal(f.jobs.size,0);f.preview.dispose();
  }
  const preview=createMicrophonePreview({environment:{}});assert.equal(await preview.start(),false);assert.equal(preview.state,'unavailable');preview.dispose();
});
test('typing, tab hiding or closing can stop tracks and restart without stale audio frames',async()=>{
  const f=fixture();await f.preview.start();f.preview.stop();assert.equal(f.preview.state,'paused');assert.equal(f.streams[0].track.stopped,1);assert.equal(f.contexts[0].closed,1);assert.equal(f.jobs.size,0);assert.equal(f.levels.at(-1),0);
  await f.preview.start();assert.equal(f.requests,2);assert.equal(f.preview.state,'ready');assert.equal(f.streams[1].track.stopped,0);f.preview.dispose();assert.equal(f.streams[1].track.stopped,1);assert.equal(f.contexts[1].closed,1);
});
test('a stale permission request cannot replace a newer microphone preview',async()=>{
  const resolves=[];const f=fixture({request:make=>new Promise(resolve=>resolves.push(()=>resolve(make())))});
  const old=f.preview.start();f.preview.stop();const current=f.preview.start();resolves[1]();assert.equal(await current,true);const active=f.streams[0];resolves[0]();assert.equal(await old,false);
  assert.equal(active.track.stopped,0);assert.equal(f.streams[1].track.stopped,1);assert.equal(f.contexts.length,1);f.preview.dispose();assert.equal(active.track.stopped,1);
});
test('disconnecting the preview device stops the meter and reports it unavailable',async()=>{
  const f=fixture();await f.preview.start();f.streams[0].track.end();assert.equal(f.preview.state,'unavailable');assert.equal(f.jobs.size,0);assert.equal(f.contexts[0].closed,1);f.preview.dispose();
});
test('meter values are silent at the midpoint and bounded for loud input',()=>{
  assert.equal(microphoneLevel(new Uint8Array()),0);assert.equal(microphoneLevel(new Uint8Array(64).fill(128)),0);assert.equal(microphoneLevel(new Uint8Array(64).fill(255)),1);
});
