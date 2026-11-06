import {assistantText} from '../src/services/assistantText.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {displayOwnerName,spokenOwnerName,ownerNameInstruction} from '../src/services/assistantIdentity.js';
import {localReply,welcome,publicKnowledge,getMediaContext} from '../src/services/assistantKnowledge.js';
import {personalGallery} from '../src/services/assistantGallery.js';
import {createBrowserSpeech} from '../src/services/assistantSpeech.js';
import {streamChat} from '../src/services/assistantSession.js';

test('WILL writes the preferred name while preserving links, code, identifiers and its own name',()=>{
  assert.equal(displayOwnerName('Sri Villiam Sai and Sri’s work. William Sai.'),'SRI VILLIAM SAI and Villiam’s work. SRI VILLIAM SAI.');
  assert.equal(displayOwnerName('SRI VILLIAM SAI'), 'SRI VILLIAM SAI');
  const literal='WILL https://example.test/Sri https://example.test/William mailto:srivilliamsai@gmail.com `Sri` Srinivasan';
  assert.equal(displayOwnerName(literal),literal);
  assert.equal(spokenOwnerName('WILL introduces Villiam Sai.'),'Will introduces Sri William Sai.');
});
test('formal capitals never turn Sri or the full owner name into spoken initials',()=>{
  for(let repeat=0;repeat<5;repeat++){
    assert.equal(spokenOwnerName('SRI'),'Sri');
    assert.equal(spokenOwnerName('SRI VILLIAM SAI'),'Sri William Sai');
    assert.equal(spokenOwnerName('His full name is SRI VILLIAM SAI.'),'His full name is Sri William Sai.');
    assert.equal(displayOwnerName('Sri William Sai'),'SRI VILLIAM SAI');
    assert.equal(spokenOwnerName('SRI VILLIAM SAI').length,'SRI VILLIAM SAI'.length);
  }
  assert.match(ownerNameInstruction,/Sri is one spoken word/);assert.match(ownerNameInstruction,/never read SRI as the letters/);
});
test('all supported owner-name spellings resolve to the same person without changing the assistant identity',()=>{
  for(const name of ['Sri','Villiam','Villiam Sai','William','William Sai']){
    const reply=localReply(`Who is ${name}?`);assert.equal(reply.topicId,'about');assert.match(reply.text,/His full name is SRI VILLIAM SAI/);assert.doesNotMatch(reply.text.replaceAll('SRI VILLIAM SAI',''),/\bSri\b|\bWilliam\b/i);
    assert.equal(localReply(`Where was ${name} born?`).text,'Villiam was born in Thanjavur, India.');
  }
  assert.equal(localReply('What is your full name?').text,'My name is WILL. I’m the portfolio assistant for SRI VILLIAM SAI.');
});
test('bare full-name questions always name the owner, including after project and gallery turns',()=>{
  const contexts=[{}, {topicId:'projects'}, {topicId:'pitstop'}, {topicId:'glassora'}, {topicId:'profile:school'}, {topicId:'interest:f1',mediaId:'personal:formula-one'}, {topicId:'about',mediaId:'personal:outdoor-portrait'}];
  for(const context of contexts)for(const question of ['What is the full name','What is his full name?','What’s the full name?','Tell me the full name','full name','his real name','What is my full name?']){
    const reply=localReply(question,context);
    assert.equal(reply.text,'SRI VILLIAM SAI',JSON.stringify({question,context,reply}));
    assert.equal(reply.topicId,'about');assert.deepEqual(reply.links,[]);assert.equal(reply.answerFormat,'names-only');
  }
  assert.equal(localReply('What is your full name?').topicId,'assistant');
  assert.equal(localReply('PitStop full name only',{topicId:'about'}).text,'PitStop');
  assert.equal(publicKnowledge().some(record=>record.id==='profile:pitstop-name'),false);
});
test('everyday replies, contact labels, gallery titles and provider facts use Villiam',()=>{
  for(const question of ['Hi','Projects','What school did he attend?','What is he studying now?','What are his career goals?','Tell me about DineDesk','What does he like?','How do I contact him?','What is his salary?']){
    const reply=localReply(question);assert.doesNotMatch(reply.text.replaceAll('SRI VILLIAM SAI',''),/\bSri\b|\bWilliam\b/i);
    for(const link of reply.links)assert.doesNotMatch(link.label,/\bSri\b/);
  }
  assert.doesNotMatch(welcome,/\bSri\b/i);assert.match(welcome,/\bVilliam\b/);assert.ok(welcome.split(/\s+/).length<=16);
  for(const record of publicKnowledge())assert.doesNotMatch(record.text.replaceAll('SRI VILLIAM SAI',''),/\bSri\b|\bWilliam\b/i);
  for(const media of personalGallery)assert.doesNotMatch(media.title,/\bSri\b/);
  assert.match(getMediaContext('personal:outdoor-portrait').description,/That’s SRI VILLIAM SAI/);
  assert.equal(localReply('Contact').links.find(link=>link.href.startsWith('mailto:')).href,'mailto:srivilliamsai@gmail.com');
});
test('Aman receives William for pronunciation while speech captions keep Villiam at the same word boundaries',async()=>{
  const aman={name:'Aman',lang:'en-IN'};let utterance;const captions=[];
  const speech=createBrowserSpeech({environment:{SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[aman],speak:value=>{utterance=value;},cancel(){}}},onCaption:value=>captions.push(value)});
  const done=speech.speak('Sri Villiam Sai builds useful products.');
  assert.equal(utterance.voice,aman);assert.equal(utterance.text,'Sri William Sai builds useful products.');assert.equal(utterance.lang,'en-IN');
  utterance.onstart();assert.equal(captions.at(-1),'SRI');assert.equal(assistantText(captions.at(-1)),'SRI');
  utterance.onboundary({name:'word',charIndex:4});assert.equal(captions.at(-1),'SRI VILLIAM');assert.equal(assistantText(captions.at(-1)),'SRI VILLIAM');
  utterance.onboundary({name:'word',charIndex:12});assert.equal(captions.at(-1),'SRI VILLIAM SAI');
  utterance.onboundary({name:'word',charIndex:16});assert.equal(captions.at(-1),'SRI VILLIAM SAI builds');
  utterance.onend();await done;assert.equal(captions.at(-1),'SRI VILLIAM SAI builds useful products.');
  const short=speech.speak('Villiam builds products.');assert.equal(utterance.text,'William builds products.');utterance.onstart();assert.equal(captions.at(-1),'Villiam');utterance.onend();await short;speech.dispose();
});
test('streamed names split across provider chunks are normalized in captions and the completed reply',async()=>{
  const partial=[];
  const packets=[{delta:'Sr'},{delta:'i’s projects include Glassora. '},{delta:'Wil'},{delta:'liam likes learning.'},{result:{topicId:'about',links:[{label:'About Sri',href:'/#about-me'}]}}];
  const fetcher=async()=>new Response(packets.map(packet=>'data: '+JSON.stringify(packet)+'\n\n').join(''));
  const reply=await streamChat('Tell me about Villiam',{},[],{fetcher,onDelta:value=>partial.push(value)});
  assert.equal(partial[1],'Villiam’s projects include Glassora. ');
  assert.equal(reply.text,'Villiam’s projects include Glassora. Villiam likes learning.');
  assert.equal(reply.links[0].label,'About Villiam');
});


test('Aman says the assistant name as Will while captions retain uppercase WILL',async()=>{
  let utterance;const captions=[];const aman={name:'Aman',lang:'en-IN'};
  const speech=createBrowserSpeech({environment:{SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[aman],speak:value=>{utterance=value;},cancel(){}}},onCaption:value=>captions.push(value)});
  const reply=speech.speak("Hi, I'm WILL, Villiam’s assistant.");
  assert.equal(utterance.voice,aman);assert.equal(utterance.text,"Hi, I'm Will, William’s assistant.");
  assert.doesNotMatch(utterance.text,/\bWILL\b/);
  utterance.onstart();utterance.onboundary({name:'word',charIndex:8});assert.equal(captions.at(-1),"Hi, I'm WILL,");
  utterance.onend();await reply;assert.equal(captions.at(-1),"Hi, I'm WILL, Villiam’s assistant.");speech.dispose();
});
