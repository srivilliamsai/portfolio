import { isSafeLink } from '../src/services/linkSafety.js';

// A deliberately small authoring grammar, not a sanitizer for arbitrary user HTML.
// Fail the build if a future article adds executable elements or attributes.
const tags = new Set(['p', 'a', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'pre', 'code']);
export function validateArticleHtml(html) {
  const tokens = String(html).match(/<[^>]*>|[^<]+/g) || [];
  if (tokens.join('') !== html) throw new Error('Unescaped HTML delimiter');
  const stack = [];
  for (const token of tokens) {
    if (!token.startsWith('<')) continue;
    const match = /^<(\/?)([a-z0-9]+)((?: [a-z]+="[^"<>]*")*)>$/.exec(token);
    if (!match || !tags.has(match[2])) throw new Error('Unsupported article markup');
    const [, closing, tag, attributes] = match;
    if (closing) {
      if (attributes || stack.pop() !== tag) throw new Error('Unbalanced article markup');
      continue;
    }
    const attrs = new Map();
    for (const [, name, value] of attributes.matchAll(/ ([a-z]+)="([^"<>]*)"/g)) {
      if (attrs.has(name) || /[&\u0000-\u001f\u007f]/.test(value)) throw new Error('Unsupported article attribute');
      attrs.set(name, value);
      if (name === 'id' && /^h[234]$/.test(tag) && /^[a-z0-9-]+$/.test(value)) continue;
      if (name === 'class' && tag === 'code' && /^language-[a-z]+$/.test(value)) continue;
      if (tag === 'a' && ((name === 'href' && isSafeLink(value)) || (name === 'target' && value === '_blank') || (name === 'rel' && /^(?:noreferrer|noopener)(?: (?:noreferrer|noopener))*$/.test(value)))) continue;
      throw new Error('Unsupported article attribute or URL');
    }
    if (tag === 'a' && (!attrs.has('href') || (attrs.has('target') && !/\b(?:noreferrer|noopener)\b/.test(attrs.get('rel') || '')))) throw new Error('Unsafe article link');
    stack.push(tag);
  }
  if (stack.length) throw new Error('Unbalanced article markup');
  return true;
}
