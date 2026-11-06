import test from 'node:test';
import assert from 'node:assert/strict';
import {connectLive} from '../src/services/assistantLive.js';
import {localReply,getMedia} from '../src/services/assistantKnowledge.js';
import {createMediaSelection} from '../src/services/assistantSpotlight.js';
import {projects} from '../src/data/projects.js';

async function setup(t){
  const audio=[],frames=new Map();let frameId=0,options,stopped=0;
  class Node{connect(){}disconnect(){}}
  class Audio{
    constructor(){this.currentTime=0;this.destination={};this.audioWorklet={addModule:async()=>{}};audio.push(this);}
    resume(){return Promise.resolve();}close(){return Promise.resolve();}
    createGain(){return Object.assign(new Node(),{gain:{value:1}});}
    createAnalyser(){return Object.assign(new Node(),{fftSize:256,getByteTimeDomainData:array=>array.fill(128)});}
    createMediaStreamSource(){return new Node();}
    createBuffer(_channels,length,rate){return {duration:length/rate,getChannelData:()=>new Float32Array(length)};}
    createBufferSource(){const node=Object.assign(new Node(),{start(){},stop(){},onended:null});this.source=node;return node;}
  }
  class Worklet extends Node{constructor(){super();this.port={};}}
  const media={getUserMedia:async()=>({getTracks:()=>[{stop(){stopped++;}}]})};
  const originals=new Map();let connection;
  const replace=(name,value)=>{originals.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{value,writable:true,configurable:true});};
  t.after(()=>{connection?.close();for(const [name,descriptor]of originals){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}});
  replace('AudioContext',Audio);replace('AudioWorkletNode',Worklet);replace('navigator',{mediaDevices:media});
  replace('requestAnimationFrame',callback=>{frames.set(++frameId,callback);return frameId;});
  replace('cancelAnimationFrame',id=>frames.delete(id));
  t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>({token:'synthetic-ephemeral-token',model:'gemini-3.8-live',voice:'Algieba'})}));
  const selected=createMediaSelection(),shown=[],heard=[],turns=[],states=[],errors=[];let open=false,token;
  const session={sendClientContent(){},sendRealtimeInput(){},sendToolResponse(){},close(){}};
  connection=await connectLive({
    messages:[{role:'assistant',content:'Welcome'}],onState:state=>states.push(state),onUser:text=>{if(!open){token=selected.beginTurn();open=true;}heard.push(text);},onText:text=>shown.push(text),
    onTurn:turn=>{turns.push(turn);open=false;},onMedia:(_id,reply)=>selected.apply(reply,token),onError:error=>errors.push(error),onInterrupt:()=>{selected.invalidate();open=false;},
    createClient:async()=>({live:{connect:async value=>{options=value;return session;}}})
  });
  return {connection,options,selected,shown,heard,turns,states,errors,get stopped(){return stopped;},message:serverContent=>options.callbacks.onmessage({serverContent}),tool:call=>options.callbacks.onmessage({toolCall:{functionCalls:[call]}}),tick:()=>{audio[0].currentTime+=10;for(const callback of [...frames.values()])callback();},endAudio:()=>audio[0].source?.onended?.()};
}
const pcm={inlineData:{mimeType:'audio/pcm;rate=24000',data:'AQACAA=='}};

test('Live requests input/output transcripts and selects every named project without a model tool call',async t=>{
  const live=await setup(t);
  assert.deepEqual(live.options.config.inputAudioTranscription,{});assert.deepEqual(live.options.config.outputAudioTranscription,{});
  for(const project of projects){
    live.message({inputTranscription:{text:`Tell me about ${project.title}`}});
    live.message({modelTurn:{parts:[pcm]},outputTranscription:{text:`${project.title} is a portfolio project.`}});
    assert.equal(getMedia(live.selected.selectedId)?.entityId,project.id,project.title);
    live.tick();assert.ok(live.shown.some(text=>text.includes(project.title)),project.title);
    live.message({turnComplete:true});live.endAudio();assert.equal(live.turns.at(-1).user,`Tell me about ${project.title}`);
  }
  assert.deepEqual(live.errors,[]);
});

test('Live handles speech transcripts arriving after audio starts and preserves a manual image choice',async t=>{
  const live=await setup(t);
  live.message({modelTurn:{parts:[pcm]}});
  live.message({inputTranscription:{text:'Tell about PitStop'}});
  assert.equal(getMedia(live.selected.selectedId)?.entityId,'pitstop');
  live.selected.choose('personal:formula-one');
  live.message({inputTranscription:{text:' project'}});
  live.message({outputTranscription:{text:'PitStop provides roadside assistance.'}});
  assert.equal(live.selected.selectedId,'personal:formula-one');
  live.message({turnComplete:true});live.endAudio();
  live.message({inputTranscription:{text:'Tell about Glassora'}});
  live.message({outputTranscription:{text:'Glassora is a wallpaper app.'}});
  assert.equal(getMedia(live.selected.selectedId)?.entityId,'glassora');
});

test('Live project lists never pick PitStop and text-only server parts still populate the transcript',async t=>{
  const live=await setup(t);
  for(const question of ['How many projects?','Tell the project names only']){
    live.connection.sendText(question);
    live.message({modelTurn:{parts:[{text:'PitStop, Carbon Footprint, Wyndra, Glassora, DineDesk, Invoice Picker'}]}});
    assert.equal(live.selected.selectedId,null);assert.match(live.shown.at(-1),/Invoice Picker/);
    live.message({turnComplete:true});assert.match(live.turns.at(-1).assistant,/PitStop/);
  }
});

test('Live interruption discards the old caption turn and a new project gets its own image',async t=>{
  const live=await setup(t);
  live.connection.sendText('Tell about PitStop');live.message({modelTurn:{parts:[pcm]},outputTranscription:{text:'PitStop helps drivers.'}});
  live.message({interrupted:true});assert.equal(live.shown.at(-1),'');
  live.message({inputTranscription:{text:'Tell about Invoice Picker'}});
  live.message({modelTurn:{parts:[pcm]},outputTranscription:{text:'Invoice Picker helps freelancers.'}});
  assert.equal(getMedia(live.selected.selectedId)?.entityId,'invoice-picker');
  live.message({turnComplete:true});live.endAudio();assert.doesNotMatch(live.turns.at(-1).assistant,/drivers/);
  live.connection.close();assert.ok(live.stopped>0);
});
