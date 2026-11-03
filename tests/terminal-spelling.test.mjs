import test from 'node:test';
import assert from 'node:assert/strict';
import { getTerminalResponse, resolveTerminalCommand } from '../src/services/terminalCommands.js';

test('singular names return the same information as their advertised commands', () => {
  for (const [alias, command] of [['skill', 'skills'], ['project', 'projects'], ['command', 'help'], ['contribution', 'oss'], ['internship', 'exp'], ['certification', 'certs'], ['badge', 'certs'], ['contacts', 'contact']]) {
    assert.equal(getTerminalResponse(alias), getTerminalResponse(command), alias);
  }
});

test('spelling corrections cover every terminal command family', () => {
  for (const [typo, command] of [['hepl', 'help'], ['skilla', 'skills'], ['porjects', 'projects'], ['abotu', 'about'], ['stroy', 'story'], ['osss', 'oss'], ['epx', 'exp'], ['cerst', 'certs'], ['arhc', 'arch'], ['conatct', 'contact'], ['helllo', 'hello'], ['claer', 'clear']]) {
    assert.deepEqual(resolveTerminalCommand(typo), { command, corrected: true, suggestions: [] }, typo);
    assert.equal(getTerminalResponse(typo), `Corrected to “${command}”.\n\n${getTerminalResponse(command)}`, typo);
  }
});

test('long aliases and multiword commands also tolerate small spelling mistakes', () => {
  for (const [typo, command] of [['experince', 'exp'], ['certificaitons', 'certs'], ['architecutre', 'arch'], ['open soruce', 'oss'], ['tech stak', 'skills'], ['sudo hrie', 'contact'], ['emial', 'contact'], ['githbu', 'contact'], ['linkdein', 'contact']]) {
    assert.equal(resolveTerminalCommand(typo).command, command, typo);
    assert.ok(getTerminalResponse(typo).endsWith(getTerminalResponse(command)), typo);
  }
});

test('ambiguous spelling asks for a specific command instead of choosing a response', () => {
  for (const input of ['hell', 'helo']) {
    const result = resolveTerminalCommand(input);
    assert.equal(result.command, null);
    assert.deepEqual(result.suggestions, ['hello', 'help']);
    assert.match(getTerminalResponse(input), /Did you mean “hello” or “help”/);
    assert.doesNotMatch(getTerminalResponse(input), /Available commands|Hello!/);
  }
});

test('unrelated, compound and oversized input stays unknown', () => {
  for (const input of ['help me with tax', 'skills && contact', 'projects; contact', 'rm -rf /', 'https://example.com', '<script>alert(1)</script>', '😀', 'a'.repeat(10000)]) {
    assert.equal(resolveTerminalCommand(input).command, null, input.slice(0, 80));
    assert.match(getTerminalResponse(input), /Try “help”/);
  }
});

test('normalization preserves exact commands, greeting behavior and help punctuation', () => {
  for (const input of [' SKILLS! ', 'Skill', '  skilla?!  ']) assert.equal(resolveTerminalCommand(input).command, 'skills');
  assert.equal(resolveTerminalCommand(' CLEAR! ').command, 'clear');
  assert.equal(getTerminalResponse('hi'), getTerminalResponse('hello'));
  assert.match(getTerminalResponse('?'), /Available commands/);
  assert.equal(resolveTerminalCommand('  tech   stack ').corrected, false);
});
