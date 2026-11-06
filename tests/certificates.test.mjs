import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { certificates, certificateCategories, filterCertificates } from '../src/data/certificates.js';
import { canonicalPaths, pageRoutes } from '../src/app/routeCatalog.js';

test('certificate categories partition the gallery without dropping or repeating documents', () => {
  assert.equal(new Set(certificates.map((certificate) => certificate.id)).size, certificates.length);
  assert.equal(filterCertificates(), certificates);
  const grouped = certificateCategories.filter((category) => category !== 'All').flatMap(filterCertificates);
  assert.equal(grouped.length, certificates.length);
  assert.deepEqual(new Set(grouped.map((certificate) => certificate.id)), new Set(certificates.map((certificate) => certificate.id)));
  assert.deepEqual(filterCertificates('unknown-category'), []);
});

test('every gallery document has a local JPG preview and larger image with valid JPEG signatures', async () => {
  for (const certificate of certificates) {
    assert.ok(certificate.title && certificate.issuer && certificate.kind && certificate.issued);
    assert.ok(certificate.width > 0 && certificate.height > 0);
    for (const asset of [certificate.src, certificate.thumbnail]) {
      assert.match(asset, /^\/static\/media\/certificates\/[a-z0-9-]+\.jpg$/);
      const bytes = await readFile(new URL('../public' + asset, import.meta.url));
      assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff');
    }
    assert.notEqual(certificate.src, certificate.thumbnail);
  }
});

test('certificates has a public canonical route for direct loading and the sitemap', () => {
  assert.ok(pageRoutes.some((route) => route.path === 'certificates' && route.page === 'Certificates'));
  assert.ok(canonicalPaths.includes('/certificates'));
});
