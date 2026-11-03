import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith('.md') ? [file] : [];
  }))).flat();
}
const files = ['README.md', 'DEPLOYMENT.md', 'CONTRIBUTING.md', ...(await markdownFiles('docs'))];
let checked = 0;
for (const file of files) {
  const content = await readFile(file, 'utf8');
  assert.equal((content.match(/^```/gm) || []).length % 2, 0, `Unclosed code fence in ${file}`);
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|#)/.test(url)) continue;
    assert.ok(!/^[a-z]+:/i.test(url), `Unsupported link scheme in ${file}: ${url}`);
    const target = path.resolve(path.dirname(file), decodeURIComponent(url.split('#')[0]));
    assert.ok(target.startsWith(`${root}${path.sep}`), `Link leaves repository in ${file}: ${url}`);
    const info = await stat(target);
    assert.ok(info.isFile() || (!match[0].startsWith('!') && info.isDirectory()), `Invalid documentation target in ${file}: ${url}`);
    checked++;
  }
}
console.log(`${files.length} Markdown documents checked; ${checked} local file/image/directory links resolve. External URLs and anchor IDs are not checked.`);
