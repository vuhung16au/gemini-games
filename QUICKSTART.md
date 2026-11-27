**English** | [中文](./QUICKSTART.zh.md) | [Tiếng Việt](./QUICKSTART.vi.md)

# Gemini Games — Quickstart

Play the **16-game** unified hub online at **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**, or clone and run it **100% offline** on your own machine.

## Prerequisites
- **Node.js** 20+ and **npm**
- **Git** (to clone the repository)
- **Wrangler CLI** (included as a devDependency; run `npx wrangler login` only if deploying to Cloudflare)

---

## 1. Clone, Install & Run Locally (100% Offline)

```bash
git clone https://github.com/vuhung16au/gemini-games.git
cd gemini-games
npm install

# Start the unified hub dev server (Dashboard + all 16 games)
make dev
# Or: npm run dev
```

To run a single game standalone:

```bash
make dev GAME=<game-slug>
# Or: cd games/<game-slug> && npm install && npm run dev
```

List all 16 game slugs with `make list-games`.

---

## 2. Test, Lint & Verify

```bash
# Run root hub unit tests (Vitest + >=70% coverage)
make test

# Run unit tests across the root hub + all 16 games
make test-all

# Run root hub browser E2E tests (Playwright)
make test-e2e

# Run ESLint & strict TypeScript check
make lint
make typecheck

# Run full repository verification (lint, typecheck, test, build, test-e2e, check-docs)
make verify
```

Every `make` target also supports `GAME=<game-slug>` (for example, `make verify GAME=minesweeper`).

---

## 3. Build & Preview Production Bundle

```bash
# Type-check and compile the root hub + all 16 games into static dist/
make build

# Preview the static dist/ build locally (100% offline)
make preview
```

---

## 4. Deploy (Cloudflare Workers or Vercel)

### Option A: Cloudflare Workers Static Assets (Default)
Configured in [wrangler.jsonc](./wrangler.jsonc):

```bash
# Dry-run validation without publishing
make deploy-dry-run

# Build dist/ and deploy to Cloudflare Workers
make deploy
```

### Option B: Vercel (Alternative)
Because `dist/` is a pure static bundle, you can also deploy it to Vercel:

```bash
make build
npx vercel --prod dist
```

---

## 5. Learn Vibe Coding with This Project
New to this repo? Follow the hands-on 9-day course in [courses/README.md](./courses/README.md).
