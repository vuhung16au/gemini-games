# Developer Guide — Flappy Bird

## Tuning & Extending
- **Physics & Geometry:** Tune `GRAVITY`, `FLAP_VELOCITY`, `TERMINAL_VELOCITY`, `PIPE_SPEED`, and `getPipeGap` in `src/game/constants.ts`.
- **Rendering:** Adjust parallax layers, bird animation, or hint corridor graphics in `src/game/renderer.ts`.

## Running Tests & Verification

```bash
npm test
npm run test:e2e
npx tsc --noEmit
npm run build
```
