import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverContactNote, resolveBookingUrl, resolveContactEndpoint } from '../src/services/contactDelivery.js';

const note = { recipient: 'srivilliamsai@gmail.com', email: 'visitor@example.com', note: 'Hello Sri ☕', endpoint: 'https://formspree.io/f/xnpplzoz' };
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });

test('public contact configuration accepts owner links and rejects unsafe or unrelated destinations', () => {
  assert.equal(resolveBookingUrl('https://cal.com/owner/30min'), 'https://cal.com/owner/30min');
  assert.equal(resolveBookingUrl('https://calendly.com/owner/intro'), 'https://calendly.com/owner/intro');
  assert.equal(resolveBookingUrl(''), null);
  assert.equal(resolveContactEndpoint(''), null);
  assert.equal(resolveContactEndpoint(note.endpoint), note.endpoint);
  for (const value of ['javascript:alert(1)', 'http://cal.com/owner/30min', 'https://cal.com.evil.test/owner/30min', 'https://owner:secret@cal.com/owner/30min', 'https://cal.com/owner/30min?token=secret']) assert.throws(() => resolveBookingUrl(value));
  for (const value of ['/api/contact', 'https://formspree.io.evil.test/f/abcdefgh', 'http://formspree.io/f/abcdefgh', 'https://user:secret@formspree.io/f/abcdefgh', 'https://formspree.io/f/abcdefgh?token=secret']) assert.throws(() => resolveContactEndpoint(value));
});
test('without a configured form, submission fails honestly without a network request or mail-app draft', async () => {
  await assert.rejects(() => deliverContactNote({ ...note, endpoint: null }, { fetchImpl: () => assert.fail('Must not fetch') }), /Direct sending is not connected/);
});
test('direct delivery posts only the visitor fields to the configured form and requires JSON acknowledgement', async () => {
  let calls = 0;
  const result = await deliverContactNote(note, { fetchImpl: async (url, request) => {
    calls++;
    assert.equal(url, note.endpoint);
    assert.equal(request.method, 'POST');
    assert.equal(request.credentials, 'omit');
    assert.equal(request.redirect, 'error');
    assert.deepEqual(JSON.parse(request.body), { email: note.email, message: note.note, _subject: 'New note from your portfolio' });
    return json({ ok: true });
  } });
  assert.equal(calls, 1);
  assert.deepEqual(result, { mode: 'submitted' });
});
test('SPA HTML, provider rejection, malformed JSON, and network failures never claim delivery', async () => {
  for (const fetchImpl of [
    async () => new Response('<html>SPA fallback</html>', { headers: { 'Content-Type': 'text/html' } }),
    async () => json({ ok: true }, 429), async () => json({ ok: false }), async () => json({ errors: [{ message: 'Not verified' }] }),
    async () => new Response('{', { headers: { 'Content-Type': 'application/json' } }),
    async () => { throw new TypeError('Offline'); },
  ]) {
    await assert.rejects(() => deliverContactNote(note, { fetchImpl }), /Delivery could not be confirmed/);
  }
});
test('contact validation runs before any transmission', async () => {
  await assert.rejects(() => deliverContactNote({ ...note, email: 'bad\n@example.com' }, { fetchImpl: () => assert.fail('Invalid data was sent') }));
});
test('timeouts stop the request without retrying or showing a false success', async () => {
  let calls = 0;
  await assert.rejects(() => deliverContactNote(note, { timeoutMs: 5, fetchImpl: (_, { signal }) => new Promise((resolve, reject) => {
    calls++; signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }) }), /Delivery could not be confirmed/);
  assert.equal(calls, 1);
});
test('unmount cancellation aborts pending work without claiming success', async () => {
  const controller = new AbortController();
  const pending = deliverContactNote(note, { signal: controller.signal, fetchImpl: (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }) });
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});

test('Formspree JSON success responses do not require an undocumented ok field', async () => {
  for (const response of [{ next: 'https://formspree.io/thanks' }, {}]) {
    assert.deepEqual(await deliverContactNote(note, { fetchImpl: async () => json(response) }), { mode: 'submitted' });
  }
});

test('visitor fields are normalized before direct submission', async () => {
  await deliverContactNote({ ...note, email: ' visitor@example.com ', note: ' Hello\r\nSri ' }, { fetchImpl: async (_, request) => {
    const fields = JSON.parse(request.body);
    assert.equal(fields.email, 'visitor@example.com');
    assert.equal(fields.message, 'Hello\nSri');
    assert.equal(Object.hasOwn(fields, 'recipient'), false);
    return json({ ok: true });
  } });
});

test('an already cancelled submission makes no network request', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(() => deliverContactNote(note, { signal: controller.signal, fetchImpl: () => assert.fail('Must not fetch') }), { name: 'AbortError' });
});
