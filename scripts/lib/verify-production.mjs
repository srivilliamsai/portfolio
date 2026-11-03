import { setTimeout as delay } from 'node:timers/promises';
import { validateRelease, sha256, validCommit } from '../../config/release.mjs';
import { resolveSiteUrl } from '../../config/site.mjs';

async function readPublished(request, url, limit) {
  const response = await request(url, { redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Published file returned HTTP ${response.status}`);
  if (Number(response.headers.get('content-length')) > limit) throw new Error('Published file exceeds size limit');
  const chunks = [];
  let size = 0;
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Published file has no body');
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) throw new Error('Published file exceeds size limit');
      chunks.push(Buffer.from(value));
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks);
}

export async function verifyProduction({ origin, commit, request = fetch, timeoutMs = 900000, intervalMs = 15000, now = Date.now, sleep = delay, onRetry = () => {} }) {
  resolveSiteUrl(origin, { requirePublic: true });
  if (!validCommit(commit) || timeoutMs <= 0 || intervalMs <= 0) throw new Error('Invalid verification configuration');
  const deadline = now() + timeoutMs;
  let lastError;
  while (now() < deadline) {
    try {
      const urlFor = (path) => `${origin}${path}?release=${commit}&check=${now()}`;
      const release = validateRelease(JSON.parse((await readPublished(request, urlFor('/deployment.json'), 65536)).toString('utf8')), commit, origin);
      for (const file of release.files) {
        if (now() >= deadline) throw new Error('Verification deadline exceeded');
        const bytes = await readPublished(request, urlFor(file.path), 20 * 1024 * 1024);
        if (sha256(bytes) !== file.sha256) throw new Error(`Published content mismatch: ${file.path}`);
      }
      if (now() >= deadline) throw new Error('Verification deadline exceeded');
      return release;
    } catch (error) {
      lastError = error;
      onRetry(error.message);
      const remaining = deadline - now();
      if (remaining > 0) await sleep(Math.min(intervalMs, remaining));
    }
  }
  throw new Error(`Production was not verified before timeout: ${lastError?.message || 'No matching release'}`);
}
