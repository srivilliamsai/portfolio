import test from 'node:test';
import assert from 'node:assert/strict';
import { terminalQuestionCases } from './fixtures/terminal-question-cases.mjs';
import { checkTerminalCase } from './fixtures/check-terminal-case.mjs';

test('question corpus contains over 1,000 unique, independently expected inputs', () => {
  assert.ok(terminalQuestionCases.length > 1000);
  assert.equal(new Set(terminalQuestionCases.map((item) => item.input)).size, terminalQuestionCases.length);
});
for (const item of terminalQuestionCases) test(`${item.id} ${item.category}: ${item.input.slice(0, 100)}`, () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Terminal answers must stay offline'); };
  try { checkTerminalCase(item); } finally { globalThis.fetch = previousFetch; }
});
