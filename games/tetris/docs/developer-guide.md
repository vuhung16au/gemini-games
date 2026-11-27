# Developer Guide — Tetris

## Tuning & Extending
- **Board & Timing:** Adjust `BOARD_COLS`, `BOARD_ROWS`, `LOCK_DELAY_SEC`, and `getGravityInterval` in `src/game/constants.ts`.
- **Hint Heuristic:** Tune weights (lines cleared, holes, aggregate height, bumpiness) in `evaluateSimulatedBoard` inside `src/game/hints.ts`.
- **Shared Theme:** CSS inherits from `../../../styles/tokens.css`; Canvas colors come from `../../../styles/theme.ts`.

## Running Tests & Verification

```bash
# 1. Unit tests (Vitest)
npm test

# 2. E2E browser tests (Playwright)
npm run test:e2e

# 3. TypeScript check
npx tsc --noEmit

# 4. Production build
npm run build
```
