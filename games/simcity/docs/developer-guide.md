# SimCity 3D — Developer Guide

## Project Layout
- `src/game/` — Pure TypeScript simulation (`types.ts`, `constants.ts`, `maps.ts`, `engine.ts`, `hints.ts`, `tutorial.ts`, `storage.ts`)
- `src/renderer/` — Three.js scene (`CityScene.ts`, `BuildingFactory.ts`, `TrafficSystem.ts`)
- `src/audio/` — Procedural Web Audio (`sfx.ts`)
- `src/components/` — React HUD & modals
- `e2e/` — Playwright E2E suite (`simcity.spec.ts`, port `4181`)

## Tuning & Extending
- Adjust grid size, starting treasury, tool costs/upkeep, capacity, and milestones in `src/game/constants.ts`.
- Add new terrain presets or starter layouts in `src/game/maps.ts`.
- Add or customize 3D building silhouettes in `src/renderer/BuildingFactory.ts`.

## Verification Commands
```bash
npm test            # Vitest unit tests
npm run test:e2e    # Playwright Chromium WebGL E2E tests
npx tsc --noEmit    # Strict TypeScript check
npm run build       # Static Vite build into dist/
```
