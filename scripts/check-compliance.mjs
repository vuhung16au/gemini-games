import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const errors = [];

function checkFile(relPath) {
  const full = path.join(rootDir, relPath);
  if (!fs.existsSync(full)) {
    errors.push(`Missing file: ${relPath}`);
    return null;
  }
  return full;
}

// 1. Root & courses multilingual READMEs
for (const base of [
  '.',
  'courses',
  ...fs
    .readdirSync(path.join(rootDir, 'courses'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith('day-'))
    .map((d) => path.join('courses', d.name)),
]) {
  checkFile(path.join(base, 'README.md'));
  checkFile(path.join(base, 'README.zh.md'));
  checkFile(path.join(base, 'README.vi.md'));
}

// 2. Discover all game slugs
const gamesDir = path.join(rootDir, 'games');
const slugs = fs
  .readdirSync(gamesDir, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      fs.existsSync(path.join(gamesDir, d.name, 'package.json')),
  )
  .map((d) => d.name)
  .sort();

const gamesRegistryContent = fs.readFileSync(
  path.join(rootDir, 'src/registry/games.ts'),
  'utf8',
);
const translationsContent = fs.readFileSync(
  path.join(rootDir, 'src/i18n/translations.ts'),
  'utf8',
);

const usedPorts = new Map();

function walkTsFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkTsFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

for (const slug of slugs) {
  const gameRel = path.join('games', slug);

  // 3. Required docs + multilingual READMEs
  for (const doc of [
    'README.md',
    'README.zh.md',
    'README.vi.md',
    'QUICKSTART.md',
    'architecture.md',
    'techstack.md',
    'user-guide.md',
    'developer-guide.md',
  ]) {
    checkFile(path.join(gameRel, 'docs', doc));
  }

  // 4. Required public assets
  for (const asset of [
    'manifest.webmanifest',
    'icons/favicon.ico',
    'icons/icon-32.png',
    'icons/apple-touch-icon.png',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'graphics/cover-hd.png',
    'graphics/cover-fullhd.png',
  ]) {
    checkFile(path.join(gameRel, 'public', asset));
  }

  // 5. index.html wiring & zero external runtime CDNs
  const indexPath = checkFile(path.join(gameRel, 'index.html'));
  if (indexPath) {
    const html = fs.readFileSync(indexPath, 'utf8');
    for (const requiredRef of [
      './icons/favicon.ico',
      './icons/icon-32.png',
      './icons/apple-touch-icon.png',
      './manifest.webmanifest',
      './graphics/cover-hd.png',
      './src/main.tsx',
    ]) {
      if (!html.includes(requiredRef)) {
        errors.push(`${gameRel}/index.html missing reference: ${requiredRef}`);
      }
    }
    const extMatches = html.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
    for (const url of extMatches) {
      if (!url.startsWith('http://www.w3.org/')) {
        errors.push(`${gameRel}/index.html contains external URL: ${url}`);
      }
    }
  }

  // 6. Hub registry & multilingual translations
  if (!gamesRegistryContent.includes(`'${slug}'`)) {
    errors.push(`src/registry/games.ts missing slug: '${slug}'`);
  }
  if (
    !translationsContent.includes(`'${slug}'`) &&
    !translationsContent.includes(`${slug}:`)
  ) {
    errors.push(`src/i18n/translations.ts missing zh/vi localization for: ${slug}`);
  }

  // 7. Unique Playwright port
  const pwPath = checkFile(path.join(gameRel, 'playwright.config.ts'));
  if (pwPath) {
    const pw = fs.readFileSync(pwPath, 'utf8');
    const portMatch = pw.match(/127\.0\.0\.1:(\d+)|localhost:(\d+)|port:\s*(\d+)/);
    const port = portMatch ? portMatch[1] || portMatch[2] || portMatch[3] : null;
    if (!port) {
      errors.push(`${gameRel}/playwright.config.ts missing explicit port`);
    } else if (usedPorts.has(port)) {
      errors.push(
        `Duplicate Playwright port ${port} shared by ${usedPorts.get(port)} and ${slug}`,
      );
    } else {
      usedPorts.set(port, slug);
    }
  }

  // 8. Zero external runtime CDN URLs in src/ (ignore test files & comments)
  for (const file of walkTsFiles(path.join(rootDir, gameRel, 'src'))) {
    if (file.includes('.test.')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const urls = content.match(/https?:\/\/[^\s"'`<>]+/g) ?? [];
    for (const url of urls) {
      if (!url.startsWith('http://www.w3.org/')) {
        errors.push(
          `${path.relative(rootDir, file)} contains external URL: ${url}`,
        );
      }
    }
  }
}

// 9. Verify .github/workflows/ has no active workflow YAML files
const workflowsDir = path.join(rootDir, '.github/workflows');
if (fs.existsSync(workflowsDir)) {
  for (const entry of fs.readdirSync(workflowsDir)) {
    if (/\.ya?ml$/i.test(entry)) {
      errors.push(
        `.github/workflows/${entry} must not exist (workflows kept blank to avoid CI spend)`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error('Compliance check failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  `AGENTS.md compliance check passed for all ${slugs.length} games (docs, i18n, assets, index.html, unique Playwright ports, zero external CDNs, blank .github/workflows).`,
);
