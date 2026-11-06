import test from 'node:test';
import assert from 'node:assert/strict';
import {localReply,getMedia,publicKnowledge} from '../src/services/assistantKnowledge.js';
import {mergeAssistantContext} from '../src/services/assistantContext.js';
import {projects} from '../src/data/projects.js';
import {livePortfolioContext} from '../src/services/assistantLiveContext.js';

test('reported Glassora speech spellings and a 500-word request return a full grounded explanation',()=>{
  for(const name of ['Lasora','Glasura','Glasora','Glassora']){
    const reply=localReply(`minimum 500 words tell about the ${name}`,{topicId:'f1-race-analysis'});
    assert.equal(reply.topicId,'glassora');assert.equal(reply.answerFormat,'detailed');
    assert.ok(reply.text.split(/\s+/).length>=500);assert.match(reply.text,/SwiftUI/);assert.match(reply.text,/Firestore/);assert.match(reply.text,/R2/);assert.match(reply.text,/Mac/);assert.match(reply.text,/Tradeoffs/);
    assert.equal(getMedia(reply.mediaId).entityId,'glassora');assert.doesNotMatch(reply.text,/Antonelli|NEMO|Vivek/);
  }
  for(const project of projects){const reply=localReply(`500 words about ${project.title}`);assert.ok(reply.text.split(/\s+/).length>=500,project.title);assert.equal(getMedia(reply.mediaId).entityId,project.id);}
});

test('Glassora compatibility follow-ups use dated App Store facts without inventing device or user counts',()=>{
  let context=mergeAssistantContext({},localReply('Explain more about Glasura'));
  for(let repeat=0;repeat<5;repeat++)for(const question of ['How many device available?','targeted version',"It is available for Mac OS",'Which platforms does it support?']){
    const reply=localReply(question,context);assert.equal(reply.topicId,'glassora');assert.equal(reply.answerFormat,'source-facts');
    assert.match(reply.text,/iPhone, iOS 16\.0/);assert.match(reply.text,/iPad, iPadOS 16\.0/);assert.match(reply.text,/Mac, macOS 14\.0/);assert.match(reply.text,/Apple Vision, visionOS 1\.0/);assert.match(reply.text,/0\.1\.6/);assert.match(reply.text,/not tested device models/);assert.match(reply.links[0].href,/apps\.apple\.com/);
    context=mergeAssistantContext(context,reply);
  }
  assert.equal(localReply('How many users?',context).answerUnavailable,true);
});

test('all project architecture answers are present and detailed follow-ups advance without repetition',()=>{
  for(const project of projects){
    let context=mergeAssistantContext({},localReply(`${project.title} architecture`));
    const first=localReply(`${project.title} architecture`);assert.match(first.text,/flow goes from/);assert.equal(first.answerFormat,'source-facts');
    const seen=new Set([first.text]);
    for(let i=0;i<5;i++){const reply=localReply('Explain detailly',context);assert.equal(reply.topicId,project.id);assert.ok(!seen.has(reply.text),project.title);seen.add(reply.text);context=mergeAssistantContext(context,reply);}
  }
  const carbon=localReply('Okay. Carbon footprints architecture.',{topicId:'glassora'});
  assert.match(carbon.text,/React frontend.*Spring Boot API/);assert.match(carbon.text,/static demo does not establish a running backend/);
});

test('ambiguous earphone and iPhone analysis requests never silently select the F1 case study',()=>{
  for(const topicId of ['glassora','f1-race-analysis','interest:f1'])for(const question of ['earphone','earphone analyse','earphone analysis','iPhone analyse','iPhone analysis']){
    const reply=localReply(question,{topicId});assert.equal(reply.needsClarification,true);assert.equal(reply.mediaId,undefined);assert.match(reply.text,/mean/);
  }
});

test('Live starts with all six full case studies, architecture, compatibility and attributed achievement details',()=>{
  const text=livePortfolioContext();
  for(const project of projects)assert.ok(text.includes(project.title));
  assert.match(text,/Spring Boot API/);assert.match(text,/macOS 14\.0/);assert.match(text,/500-word/);assert.match(text,/Vivek Raja P S/);assert.match(text,/crocheted Batman collectible/);
  assert.doesNotMatch(text,/Image supplied by/);assert.equal(publicKnowledge().find(item=>item.id==='glassora-availability').links[0].href,'https://apps.apple.com/in/app/glassora-wallpapers-hd-4k/id6777764126');
});
