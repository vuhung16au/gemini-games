# Quickstart — Tiến Lên Miền Nam

Run all commands inside `games/tien-len-mien-nam/`:

## 1. Install Dependencies

```bash
npm install
```

## 2. Run Local Dev Server

```bash
npm run dev
```

Or specify the dedicated Playwright port (`4187`):

```bash
npm run dev -- --port 4187 --host 127.0.0.1
```

## 3. Run Automated Tests & Type Check

```bash
npm test            # Vitest unit tests (src/**/*.test.ts)
npm run test:e2e    # Playwright E2E browser tests on port 4187
npx tsc --noEmit    # Strict TypeScript type-check
```

## 4. Production Build & Preview

```bash
npm run build       # Outputs static bundle to dist/
npm run preview     # Serves dist/ locally
```
