import test from 'node:test';
import assert from 'node:assert/strict';
import {localReply,searchKnowledge,publicKnowledge,getMedia} from '../src/services/assistantKnowledge.js';
import {sanitizeAssistantContext,mergeAssistantContext} from '../src/services/assistantContext.js';
import {personalGallery} from '../src/services/assistantGallery.js';
function conversation(initial={}){let context=initial;return q=>{const reply=localReply(q,context);context=mergeAssistantContext(context,reply);return reply;};}

test('the failed personal-image transcript resolves names, reasons and speech transcriptions',()=>{
  const ask=conversation();
  const first=ask('Okay he show some image of Messi Dhoni F1 Y');
  for(const name of ['Messi','Dhoni','Formula 1'])assert.ok(first.text.includes(name));
  assert.equal(first.mediaId,'personal:lionel-messi');
  assert.match(ask('Okay why he had the image').text,/watching it and playing/);
  const dhoni=ask('Okay why he had Dhoni image');assert.equal(dhoni.mediaId,'personal:cricket');assert.match(dhoni.text,/interest in cricket/);
  const laptop=ask('Okay why he had the laptop image');assert.equal(laptop.mediaId,'personal:developer-workspace');assert.match(laptop.text,/interfaces, backend services/);
  const mongo=ask('koi He had Mango DP');assert.equal(mongo.mediaId,'personal:mongodb-coffee');assert.match(mongo.text,/already attended MongoDB.local/);
  assert.match(ask('Did he attend the event?').text,/already attended/);
});
test('requested picture sequences advance without looping or being hijacked by an old topic',()=>{
  const ask=conversation({topicId:'dinedesk',mediaId:'dinedesk-kitchen'});
  assert.equal(ask('Show Messi, Dhoni and F1 pictures').mediaId,'personal:lionel-messi');
  assert.equal(ask('next picture').mediaId,'personal:cricket');
  assert.match(ask('Why?').text,/interest in cricket/);
  assert.equal(ask('next image').mediaId,'personal:formula-one');
  assert.match(ask('next picture').text,/last of the pictures/);
  assert.equal(ask('previous picture').mediaId,'personal:cricket');
  assert.equal(ask('Tell me about the laptop image').mediaId,'personal:developer-workspace');
  assert.equal(ask('Tell me about Invoice Picker').topicId,'invoice-picker');
});
test('new named interests override an existing selected personal photo',()=>{
  const context={topicId:'interest:messi',mediaId:'personal:lionel-messi'};
  for(const [q,id]of [['Tell me about Dhoni image','personal:cricket'],['Show me his laptop','personal:developer-workspace'],['MongoDB.local','personal:mongodb-coffee'],['What anime does he like?','personal:naruto']])assert.equal(localReply(q,context).mediaId,id,q);
});
test('biography follow-ups add distinct approved facts instead of replaying an introduction',()=>{
  const ask=conversation();
  const intro=ask('Explain about she');assert.match(intro.text,/SRI VILLIAM SAI/);assert.equal(intro.detailLevel,0);
  const education=ask('Explain more');assert.match(education.text,/Thanjavur.*Orathanadu.*2020/);assert.match(education.text,/2026–2028/);
  const experience=ask('Tell me more');assert.match(experience.text,/Global Techno Solution.*Zidio Development.*Infosys Springboard/);
  const interests=ask('more');assert.match(interests.text,/Naruto/);assert.match(interests.text,/attended MongoDB.local/);
  assert.equal(new Set([intro.text,education.text,experience.text,interests.text]).size,4);
  for(const reply of [intro,education,experience,interests])assert.doesNotMatch(reply.text,/\bI learn|\bSri\b|\bWilliam\b/);
  const reset=ask('Explain about him');assert.equal(reset.detailLevel,0);assert.equal(reset.text,intro.text);
});
test('the new gallery facts do not invent personal reasons, event dates, favourite characters or teams',()=>{
  assert.match(localReply('Why Dhoni?').text,/hasn’t shared a more specific story/);
  assert.match(localReply('What is his favourite Naruto character?').text,/hasn’t specified/);
  assert.match(localReply('What is his favourite F1 team?').text,/hasn’t specified/);
  for(const q of ['When did he attend MongoDB.local?','What year was the MongoDB event?'])assert.match(localReply(q).text,/don’t have the event date/);
  assert.match(localReply('Where was MongoDB.local?').text,/don’t have the city or venue/);
  assert.match(localReply('Why Batman?').text,/don.t have a story/);
});
test('Naruto is available as a local gallery asset and in grounded provider facts',()=>{
  const naruto=getMedia('personal:naruto');assert.ok(personalGallery.some(media=>media.id===naruto.id));assert.ok(naruto.thumbnail.startsWith('/static/media/assistant/thumbnails/'));
  assert.match(naruto.sourceUrl,/^https:\/\/naruto-official.com\//);assert.equal(naruto.identityEvidence,false);
  assert.equal(localReply('What is his favourite anime?').mediaId,naruto.id);
  for(const [q,id]of [['Naruto','interest:naruto'],['Mango DP','interest:mongodb-event'],['Dhoni','interest:cricket'],['laptop','interest:learning-technology']])assert.ok(searchKnowledge(q).some(record=>record.id===id),q);
  assert.match(publicKnowledge().find(record=>record.id==='interest:mongodb-event').text,/already attended/);
});
test('photo routing preserves certificates, programming questions and F1 analysis attribution',()=>{
  for(const context of [{},{topicId:'interest:messi',mediaId:'personal:lionel-messi'}]){
    assert.equal(localReply('Show MongoDB certificate',context).mediaId,'certificate:mongodb-associate-developer');
    assert.match(localReply('F1 championship forecast',context).text,/Vivek Raja P S|AWS Builder Center/i);
    assert.equal(localReply('What programming languages does he know?',context).topicId,'programming-languages');
    assert.equal(localReply('Where was he born?',context).topicId,'profile:birthplace');
  }
});
test('picture queues and biography progress are bounded and cleared with unrelated topics',()=>{
  const queue=['personal:lionel-messi','personal:cricket'];
  assert.deepEqual(sanitizeAssistantContext({mediaQueue:queue,detailLevel:2,biography:'injected'}),{mediaQueue:queue,detailLevel:2});
  for(const mediaQueue of [['https://attacker.test/a'],Array(13).fill('personal:naruto'),['personal:naruto',{fact:'injected'}]])assert.equal(sanitizeAssistantContext({mediaQueue}).mediaQueue,undefined);
  for(const detailLevel of [-1,4,1.5,'2'])assert.equal(sanitizeAssistantContext({detailLevel}).detailLevel,undefined);
  const context={topicId:'interest:messi',mediaId:queue[0],mediaQueue:queue,detailLevel:2};
  assert.equal(mergeAssistantContext(context,{clearMedia:true}).mediaQueue,undefined);
  const changed=mergeAssistantContext(context,{topicId:'skills'});assert.equal(changed.mediaQueue,undefined);assert.equal(changed.detailLevel,undefined);
  assert.equal(localReply('next image',{...context,mediaQueue:['personal:not-registered']}).mediaId,'personal:lionel-messi');
});
