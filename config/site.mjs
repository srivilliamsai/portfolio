import { isIP } from 'node:net';

export function isPublicHostname(hostname) {
  const host = hostname.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '');
  const version = isIP(host);
  if (version === 4) {
    const [a, b, c] = host.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224
      || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
      || (a === 192 && b === 0) || (a === 198 && [18, 19].includes(b))
      || (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113));
  }
  if (version === 6) {
    // Public unicast space only; excludes loopback, mapped IPv4, link-local,
    // unique-local, multicast and documentation addresses without DNS requests.
    const prefix = Number.parseInt(host.split(':')[0], 16);
    return prefix >= 0x2000 && prefix <= 0x3fff && !/^2001:db8(?::|$)/.test(host);
  }
  return host.includes('.') && !/(^|\.)(localhost|local|internal|invalid|test)$/.test(host);
}

export function resolveSiteUrl(value, { requirePublic = false } = {}) {
  if (!value && requirePublic) throw new Error('Set VITE_SITE_URL to your public Amplify HTTPS origin before deploying.');
  const url = new URL(value || 'http://localhost:3000');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.');
  }
  if (requirePublic && (url.protocol !== 'https:' || !isPublicHostname(url.hostname))) {
    throw new Error('Amplify builds require a public HTTPS VITE_SITE_URL.');
  }
  return url.origin;
}

export function createSitemap(siteUrl, paths) {
  const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(paths)].map((path) => `  <url><loc>${escapeXml(new URL(path, siteUrl).href)}</loc></url>`).join('\n')}\n</urlset>\n`;
}
