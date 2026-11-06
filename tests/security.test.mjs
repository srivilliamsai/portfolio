import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticleHtml } from '../config/content-policy.mjs';
import { blogPosts } from '../src/data/blogs.js';
import { isSafeLink } from '../src/services/linkSafety.js';

for (const post of blogPosts) test(`authored article passes the restricted HTML grammar: ${post.slug}`, () => assert.equal(validateArticleHtml(post.content), true));
for (const html of [
  '<script>alert(1)</script>', '<img src="x" onerror="alert(1)">', '<svg><a href="x"></a></svg>',
  '<p onclick="alert(1)">text</p>', '<a href="javascript:alert(1)">click</a>', '<a href="&#106;avascript:alert(1)">click</a>',
  '<a href="//attacker.example">click</a>', '<a href="https://safe.example" target="_blank">click</a>',
  '<a href="https://safe.example" href="javascript:alert(1)">click</a>', '<p style="color:red">text</p>',
  '<p><strong>broken</p></strong>', '<p>raw < delimiter</p>', '<!-- hidden markup -->', '<a href="https://user:password@example.com">click</a>',
]) test(`article rejects executable or unsupported markup: ${html.slice(0, 65)}`, () => assert.throws(() => validateArticleHtml(html)));

test('link policy rejects obfuscated schemes and accepts ordinary navigation', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,bad', 'file:///tmp/x', '//example.com', 'https:\\example.com', 'java\nscript:alert(1)', 'https://user:secret@example.com']) assert.equal(isSafeLink(value), false, value);
  for (const value of ['/blog', 'https://example.com/a?x=1', 'mailto:person@example.com']) assert.equal(isSafeLink(value), true, value);
});
