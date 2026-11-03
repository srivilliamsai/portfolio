import { createHash } from 'node:crypto';
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const validCommit = (value) => /^[a-f0-9]{40}$/.test(value || '');
export const validReleasePath = (value) => value === '/index.html' || value === '/static/theme.js' || /^\/assets\/[A-Za-z0-9_-]+\.(?:js|css)$/.test(value);
export function createRelease(commit, origin, files) {
  if (!validCommit(commit)) throw new Error('Release requires a full Git commit SHA');
  const release = { schemaVersion: 1, commit, origin, files: files.map(({ path, bytes }) => ({ path, sha256: sha256(bytes) })) };
  validateRelease(release, commit, origin);
  return release;
}
export function validateRelease(release, commit, origin) {
  if (!validCommit(commit) || release?.schemaVersion !== 1 || release.commit !== commit || release.origin !== origin) throw new Error('Published release does not match the expected commit and origin');
  if (!Array.isArray(release.files) || release.files.length < 3 || release.files.length > 100) throw new Error('Invalid release files');
  const paths = new Set();
  for (const file of release.files) {
    if (!validReleasePath(file.path) || !/^[a-f0-9]{64}$/.test(file.sha256) || paths.has(file.path)) throw new Error('Invalid release file');
    paths.add(file.path);
  }
  if (!paths.has('/index.html') || !paths.has('/static/theme.js') || ![...paths].some(path => path.endsWith('.css')) || ![...paths].some(path => path.startsWith('/assets/') && path.endsWith('.js'))) throw new Error('Release entry files are missing');
  return release;
}
