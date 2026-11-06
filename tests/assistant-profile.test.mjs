import test from 'node:test';
import assert from 'node:assert/strict';
import {localReply,searchKnowledge,publicKnowledge,getMedia} from '../src/services/assistantKnowledge.js';
import {mergeAssistantContext} from '../src/services/assistantContext.js';
import {projects} from '../src/data/projects.js';
import {assistantProfile} from '../src/data/assistantProfile.js';

function conversation(){let context={};return question=>{const answer=localReply(question,context);context=mergeAssistantContext(context,answer);return answer;};}
test('birthplace answers use the owner’s confirmed city without inventing residence, birthday or photo location',()=>{
  for(const question of ['Where was Sri born?','Where he born','What is his birthplace?','Where is he from?']){
    const reply=localReply(question);assert.equal(reply.topicId,'profile:birthplace');assert.equal(reply.text,'Villiam was born in Thanjavur, India.');
  }
  assert.match(localReply('Where does he live now?').text,/not specified/);
  assert.match(localReply('When was he born?').text,/not his date or year/);
  const ask=conversation();ask('Where was he born?');assert.match(ask('When?').text,/not his date or year/);
  assert.match(localReply('Where was this photo taken?',{mediaId:'personal:outdoor-portrait'}).text,/don’t have the location/);
  assert.match(localReply('Where was this person born?',{mediaId:'personal:outdoor-portrait'}).text,/Thanjavur/);
});
test('reported location and sibling questions never fall through to biography, projects or guessed private facts',()=>{
  const contexts=[{}, {topicId:'projects',tour:{collection:'projects',index:0}},...projects.map(project=>({topicId:project.id})),{topicId:'interest:f1',mediaId:'personal:formula-one'},{topicId:'about',mediaId:'personal:outdoor-portrait'},{topicId:'profile:undergraduate'},{topicId:'profile:postgraduate'}];
  for(const context of contexts){
    for(const question of ['William location','William currently located','Where is Villiam currently located?','Where does he live now?','Where is he based?','Where is he now?','his current location']){
      const reply=localReply(question,context);
      assert.equal(reply.topicId,'profile:residence',JSON.stringify({question,context,reply}));
      assert.equal(reply.answerUnavailable,true);assert.match(reply.text,/current city of residence is not specified/);
      assert.doesNotMatch(reply.text,/Thanjavur|Chennai|DineDesk|Invoice Picker|product developer|B\.Tech/);
    }
    for(const question of ['Brothers','Does William have a brother?','How many siblings does he have? Count only','Tell me about his family']){
      const reply=localReply(question,context);
      assert.equal(reply.topicId,'profile:family');assert.equal(reply.answerUnavailable,true);
      assert.match(reply.text,/information.*(?:siblings|family)/);assert.doesNotMatch(reply.text,/didn.t catch|^\d+$/);
    }
  }
  assert.equal(localReply('PitStop location services').topicId,'pitstop');
  assert.equal(localReply('Where was Villiam born?').topicId,'profile:birthplace');
  assert.equal(localReply('Where is his school?').topicId,'profile:school');
  assert.match(localReply('Where was this photo taken?',{mediaId:'personal:outdoor-portrait'}).text,/don.t have the location/);
});
test('school answers retain the exact supplied name, town and completion year',()=>{
  for(const question of ['What school did he attend?','Where did Sri go to school?','Schooling','Which higher secondary school?']){
    const reply=localReply(question);assert.equal(reply.topicId,'profile:school');assert.match(reply.text,/London Krishnamoorthi Matriculation Higher Secondary School/);assert.match(reply.text,/Orathanadu/);assert.match(reply.text,/2020/);
  }
  const ask=conversation();ask('Schooling');assert.equal(ask('Where?').text,'His school is in Orathanadu.');assert.equal(ask('When did he finish?').text,'Villiam completed school in 2020.');
  assert.match(ask('When did he join?').text,/not the year he joined/);
});
test('undergraduate and postgraduate institutions remain distinct across short follow-ups',()=>{
  const ask=conversation();assert.match(ask('What is his B.Tech college?').text,/SRM Valliammai/);
  assert.match(ask('What years?').text,/2020–2024/);
  for(const question of ['What is he studying now?','Where is he pursuing M.Tech?','MTech university','SRMIST']){
    const reply=ask(question);assert.equal(reply.topicId,'profile:postgraduate');assert.match(reply.text,/SRM Institute of Science and Technology/);assert.match(reply.text,/2026–2028/);assert.match(reply.text,/pursuing/);assert.match(reply.text,/expected/);
    assert.match(ask('And which university?').text,/SRMIST/);assert.match(ask('When will he complete it?').text,/expects to complete.*2028/);
  }
  assert.equal(assistantProfile.postgraduate.status,'Pursuing');
  assert.match(ask('What is his undergraduate college?').text,/SRM Valliammai/);
});
test('the concise education timeline uses confirmed years without presenting M.Tech as completed',()=>{
  const reply=localReply('Tell me about his education');
  for(const fact of ['Orathanadu','2020','2020–2024','SRM Valliammai','SRMIST','2026–2028','expected'])assert.ok(reply.text.includes(fact));
  assert.doesNotMatch(reply.text,/completed (?:his )?M\.Tech|graduated.*SRMIST/);
});
test('the roadside project uses PitStop consistently with approved media',()=>{
  for(const question of ['Tell me about PitStop','What is PitStop?','Is PitStop his academic project?']){
    const reply=localReply(question);assert.equal(reply.topicId,'pitstop');assert.match(reply.text,/PitStop/);assert.doesNotMatch(reply.text,/same project|separate projects|alternative name/);assert.ok(getMedia(reply.mediaId));
  }
  assert.equal(projects.length,6);assert.match(localReply('How many projects has he done?').text,/six main projects/);
});
test('ZidioConnect is development work with bounded module claims, and does not become a new employer',()=>{
  const ask=conversation();assert.match(ask('Tell me about ZidioConnect').text,/building.*job and internship/);
  assert.match(ask('What stack does it use?').text,/Java, Spring Boot/);
  assert.match(ask('Is it completed?').text,/in development/);
  assert.doesNotMatch(ask('Is it live?').text,/is released|production.ready/);
  assert.match(localReply('What is he building right now?').text,/ZidioConnect/);
});
test('personal AI projects do not acquire invented releases, final stacks or a trained foundation model',()=>{
  const ask=conversation();assert.match(ask('What is SREN?').text,/personal project.*emotion/);
  assert.match(ask('Has it been released?').text,/not specified/);
  assert.match(ask('What technology does it use?').text,/don’t have a confirmed final/);
  assert.match(ask('Tell me about VILL LLM').text,/personal project.*large language models/);
  assert.match(ask('What model did he train?').text,/don’t have a confirmed/);
  assert.match(ask('Is it completed?').text,/not specified/);
  assert.match(localReply('What is your name?').text,/My name is WILL/);
});
test('background experience, learning and coding practice come from the supplied profile',()=>{
  const internship=localReply('What internships has he done?');
  for(const organization of ['Global Techno Solution','Zidio Development','Infosys Springboard'])assert.ok(internship.text.includes(organization));
  assert.match(localReply('Global Techno Solution').text,/June–July 2023/);
  assert.match(localReply('How does Sri learn?').text,/learns by building/);
  assert.match(localReply('What are his career goals?').text,/Java and backend/);
  assert.match(localReply('HackerRank and GeeksforGeeks').text,/three-star.*50.*November 2026/);
  assert.match(localReply('Does he know C++?').text,/studied C and C\+\+ fundamentals/);
});
test('new profile topics clear stale galleries and project walkthroughs, and explicit topics override the profile',()=>{
  const context={topicId:'dinedesk',mediaId:'dinedesk-kitchen',tour:{collection:'projects',index:4}};
  const school=localReply('Which school did he go to?',context);assert.equal(school.tour,null);assert.equal(mergeAssistantContext(context,school).mediaId,null);
  assert.equal(localReply('What is DineDesk?',school).topicId,'dinedesk');
  const ask=conversation();ask('M.Tech');assert.match(ask('What internships has he done?').text,/Zidio Development/);
  assert.equal(ask('Projects').topicId,'projects');
});
test('retrieval and provider records expose the same confirmed biography with bounded status claims',()=>{
  for(const [question,id]of [['school','profile:school'],['Where was he born?','profile:birthplace'],['M.Tech university','profile:postgraduate'],['SREN','background:sren'],['Global Techno Solution','profile:early-experience']])assert.equal(searchKnowledge(question)[0].id,id);
  const records=publicKnowledge();assert.match(records.find(item=>item.id==='profile:school').text,/Orathanadu.*2020/);
  assert.match(records.find(item=>item.id==='profile:postgraduate').text,/SRMIST.*2026–2028.*expected/);
  assert.match(records.find(item=>item.id==='background:sren').text,/not specified/);
  assert.equal(records.find(item=>item.id==='profile:pitstop-name'),undefined);assert.equal(records.find(item=>item.id==='pitstop').title,'PitStop');
  assert.equal(records.find(item=>item.id==='projects').count,6);
  assert.equal(new Set(records.map(item=>item.id)).size,records.length);
});


test('explicit showcase and selected-photo questions override an earlier personal-project topic',()=>{
  const context={topicId:'background:sren',mediaId:'personal:outdoor-portrait'};
  assert.equal(localReply('Tell me about this DineDesk',context).topicId,'dinedesk');
  assert.match(localReply('Tell me about this photo',context).text,/That’s SRI VILLIAM SAI/);
  assert.match(localReply('Where was this picture taken?',context).text,/don’t have the location/);
});
