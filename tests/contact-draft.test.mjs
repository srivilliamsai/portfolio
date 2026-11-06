import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactDraft } from '../src/services/contactDraft.js';

const valid = { recipient: 'srivilliamsai@gmail.com', email: 'visitor@example.com', note: 'Hello Sri!' };
test('contact notes produce a draft addressed only to the portfolio owner', () => {
  const draft = new URL(createContactDraft(valid));
  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, valid.recipient);
  assert.deepEqual([...draft.searchParams.keys()], ['subject', 'body']);
  assert.equal(draft.searchParams.get('body'), 'From: visitor@example.com\n\nHello Sri!');
});
test('visitor punctuation and Unicode remain body text without adding mail headers', () => {
  const note = 'Hello ☕\r\n?bcc=other@example.com&subject=changed%0A<script>alert(1)</script>';
  const draft = new URL(createContactDraft({ ...valid, note }));
  assert.deepEqual([...draft.searchParams.keys()], ['subject', 'body']);
  assert.equal(draft.searchParams.get('body'), `From: visitor@example.com\n\n${note.replace('\r\n', '\n')}`);
});
test('contact drafts reject header injection, empty notes and invalid or oversized fields', () => {
  for (const email of ['', 'broken', 'visitor@example.com\r\nBcc: other@example.com', 'x'.repeat(255) + '@example.com']) assert.throws(() => createContactDraft({ ...valid, email }));
  for (const recipient of ['owner@example.com?bcc=other@example.com', 'owner@example.com#other', 'owner@example.com\n']) assert.throws(() => createContactDraft({ ...valid, recipient }));
  for (const note of ['', ' \n ', 'x'.repeat(1001), 'hello\u0000']) assert.throws(() => createContactDraft({ ...valid, note }));
});
test('drafts normalize line endings and accept notes at the form character limit', () => {
  assert.ok(createContactDraft({ ...valid, note: 'x'.repeat(1000) }));
  const draft = new URL(createContactDraft({ ...valid, email: ' visitor+work@example.com ', note: ' Hi\rthere \n' }));
  assert.equal(draft.searchParams.get('body'), 'From: visitor+work@example.com\n\nHi\nthere');
});
