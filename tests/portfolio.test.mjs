import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteUrl, createSitemap } from '../config/site.mjs';
import { getTerminalResponse } from '../src/services/terminalCommands.js';
import { projects } from '../src/data/projects.js';

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

test('local commands stay useful when all network access fails', () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Network must not be used'); };
  try {
    assert.match(getTerminalResponse('  SKILLS!  '), /Spring Boot/);
    assert.match(getTerminalResponse('experience'), /Zidio/);
    assert.match(getTerminalResponse('contact'), /srivilliamsai@gmail.com/);
    assert.match(getTerminalResponse('certs'), /credly\.com/);
    assert.match(getTerminalResponse('story'), /SwiftUI/);
    assert.match(getTerminalResponse('unrecognized question'), /Try “help”/);
    assert.match(getTerminalResponse('?'), /Available commands/);
  } finally { globalThis.fetch = previousFetch; }
});

test('project output shares descriptions with cards and preserves Wyndra’s identity', () => {
  const response = getTerminalResponse('projects');
  for (const project of projects) assert.ok(response.includes(project.description));
  assert.match(response, /native iOS weather app/);
  assert.doesNotMatch(response, /workflow engine|#1/);
});
