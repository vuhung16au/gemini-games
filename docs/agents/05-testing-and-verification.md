# 5. Mandatory Testing (Unit + E2E) & Verification Gate

Every game project (`games/<game-name>/`) **must** include both automated test suites:

- **Unit Tests (Vitest):** Cover pure simulation logic, physics/collision/economy rules, state transitions, and safe `localStorage` persistence (`npm test`).
- **E2E Tests (Playwright):** Cover real browser gameplay and UI flows—clean page load with zero console/page errors, primary input controls (keyboard/pointer), HUD/score updates, state transitions (start/play/end/restart), mute toggle, and persistence across reloads (`npm run test:e2e` / `npx playwright test`).

## Verification Commands
Before considering any game implementation or update complete, run and pass:
1. `make lint GAME=<slug>` (ESLint code quality & React Hooks check)
2. `make typecheck GAME=<slug>` (strict TypeScript compilation `tsc --noEmit`)
3. `make test GAME=<slug>` (Vitest unit tests with `>= 70%` statements, branches, functions, and lines coverage)
4. `make build GAME=<slug>` (clean Vite production build)
5. `make test-e2e GAME=<slug>` (Playwright E2E tests)
6. `make verify` at the repository root (runs `lint`, `typecheck`, `test` with `>= 70%` coverage, `build`, `test-e2e`, and `check-docs` / `scripts/check-compliance.mjs` across all games, docs, multilingual READMEs, icons/covers, `index.html`, `games.ts`, `translations.ts`, unique Playwright ports, zero external CDNs, and blank `.github/workflows/`).

> **Mandatory AI Agent Rule:** Never report a game creation or modification task as complete until the commands above exit `0` after the **final** edit, and always cite the exact observed test counts and coverage percentages from the final run.
