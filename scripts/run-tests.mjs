import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { printableReportText } from './lib/report-text.mjs';

// Pass explicit paths so Windows does not depend on shell wildcard expansion.
const options = new Set(process.argv.slice(2));
for (const option of options) {
  if (!['--ci', '--terminal'].includes(option)) throw new Error(`Unknown option: ${option}`);
}
const files = (await readdir('tests'))
  .filter((file) => file.endsWith('.test.mjs') && (!options.has('--terminal') || file.startsWith('terminal-')))
  .sort().map((file) => `tests/${file}`);
if (!files.length) throw new Error('No test files found');
const args = ['--test'];
if (options.has('--ci')) {
  await mkdir('test-results', { recursive: true });
  args.push('--test-reporter=spec', '--test-reporter-destination=stdout',
    '--test-reporter=junit', '--test-reporter-destination=test-results/unit.xml',
    '--test-reporter=tap', '--test-reporter-destination=test-results/unit.tap');
}
const result = spawnSync(process.execPath, [...args, ...files], { stdio: 'inherit' });
if (result.error) throw result.error;
if (options.has('--ci')) {
  for (const file of ['test-results/unit.xml', 'test-results/unit.tap']) {
    const report = await readFile(file, 'utf8').catch((error) => {
      if (error.code === 'ENOENT' && result.status !== 0) return null;
      throw error;
    });
    if (report !== null) await writeFile(file, printableReportText(report));
  }
}
if (result.signal) {
  console.error(`Test runner interrupted: ${result.signal}`);
  process.exitCode = 1;
} else process.exitCode = result.status ?? 1;
