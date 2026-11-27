# Developer Guide — Tấn Đỡ (Bài Tấn)

## Project Structure
```text
games/tan-do/
├── index.html
├── package.json
├── playwright.config.ts   # Base URL http://127.0.0.1:4188
├── tsconfig.json
├── vite.config.ts         # base: './', Vitest include src/**/*.test.ts
├── public/
│   └── manifest.webmanifest
├── e2e/
│   └── tan-do.spec.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── style.css
    ├── components/
    └── game/
```

## Tuning Gameplay Parameters
- **`src/game/constants.ts`**: Adjust `INITIAL_HAND_SIZE` (`8`), `MAX_TABLE_SLOTS` (`6`), or `STORAGE_KEY` (`tan_do_v1`).
- **`src/game/ai.ts`**: Tune `chooseAIMove` thresholds (e.g., high-trump conservation threshold when `noc.length > 10`).
- **`src/App.tsx`**: Adjust AI turn delay (`360ms`) or scoring bonuses (`calculateWinScore` in `engine.ts`).

## Testing & Verification Workflow
Run inside `games/tan-do/`:

1. **Unit Tests (Vitest):**
   ```bash
   npm test
   ```
   Tests reside in `src/game/__tests__/*.test.ts`.

2. **E2E Tests (Playwright):**
   ```bash
   npm run test:e2e
   ```
   Starts Vite on `127.0.0.1:4188` and tests viewport fit, Help modal, 3-step Tutorial, Hints, 2P/3P/4P switching, Pass & Play Privacy Curtain, and `localStorage` reload persistence.

3. **Type-Check & Production Build:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```
   Produces a static bundle in `dist/` ready for local preview or static hosting.
