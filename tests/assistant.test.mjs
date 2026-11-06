import test from 'node:test';
import assert from 'node:assert/strict';
import {localReply,searchKnowledge,knowledgeRecords,getMedia,getMediaContext} from '../src/services/assistantKnowledge.js';
import {appendMessages,transcriptForProvider,parseSse,streamChat} from '../src/services/assistantSession.js';
import {assistantApiPath} from '../src/services/assistantApi.js';
import {createBrowserSpeech,selectMaleVoice} from '../src/services/assistantSpeech.js';
import {assistantText} from '../src/services/assistantText.js';
import {assistantMedia} from '../src/data/assistantMedia.js';
import {projects} from '../src/data/projects.js';
import {achievements} from '../src/data/achievements.js';
import {certificates} from '../src/data/certificates.js';
import {workGallery,personalGallery} from '../src/services/assistantGallery.js';

test('provider media-display markers never leak into visible or spoken portfolio answers',()=>{
  assert.equal(assistantText('PitStop helps drivers. [Show project:pitstop:pitstop-one] More details.'),'PitStop helps drivers.  More details.');
  assert.equal(assistantText('[Show image personal:formula-one] Formula 1.'),'Formula 1.');
  assert.equal(assistantText('Use the [case study](/pitstop).'),'Use the case study.');
});

test('all current projects, achievements and certificates are available to WILL',()=>{
  for(const p of projects)assert.ok(knowledgeRecords.find(r=>r.id===p.id));
  for(const a of achievements)assert.ok(knowledgeRecords.find(r=>r.id===a.slug));
  for(const c of certificates)assert.ok(knowledgeRecords.find(r=>r.id===`cert:${c.id}`));
  assert.ok(knowledgeRecords.find(r=>r.id==='dinedesk'));
  assert.ok(knowledgeRecords.find(r=>r.id==='invoice-picker'));
});
test('product answers use the corrected names and the matching media',()=>{
  assert.equal(localReply('What is DineDesk?').topicId,'dinedesk');
  assert.equal(localReply('Show me Invoice Picker').mediaId,'invoice-picker-template');
  assert.equal(localReply('Tell me about Glassora').topicId,'glassora');
  assert.equal(localReply('Tell me about Dine Desk').topicId,'dinedesk');
});
test('follow-up stack question stays with the previous project and next-image command advances',()=>{
  const first=localReply('DineDesk');
  const second=localReply('What stack does it use?',first);
  assert.equal(second.topicId,'dinedesk');assert.match(second.text,/Electron/);
  assert.equal(localReply('Next image',first).mediaId,'dinedesk-analytics');
  assert.equal(localReply('Show me Invoice Picker',first).topicId,'invoice-picker');
});
test('selected picture descriptions override unrelated prior project context',()=>{
  const reply=localReply('What is this screen?',{topicId:'glassora',mediaId:'dinedesk-kitchen'});
  assert.match(reply.text,/kitchen ticket board/i);assert.equal(reply.topicId,'dinedesk');
});
test('WILL shows the supplied personal photos and retained Messi artwork without reference placeholders or work covers',()=>{
  const photos=personalGallery.filter(media=>media.kind!=='song');
  assert.equal(photos.length,10);
  assert.ok(personalGallery.some(media=>media.id==='personal:lionel-messi'));
  for(const media of photos){assert.equal(media.placeholder,false);assert.ok(media.thumbnail);assert.equal(media.identityEvidence,false);}
  assert.equal(assistantMedia.some(media=>media.id.startsWith('reference-')),false);
  assert.ok(workGallery.length>0);
  assert.equal(workGallery.some(media=>media.src.includes('/projectcover/')||media.id.startsWith('certificate:')),false);
  const football=localReply('Tell me about football');
  assert.match(football.text,/watching football and playing on weekends/);
  assert.equal(football.mediaId,'personal:lionel-messi');
});
test('photo dismissal is explicit and retains topic',()=>{
  const reply=localReply('Put it back',{topicId:'dinedesk',mediaId:'dinedesk-kitchen'});
  assert.equal(reply.clearMedia,true);assert.equal(reply.topicId,'dinedesk');
});
test('unsupported facts and product commercial claims get bounded answers',()=>{
  assert.match(localReply('What is his salary?').text,/don't have that detail/);
  assert.match(localReply('What is DineDesk pricing?').text,/don't have verified pricing/);
  assert.match(localReply('Is DineDesk live?').text,/pre-production/i);
  assert.match(localReply('F1 championship forecast').text,/Vivek Raja P S.*AWS Builder Center/);
  assert.doesNotMatch(localReply('F1 championship forecast').text,/Villiam built|Villiam won/);
});
test('interests and short F1 aliases resolve from supplied facts',()=>{
  const interests=localReply('What does Sri like outside work?');
  for(const word of ['Travel','Bike','Gym','Messi','Cricket','Formula','Basketball'])assert.ok(interests.text.includes(word));
  assert.ok(searchKnowledge('Show me F1').some(r=>r.id==='interest:f1'));
});
test('every answer media ID resolves to an allowlisted media record',()=>{
  for(const record of knowledgeRecords)for(const id of record.mediaIds||[])assert.ok(getMedia(id),id);
  assert.equal(getMedia('https://attacker.test/image.png'),null);
});
test('conversation is bounded, duplicate live user turns are suppressed, provider history has no UI fields',()=>{
  let messages=[];for(let i=0;i<100;i++)messages=appendMessages(messages,{role:'user',content:String(i),mediaId:'private-ui-state'});
  assert.equal(messages.length,60);messages=appendMessages(messages,{role:'user',content:'99'});assert.equal(messages.length,60);
  const provider=transcriptForProvider(messages);assert.equal(provider.length,12);assert.deepEqual(Object.keys(provider[0]),['role','content']);
});
test('SSE parsing survives chunk boundaries and CRLF packets',()=>{
  const parser=parseSse();assert.deepEqual(parser.push('data: {"del'),[]);
  assert.deepEqual(parser.push('ta":"Hello"}\r\n\r\ndata: {"delta":" world"}\n\n'),[{delta:'Hello'},{delta:' world'}]);
  assert.deepEqual(parser.push('data: [DONE]\n\n'),[]);
});
test('API URLs reject credential-bearing or executable destinations',()=>{
  assert.equal(assistantApiPath('/chat',''),'/api/assistant/chat');
  assert.equal(assistantApiPath('/chat','https://api.example.test/api/assistant/'),'https://api.example.test/api/assistant/chat');
  for(const base of ['javascript:alert(1)','http://public.example','https://user:pass@example.test','https://example.test/?key=secret'])assert.throws(()=>assistantApiPath('/chat',base));
  assert.throws(()=>assistantApiPath('/unknown',''));
});
test('male browser voice selection excludes female and unclassified default voices',()=>{
  assert.equal(selectMaleVoice([{name:'Google UK English Female',lang:'en-GB'}]),null);
  assert.equal(selectMaleVoice([{name:'Samantha',lang:'en-US'},{name:'Daniel',lang:'en-GB'}]).name,'Daniel');
});
test('recognition and playback are stopped and late callbacks do not survive disposal',async()=>{
  let recognizer,spoken,cancelled=0,aborted=0;const states=[],final=[];
  class Recognition{constructor(){recognizer=this;}start(){this.onstart?.();}abort(){aborted++;}}
  class Utterance{constructor(text){this.text=text;}}
  const environment={SpeechRecognition:Recognition,SpeechSynthesisUtterance:Utterance,speechSynthesis:{getVoices:()=>[{name:'Daniel',lang:'en-GB'}],speak:u=>{spoken=u;u.onstart();},cancel:()=>cancelled++}};
  const speech=createBrowserSpeech({environment,onState:v=>states.push(v),onFinal:t=>final.push(t)});
  speech.listen();recognizer.onresult({resultIndex:0,results:[Object.assign([{transcript:'DineDesk'}],{isFinal:true})]});
  assert.deepEqual(final,['DineDesk']);assert.equal(aborted,1);
  const done=speech.speak('Hello');assert.equal(spoken.voice.name,'Daniel');speech.dispose();await done;
  assert.equal(cancelled,1);assert.equal(recognizer.onresult,null);assert.equal(spoken.onend,null);
});

test('stalled chat times out and caller cancellation is preserved',async()=>{
  const hanging=(_url,{signal})=>new Promise((resolve,reject)=>{if(signal.aborted)reject(signal.reason);else signal.addEventListener('abort',()=>reject(signal.reason),{once:true});});
  await assert.rejects(streamChat('Hello',{},[],{fetcher:hanging,timeoutMs:10}),/timed out/);
  const controller=new AbortController();controller.abort(new Error('Visitor closed WILL'));
  await assert.rejects(streamChat('Hello',{},[],{fetcher:hanging,signal:controller.signal}),/Visitor closed WILL/);
});
test('completed chat returns streamed content and provider metadata',async()=>{
  const deltas=[];
  const fetcher=async()=>new Response('data: {"delta":"Hello "}\n\ndata: {"delta":"there"}\n\ndata: {"result":{"provider":"gemini","topicId":"about"}}\n\n');
  const result=await streamChat('Hello',{},[],{fetcher,onDelta:value=>deltas.push(value)});
  assert.equal(result.text,'Hello there');assert.equal(result.provider,'gemini');assert.deepEqual(deltas,['Hello ','Hello there']);
});

test('assistant display removes raw media/link markup while keeping readable labels',()=>{
 const answer='Glassora.\n\n[ ![Glassora](project:glassora:cover) ](/glassora)\n\nSee the [case study](/glassora) and **SwiftUI**.';
 assert.equal(assistantText(answer),'Glassora.\n\nSee the case study and SwiftUI.');
});
test('assistant display keeps ordinary text, prices, code operators and Unicode',()=>{
 const answer='WILL costs $0 here. 2 * 3 = 6. Villiam’s projects — C++ & Java.';
 assert.equal(assistantText(answer),answer);
});

test('male voice choice is deterministic and stays pinned when browser voice order changes',async()=>{
  const daniel={name:'Daniel',lang:'en-GB',voiceURI:'daniel'};
  const david={name:'David',lang:'en-US',voiceURI:'david'};
  assert.equal(selectMaleVoice([david,daniel]),daniel);
  assert.equal(selectMaleVoice([daniel,david]),daniel);
  let voices=[daniel],spoken=[];
  const environment={SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>voices,speak:u=>spoken.push(u),cancel(){}}};
  const speech=createBrowserSpeech({environment});
  const first=speech.speak('Hello');
  assert.equal(spoken[0].voice,daniel);assert.equal(spoken[0].rate,.94);assert.equal(spoken[0].pitch,.96);
  spoken[0].onend();await first;
  voices=[david,daniel];
  const next=speech.speak('Another reply');assert.equal(spoken[1].voice,daniel);
  speech.dispose();await next;
});
test('WILL uses the selected Aman Indian English voice ahead of other male voices and keeps it for every reply',async()=>{
  const aman={name:'Aman',lang:'en-IN',voiceURI:'aman'};
  const enhanced={name:'Aman (Enhanced)',lang:'en-IN',voiceURI:'aman-enhanced'};
  const daniel={name:'Daniel',lang:'en-GB',voiceURI:'daniel-premium'};
  for(const voices of [[daniel,aman],[aman,daniel]])assert.equal(selectMaleVoice(voices),aman);
  assert.equal(selectMaleVoice([daniel,aman,enhanced]),enhanced);
  assert.equal(selectMaleVoice([daniel]),daniel);
  let voices=[daniel,aman];const spoken=[];
  const environment={SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>voices,speak:u=>spoken.push(u),cancel(){}}};
  const speech=createBrowserSpeech({environment});
  const first=speech.speak('Welcome to WILL.');
  assert.equal(spoken[0].voice,aman);assert.equal(spoken[0].lang,'en-IN');
  spoken[0].onend();await first;
  voices=[enhanced,daniel];
  const next=speech.speak('Let’s explore Sri’s projects.');
  assert.equal(spoken[1].voice,aman);assert.equal(spoken[1].lang,'en-IN');
  speech.dispose();await next;
});
test('late installed voices cannot start speech after cancellation, and the next reply uses the pinned voice',async()=>{
  let voices=[],changed,spoken=[];
  const synth={getVoices:()=>voices,addEventListener:(_name,handler)=>{changed=handler;},removeEventListener(){},speak:u=>spoken.push(u),cancel(){}};
  const speech=createBrowserSpeech({environment:{speechSynthesis:synth,SpeechSynthesisUtterance:class{}}});
  const cancelled=speech.speak('Old reply');speech.stopSpeaking();
  const daniel={name:'Daniel',lang:'en-GB'};voices=[daniel];changed();await cancelled;
  assert.equal(spoken.length,0);
  const next=speech.speak('Current reply');assert.equal(spoken[0].voice,daniel);
  speech.dispose();await next;
});

test('an installed male voice is discovered even after the initial voice-list wait expired',async()=>{
  let voices=[],spoken;
  const environment={SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>voices,speak:u=>{spoken=u;},cancel(){}}};
  const speech=createBrowserSpeech({environment,voiceWaitMs:2});
  await new Promise(resolve=>setTimeout(resolve,5));
  voices=[{name:'Daniel',lang:'en-GB'}];
  const reply=speech.speak('Late voice');await Promise.resolve();
  assert.equal(spoken.voice.name,'Daniel');speech.dispose();await reply;
});

test('WILL answers assistant and owner names directly, even after an unrelated topic',()=>{
  for(const question of ['What is your full name','What is your full name?','What’s your name?','Who are you?','Introduce yourself','Tell me about yourself']){
    const reply=localReply(question,{topicId:'dinedesk',mediaId:'dinedesk-kitchen'});
    assert.match(reply.text,/My name is WILL/);assert.match(reply.text,/SRI VILLIAM SAI/);
    assert.equal(reply.topicId,'assistant');assert.deepEqual(reply.links,[]);
    assert.doesNotMatch(reply.text,/don.t have|contact him/i);
  }
  for(const question of ['What is his full name?','Full name'])assert.equal(localReply(question).text,'SRI VILLIAM SAI');
  assert.match(localReply('Who is Sri?').text,/His full name is SRI VILLIAM SAI/);
  assert.match(localReply('Are you Sri?').text,/AI portfolio assistant/);
});
test('short conversational replies do not repeat the welcome or lose the selected project',()=>{
  const context={topicId:'dinedesk'};
  for(const question of ['Hi','Hello WILL','Good afternoon','How are you?','Thank you','What can you do?']){
    const reply=localReply(question,context);
    assert.ok(reply.text.length<220);assert.equal(reply.topicId,'dinedesk');assert.deepEqual(reply.links,[]);
    assert.doesNotMatch(reply.text,/story behind a picture|I don.t have/);
  }
});
test('higher-quality versions of male voices take priority without relying on voice-list order',()=>{
  const basic={name:'Daniel',lang:'en-GB',voiceURI:'daniel-compact'};
  const enhanced={name:'Daniel (Enhanced)',lang:'en-GB',voiceURI:'daniel-enhanced'};
  const premium={name:'Daniel',lang:'en-GB',voiceURI:'daniel-premium'};
  assert.equal(selectMaleVoice([basic,premium,enhanced]),premium);
  assert.equal(selectMaleVoice([enhanced,basic]),enhanced);
  assert.equal(selectMaleVoice([{name:'Samantha (Premium)',lang:'en-US'},basic]),basic);
});


test('personal photos get conversational replies and keep the exact selected image',()=>{
  for(const media of personalGallery){
    const reply=localReply('Tell me about this picture',{topicId:'dinedesk',mediaId:media.id});
    assert.equal(reply.mediaId,media.id);
    assert.equal(reply.text,media.reply);
    assert.doesNotMatch(reply.text,/supplied by|owner supplied|personal gallery|retained at|reference|placeholder/i);
    assert.equal(getMediaContext(media.id).description,media.reply);
    assert.equal('source' in getMediaContext(media.id),false);
  }
  const portrait=localReply('Who is this?',{mediaId:'personal:outdoor-portrait'});
  assert.match(portrait.text,/That’s SRI VILLIAM SAI/);assert.equal(portrait.topicId,'about');
  assert.match(localReply('Is this Sri?',{mediaId:'personal:outdoor-portrait'}).text,/That’s SRI VILLIAM SAI/);
  assert.match(localReply('What is this?',{mediaId:'personal:batman'}).text,/crocheted Batman/);
  assert.match(localReply('Tell me about this photo',{mediaId:'personal:lionel-messi'}).text,/watching football and playing on weekends/);
});
test('photo location and date questions do not turn upload provenance into a personal story',()=>{
  const context={mediaId:'personal:outdoor-portrait'};
  assert.match(localReply('Where was this photo taken?',context).text,/don’t have the location/);
  assert.match(localReply('When was this taken?',context).text,/don’t have a date/);
  assert.match(localReply('What year is this picture from?',context).text,/don’t have a date/);
  assert.equal(getMediaContext('unknown'),null);
  assert.match(getMediaContext('dinedesk-kitchen').description,/example kitchen ticket board/i);
});
