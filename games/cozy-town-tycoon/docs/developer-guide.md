# Developer Guide — Cozy Town Tycoon

## Tuning & Extending
- **Economy Constants:** Adjust product prices, upgrade costs, staff scaling (`1.45^lvl`), and `MAX_OFFLINE_SECONDS` in `src/game/config.ts`.
- **Next-Action Hints:** Update recommendation priorities in `getNextActionHint` (`src/game/hints.ts`).

## Running Tests & Verification

```bash
npm test
npm run test:e2e
npx tsc --noEmit
npm run build
```
