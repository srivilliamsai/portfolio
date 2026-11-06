import test from 'node:test';
import assert from 'node:assert/strict';
import {captionWords,tourPresentation} from '../src/services/assistantPresentation.js';

test('listening captions show the visitor’s current words without a stale assistant reply',()=>{
  const lastMessage={role:'assistant',content:'Previous answer.'};
  assert.deepEqual(tourPresentation({state:'listening',heard:'Who is this?',partial:'Stale stream',lastMessage}),{text:'Who is this?',isUser:true,primary:'Listening',secondary:'Just talk'});
  assert.equal(tourPresentation({state:'listening',lastMessage}).text,'');
});
test('thinking hides the previous turn until the current answer begins streaming',()=>{
  const lastMessage={role:'user',content:'New question?'};
  assert.equal(tourPresentation({state:'thinking',lastMessage}).text,'');
  assert.equal(tourPresentation({state:'thinking',partial:'New **answer**.',lastMessage}).text,'New answer.');
  assert.equal(tourPresentation({state:'connecting',lastMessage}).text,'');
  assert.equal(tourPresentation({state:'speaking',lastMessage:{role:'assistant',content:'Current reply.'}}).text,'Current reply.');
});
test('caption windows retain the latest two sentences with stable word positions while streaming',()=>{
  const first=captionWords('One sentence. Another sentence. A third');
  assert.equal(first.map(item=>item.word).join(' '),'Another sentence. A third');
  assert.deepEqual(captionWords('One sentence. Another sentence. A third sentence.').slice(0,3),first.slice(0,3));
  assert.equal(first[0].index,2);
  assert.deepEqual(captionWords(''),[]);
  assert.equal(captionWords('**Sri** builds.\n\n[See more](/projects).').map(item=>item.word).join(' '),'Villiam builds. See more.');
});


test('voice mode never displays a completed transcript before speech captions arrive',()=>{
  const lastMessage={role:'assistant',content:'This complete answer has not been spoken yet.'};
  for(const state of ['thinking','speaking','idle'])assert.equal(tourPresentation({state,mode:'voice',lastMessage}).text,'');
  assert.equal(tourPresentation({state:'speaking',mode:'voice',partial:'This complete',lastMessage}).text,'This complete');
  assert.equal(tourPresentation({state:'idle',mode:'type',lastMessage}).text,lastMessage.content);
});
