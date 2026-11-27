# Developer Guide — 1024

## Tuning & Extending
- **Grid & Target:** Adjust `GRID_SIZE`, `TARGET_TILE`, `SPAWN_TWO_PROBABILITY`, and `MAX_UNDO_HISTORY` in `src/game/constants.ts`.
- **Hint Heuristic:** Tune weights in `findBestDirection` (`src/game/hints.ts`).

## Running Tests & Verification

```bash
npm test
npm run test:e2e
npx tsc --noEmit
npm run build
```
