import test from 'node:test';
import assert from 'node:assert/strict';
import {credlyCredentials,credlyProfileUrl,credlySnapshotDate} from '../src/data/credlyCredentials.js';
import {certificates} from '../src/data/certificates.js';

test('the public snapshot includes all 113 Credly badges and four other credentials once',()=>{
  assert.equal(credlyProfileUrl,'https://www.credly.com/users/srivilliamsai');
  assert.equal(credlySnapshotDate,'2026-11-05');
  assert.equal(credlyCredentials.length,117);
  assert.equal(new Set(credlyCredentials.map(item=>item.id)).size,117);
  assert.equal(credlyCredentials.filter(item=>item.collection==='Credly').length,113);
  assert.equal(credlyCredentials.filter(item=>item.collection==='Other').length,4);
  for(const item of credlyCredentials){
    assert.ok(item.title&&item.issuer&&item.dateLabel);
    assert.equal(new URL(item.image).hostname,'images.credly.com');
    const url=new URL(item.url);
    assert.equal(url.protocol,'https:');
    if(item.collection==='Credly'){
      assert.equal(url.hostname,'www.credly.com');
      assert.match(url.pathname,/^\/badges\/[a-f0-9-]+$/);
    }else{
      assert.equal(url.hostname,'catalog-education.oracle.com');
      assert.equal(item.status,'Unverified');
    }
  }
});

test('the three selected document images stay separate from the complete badge collection',()=>{
  assert.deepEqual(certificates.map(item=>item.id),['google-professional-cloud-developer','mongodb-associate-developer','claude-architect-foundations']);
  assert.equal(credlyCredentials.filter(item=>item.issuer==='Oracle').length,4);
});
