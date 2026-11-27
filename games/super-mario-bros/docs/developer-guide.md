# Super Mario Bros. (1985) — Developer Guide

## Project Layout
- `src/game/` — Pure TypeScript simulation (`types.ts`, `constants.ts`, `levels.ts`, `engine.ts`, `hints.ts`, `tutorial.ts`, `storage.ts`)
- `src/renderer/canvasRenderer.ts` — Crisp pixel-art Canvas 2D renderer
- `src/audio/sfx.ts` — Web Audio 8-bit chiptune SFX
- `src/components/` — HUD, overlays, modals, and touch controls
- `e2e/mario.spec.ts` — Playwright E2E suite (port `4183`)

## `TODO:` Extending for 2-Player Co-op & Worlds 2–8
- **2-Player Co-op (`TODO`):** Add a second `PlayerEntity` (Luigi) to `state.players`, split keyboard bindings (`WASD+Space` vs `Arrows+Enter`), track midpoint camera scrolling, and implement bubble respawn when one player falls.
- **Worlds 2–8 (`TODO`):** Add `'2-1'..'8-4'` to `LevelId` in `src/game/types.ts`, register builders in `LEVEL_BUILDERS` inside `src/game/levels.ts`, and add underwater buoyancy physics for `2-2` / `7-2`.

## Verification Commands
```bash
npm test            # Vitest unit tests
npm run test:e2e    # Playwright E2E tests
npx tsc --noEmit    # Strict TypeScript check
npm run build       # Static Vite production build
```
