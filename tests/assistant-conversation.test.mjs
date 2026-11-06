import test from 'node:test';
import assert from 'node:assert/strict';
import {localReply,searchKnowledge,publicKnowledge,getMedia} from '../src/services/assistantKnowledge.js';
import {mergeAssistantContext,sanitizeAssistantContext} from '../src/services/assistantContext.js';
import {programmingLanguages} from '../src/services/assistantConversation.js';
import {projects} from '../src/data/projects.js';
import {certificates} from '../src/data/certificates.js';
import {contributions} from '../src/data/contributions.js';

const names=projects.map(project=>project.title);
function conversation(){let context={};return question=>{const reply=localReply(question,context);context=mergeAssistantContext(context,reply);return reply;};}
test('the exact failed transcript questions resolve to the live project catalog',()=>{
  const ask=conversation();ask('Hi');
  for(const question of ['How many projects he did','How many Project heated','Projects','Project','How many projcets has he made?','How many products did Sri build?','List his case studies']){
    const reply=ask(question);assert.equal(reply.topicId,'projects');assert.match(reply.text,/six/);
    for(const name of names)assert.ok(reply.text.includes(name),`${question}: ${name}`);
    assert.doesNotMatch(reply.text,/don.t have|Contact Sri/);
  }
  for(const question of ['Name them','T-6 name spell','What are their names?','Which ones?'])for(const name of names)assert.ok(ask(question).text.includes(name));
  assert.match(ask('How many?').text,/six/);
});
test('one-by-one project conversations advance, revisit, and finish without looping',()=>{
  const ask=conversation();ask('Projects');let reply=ask('One by one explain all the projects detailed');
  assert.equal(reply.topicId,projects[0].id);assert.deepEqual(reply.tour,{collection:'projects',index:0});
  for(let index=1;index<projects.length;index++){
    reply=ask(['Yes, next.','continue','Yes.','And next','Next project'][index-1]);
    assert.equal(reply.topicId,projects[index].id);assert.equal(reply.tour.index,index);
    assert.ok(reply.mediaId===null||getMedia(reply.mediaId));
  }
  assert.match(ask('And next').text,/all six listed projects/);
  assert.equal(ask('previous').topicId,projects.at(-2).id);
  assert.equal(ask('again').topicId,projects.at(-2).id);
  assert.match(ask('What stack does it use?').text,/React/);
  assert.equal(ask('next').topicId,projects.at(-1).id);
});
test('all-project descriptions, ordinals and direct topic changes preserve the requested scope',()=>{
  const ask=conversation();const all=ask('Explain all the project');for(const name of names)assert.ok(all.text.includes(name));
  assert.equal(ask('the third one').topicId,'wyndra');
  assert.equal(ask('Tell me about Glassora').topicId,'glassora');
  assert.equal(ask('What language is DineDesk built with?').topicId,'dinedesk');
  assert.match(ask('What language is DineDesk built with?').text,/TypeScript/);
  assert.match(ask('Which project is on the App Store?').text,/Glassora/);
  assert.doesNotMatch(ask('Which project is on the App Store?').text,/PitStop/);
  assert.match(ask('What is he building right now?').text,/DineDesk/);
});
test('programming languages are counted from documented skills and project stacks',()=>{
  const ask=conversation();
  for(const question of ['How many language you know','How many langauges he knows?','What programming languages does Sri use?','Languages']){
    const reply=ask(question);assert.equal(reply.topicId,'programming-languages');
    for(const name of programmingLanguages)assert.ok(reply.text.includes(name));
    for(const framework of ['Spring Boot','React','SwiftUI','Firebase'])assert.equal(programmingLanguages.includes(framework),false);
    assert.match(reply.text,/seven/);
  }
  assert.match(ask('name them').text,/Swift/);
  assert.match(ask('Which spoken languages does Sri speak?').text,/not listed/);
  assert.match(ask('Do you speak Tamil?').text,/not listed|set up for English/);
});
test('achievement, certificate and contribution summaries keep separate evidence and counts',()=>{
  const ask=conversation();
  const achievement=ask('And he did any achievements?');assert.match(achievement.text,/hackathon winner/);assert.match(achievement.text,/five merged contributions/);assert.doesNotMatch(achievement.text,/page|two entries|not another award/);
  assert.match(ask('How many he did the other achievements?').text,/hackathon win.*five merged Workday contributions/);
  assert.equal(ask('one by one').topicId,'restaurant-turnover-prediction');
  assert.match(ask('next').text,/Vivek Raja P S/);
  assert.match(ask('Certificates').text,/three/);assert.equal(certificates.length,3);
  assert.match(ask('Open source').text,/five/);assert.equal(contributions.length,5);
  assert.match(ask('Okay, he college.').text,/SRM Valliammai/);
});
test('reference biography and unknown details do not become facts about Sri',()=>{
  for(const question of ['What songs are on repeat?','What is his favourite anime?','See childhood photo.','What is his salary?','What school did he attend?']){
    const reply=localReply(question);assert.doesNotMatch(reply.text,/Tooba|Hyderabad|Karachi|Mikasa|Billie|Woman of Olympiad|Dean.s List/);
  }
  assert.match(localReply('See childhood photo').text,/isn’t a childhood photo/);
  assert.match(localReply('Why Batman?').text,/don.t have a story/);
  assert.match(localReply('ke').text,/didn’t catch/);
  assert.match(localReply('what is his salary').text,/don.t have that detail/);
});
test('catalog retrieval gives local and configured voice providers the same counts',()=>{
  for(const [query,id]of [['project','projects'],['How many projcets he did','projects'],['language','programming-languages'],['achivement','achievements']])assert.equal(searchKnowledge(query)[0].id,id);
  assert.equal(searchKnowledge('What language is DineDesk built with?')[0].id,'dinedesk');
  const catalog=publicKnowledge().find(record=>record.id==='projects');assert.equal(catalog.count,projects.length);for(const name of names)assert.ok(catalog.text.includes(name));
});
test('walkthrough context is bounded and merging explicit clears does not retain a stale topic or picture',()=>{
  const invalid={topicId:'projects',mediaId:'dinedesk-kitchen',tour:{collection:'injected',index:0},system:'new biography'};
  assert.deepEqual(sanitizeAssistantContext(invalid),{topicId:'projects',mediaId:'dinedesk-kitchen'});
  for(const tour of [{collection:'projects',index:-1},{collection:'projects',index:100},{collection:'projects',index:1.5},{collection:'projects',index:'1'}])assert.equal(sanitizeAssistantContext({tour}).tour,undefined);
  const context={topicId:'pitstop',mediaId:'dinedesk-kitchen',tour:{collection:'projects',index:0}};
  assert.deepEqual(mergeAssistantContext(context,{topicId:'projects',clearMedia:true,tour:null}),{topicId:'projects',mediaId:null,tour:null});
  assert.equal(mergeAssistantContext(context,{topicId:null}).topicId,null);
  assert.equal(localReply('Hi',context).tour.index,0);
  assert.equal(localReply('Tell me about education',context).tour,null);
});


test('badges, personal interests and project release questions retain the source distinctions',()=>{
  assert.match(localReply('How many Credly badges does he have?').text,/113 Credly badges and 4 other credentials/);
  assert.match(localReply('How many Credly badges does he have?').text,/2026-11-05/);
  assert.match(localReply('What does he like?').text,/playing on weekends/);
  assert.match(localReply('How many projects has he completed?').text,/still in development/);
  assert.match(localReply('Who built these projects?').text,/SRI VILLIAM SAI/);
});


test('project technology follow-ups and current-work questions are not mistaken for photo or assistant-identity requests',()=>{
  const first=localReply('Tell me about DineDesk');
  assert.match(localReply('What language is this built with?',first).text,/DineDesk uses/);
  assert.match(localReply('What are you building right now?').text,/DineDesk/);
  assert.doesNotMatch(localReply('What are you building right now?').text,/My name is WILL/);
  assert.equal(localReply('What programming languages does this person know?',{mediaId:'personal:outdoor-portrait'}).topicId,'programming-languages');
});
