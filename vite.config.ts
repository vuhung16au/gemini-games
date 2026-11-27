import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamesDir = path.resolve(__dirname, 'games');

function discoverGameSlugs(): string[] {
  if (!fs.existsSync(gamesDir)) return [];
  return fs
    .readdirSync(gamesDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(gamesDir, entry.name, 'index.html')),
    )
    .map((entry) => entry.name)
    .sort();
}

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

/**
 * Serves each game's `public/` assets at `/games/<slug>/*` during dev
 * and copies them into `dist/games/<slug>/` on build.
 */
function gamePublicAssetsPlugin(slugs: string[]): Plugin {
  return {
    name: 'gemini-games-public-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url?.split('?')[0];
        if (!rawUrl) return next();

        const match = rawUrl.match(/^\/games\/([^/]+)\/(.+)$/);
        if (!match) return next();

        const [, slug, relPath] = match;
        const publicDir = path.resolve(gamesDir, slug, 'public');
        const targetFile = path.resolve(publicDir, relPath);

        if (
          !targetFile.startsWith(publicDir + path.sep) ||
          !fs.existsSync(targetFile) ||
          !fs.statSync(targetFile).isFile()
        ) {
          return next();
        }

        const ext = path.extname(targetFile).toLowerCase();
        if (MIME_TYPES[ext]) {
          res.setHeader('Content-Type', MIME_TYPES[ext]);
        }
        fs.createReadStream(targetFile).pipe(res);
      });
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      for (const slug of slugs) {
        const srcPublic = path.resolve(gamesDir, slug, 'public');
        const destPublic = path.resolve(distDir, 'games', slug);
        if (fs.existsSync(srcPublic)) {
          fs.cpSync(srcPublic, destPublic, { recursive: true });
        }
      }
    },
  };
}

const gameSlugs = discoverGameSlugs();
const gameInputs: Record<string, string> = {};
for (const slug of gameSlugs) {
  gameInputs[`game-${slug}`] = path.resolve(gamesDir, slug, 'index.html');
}

export default defineConfig({
  base: './',
  plugins: [react(), gamePublicAssetsPlugin(gameSlugs)],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        ...gameInputs,
      },
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});
