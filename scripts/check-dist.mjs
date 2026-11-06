import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { validateRelease, sha256 } from '../config/release.mjs';
import { execFileSync } from 'node:child_process';
import { loadEnv } from 'vite';
import { resolveSiteUrl } from '../config/site.mjs';

const siteUrl = resolveSiteUrl(loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL, { requirePublic: Boolean(process.env.AWS_APP_ID) });
const html = await readFile('dist/index.html', 'utf8');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const robots = await readFile('dist/robots.txt', 'utf8');
assert.ok(html.includes(`rel="canonical" href="${siteUrl}/"`), 'Static canonical must match VITE_SITE_URL');
assert.ok(html.includes(`content="${siteUrl}/" property="og:url"`), 'Static social URL must match VITE_SITE_URL');
assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
assert.ok(sitemap.includes(`${siteUrl}/wyndra`));
assert.ok(sitemap.includes(`${siteUrl}/glassora`));
assert.ok(sitemap.includes(`${siteUrl}/blog/`));

const release = JSON.parse(await readFile('dist/deployment.json', 'utf8'));
validateRelease(release, execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), siteUrl);
for (const file of release.files) assert.equal(sha256(await readFile(`dist${file.path}`)), file.sha256, `Release hash mismatch: ${file.path}`);

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    assert.ok(!['archive', 'docs', 'tests', 'scripts', 'server', '.github'].includes(entry.name), `Non-site entry must not be published: ${path}`);
    if (entry.isDirectory()) { await inspect(path); continue; }
    assert.notEqual(entry.name, '.env', 'Environment files must not be published');
    assert.ok(!entry.name.startsWith('.'), `Hidden metadata must not be published: ${path}`);
    assert.ok(!['archive', 'docs', 'tests', 'scripts'].includes(entry.name), `Non-site directory must not be published: ${path}`);
    if (!/\.(html|js|css|xml|txt|json)$/.test(entry.name)) continue;
    const content = await readFile(path, 'utf8');
    assert.ok(!/AIza[0-9A-Za-z_-]{30,}|AQ\.[0-9A-Za-z_-]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(content), `Possible credential in ${path}`);
    // VILL intentionally lazy-loads the Gemini browser SDK for ephemeral-token Live sessions.
    // The retired API route and browser-exposed permanent-key configuration remain forbidden.
    for (const forbidden of ['__SITE_URL__', '/api/gemini', 'VITE_GEMINI_API_KEY', '/_vercel/insights', '/_vercel/speed-insights', 'https://srivilliamsai.vercel.app']) assert.ok(!content.includes(forbidden), `Retired integration or unresolved configuration in ${path}`);
  }
}
await inspect('dist');
console.log(`Build artifacts checked: metadata, routes, retired integrations, and credential patterns (${siteUrl}).`);
