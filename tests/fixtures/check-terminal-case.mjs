import assert from 'node:assert/strict';
import { getTerminalResponse, resolveTerminalCommand } from '../../src/services/terminalCommands.js';
import { resolveTerminalQuestion } from '../../src/services/terminalQuestions.js';

export function checkTerminalCase(item) {
  const intent = resolveTerminalQuestion(item.input);
  if (item.intent === null) assert.equal(intent, null, 'Unsupported input must not gain an informational intent');
  else for (const [key, value] of Object.entries(item.intent)) assert.deepEqual(intent?.[key], value, `Expected ${key}`);
  const answer = getTerminalResponse(item.input);
  assert.equal(typeof answer, 'string');
  for (const expected of item.contains) assert.ok(answer.includes(expected), `Missing ${JSON.stringify(expected)} in ${JSON.stringify(answer)}`);
  for (const excluded of item.excludes) assert.ok(!answer.includes(excluded), `Unexpected ${JSON.stringify(excluded)}`);
  assert.ok(answer.length < 6000, 'Answer must remain bounded');
  assert.ok(!answer.includes('github.com/srivilliamsai/svs'), 'Portfolio-source link stays absent');
  assert.notEqual(resolveTerminalCommand(item.input).command, 'clear', 'Questions must not clear terminal history');
  return { intent, answer };
}
