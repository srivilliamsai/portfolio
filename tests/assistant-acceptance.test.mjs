import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {assistantAcceptanceCases} from './fixtures/assistant-acceptance-cases.mjs';
import {localReply,getMedia} from '../src/services/assistantKnowledge.js';
import {canonicalQuery} from '../src/services/assistantQuery.js';

test('WILL answers at least 2,000 distinct portfolio questions with the correct topic and grounded detail',async()=>{
  const unique=new Set(assistantAcceptanceCases.map(item=>canonicalQuery(item.question)));
  assert.ok(unique.size>=2000,`Only ${unique.size} distinct questions`);
  assert.equal(unique.size,assistantAcceptanceCases.length,'Duplicate questions do not count as coverage');
  const results=assistantAcceptanceCases.map(item=>{
    const reply=localReply(item.question),errors=[];
    if(reply.topicId!==item.topicId)errors.push(`topic ${reply.topicId}, expected ${item.topicId}`);
    if(item.mediaId&&reply.mediaId!==item.mediaId)errors.push(`image ${reply.mediaId}, expected ${item.mediaId}`);
    if(item.contains&&!canonicalQuery(reply.text).includes(canonicalQuery(item.contains)))errors.push(`missing fact: ${item.contains}`);
    if(item.anchor&&!canonicalQuery(reply.text).includes(canonicalQuery(item.anchor)))errors.push(`missing section detail: ${item.anchor}`);
    if(reply.mediaId&&!getMedia(reply.mediaId))errors.push('image is not allowlisted');
    if(/I (?:don.t have that detail|didn.t catch)|Tooba|NEMO/.test(reply.text))errors.push('fallback or reference biography');
    return {category:item.category,question:item.question,passed:!errors.length,errors,topicId:reply.topicId,mediaId:reply.mediaId||null,answer:reply.text};
  });
  const failures=results.filter(item=>!item.passed);
  const summary={total:results.length,distinctQuestions:unique.size,passed:results.length-failures.length,failed:failures.length,categories:Object.fromEntries([...new Set(results.map(item=>item.category))].map(category=>[category,results.filter(item=>item.category===category).length])),scope:'Deterministic local responder; generated natural-language variations over approved case-study sections, technologies, certificates, images and biography. No paid provider calls or acoustic verification.'};
  await mkdir('test-results',{recursive:true});await writeFile('test-results/will-acceptance.json',JSON.stringify({summary,results},null,2)+'\n');
  assert.equal(failures.length,0,JSON.stringify({summary,failures:failures.slice(0,12)},null,2));
});
