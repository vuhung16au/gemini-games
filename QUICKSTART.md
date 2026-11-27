# Gemini Games — Quickstart

## Prerequisites
- **Node.js** 20+ and **npm**
- **Wrangler CLI** (installed as a devDependency) authenticated via `npx wrangler login` for Cloudflare deployment

---

## 1. Install & Run Locally (Unified Hub)

From the repository root (`/Users/vuhung/Desktop/gemini-games`):

```bash
# Install root dependencies
npm install

# Start the unified hub dev server (serves Dashboard + all 15 games)
npm run dev
```

To run a single game standalone:

```bash
cd games/<game-slug>
npm install
npm run dev
```

---

## 2. Test & Type-Check

```bash
# Run root hub unit tests (Vitest)
npm test

# Run root hub browser E2E tests (Playwright)
npm run test:e2e

# Strict TypeScript check
npx tsc --noEmit
```

Each game in `games/<game-slug>/` also supports `npm test` and `npm run test:e2e`.

---

## 3. Build & Preview Production Bundle

```bash
# Type-check and compile the root hub + all 15 games into dist/
npm run build

# Preview the static dist/ build locally
npm run preview
```

---

## 4. Deploy to Cloudflare

Deployment uses **Cloudflare Workers Static Assets** configured in [wrangler.jsonc](./wrangler.jsonc):

```bash
# Build dist/ and deploy to Cloudflare Workers
npm run deploy
```

Or run validation first:

```bash
npm run build && npx wrangler deploy --dry-run
npx wrangler deploy
```

Live deployment: `https://gemini-games.vuhung16plus.workers.dev`
