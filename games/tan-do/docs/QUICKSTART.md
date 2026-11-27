# Quickstart — Tấn Đỡ (Bài Tấn)

Run these commands inside `games/tan-do/`:

## 1. Install Dependencies
```bash
npm install
```

## 2. Start Local Dev Server
```bash
npm run dev
```
Open the local URL printed by Vite (or run on port `4188` via `npm run dev -- --port 4188 --host 127.0.0.1`).

## 3. Run Automated Tests
```bash
# Unit tests (Vitest)
npm test

# End-to-End browser tests (Playwright, port 4188)
npm run test:e2e
```

## 4. Type-Check & Production Build
```bash
npx tsc --noEmit
npm run build
npm run preview
```
