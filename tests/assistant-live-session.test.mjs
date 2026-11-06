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
  const sent=[],toolResponses=[];const session={sendClientContent(value){sent.push(value);},sendRealtimeInput(){},sendToolResponse(value){toolResponses.push(value);},close(){}};
  connection=await connectLive({
    messages:[{role:'assistant',content:'Welcome'}],onState:state=>states.push(state),onUser:text=>{if(!open){token=selected.beginTurn();open=true;}heard.push(text);},onText:text=>shown.push(text),
    onTurn:turn=>{turns.push(turn);open=false;},onMedia:(_id,reply)=>selected.apply(reply,token),onError:error=>errors.push(error),onInterrupt:()=>{selected.invalidate();open=false;},
    createClient:async()=>({live:{connect:async value=>{options=value;return session;}}})
  });
  return {connection,options,selected,shown,heard,turns,states,errors,sent,toolResponses,get stopped(){return stopped;},message:serverContent=>options.callbacks.onmessage({serverContent}),tool:call=>options.callbacks.onmessage({toolCall:{functionCalls:[call]}}),tick:()=>{audio[0].currentTime+=10;for(const callback of [...frames.values()])callback();},endAudio:()=>audio[0].source?.onended?.()};
}
const pcm={inlineData:{mimeType:'audio/pcm;rate=24000',data:'AQACAA=='}};

test('Live requests input/output transcripts and selects every named project without a model tool call',async t=>{
  const live=await setup(t);
  assert.deepEqual(live.options.config.inputAudioTranscription,{});assert.deepEqual(live.options.config.outputAudioTranscription,{});
  assert.equal(live.sent[0].turnComplete,false);assert.match(live.sent[0].turns[0].parts[0].text,/Shree is one syllable/);
  assert.equal(live.sent[1].turnComplete,false);assert.match(live.sent[1].turns[0].parts[0].text,/Public portfolio reference/);assert.match(live.sent[1].turns[0].parts[0].text,/macOS 14\.0/);
  for(const project of projects){
    live.message({inputTranscription:{text:`Tell me about ${project.title}`}});
    live.message({modelTurn:{parts:[pcm]},outputTranscription:{text:`${project.title} is a portfolio project.`}});
    assert.equal(getMedia(live.selected.selectedId)?.entityId,project.id,project.title);
    live.tick();assert.ok(live.shown.some(text=>text.includes(project.title)),project.title);
    live.message({turnComplete:true});live.endAudio();assert.equal(live.turns.at(-1).user,`Tell me about ${project.title}`);
  }
  assert.deepEqual(live.errors,[]);
});

test('tool retrieval and automatic media routing share one follow-up context without skipping sections',async t=>{
  const live=await setup(t);
  live.connection.sendText('Explain Glassora');live.message({outputTranscription:{text:'Glassora is a wallpaper app.'},turnComplete:true});
  const sections=[];
  for(let i=0;i<3;i++){
    live.connection.sendText('Explain more');
    live.tool({id:`search-${i}`,name:'search_portfolio',args:{query:'Explain more'}});
    const reply=live.toolResponses.at(-1).functionResponses[0].response.result.answer;
    sections.push(reply.coveredSections.at(-1));
    live.message({outputTranscription:{text:reply.text},turnComplete:true});
  }
  assert.deepEqual(sections,['problem','product-flow','onboarding']);
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


test('Live interim words appear immediately, survive thinking, and commit without a final ASR packet',async t=>{
  const live=await setup(t);
  live.message({interimInputTranscription:{text:'Tell about Pit'}});assert.equal(live.heard.at(-1),'Tell about Pit');
  live.message({interimInputTranscription:{text:'Tell about PitStop'}});assert.equal(live.heard.at(-1),'Tell about PitStop');
  live.message({outputTranscription:{text:'PitStop provides roadside assistance.'}});assert.equal(getMedia(live.selected.selectedId).entityId,'pitstop');
  live.message({turnComplete:true});assert.equal(live.turns.at(-1).user,'Tell about PitStop');
});

test('interim and final speech packets update one question without duplicate words',async t=>{
  const live=await setup(t);
  live.message({interimInputTranscription:{text:'Tell about'}});
  live.message({inputTranscription:{text:'Tell about '}});
  live.message({interimInputTranscription:{text:'Glassora'}});assert.equal(live.heard.at(-1),'Tell about Glassora');
  live.message({inputTranscription:{text:'Glassora',finished:true}});assert.equal(live.heard.at(-1),'Tell about Glassora');
  live.message({outputTranscription:{text:'Shree William Sai built Glassora.'},turnComplete:true});
  assert.equal(live.turns.at(-1).user,'Tell about Glassora');assert.equal(live.turns.at(-1).assistant,'SRI VILLIAM SAI built Glassora.');
});

test('tool-only completion does not save an empty answer or discard the visitor question',async t=>{
  const live=await setup(t);
  live.connection.sendText('Carbon footprints architecture');
  live.tool({id:'lookup',name:'search_portfolio',args:{query:'Carbon footprints architecture'}});
  live.message({turnComplete:true});assert.equal(live.turns.length,0);
  live.message({outputTranscription:{text:'The flow connects React to the Spring Boot API.'}});
  assert.equal(live.turns.length,0);
  live.message({turnComplete:true});assert.equal(live.turns.length,1);assert.equal(live.turns[0].user,'Carbon footprints architecture');assert.match(live.turns[0].assistant,/Spring Boot/);
});

test('a mid-answer tool call preserves the opening words until the complete spoken reply',async t=>{
  const live=await setup(t);live.connection.sendText('Why he had the Batman?');
  live.message({outputTranscription:{text:'That’s a little '}});
  live.tool({id:'picture',name:'get_media',args:{id:'personal:batman'}});
  live.message({turnComplete:true});assert.equal(live.turns.length,0);
  live.message({outputTranscription:{text:'crocheted Batman collectible.'},turnComplete:true});
  assert.equal(live.turns[0].assistant,'That’s a little crocheted Batman collectible.');
});
