import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const rootDir = process.cwd();
const gamesDir = path.join(rootDir, 'games');

function discoverTargets() {
  const targets = [{ name: 'root (hub)', cwd: rootDir }];
  if (!fs.existsSync(gamesDir)) return targets;

  const slugs = fs
    .readdirSync(gamesDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(gamesDir, entry.name, 'package.json')),
    )
    .map((entry) => entry.name)
    .sort();

  for (const slug of slugs) {
    targets.push({ name: `games/${slug}`, cwd: path.join(gamesDir, slug) });
  }
  return targets;
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gemini-games-test-all-'));
const targets = discoverTargets();
const results = [];

try {
  for (const [idx, target] of targets.entries()) {
    console.log(`\n=== [${idx + 1}/${targets.length}] ${target.name} ===`);
    const jsonOut = path.join(tmpDir, `result-${idx}.json`);
    const startedAt = Date.now();

    const proc = spawnSync(
      'npx',
      ['vitest', 'run', '--reporter=default', '--reporter=json', `--outputFile=${jsonOut}`],
      { cwd: target.cwd, stdio: 'inherit', env: process.env },
    );

    const durationMs = Date.now() - startedAt;
    let filesTotal = 0;
    let filesPassed = 0;
    let testsTotal = 0;
    let testsPassed = 0;
    let testsFailed = 0;

    if (fs.existsSync(jsonOut)) {
      try {
        const report = JSON.parse(fs.readFileSync(jsonOut, 'utf8'));
        filesTotal = report.numTotalTestSuites ?? 0;
        filesPassed = report.numPassedTestSuites ?? 0;
        testsTotal = report.numTotalTests ?? 0;
        testsPassed = report.numPassedTests ?? 0;
        testsFailed = report.numFailedTests ?? 0;
      } catch {
        // Fallback to exit status only if JSON report could not be parsed
      }
    }

    results.push({
      name: target.name,
      ok: proc.status === 0,
      filesTotal,
      filesPassed,
      testsTotal,
      testsPassed,
      testsFailed,
      durationMs,
    });
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

const totalSuites = results.length;
const passedSuites = results.filter((r) => r.ok).length;
const failedSuites = totalSuites - passedSuites;
const totalFiles = results.reduce((sum, r) => sum + r.filesTotal, 0);
const passedFiles = results.reduce((sum, r) => sum + r.filesPassed, 0);
const totalTests = results.reduce((sum, r) => sum + r.testsTotal, 0);
const passedTests = results.reduce((sum, r) => sum + r.testsPassed, 0);
const failedTests = results.reduce((sum, r) => sum + r.testsFailed, 0);
const totalDurationSec = (
  results.reduce((sum, r) => sum + r.durationMs, 0) / 1000
).toFixed(2);

console.log('\n==================== OVERALL TEST RESULTS ====================');
console.log(
  `${'Target'.padEnd(26)} ${'Status'.padEnd(8)} ${'Files'.padEnd(10)} ${'Tests'.padEnd(12)} Time`,
);
console.log('-'.repeat(66));
for (const r of results) {
  const status = r.ok ? 'PASS' : 'FAIL';
  const files = `${r.filesPassed}/${r.filesTotal}`;
  const tests = `${r.testsPassed}/${r.testsTotal}`;
  const sec = `${(r.durationMs / 1000).toFixed(2)}s`;
  console.log(
    `${r.name.padEnd(26)} ${status.padEnd(8)} ${files.padEnd(10)} ${tests.padEnd(12)} ${sec}`,
  );
}
console.log('-'.repeat(66));
console.log(
  `Overall Suites : ${passedSuites}/${totalSuites} passed (${failedSuites} failed)`,
);
console.log(`Test Files     : ${passedFiles}/${totalFiles} passed`);
console.log(
  `Test Cases     : ${passedTests}/${totalTests} passed (${failedTests} failed)`,
);
console.log(`Total Duration : ${totalDurationSec}s`);
console.log('==============================================================');

if (failedSuites > 0) {
  process.exit(1);
}
