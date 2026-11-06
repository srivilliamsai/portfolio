import test from 'node:test';
import assert from 'node:assert/strict';
import {createTourExit,TOUR_EXIT_MS} from '../src/services/assistantExit.js';
function setup(reduced=false) {
  const calls=[],timers=new Map();let next=0;
  const exit=createTourExit({stop:()=>calls.push('stop'),begin:()=>calls.push('animate'),complete:()=>calls.push('closed'),reducedMotion:()=>reduced,schedule:(callback,ms)=>{assert.equal(ms,TOUR_EXIT_MS);timers.set(++next,callback);return next;},cancel:id=>timers.delete(id)});
  return {exit,calls,timers};
}
test('return stops audio immediately and waits for the closing animation',()=>{
  const {exit,calls,timers}=setup();exit.start();assert.deepEqual(calls,['stop','animate']);assert.equal(timers.size,1);
  exit.finish();assert.deepEqual(calls,['stop','animate','closed']);assert.equal(timers.size,0);
});
test('timer completes the return when animationend is unavailable, exactly once',()=>{
  const {exit,calls,timers}=setup();exit.start();exit.start();const fallback=[...timers.values()][0];fallback();exit.finish();fallback();
  assert.deepEqual(calls,['stop','animate','closed']);assert.equal(timers.size,0);
});
test('reduced motion returns immediately without an animation delay',()=>{
  const {exit,calls,timers}=setup(true);exit.start();assert.deepEqual(calls,['stop','closed']);assert.equal(timers.size,0);
});
test('unmount cancels a pending return and ignores late animation/timer callbacks',()=>{
  const {exit,calls,timers}=setup();exit.start();const fallback=[...timers.values()][0];exit.dispose();fallback();exit.finish();exit.start();
  assert.deepEqual(calls,['stop','animate']);assert.equal(timers.size,0);
});
