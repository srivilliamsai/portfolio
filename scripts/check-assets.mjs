import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
const sources = ['index.html', ...(await walk('src')).filter((file) => /\.(jsx?|css)$/.test(file))];
const text = (await Promise.all(sources.map((file) => readFile(file, 'utf8')))).join('\n');
const referenced = new Set([...text.matchAll(/\/static\/[^\s'"`<>\)]+/g)].map((match) => match[0]));
for (const url of referenced) assert.ok((await stat(`public${url}`)).isFile(), `Missing active asset: ${url}`);
const publicFiles = await walk('public');
for (const file of publicFiles) {
  assert.ok(!path.basename(file).startsWith('.'), `Move OS metadata out of public: ${file}`);
  const url = '/' + path.relative('public', file).split(path.sep).join('/');
  assert.ok(referenced.has(url) || /^\/google[a-f0-9]+\.html$/.test(url), `Unreferenced public file requires review: ${file}`);
}
console.log(`${referenced.size} active asset references resolve; ${publicFiles.length} required public files verified.`);
