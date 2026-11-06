import test from 'node:test';
import assert from 'node:assert/strict';
import {createMediaSelection,sentenceMedia} from '../src/services/assistantSpotlight.js';
import {localReply,getMedia} from '../src/services/assistantKnowledge.js';
import {mergeAssistantContext} from '../src/services/assistantContext.js';
import {resolveLiveTool} from '../src/services/assistantLive.js';
import {createSpeechQueue} from '../src/services/assistantSpeechQueue.js';
import {projects} from '../src/data/projects.js';
import {assistantMedia} from '../src/data/assistantMedia.js';
import {assistantMusic} from '../src/data/assistantMusic.js';

test('project overviews and strict name lists cannot open PitStop from incidental spoken names',()=>{
  for(const question of ['How many projects is completed?','Tell all projects','Explain all projects','ok how many project he completed tell about the name only']){
    const reply=localReply(question),selection=createMediaSelection(),turn=selection.beginTurn();
    selection.apply(reply,turn);
    for(const text of reply.text.split(/(?<=[.!?])\s+/)){
      const id=sentenceMedia(text,selection.selectedId,reply);
      assert.equal(id,null,question);
      if(id)selection.apply({...reply,mediaId:id},turn);
    }
    assert.equal(selection.selectedId,null,question);
  }
});

test('each project keeps its own image through a long answer, follow-up and elapsed time',t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  for(const project of projects){
    const selection=createMediaSelection(),turn=selection.beginTurn(),reply=localReply(`Tell about ${project.title}`);
    selection.apply(reply,turn);
    assert.equal(getMedia(selection.selectedId).entityId,project.id);
    t.mock.timers.tick(30000);
    for(const text of [reply.text,'PitStop and Glassora are other projects.','The explanation continues.']){
      const id=sentenceMedia(text,selection.selectedId,reply);
      if(id)selection.apply({...reply,mediaId:id},turn);
      assert.equal(getMedia(selection.selectedId).entityId,project.id);
    }
    const next=selection.beginTurn();
    selection.apply(localReply('Explain more',mergeAssistantContext({},reply)),next);
    t.mock.timers.tick(30000);
    assert.equal(getMedia(selection.selectedId).entityId,project.id);
  }
});

test('a manual screenshot survives streamed sentences and completion, then a named topic can replace it',async()=>{
  const reply=localReply('Tell about PitStop'),selection=createMediaSelection(),turn=selection.beginTurn();
  const alternate=assistantMedia.find(media=>media.entityId==='pitstop'&&media.id!==reply.mediaId);
  let release;
  const queue=createSpeechQueue({speak:(_text,{onStart})=>{onStart();return new Promise(resolve=>{release=resolve;});},onSentence:text=>{
    selection.apply(reply,turn);
    const id=sentenceMedia(text,selection.selectedId,reply);if(id)selection.apply({...reply,mediaId:id},turn);
  }});
  queue.update('PitStop finds roadside assistance. The answer continues');
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(selection.selectedId,reply.mediaId);
  selection.choose(alternate.id);
  queue.end('PitStop finds roadside assistance. The answer continues.');
  release();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(selection.selectedId,alternate.id);
  release();await queue.done;
  selection.apply(reply,turn);
  assert.equal(selection.selectedId,alternate.id);
  selection.apply(reply,selection.beginTurn());
  assert.equal(selection.selectedId,alternate.id);
  const glassora=localReply('Tell Glassora project');
  selection.apply(glassora,selection.beginTurn());
  assert.equal(selection.selectedId,glassora.mediaId);
});

test('manual picks and dismissals reject late callbacks for every project, portraits and Spotify player',()=>{
  const ids=[...projects.map(project=>localReply(`Tell ${project.title} project`).mediaId),'personal:outdoor-portrait','personal:mirror-portrait',...assistantMusic.map(track=>track.id)];
  for(const id of ids){
    const selection=createMediaSelection(),oldTurn=selection.beginTurn();
    selection.choose(id);
    selection.apply(localReply('Tell PitStop project'),oldTurn);
    assert.equal(selection.selectedId,id);
    selection.apply({clearMedia:true},oldTurn);
    assert.equal(selection.selectedId,id);
    selection.choose(null);
    selection.apply({mediaId:id},oldTurn);
    assert.equal(selection.selectedId,null);
    const newTurn=selection.beginTurn();
    selection.apply({mediaId:id},newTurn);
    selection.apply({clearMedia:true},oldTurn);
    assert.equal(selection.selectedId,id);
    selection.invalidate();
    selection.apply({clearMedia:true},newTurn);
    assert.equal(selection.selectedId,id);
  }
});

test('live media lookups never display cards and project lists cannot be overridden by show tools',()=>{
  const shown=[],onMedia=(id,reply)=>shown.push({id,reply});
  const pitstop=localReply('Tell PitStop project').mediaId;
  const found=resolveLiveTool('get_media',{id:pitstop},{question:'How many projects?',onMedia});
  assert.equal(found.result.id,pitstop);assert.deepEqual(shown,[]);
  for(const question of ['How many projects?','Project names only','Explain all projects']){
    const result=resolveLiveTool('show_media',{id:pitstop},{question,onMedia});
    assert.ok(result.result.error);assert.deepEqual(shown,[]);
  }
  const mismatch=resolveLiveTool('show_media',{id:pitstop},{question:'Tell Glassora project',onMedia});
  assert.ok(mismatch.result.error);assert.deepEqual(shown,[]);
});

test('live lookup uses the actual visitor question and only an explicit dismissal can hide media',()=>{
  const selection=createMediaSelection(),turn=selection.beginTurn(),pitstop=localReply('Tell PitStop project');
  selection.apply(pitstop,turn);selection.choose('personal:formula-one');
  const onMedia=(id,reply)=>selection.apply(reply,turn);
  const looked=resolveLiveTool('search_portfolio',{query:'PitStop'},{question:'Tell Glassora project',context:mergeAssistantContext({},pitstop),onMedia});
  assert.equal(looked.result.answer.topicId,'glassora');
  assert.equal(looked.context.mediaId,'personal:formula-one');
  const hidden=resolveLiveTool('hide_media',{}, {question:'Tell Glassora project',context:looked.context,onMedia});
  assert.equal(hidden.result.hidden,false);assert.equal(selection.selectedId,'personal:formula-one');
  const dismissTurn=selection.beginTurn();
  const dismissed=resolveLiveTool('hide_media',{}, {question:'Hide the image',context:looked.context,onMedia:(_id,reply)=>selection.apply(reply,dismissTurn)});
  assert.equal(dismissed.result.hidden,true);assert.equal(selection.selectedId,null);
});

test('the second reported transcript resolves pictures, speech aliases and reasons in sequence',()=>{
  const cases=[['tell about','about'],['how many project is completed','projects'],['ok tell about pitstop','pitstop'],['ok tell about glycerol','glassora'],['tell about the Glacier project','glassora'],['he image any','about'],['show the image','about'],['earphone','about'],['earphone','about'],['F1','interest:f1'],['Ok why should he had','interest:f1'],['Ok why he had the Naruto image','interest:naruto'],['ok how many project he completed tell about the name only','projects']];
  let context={},previousClarification;
  for(const [question,topic]of cases){
    const reply=localReply(question,context);
    assert.equal(reply.topicId,topic,JSON.stringify({question,context,reply}));
    assert.doesNotMatch(reply.text,/didn.t catch|don.t have that detail in|couldn.t match/);
    if(question==='earphone'){assert.equal(reply.needsClarification,true);assert.match(reply.text,/F1|Formula 1/);assert.notEqual(reply.text,previousClarification);previousClarification=reply.text;}
    if(topic==='interest:f1'){assert.match(reply.text,/watching.*Formula 1 series/);assert.doesNotMatch(reply.text,/owns|favourite|favorite/);}
    if(question==='he image any'||question==='show the image')assert.equal(reply.mediaId,'personal:outdoor-portrait');
    context=mergeAssistantContext(context,reply);
  }
  assert.equal(context.clarificationId,undefined);
});

test('show-image requests use the selected project even while a different project is being explained',()=>{
  for(const project of projects){
    const reply=localReply(`Tell ${project.title} project`);
    const shown=localReply('show the image',{topicId:project.id});
    assert.equal(getMedia(shown.mediaId).entityId,project.id);
    const other=projects.find(item=>item.id!==project.id);
    const selected=localReply('show the image',{topicId:other.id,mediaId:reply.mediaId});
    assert.equal(selected.mediaId,reply.mediaId);assert.equal(selected.topicId,project.id);assert.match(selected.text,new RegExp(project.title));
  }
  assert.equal(localReply('show the image',{}).needsClarification,true);
  assert.equal(localReply('tell about Nebula',{topicId:'dinedesk'}).needsClarification,true);
});

test('explicit next-photo and next-song requests can replace a manually selected item on a later turn',()=>{
  for(const [first,question]of [['personal:outdoor-portrait','next photo'],[assistantMusic[0].id,'next song']]){
    const selection=createMediaSelection();selection.choose(first);
    const context={topicId:getMedia(first).entityId,mediaId:first};
    const reply=localReply(question,context);
    assert.notEqual(reply.mediaId,first);
    selection.apply(reply,selection.beginTurn());
    assert.equal(selection.selectedId,reply.mediaId);
  }
});
