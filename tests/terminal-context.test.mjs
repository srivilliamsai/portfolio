import test from 'node:test';
import assert from 'node:assert/strict';
import { terminalConversationCases } from './fixtures/terminal-conversation-cases.mjs';
import { checkTerminalConversation } from './fixtures/check-terminal-conversation.mjs';
import { getTerminalReply } from '../src/services/terminalCommands.js';

for (const item of terminalConversationCases) test(`${item.id} ${item.category}: ${item.inputs.join(' → ')}`, () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Conversation must stay local'); };
  try { checkTerminalConversation(item); } finally { globalThis.fetch = previousFetch; }
});
test('untrusted or missing project context never creates a pricing claim', () => {
  for (const context of [null, {}, { projectId: 'missing' }, { projectId: '__proto__' }]) {
    const reply = getTerminalReply('its free', context);
    assert.equal(reply.context, null);
    assert.match(reply.output, /Which project do you mean/);
  }
});
