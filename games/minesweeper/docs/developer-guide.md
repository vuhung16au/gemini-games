# Minesweeper — Developer Guide

## Project Layout
- `src/game/` — Pure TypeScript simulation (`types.ts`, `constants.ts`, `engine.ts`, `hints.ts`, `tutorial.ts`, `storage.ts`)
- `src/audio/sfx.ts` — Procedural Web Audio SFX
- `src/components/` — `HowToPlayModal.tsx`, `CustomBoardModal.tsx`
- `e2e/minesweeper.spec.ts` — Playwright E2E suite (port `4189`)

## Verification Commands
```bash
npm test            # Vitest unit tests
npm run test:e2e    # Playwright E2E tests
npx tsc --noEmit    # Strict TypeScript check
npm run build       # Static Vite production build
```
