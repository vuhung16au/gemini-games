# Battle City (1985) — Developer Guide

## Project Layout
- `src/game/` — Pure TypeScript simulation (`types.ts`, `constants.ts`, `stages.ts`, `engine.ts`, `hints.ts`, `tutorial.ts`, `storage.ts`)
- `src/renderer/canvasRenderer.ts` — Crisp pixel-art Canvas 2D renderer
- `src/audio/sfx.ts` — Web Audio 8-bit chiptune SFX
- `src/components/` — Sidebar, overlays, modals, and touch controls
- `e2e/battle-city.spec.ts` — Playwright E2E suite (port `4182`)

## Verification Commands
```bash
npm test            # Vitest unit tests
npm run test:e2e    # Playwright E2E tests
npx tsc --noEmit    # Strict TypeScript check
npm run build       # Static Vite production build
```
