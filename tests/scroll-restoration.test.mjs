import test from 'node:test';
import assert from 'node:assert/strict';
import {createScrollRestoration} from '../src/services/scrollRestoration.js';
function setup(){
  let next=0,mutation;const listeners=new Map(),frames=new Map(),timers=new Map(),calls=[];let pending=false,hasTarget=true;
  const emit=(name,event={})=>{for(const fn of listeners.get(name)||[])fn({type:name,...event});};
  const main={querySelector:()=>pending?{}:null,focus:options=>calls.push(['focus',options])};
  const target={scrollIntoView:options=>{calls.push(['anchor',options]);env.scrollY=3100;},focus:options=>calls.push(['focus',options])};
  const env={scrollY:0,history:{scrollRestoration:'auto'},document:{documentElement:{},getElementById:id=>id==='main-content'?main:hasTarget?target:null},matchMedia:()=>({matches:false}),scrollTo:options=>{calls.push(['position',options]);env.scrollY=options.top;emit('scroll');},requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:fn=>{timers.set(++next,fn);return next;},clearTimeout:id=>timers.delete(id),addEventListener:(name,fn)=>{if(!listeners.has(name))listeners.set(name,new Set());listeners.get(name).add(fn);},removeEventListener:(name,fn)=>listeners.get(name)?.delete(fn),MutationObserver:class{constructor(fn){mutation=fn;}observe(){}disconnect(){}}};
  const service=createScrollRestoration(env);
  return {service,env,calls,emit,frames,timers,frame(){for(const [id,fn]of [...frames]){frames.delete(id);fn();}},mutate(){mutation?.();},pending(value){pending=value;},target(value){hasTarget=value;}};
}
test('browser Back restores the saved About me position immediately without a later smooth anchor jump',()=>{
  const s=setup();assert.equal(s.env.history.scrollRestoration,'manual');
  s.service.navigate({key:'about',hash:'#about-me',navigationType:'POP'});s.frame();assert.deepEqual(s.calls.at(-1),['anchor',{behavior:'instant'}]);
  s.env.scrollY=3400;s.emit('scroll');s.service.navigate({key:'project',navigationType:'PUSH'});s.frame();assert.equal(s.env.scrollY,0);
  s.service.navigate({key:'about',hash:'#about-me',navigationType:'POP'});s.frame();assert.deepEqual(s.calls.at(-1),['position',{top:3400,behavior:'instant'}]);
  s.mutate();assert.equal(s.env.scrollY,3400);s.service.dispose();assert.equal(s.env.history.scrollRestoration,'auto');
});
test('explicit anchors use smooth navigation and lazy routes scroll only once after mounting',()=>{
  const s=setup();s.pending(true);s.service.navigate({key:'one',hash:'#architecture'});s.frame();assert.equal(s.calls.length,0);
  s.pending(false);s.mutate();assert.deepEqual(s.calls,[['anchor',{behavior:'smooth'}]]);s.mutate();assert.equal(s.calls.length,1);s.service.dispose();
});
test('a visitor scroll or a newer navigation cancels stale lazy-fragment work',()=>{
  const s=setup();s.target(false);s.service.navigate({key:'old',hash:'#about-me'});s.frame();s.emit('wheel');s.target(true);s.mutate();assert.equal(s.calls.length,0);
  s.target(false);s.service.navigate({key:'other',hash:'#about-me'});s.frame();s.service.navigate({key:'new'});s.target(true);s.frame();s.mutate();assert.deepEqual(s.calls,[['position',{top:0,behavior:'instant'}]]);s.service.dispose();
});
test('zero positions, missing fragments, reduced motion and teardown are safe',()=>{
  const s=setup();s.env.matchMedia=()=>({matches:true});s.service.navigate({key:'home'});s.frame();s.service.navigate({key:'next',hash:'#skills'});s.frame();assert.equal(s.calls.at(-1)[1].behavior,'instant');
  s.service.navigate({key:'home',navigationType:'POP'});s.frame();assert.equal(s.env.scrollY,0);
  s.target(false);s.service.navigate({key:'missing',hash:'#missing'});s.frame();const fallback=[...s.timers.values()][0];fallback();s.target(true);s.mutate();assert.equal(s.env.scrollY,0);s.service.dispose();assert.equal(s.frames.size,0);
});


test('a shorter destination cannot overwrite the pre-navigation reading position',()=>{
  const s=setup();s.service.navigate({key:'about',hash:'#about-me',navigationType:'POP'});s.frame();
  s.env.scrollY=3250;s.emit('click');
  // The next DOM commit clamps the viewport before the route effect runs.
  s.env.scrollY=595;s.service.navigate({key:'short-page'});s.frame();
  s.emit('popstate');s.service.navigate({key:'about',hash:'#about-me',navigationType:'POP'});s.frame();
  assert.equal(s.env.scrollY,3250);s.service.dispose();
});
