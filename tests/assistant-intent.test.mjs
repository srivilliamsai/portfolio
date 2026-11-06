import test from 'node:test';
import assert from 'node:assert/strict';
import {localReply,searchKnowledge,getMedia} from '../src/services/assistantKnowledge.js';
import {mergeAssistantContext,sanitizeAssistantContext} from '../src/services/assistantContext.js';
import {projects} from '../src/data/projects.js';
import {certificates} from '../src/data/certificates.js';
import {technicalSkills} from '../src/data/technicalSkills.js';
import {contributions} from '../src/data/contributions.js';
import {programmingLanguages} from '../src/services/assistantConversation.js';

const names=projects.map(project=>project.title).join(', ');
const conversation=()=>{let context={};return q=>{const reply=localReply(q,context);context=mergeAssistantContext(context,reply);return reply;};};
const pure=(reply,expected)=>{assert.equal(reply.text,expected);assert.deepEqual(reply.links,[]);assert.equal(reply.mediaId,null);assert.equal(reply.clearMedia,true);};

test('reported project speech transcriptions and functional descriptions resolve before the project catalog in any previous context',()=>{
  const cases=[['tell the Glacier project','glassora'],['tell kasora project','glassora'],['tell black Sora project','glassora'],['tell about the wallpaper project','glassora'],['tell tiny desk project','dinedesk'],['explain the weather project','wyndra'],['tell the roadside assistance project','pitstop'],['explain the emissions tracker','carbon-footprint'],['tell the invoicing app','invoice-picker']];
  const contexts=[{}, {topicId:'projects'}, {topicId:'dinedesk',mediaId:'dinedesk-kitchen'}, {topicId:'background:vill-llm'}, {topicId:'interest:f1',mediaId:'personal:formula-one'}, {topicId:'profile:school'}, {topicId:'achievements',tour:{collection:'achievements',index:0}}];
  for(const [question,id]of cases)for(const context of contexts){
    const reply=localReply(question,context),project=projects.find(project=>project.id===id);
    assert.equal(reply.topicId,id,JSON.stringify({question,context}));assert.ok(reply.text.includes(project.title));
    assert.equal(getMedia(reply.mediaId)?.entityId,id);assert.doesNotMatch(reply.text,/six main projects/);
    assert.equal(searchKnowledge(question)[0].id,id);
  }
});

test('an unmatched specific project asks for a name instead of listing projects or inheriting an old architecture',()=>{
  for(const question of ['tell Nebula project','explain Nebula project architecture','tell Nebula project names only']){
    const reply=localReply(question,{topicId:'dinedesk',mediaId:'dinedesk-kitchen'});
    assert.match(reply.text,/spell it or describe/);assert.doesNotMatch(reply.text,/PitStop|DineDesk|six/);assert.equal(reply.clearMedia,true);
  }
  assert.match(localReply('Tell me about projects').text,/six main projects/);
  assert.match(localReply('Tell me all projects').text,/PitStop/);
});

test('the exact F1 achievement transcript selects the case study and work figures over a personal car',()=>{
  const ask=conversation();assert.match(ask('key achievements').text,/hackathon winner/);
  for(const question of ['ok explain the F1 case study','explain the he achievements of F1 case study']){
    const reply=ask(question);assert.equal(reply.topicId,'f1-race-analysis');assert.match(reply.text,/4,000.*Bedrock/);assert.match(reply.text,/Vivek Raja P S/);assert.equal(getMedia(reply.mediaId)?.entityId,'f1-race-analysis');assert.ok(reply.links[0].href.includes('/achievements/f1-race-analysis'));assert.doesNotMatch(reply.text,/red racing car|one of Villiam.s interests/);
    assert.equal(searchKnowledge(question)[0].id,'f1-race-analysis');
  }
  const stale=localReply('Explain F1 case study',{topicId:'interest:f1',mediaId:'personal:formula-one'});assert.equal(stale.topicId,'f1-race-analysis');
});

test('case-study follow-ups progress to different details and select section-specific images',()=>{
  const ask=conversation();const initial=ask('F1 case study');
  const more=ask('explain more');assert.match(more.text,/deterministic.*OpenF1/);assert.notEqual(more.text,initial.text);
  const next=ask('tell me more');assert.match(next.text,/July|replay/i);assert.notEqual(next.text,more.text);
  const architecture=ask('What is the architecture?');assert.equal(architecture.mediaId,'achievement:f1-race-analysis:6');
  const correction=ask('explain the cancelled round correction');assert.equal(correction.mediaId,'achievement:f1-race-analysis:5');
  assert.equal(ask('Show the F1 car').mediaId,'personal:formula-one');
  assert.equal(ask('Show the F1 case-study image').topicId,'f1-race-analysis');
  assert.equal(ask('Tell Glacier project').topicId,'glassora');
  assert.equal(ask('Explain more').topicId,'glassora');
});

test('personal F1 interests and explicit award questions preserve separate source facts',()=>{
  for(const question of ['why does he like F1','show the F1 car','favourite F1 driver'])assert.equal(localReply(question,{topicId:'f1-race-analysis'}).mediaId,'personal:formula-one');
  const award=localReply('Did he win an F1 award?');assert.match(award.text,/confirmed hackathon win is for Restaurant Turnover Prediction/);assert.match(award.text,/Vivek Raja P S/);
  const general=localReply('key achievements');assert.match(general.text,/Workday/);assert.doesNotMatch(general.text,/two entries|page has|not another award/);
});

test('names-only takes priority over count and completion wording with no ancillary output',()=>{
  for(const question of ['how many project if he completed till the project name only','only project names','just the names of all projects','list project names without explanation','all projects names no descriptions'])pure(localReply(question),names);
  pure(localReply('How many projects? Just the number.'),'6');
  pure(localReply('Tell Glacier project name only'),'Glassora');
  pure(localReply('App Store project names only'),'Glassora');
});

test('the same strict names format applies to approved skills, languages, credentials, contributions and biography',()=>{
  for(const [question,expected]of [
    ['skill names only',technicalSkills.map(item=>item.name).join(', ')],
    ['coding language names only',programmingLanguages.join(', ')],
    ['certificate names only',certificates.map(item=>item.title).join(', ')],
    ['open source contribution titles only',contributions.map(item=>item.title).join(', ')],
    ['school name only','London Krishnamoorthi Matriculation Higher Secondary School'],
    ['his full name only','SRI VILLIAM SAI'],
    ['your name only','WILL'],
  ])pure(localReply(question),expected);
  pure(localReply('How many skills? Count only'),String(technicalSkills.length));
  pure(localReply('How many selected certificates? Number only'),'3');
  assert.doesNotMatch(localReply('spoken languages names only').text,/Java|Swift/);
});

test('format-only follow-ups keep technology-list scope and clear it on a new topic',()=>{
  const ask=conversation();ask('DineDesk stack');pure(ask('names only'),projects.find(project=>project.id==='dinedesk').technologies.join(', '));
  pure(ask('count only'),String(projects.find(project=>project.id==='dinedesk').technologies.length));
  ask('Certificates');pure(ask('names only'),certificates.map(item=>item.title).join(', '));
  ask('Projects');pure(ask('name them'),names);
  assert.equal(sanitizeAssistantContext({answerScope:'arbitrary injected facts'}).answerScope,undefined);
  assert.equal(mergeAssistantContext({topicId:'dinedesk',answerScope:'project-technologies'},{topicId:'about'}).answerScope,undefined);
});


test('F1 technology lists keep case-study scope while an explicit owner-language question switches topics',()=>{
  const ask=conversation();ask('F1 case study');
  assert.match(ask('What languages does it use?').text,/Amazon Bedrock/);
  pure(ask('names only'),'Python, OpenF1, Strands Agents, Amazon Bedrock, Amazon Nova Pro, Amazon S3, AWS App Runner');
  pure(ask('count only'),'7');
  assert.equal(ask('What programming languages does he know?').topicId,'programming-languages');
});
