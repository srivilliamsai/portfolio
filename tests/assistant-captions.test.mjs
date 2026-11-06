import test from 'node:test';
import assert from 'node:assert/strict';
import {createAudioCaptions,createUtteranceCaptions} from '../src/services/assistantCaptions.js';
import {createBrowserSpeech} from '../src/services/assistantSpeech.js';

function timers(){let now=0,id=0;const jobs=new Map();return {setTimer(fn,delay){const key=++id;jobs.set(key,{at:now+delay,fn});return key;},clearTimer(key){jobs.delete(key);},advance(ms){const end=now+ms;for(;;){const next=[...jobs].filter(([,job])=>job.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;jobs.delete(next[0]);next[1].fn();}now=end;},get pending(){return jobs.size;}};}

test('live captions wait for scheduled audio and reveal words on the audio clock',()=>{
  let now=0;const shown=[];
  const captions=createAudioCaptions({clock:()=>now,onCaption:text=>shown.push(text)});
  captions.append('Sri builds useful software.');captions.tick();assert.deepEqual(shown,[]);
  captions.start(1);now=.8;captions.tick();assert.deepEqual(shown,[]);
  now=1;captions.tick();assert.equal(shown.at(-1),'Sri');
  now=1.5;captions.tick();assert.equal(shown.at(-1),'Sri builds');
  const paused=shown.at(-1);captions.tick();assert.equal(shown.at(-1),paused);
  now=3;captions.tick();assert.equal(shown.at(-1),'Sri builds useful software.');
});
test('live caption chunks preserve split words and reset drops a cancelled turn',()=>{
  let now=0;const shown=[];const captions=createAudioCaptions({clock:()=>now,onCaption:text=>shown.push(text)});
  captions.start(0);captions.append('Hel');captions.tick();assert.equal(shown.at(-1),'Hel');
  captions.append('lo Sri.');captions.tick();assert.equal(shown.at(-1),'Hello');
  now=2;captions.tick();assert.equal(shown.at(-1),'Hello Sri.');
  captions.append(' More words pending.');captions.reset();now=30;captions.tick();assert.equal(shown.at(-1),'');
  captions.append('New reply.');captions.tick();assert.equal(shown.at(-1),'');
  captions.start(31);now=31;captions.tick();assert.equal(shown.at(-1),'New');
  captions.finish();assert.equal(shown.at(-1),'New reply.');
});
test('browser captions start at playback and track word boundaries, not the whole answer',()=>{
  const clock=timers(),shown=[];const captions=createUtteranceCaptions({text:'Sri builds useful software.',onCaption:text=>shown.push(text),...clock});
  assert.deepEqual(shown,[]);captions.start();assert.equal(shown.at(-1),'Sri');
  captions.boundary({name:'word',charIndex:4});assert.equal(shown.at(-1),'Sri builds');
  clock.advance(500);assert.equal(shown.at(-1),'Sri builds');
  captions.boundary({name:'sentence',charIndex:11});assert.equal(shown.at(-1),'Sri builds');
  captions.boundary({name:'word',charIndex:11});assert.equal(shown.at(-1),'Sri builds useful');
  captions.finish();assert.equal(shown.at(-1),'Sri builds useful software.');assert.equal(clock.pending,0);
});
test('voices without boundary events use paced captions and pause/cancel clear pending updates',()=>{
  const clock=timers(),shown=[];const captions=createUtteranceCaptions({text:'One two three four five six.',onCaption:text=>shown.push(text),...clock});
  captions.start();assert.equal(shown.at(-1),'One');clock.advance(350);assert.equal(shown.at(-1),'One two');
  captions.pause();clock.advance(2000);assert.equal(shown.at(-1),'One two');
  captions.resume();clock.advance(1200);assert.equal(shown.at(-1),'One two three');
  captions.cancel();assert.equal(clock.pending,0);clock.advance(5000);assert.equal(shown.at(-1),'');
  captions.boundary({name:'word',charIndex:19});assert.equal(shown.at(-1),'');
});
test('browser speech publishes caption boundaries and cancellation detaches old callbacks',async()=>{
  let utterance;const shown=[];const synth={getVoices:()=>[{name:'Daniel',lang:'en-GB'}],speak:value=>{utterance=value;},cancel(){}};
  const speech=createBrowserSpeech({environment:{speechSynthesis:synth,SpeechSynthesisUtterance:class{}},onCaption:value=>shown.push(value)});
  const done=speech.speak('Sri builds useful products.');assert.deepEqual(shown,[]);
  utterance.onstart();assert.equal(shown.at(-1),'Villiam');
  utterance.onboundary({name:'word',charIndex:8});assert.equal(shown.at(-1),'Villiam builds');
  const late=utterance.onboundary;speech.stopSpeaking();await done;
  assert.equal(shown.at(-1),'');assert.equal(utterance.onboundary,null);
  late({name:'word',charIndex:11});assert.equal(shown.at(-1),'');speech.dispose();
});


test('native speech boundaries remain authoritative across long pauses and resume',()=>{
  const clock=timers(),shown=[];const captions=createUtteranceCaptions({text:'One slow sentence with pauses.',onCaption:text=>shown.push(text),...clock});
  captions.start();captions.boundary({name:'word',charIndex:4});assert.equal(shown.at(-1),'One slow');
  clock.advance(10000);assert.equal(shown.at(-1),'One slow');assert.equal(clock.pending,0);
  captions.pause();clock.advance(3000);captions.resume();clock.advance(3000);assert.equal(shown.at(-1),'One slow');
  captions.boundary({name:'word',charIndex:9});assert.equal(shown.at(-1),'One slow sentence');captions.cancel();assert.equal(clock.pending,0);
});


test('an initial-only boundary event does not freeze a voice that needs estimated captions',()=>{
  const clock=timers(),shown=[];const captions=createUtteranceCaptions({text:'One two three four.',onCaption:text=>shown.push(text),...clock});
  captions.start();captions.boundary({name:'word',charIndex:0});clock.advance(350);assert.equal(shown.at(-1),'One two');
  captions.cancel();assert.equal(clock.pending,0);
});
