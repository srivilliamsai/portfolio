import { verifyProduction } from './lib/verify-production.mjs';
const release = await verifyProduction({
  origin: process.env.PRODUCTION_URL,
  commit: process.env.GITHUB_SHA,
  onRetry: (reason) => console.log(`Waiting for the matching AWS release: ${reason}`),
});
console.log(`Verified published commit ${release.commit} and ${release.files.length} file hashes at ${release.origin}.`);
