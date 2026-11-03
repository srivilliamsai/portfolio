import test from 'node:test';
import assert from 'node:assert/strict';
import { createRelease, validateRelease } from '../config/release.mjs';
import { verifyProduction } from '../scripts/lib/verify-production.mjs';

const origin = 'https://main.example.amplifyapp.com';
const commit = 'a'.repeat(40);
const files = [
  { path: '/index.html', bytes: '<html>entry</html>' },
  { path: '/static/theme.js', bytes: 'theme();' },
  { path: '/assets/index-abc.js', bytes: 'app();' },
  { path: '/assets/index-abc.css', bytes: 'body{}' },
];
const release = createRelease(commit, origin, files);
function fixture(change = () => {}) {
  let time = 0;
  const requests = [];
  const request = async (input, options) => {
    const url = new URL(input);
    requests.push(url);
    assert.equal(url.origin, origin);
    assert.equal(options.redirect, 'error');
    const body = url.pathname === '/deployment.json' ? JSON.stringify(release) : files.find(file => file.path === url.pathname)?.bytes;
    return change(url, body) || new Response(body, { status: body === undefined ? 404 : 200 });
  };
  return { request, requests, now: () => time, sleep: async ms => { time += ms; }, timeoutMs: 30, intervalMs: 10 };
}
test('matching commit and every published file hash are required for Production success', async () => {
  const setup = fixture();
  assert.deepEqual(await verifyProduction({ origin, commit, ...setup }), release);
  assert.equal(setup.requests.length, files.length + 1);
});
for (const [name, change] of [
  ['stale commit', (url, body) => url.pathname === '/deployment.json' && new Response(body.replace(commit, 'b'.repeat(40)))],
  ['wrong origin', (url, body) => url.pathname === '/deployment.json' && new Response(body.replace(origin, 'https://attacker.example'))],
  ['SPA HTML instead of metadata', url => url.pathname === '/deployment.json' && new Response('<html>fallback</html>')],
  ['missing build', () => new Response('missing', { status: 404 })],
  ['tampered entry', url => url.pathname === '/index.html' && new Response('different entry')],
  ['missing bundle', url => url.pathname.endsWith('.js') && new Response('unavailable', { status: 503 })],
  ['network or redirect error', () => { throw new Error('fetch failed'); }],
  ['oversize response', url => url.pathname === '/deployment.json' && new Response('{}', { headers: { 'content-length': '70000' } })],
]) test(`Production stays unsuccessful for ${name}`, async () => {
  await assert.rejects(verifyProduction({ origin, commit, ...fixture(change) }), /not verified before timeout/);
});
test('an old release can become the exact new release while polling', async () => {
  let attempts = 0;
  const setup = fixture((url, body) => url.pathname === '/deployment.json' && attempts++ === 0 && new Response(body.replace(commit, 'b'.repeat(40))));
  assert.equal((await verifyProduction({ origin, commit, ...setup })).commit, commit);
  assert.equal(attempts, 2);
});
test('manifest paths cannot escape the public site or contain duplicates', () => {
  for (const path of ['https://attacker.example/x.js', '//attacker.example/x.js', '/assets/../secret.js', '/.env', '/assets/%2e%2e/x.js']) {
    assert.throws(() => validateRelease({ ...release, files: [...release.files, { path, sha256: 'a'.repeat(64) }] }, commit, origin), /Invalid release file/);
  }
  assert.throws(() => validateRelease({ ...release, files: [...release.files, release.files[0]] }, commit, origin), /Invalid release file/);
});
test('production verifier rejects invalid SHA and development origins before network access', async () => {
  const request = () => { throw new Error('Must not request'); };
  await assert.rejects(verifyProduction({ origin, commit: 'HEAD', request }), /Invalid verification/);
  await assert.rejects(verifyProduction({ origin: 'http://localhost:3000', commit, request }), /public HTTPS/);
});
