# Quickstart — Solitaire

## Prerequisites
- **Node.js** 18+ and **npm**

## Local Setup & Play

From the repository root (unified web app):

```bash
npm run dev
```

Or standalone inside `games/solitaire/`:

```bash
cd games/solitaire
npm install
npm run dev
```

## Automated Tests & Build

```bash
# Run Vitest unit tests
npm test

# Run Playwright E2E browser tests
npm run test:e2e

# Strict TypeScript check
npx tsc --noEmit

# Production static build (outputs to dist/)
npm run build
```
