import test from 'node:test';
import assert from 'node:assert/strict';
import {lockDocumentScroll} from '../src/services/documentScrollLock.js';
test('dialog focus cannot leave the returning page at a different scroll position',()=>{
  const env={document:{documentElement:{style:{overflow:'auto'}}},scrollY:3100,location:{href:'https://portfolio.test/#about-me'},scrollTo({top,behavior}){assert.equal(behavior,'instant');this.scrollY=top;}};
  const unlock=lockDocumentScroll(env);assert.equal(env.document.documentElement.style.overflow,'hidden');
  env.scrollY=2700;unlock();assert.equal(env.scrollY,3100);assert.equal(env.document.documentElement.style.overflow,'auto');
  env.scrollY=3300;unlock();assert.equal(env.scrollY,3300);
});
test('closing a dialog during navigation does not overwrite the new page scroll',()=>{
  const env={document:{documentElement:{style:{overflow:''}}},scrollY:3100,location:{href:'https://portfolio.test/#about-me'},scrollTo({top}){this.scrollY=top;}};
  const unlock=lockDocumentScroll(env);env.location.href='https://portfolio.test/projects';env.scrollY=0;unlock();assert.equal(env.scrollY,0);assert.equal(env.document.documentElement.style.overflow,'');
});
