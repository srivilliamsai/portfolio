import assert from 'node:assert/strict';
import { getTerminalReply } from '../../src/services/terminalCommands.js';

export function checkTerminalConversation(item) {
  let context = null;
  const turns = item.inputs.map((input) => {
    const before = context ? { ...context } : null;
    const reply = getTerminalReply(input, context);
    assert.deepEqual(context, before, 'Reading context must not mutate the caller’s object');
    context = reply.context;
    assert.equal(typeof reply.output, 'string');
    assert.ok(reply.output.length < 6000);
    assert.ok(!reply.output.includes('github.com/srivilliamsai/svs'));
    return { input, ...reply };
  });
  const last = turns.at(-1);
  assert.deepEqual(last.context, item.projectId ? { projectId: item.projectId } : null);
  for (const expected of item.contains) assert.ok(last.output.includes(expected), `Missing ${JSON.stringify(expected)} in ${JSON.stringify(last.output)}`);
  for (const excluded of item.excludes) assert.ok(!last.output.includes(excluded), `Unexpected ${JSON.stringify(excluded)}`);
  return turns;
}
