import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticleHtml } from '../config/content-policy.mjs';
import { blogPosts } from '../src/data/blogs.js';
import { isSafeLink } from '../src/services/linkSafety.js';
import { terminalHistoryReducer, initialHistoryState, TERMINAL_INPUT_LIMIT, TERMINAL_HISTORY_LIMIT, appendTerminalEntry } from '../src/services/terminalHistory.js';

for (const post of blogPosts) test(`authored article passes the restricted HTML grammar: ${post.slug}`, () => assert.equal(validateArticleHtml(post.content), true));
for (const html of [
  '<script>alert(1)</script>', '<img src="x" onerror="alert(1)">', '<svg><a href="x"></a></svg>',
  '<p onclick="alert(1)">text</p>', '<a href="javascript:alert(1)">click</a>', '<a href="&#106;avascript:alert(1)">click</a>',
  '<a href="//attacker.example">click</a>', '<a href="https://safe.example" target="_blank">click</a>',
  '<a href="https://safe.example" href="javascript:alert(1)">click</a>', '<p style="color:red">text</p>',
  '<p><strong>broken</p></strong>', '<p>raw < delimiter</p>', '<!-- hidden markup -->', '<a href="https://user:password@example.com">click</a>',
]) test(`article rejects executable or unsupported markup: ${html.slice(0, 65)}`, () => assert.throws(() => validateArticleHtml(html)));

test('link policy rejects obfuscated schemes and accepts ordinary navigation', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,bad', 'file:///tmp/x', '//example.com', 'https:\\example.com', 'java\nscript:alert(1)', 'https://user:secret@example.com']) assert.equal(isSafeLink(value), false, value);
  for (const value of ['/blog', 'https://example.com/a?x=1', 'mailto:person@example.com']) assert.equal(isSafeLink(value), true, value);
});
test('terminal input and recall remain bounded, with the unsubmitted draft restored', () => {
  let state = terminalHistoryReducer(initialHistoryState, { type: 'type', value: 'x'.repeat(100000) });
  assert.equal(state.input.length, TERMINAL_INPUT_LIMIT);
  for (let i = 0; i < 250; i++) state = terminalHistoryReducer(state, { type: 'execute', command: `command-${i}` });
  assert.equal(state.commands.length, TERMINAL_HISTORY_LIMIT);
  assert.equal(state.commands[0], 'command-150');
  state = terminalHistoryReducer(state, { type: 'type', value: 'unfinished draft' });
  state = terminalHistoryReducer(state, { type: 'previous' });
  assert.equal(state.input, 'command-249');
  state = terminalHistoryReducer(state, { type: 'next' });
  assert.equal(state.input, 'unfinished draft');
});
test('terminal output evicts only the oldest entries at the limit', () => {
  let entries = [];
  for (let i = 0; i < 250; i++) entries = appendTerminalEntry(entries, { command: String(i), output: 'text' });
  assert.equal(entries.length, TERMINAL_HISTORY_LIMIT);
  assert.equal(entries[0].command, '150');
  assert.equal(entries.at(-1).command, '249');
});
