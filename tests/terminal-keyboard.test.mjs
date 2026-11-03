import test from 'node:test';
import assert from 'node:assert/strict';
import { isTerminalToggle, terminalInputAction } from '../src/services/terminalKeyboard.js';
import { getTerminalCompletions, getTerminalResponse } from '../src/services/terminalCommands.js';

const key = (value, modifiers = {}) => ({ key: value, ...modifiers });

test('Mac Command+K and Windows Control+K toggle, without repeats or unrelated modifier combinations', () => {
  for (const modifier of ['metaKey', 'ctrlKey']) {
    assert.equal(isTerminalToggle(key('k', { [modifier]: true })), true);
    assert.equal(isTerminalToggle(key('K', { [modifier]: true })), true);
    for (const extra of ['repeat', 'altKey', 'shiftKey', 'defaultPrevented', 'isComposing']) {
      assert.equal(isTerminalToggle(key('k', { [modifier]: true, [extra]: true })), false, extra);
    }
  }
  assert.equal(isTerminalToggle(key('k')), false);
  assert.equal(Boolean(isTerminalToggle(key('l', { ctrlKey: true }))), false);
});

test('clear and cancel bindings distinguish Mac Command from Control and selected text', () => {
  for (const modifier of ['metaKey', 'ctrlKey']) assert.equal(terminalInputAction(key('l', { [modifier]: true })), 'clear-output');
  assert.equal(terminalInputAction(key('u', { ctrlKey: true })), 'clear-input');
  assert.equal(terminalInputAction(key('c', { ctrlKey: true })), 'cancel-input');
  assert.equal(terminalInputAction(key('g', { ctrlKey: true })), 'cancel-input');
  assert.equal(terminalInputAction(key('c', { ctrlKey: true }), { hasSelection: true }), null);
  assert.equal(terminalInputAction(key('c', { metaKey: true })), null);
  assert.equal(terminalInputAction(key('u', { metaKey: true })), null);
});

test('ordinary copy, paste, cut, select-all and cursor shortcuts retain native handling', () => {
  for (const modifier of ['metaKey', 'ctrlKey']) {
    for (const value of ['a', 'v', 'x', 'ArrowLeft', 'ArrowRight']) assert.equal(terminalInputAction(key(value, { [modifier]: true })), null);
  }
  assert.equal(terminalInputAction(key('ArrowLeft', { altKey: true })), null);
  assert.equal(terminalInputAction(key('c', { metaKey: true }), { hasSelection: true }), null);
});

test('run, history and completion keys preserve Shift+Tab navigation and repeated history traversal', () => {
  assert.equal(terminalInputAction(key('Enter')), 'execute');
  assert.equal(terminalInputAction(key('Enter', { repeat: true })), null);
  assert.equal(terminalInputAction(key('ArrowUp', { repeat: true })), 'previous');
  assert.equal(terminalInputAction(key('ArrowDown')), 'next');
  assert.equal(terminalInputAction(key('Tab')), 'complete');
  assert.equal(terminalInputAction(key('Tab', { shiftKey: true })), null);
  assert.equal(terminalInputAction(key('ArrowUp', { shiftKey: true })), null);
});

test('composition events never execute commands or hijack the global shortcut', () => {
  for (const composing of [{ isComposing: true }, { nativeEvent: { isComposing: true } }, { keyCode: 229 }]) {
    for (const value of ['Enter', 'Tab', 'ArrowUp']) assert.equal(terminalInputAction(key(value, composing)), null);
    assert.equal(Boolean(isTerminalToggle(key('k', { ctrlKey: true, ...composing }))), false);
  }
});

test('completion recognizes partial commands and advertised aliases without choosing an ambiguous match', () => {
  assert.deepEqual(getTerminalCompletions('ski'), ['skills']);
  assert.deepEqual(getTerminalCompletions('EXPE'), ['experience']);
  assert.deepEqual(getTerminalCompletions('shor'), ['shortcuts']);
  assert.deepEqual(getTerminalCompletions('sudo h'), ['sudo hire']);
  assert.deepEqual(getTerminalCompletions('skills'), ['skills']);
  assert.ok(getTerminalCompletions('c').length > 1);
  assert.deepEqual(getTerminalCompletions(''), []);
  assert.deepEqual(getTerminalCompletions('not-a-command'), []);
});

test('the keyboard guide is available through shortcuts, keys and help', () => {
  assert.equal(getTerminalResponse('keys'), getTerminalResponse('shortcuts'));
  assert.match(getTerminalResponse('shortcuts'), /Mac: ⌘K · Windows: Ctrl\+K/);
  assert.match(getTerminalResponse('shortcuts'), /Ctrl\+C copies selected text/);
  assert.match(getTerminalResponse('help'), /shortcuts \/ keys/);
  assert.match(getTerminalResponse('shorcuts'), /Corrected to “shortcuts”/);
});
