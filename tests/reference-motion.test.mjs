import test from 'node:test';
import assert from 'node:assert/strict';
import { createSignatureTimeline, signatureFrame, paperFoldFrame, nextDialTurn, modulo, ERROR_DIGITS, DIAL_DIGITS } from '../src/services/referenceMotion.js';

test('404 rotary sequence always rotates forward and stops on the requested digit', () => {
  let angle=0;
  for (const digit of [...ERROR_DIGITS,...ERROR_DIGITS]) {
    const turn=nextDialTurn(angle,digit);
    assert.ok(turn.to>angle);
    assert.ok(turn.to-angle>=36 && turn.to-angle<=396);
    assert.equal(DIAL_DIGITS[modulo(Math.round(-turn.to/36),10)],digit);
    angle=turn.to;
  }
});
test('rotary input rejects invalid values instead of producing a broken transform', () => {
  for(const digit of [-1,10,'4',undefined,NaN]) assert.throws(()=>nextDialTurn(0,digit));
  assert.throws(()=>nextDialTurn(Infinity,4));
});
test('paper fold ends with an empty front and finite mirrored geometry at desktop and mobile sizes', () => {
  for(const [width,height] of [[1280,720],[390,844],[320,568],[844,390]]) {
    const first=paperFoldFrame(0,width,height),last=paperFoldFrame(1,width,height);
    assert.notEqual(first.page,'polygon(0 0,0 0,0 0)');
    assert.equal(last.page,'polygon(0 0,0 0,0 0)');
    for(const progress of [0,.1,.25,.5,.75,.99,1]) {
      const state=paperFoldFrame(progress,width,height);
      assert.doesNotMatch(JSON.stringify(state),/NaN|Infinity|undefined/);
      assert.match(state.page,/^polygon\(/);assert.match(state.fold,/^polygon\(/);
    }
  }
});
test('paper fold clamps time and refuses invalid viewport bounds', () => {
  assert.deepEqual(paperFoldFrame(-10,390,844),paperFoldFrame(0,390,844));
  assert.deepEqual(paperFoldFrame(10,390,844),paperFoldFrame(1,390,844));
  for(const input of [[NaN,390,844],[0,0,844],[0,390,-1]]) assert.throws(()=>paperFoldFrame(...input));
});

test('signature strokes keep proportional lengths and clean pen-lift gaps', () => {
  const timeline = createSignatureTimeline([150, 300, 2, 220]);
  assert.equal(timeline.strokes[0].delay, 250);
  assert.ok(timeline.strokes[1].duration > timeline.strokes[0].duration);
  assert.equal(timeline.strokes[2].duration, 90);
  for (let index = 1; index < timeline.strokes.length; index++) {
    const previous = timeline.strokes[index - 1];
    assert.equal(timeline.strokes[index].delay, previous.delay + previous.duration + 50);
  }
  const last = timeline.strokes.at(-1);
  assert.equal(timeline.drawingEnd, last.delay + last.duration + 50);
});
test('signature holding, folding, and completion share the animation clock', () => {
  const timeline = createSignatureTimeline([100, 250, 80]);
  assert.equal(signatureFrame(timeline, timeline.drawingEnd).phase, 'hold');
  assert.equal(signatureFrame(timeline, timeline.foldStart).phase, 'folding');
  assert.equal(signatureFrame(timeline, timeline.foldStart + 475).foldProgress, 0.5);
  assert.equal(signatureFrame(timeline, timeline.end).phase, 'complete');
  assert.equal(signatureFrame(timeline, timeline.end + 1000).foldProgress, 1);
});
test('signature timelines reject empty and invalid geometry', () => {
  for (const lengths of [[], [0], [-1], [NaN], [Infinity], [100, '2'], null]) assert.throws(() => createSignatureTimeline(lengths));
});
