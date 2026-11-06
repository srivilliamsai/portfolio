import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeFragment, scrollBehavior } from '../src/utils/scroll.js';
import { pageRoutes, canonicalPaths, legacyRedirects } from '../src/app/routeCatalog.js';
import { contributions } from '../src/data/contributions.js';
import { projects } from '../src/data/projects.js';
import { resolveSiteUrl } from '../config/site.mjs';

test('fragment decoding tolerates malformed percent sequences', () => {
  for (const hash of ['#%', '#%zz', '#%E0%A4%A']) assert.equal(decodeFragment(hash), hash.slice(1));
  assert.equal(decodeFragment('#about-me'), 'about-me'); assert.equal(decodeFragment('#hello%20world'), 'hello world');
  assert.equal(decodeFragment(), ''); assert.equal(decodeFragment('skills'), 'skills');
});
test('scroll behavior honors reduced motion', () => {
  assert.equal(scrollBehavior(true), 'instant'); assert.equal(scrollBehavior(false), 'smooth');
});
test('route catalog covers projects, keeps redirects canonical and excludes wildcard from sitemap', () => {
  assert.equal(new Set(canonicalPaths).size, canonicalPaths.length);
  assert.equal(new Set(legacyRedirects.map((route) => route.from)).size, legacyRedirects.length);
  for (const project of projects) assert.ok(canonicalPaths.includes(project.link));
  for (const redirect of legacyRedirects) assert.ok(canonicalPaths.includes(redirect.to));
  assert.equal(pageRoutes.filter((route) => route.index).length, 1); assert.ok(!canonicalPaths.some((route) => /\*|:slug/.test(route)));
});
test('portfolio contributions match five merged upstream evidence records', () => {
  assert.deepEqual(contributions.map((item) => item.number).sort((a,b) => a-b), [5,14,16,17,22]);
  for (const item of contributions) {
    assert.equal(item.status, 'Merged');
    assert.ok(Number.isFinite(Date.parse(item.mergedAt)));
    assert.equal(new URL(item.url).hostname, 'github.com');
  }
});
test('public origin checks reject alternate private address representations and local suffixes', () => {
  for (const origin of ['https://127.0.0.2', 'https://2130706433', 'https://0x7f000001', 'https://192.168.1.10', 'https://172.31.1.1', 'https://172.16.0.1', 'https://10.0.0.1', 'https://100.64.0.1', 'https://169.254.1.1', 'https://localhost.', 'https://example.localhost', 'https://[::ffff:127.0.0.1]', 'https://[fc00::1]', 'https://[fe80::1]']) assert.throws(() => resolveSiteUrl(origin, { requirePublic: true }), origin);
  for (const origin of ['https://main.example.amplifyapp.com','https://portfolio.example.com','https://8.8.8.8','https://172.32.0.1','https://[2606:4700:4700::1111]']) assert.equal(resolveSiteUrl(origin, { requirePublic: true }), new URL(origin).origin);
});
