---
name: game-testing-and-quality
description: Write deterministic Vitest unit tests (>=70% statements, branches, functions, lines) and Playwright E2E tests, and run the Makefile quality gates for gemini-games.
---

# Game Testing & Quality Gates

## 1. Vitest Unit Tests (`>= 70%` Coverage)
- Keep pure simulation logic in `src/game/` with **zero DOM/Canvas/Audio imports** (`audio/` and `renderer/` belong in `src/audio/` and `src/renderer/`).
- Configure `games/<slug>/vite.config.ts` with `coverage`:
  - `provider: 'v8'`
  - `include: ['src/game/**/*.ts']`
  - `exclude: ['src/**/*.test.ts', 'src/game/types.ts']`
  - `thresholds: { lines: 70, statements: 70, functions: 70, branches: 70 }`
- Always test:
  1. Core rules, scoring, win/loss/draw transitions, and edge-case guards
  2. Hints (`hints.ts`) and 3-step Tutorial progression (`tutorial.ts`)
  3. Safe `localStorage` load/save with corrupt JSON and throwing-storage fallbacks (`storage.ts`)

## 2. Playwright E2E Tests
- Use a unique local port in `games/<slug>/playwright.config.ts`.
- For Three.js WebGL games, pass SwiftShader args in `playwright.config.ts`:
  `--use-gl=angle`, `--use-angle=swiftshader`, `--enable-webgl`, `--ignore-gpu-blocklist`.
- Assert in `e2e/<slug>.spec.ts`:
  - Clean load with `0` `console.error` and `0` `pageerror`
  - Primary keyboard/pointer controls and HUD updates
  - Modals (`How to Play`, `Tutorial`, `Hint`), Mute toggle, and `localStorage` persistence across `page.reload()`

## 3. Verification Commands
```bash
make lint GAME=<slug>
make typecheck GAME=<slug>
make test GAME=<slug>
make build GAME=<slug>
make test-e2e GAME=<slug>
make test-all          # Root + all 16 games with overall summary
make verify            # Root lint, typecheck, test, build, test-e2e, check-docs
```
