import test from 'node:test';
import assert from 'node:assert/strict';
import { createSoundEngine } from '../src/services/interfaceSounds.js';

function harness({ loadMessage } = {}) {
  let created = 0, resumed = 0, time = 0;
  const tones = [], recordings = [], levels = [];
  const parameter = () => ({ setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} });
  const source = (kind) => ({
    stops: [], connect() {}, disconnect() {},
    start() { (kind === 'tone' ? tones : recordings).push(this); },
    stop(at) { this.stops.push(at); },
  });
  const context = {
    state: 'running', currentTime: 2, sampleRate: 8000, destination: {},
    createOscillator() {
      const tone = source('tone');
      tone.frequency = { ...parameter(), setValueAtTime(value) { tone.hz = value; } };
      return tone;
    },
    createGain() { return { gain: { ...parameter(), setTargetAtTime(value) { levels.push(value); } }, connect() {}, disconnect() {} }; },
    createBufferSource() { return source('recording'); },
    createBuffer(channels, length) { return { length, getChannelData: () => new Float32Array(length) }; },
    createBiquadFilter() { return { frequency: parameter(), Q: {}, connect() {}, disconnect() {} }; },
    decodeAudioData() { return Promise.resolve({ decoded: true }); },
    close() { context.state = 'closed'; return Promise.resolve(); },
    resume() { resumed++; context.state = 'running'; return Promise.resolve(); },
  };
  const engine = createSoundEngine({ contextFactory: () => { created++; return context; }, loadMessage, now: () => time });
  return { engine, tones, recordings, levels, context, created: () => created, resumed: () => resumed, advance: (ms = 100) => { time += ms; } };
}
test('only approved sections, including WILL, can play their assigned sounds', async () => {
  const h = harness(); h.engine.setEnabled(true); await h.engine.unlock();
  for (const [section, kind] of [['contact', 'message'], ['contact', 'shuffle'], ['contact', 'send'], ['open-source', 'shuffle'], ['credentials', 'shuffle'], ['404', 'click'], ['404', 'shuffle'], ['will', 'open'], ['will', 'close'], ['will', 'click'], ['will', 'select'], ['will', 'send'], ['will','listen'], ['will','think'], ['will','transcript']]) {
    h.advance(400); assert.equal(h.engine.play(section, kind), true, `${section}: ${kind}`);
  }
  const sources = h.tones.length + h.recordings.length;
  for (const [section, kind] of [['intro', 'writing'], ['intro', 'shuffle'], ['navigation', 'click'], ['footer', 'click'], ['contact', 'click'], ['open-source', 'message'], ['open-source', 'click'], ['credentials', 'message'], ['credentials', 'click'], ['404', 'message'], ['404', 'send'], ['404', 'dial'], [undefined, 'click'], ['constructor', 'click']]) {
    h.advance(400); assert.equal(h.engine.play(section, kind), false, `${section}: ${kind}`);
  }
  assert.equal(h.tones.length + h.recordings.length, sources);
});
test('disabled and disposed audio never creates sources', async () => {
  const h = harness();
  assert.equal(h.engine.play('404', 'click'), false); assert.equal(await h.engine.unlock(), false); assert.equal(h.created(), 0);
  h.engine.setEnabled(true); h.engine.play('404', 'click');
  h.engine.setEnabled(false); h.advance();
  assert.equal(h.engine.play('404', 'click'), false);
  assert.ok(h.tones[0].stops.includes(undefined), 'cleanup stops active audio immediately');
  h.engine.dispose(); assert.equal(h.engine.play('contact', 'message'), false);
});
test('rapid section effects are bounded without swallowing another kind', async () => {
  const h = harness(); h.engine.setEnabled(true); await h.engine.unlock();
  assert.equal(h.engine.play('404', 'click'), true); assert.equal(h.engine.play('404', 'click'), false);
  assert.equal(h.engine.play('open-source', 'shuffle'), true); assert.equal(h.engine.play('contact', 'message'), true);
  h.advance(); assert.equal(h.engine.play('404', 'click'), true);
});
test('a gesture unlocks suspended audio without queuing old contact messages', async () => {
  const h = harness(); h.engine.setEnabled(true); h.context.state = 'suspended';
  assert.equal(h.engine.isReady(), false);
  assert.equal(h.engine.play('contact', 'message'), false); assert.equal(h.created(), 0);
  assert.equal(await h.engine.unlock(), true); assert.equal(h.resumed(), 1);
  assert.equal(h.engine.isReady(), true);
  assert.equal(h.tones.length, 0); assert.equal(h.recordings.length, 0);
  assert.equal(h.engine.play('contact', 'message'), true); assert.equal(h.tones[0].hz, 340);
});
test('the local message recording decodes once and plays through Web Audio', async () => {
  let loads = 0;
  const h = harness({ loadMessage: async () => { loads++; return new ArrayBuffer(8); } });
  h.engine.setEnabled(true);
  assert.equal(await h.engine.unlock(), true); assert.equal(await h.engine.unlock(), true);
  await new Promise(resolve=>setImmediate(resolve));assert.equal(loads, 1);
  assert.equal(h.engine.play('contact', 'message'), true); assert.equal(h.tones.length, 0);
  assert.deepEqual(h.recordings[0].buffer, { decoded: true });
  assert.equal(h.engine.play('contact', 'message'), false); h.advance(210);
  assert.equal(h.engine.play('contact', 'message'), true); assert.equal(h.recordings.length, 2);
  h.engine.dispose(); assert.ok(h.recordings.every(s => s.stops.includes(undefined)));
});
test('an unavailable message file falls back to a pop and paper send still plays', async () => {
  const h = harness({ loadMessage: async () => { throw new Error('File unavailable'); } });
  h.engine.setEnabled(true); assert.equal(await h.engine.unlock(), true);
  assert.equal(h.engine.play('contact', 'message'), true); assert.equal(h.tones[0].hz, 340);
  assert.equal(h.engine.play('contact', 'send'), true); assert.equal(h.recordings[0].buffer.length, 6000);
  assert.equal(h.recordings[0].stops[0], 2.75); assert.equal(h.engine.play('contact', 'send'), false);
});
test('a delayed asset cannot play after disposal', async () => {
  let finish;
  const h = harness({ loadMessage: () => new Promise(resolve => { finish = resolve; }) });
  h.engine.setEnabled(true); assert.equal(await h.engine.unlock(),true);
  await new Promise(resolve => setImmediate(resolve));
  h.engine.dispose(); finish(new ArrayBuffer(8));
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(h.engine.isReady(),false); assert.equal(h.engine.play('contact', 'message'), false);
  assert.equal(h.recordings.length, 0); assert.equal(h.tones.length, 0);
});
test('unavailable audio or a rejected browser resume never breaks the page', async () => {
  const unavailable = createSoundEngine({ contextFactory() { throw new Error('Unavailable'); } });
  unavailable.setEnabled(true); assert.equal(await unavailable.unlock(), false); assert.equal(unavailable.play('404', 'click'), false);
  const h = harness(); h.engine.setEnabled(true); h.context.state = 'suspended';
  h.context.resume = () => Promise.reject(new Error('Not allowed'));
  assert.equal(await h.engine.unlock(), false); assert.equal(h.engine.play('404', 'click'), false); assert.equal(h.tones.length, 0);
});

test('WILL button sounds play immediately even while the contact audio file is still loading',async()=>{
  let finish;
  const h=harness({loadMessage:()=>new Promise(resolve=>{finish=resolve;})});
  h.context.state='suspended';h.engine.setEnabled(true);
  assert.equal(await h.engine.unlock(),true);
  assert.equal(h.engine.play('will','open'),true);assert.equal(h.tones.length,3);assert.equal(h.recordings.length,1);
  h.advance();assert.equal(h.engine.play('will','select'),true);assert.equal(h.tones.length,5);
  h.engine.dispose();finish(new ArrayBuffer(8));
});


test('WILL uses the reference boot sweep, square click, and two-note photo chime',async()=>{
  const h=harness();h.engine.setEnabled(true);await h.engine.unlock();
  h.engine.play('will','open');assert.deepEqual(h.tones.map(t=>t.hz),[110,1320,1760]);
  assert.equal(h.tones[0].type,'sawtooth');assert.equal(h.recordings[0].buffer.length,2800);
  h.advance();h.engine.play('will','click');assert.equal(h.tones.at(-1).hz,1800);assert.equal(h.tones.at(-1).type,'square');
  h.advance();h.engine.play('will','select');assert.deepEqual(h.tones.slice(-2).map(t=>[t.hz,t.type]),[[988,'triangle'],[1318,'triangle']]);
  h.advance();h.engine.play('will','transcript');assert.equal(h.tones.at(-1).hz,440);assert.equal(h.tones.at(-1).type,'triangle');
});
test('WILL mute immediately stops its effects, keeps other sections active, and restores sound on unmute',async()=>{
  const h=harness();h.engine.setEnabled(true);await h.engine.unlock();
  h.engine.play('will','open');h.engine.play('contact','message');const contact=h.tones.at(-1);
  h.engine.setSectionMuted('will',true);
  assert.ok(h.tones.slice(0,3).every(t=>t.stops.includes(undefined)));
  assert.ok(h.recordings[0].stops.includes(undefined));assert.equal(contact.stops.includes(undefined),false);
  for(const kind of ['open','close','click','select','send','listen','think','transcript']){h.advance(400);assert.equal(h.engine.play('will',kind),false);}
  h.advance(400);assert.equal(h.engine.play('contact','send'),true);
  h.engine.setSectionMuted('will',false);assert.equal(h.engine.play('will','click'),true);
  h.engine.dispose();assert.equal(h.engine.play('will','click'),false);
});
test('WILL and contact send effects have independent cooldowns',async()=>{
  const h=harness();h.engine.setEnabled(true);await h.engine.unlock();
  assert.equal(h.engine.play('contact','send'),true);assert.equal(h.engine.play('will','send'),true);
  assert.equal(h.engine.play('will','send'),false);
  assert.deepEqual(h.tones.slice(-3).map(t=>t.hz),[1046,784,1318]);
});
