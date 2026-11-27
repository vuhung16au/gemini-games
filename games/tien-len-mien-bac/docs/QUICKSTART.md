# Quickstart — Tiến Lên Miền Bắc

Run all commands inside `games/tien-len-mien-bac/`:

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Local Development Server

```bash
npm run dev
```

Or specify the E2E port (`4186`):

```bash
npm run dev -- --port 4186 --host 127.0.0.1
```

## 3. Run Automated Tests & Type Check

```bash
npm test            # Vitest unit tests (src/**/*.test.ts)
npm run test:e2e    # Playwright E2E tests on http://127.0.0.1:4186
npx tsc --noEmit    # Strict TypeScript check
```

## 4. Production Build & Preview

```bash
npm run build       # Outputs static bundle to dist/
npm run preview     # Serves dist/ locally
```
