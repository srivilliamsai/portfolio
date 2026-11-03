import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { canonicalPaths, legacyRedirects } from '../src/app/routeCatalog.js';
import { resolveSiteUrl } from '../config/site.mjs';

const rules = JSON.parse(await readFile(new URL('../deployment/amplify-rewrites.json', import.meta.url), 'utf8'));
const fallback = rules.find((rule) => rule.target === '/index.html' && rule.status === '200');
assert.ok(fallback, 'Amplify must have a 200 SPA fallback');
assert.ok(fallback.source.startsWith('</') && fallback.source.endsWith('/>'));
const pattern = new RegExp(fallback.source.slice(2, -2));

async function publicFiles(directory = 'public') {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? publicFiles(file) : [file];
  }))).flat();
}

test('SPA fallback handles every canonical page and article', () => {
  for (const route of canonicalPaths) assert.ok(pattern.test(route), `Route misses fallback: ${route}`);
});
test('legacy HTML visits reach the application redirects', () => {
  for (const route of legacyRedirects) assert.ok(pattern.test(`/${route.from}`), `Legacy route misses fallback: ${route.from}`);
});
test('every required public asset bypasses the SPA fallback', async () => {
  for (const file of await publicFiles()) {
    const url = `/${path.relative('public', file).split(path.sep).join('/')}`;
    assert.equal(pattern.test(url), false, `Asset would receive SPA HTML: ${url}`);
  }
});
test('fingerprinted bundles and generated discovery files bypass fallback', () => {
  for (const url of ['/assets/index-123abc.js', '/assets/index-123abc.css', '/sitemap.xml', '/robots.txt']) {
    assert.equal(pattern.test(url), false, url);
  }
});
test('public configuration rejects a missing deployment origin', () => {
  assert.throws(() => resolveSiteUrl(undefined, { requirePublic: true }), /Set VITE_SITE_URL/);
});
test('public configuration rejects development origins', () => {
  for (const url of ['http://localhost:3000', 'https://127.0.0.1', 'https://192.168.0.1']) {
    assert.throws(() => resolveSiteUrl(url, { requirePublic: true }), /public HTTPS/);
  }
});
test('public configuration accepts the CI example without a network request', () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Origin validation must remain local'); };
  try {
    assert.equal(resolveSiteUrl('https://main.example.amplifyapp.com', { requirePublic: true }), 'https://main.example.amplifyapp.com');
  } finally { globalThis.fetch = originalFetch; }
});
