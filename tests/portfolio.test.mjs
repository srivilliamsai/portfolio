import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteUrl, createSitemap } from '../config/site.mjs';

test('deployment origins normalize and reject unsafe or incomplete public configuration', () => {
  assert.equal(resolveSiteUrl('https://main.example.amplifyapp.com/'), 'https://main.example.amplifyapp.com');
  assert.equal(resolveSiteUrl(), 'http://localhost:3000');
  for (const value of ['', 'http://localhost:3000', 'http://example.com', 'https://user:password@example.com', 'https://example.com/path', 'https://example.com/?x=1', 'https://example.com/#story', 'javascript:alert(1)']) {
    assert.throws(() => resolveSiteUrl(value, { requirePublic: true }));
  }
});

test('sitemap uses the configured deployment origin and deduplicates routes', () => {
  const sitemap = createSitemap('https://portfolio.example.com', ['/', '/wyndra', '/wyndra']);
  assert.match(sitemap, /<loc>https:\/\/portfolio\.example\.com\/wyndra<\/loc>/);
  assert.equal((sitemap.match(/<url>/g) || []).length, 2);
});
