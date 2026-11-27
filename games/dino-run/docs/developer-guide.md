# Dino Run — Developer Guide

## Project Layout
- `src/game/` — Pure TypeScript simulation (`types.ts`, `constants.ts`, `engine.ts`, `hints.ts`, `tutorial.ts`, `storage.ts`)
- `src/renderer/canvasRenderer.ts` — Crisp pixel-art Canvas 2D renderer
- `src/audio/sfx.ts` — Web Audio SFX
- `src/components/HowToPlayModal.tsx` & `src/App.tsx` — UI and input handling
- `e2e/dino.spec.ts` — Playwright E2E suite (port `4184`)

## Verification Commands
```bash
npm test            # Vitest unit tests
npm run test:e2e    # Playwright E2E tests
npx tsc --noEmit    # Strict TypeScript check
npm run build       # Static Vite production build
```
