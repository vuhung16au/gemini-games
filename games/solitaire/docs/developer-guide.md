# Developer Guide — Solitaire

## Tuning & Extending
- **Scoring & Undo Depth:** Edit constants in `src/game/constants.ts`.
- **Hint Heuristics:** Adjust priority rules in `findBestHint` (`src/game/hints.ts`).
- **Tutorial Deal:** Modify `createTutorialState` and `evaluateTutorialProgress` in `src/game/tutorial.ts`.
- **Shared Theme:** Colors inherit from `../../../styles/tokens.css` imported in `src/main.tsx`.

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
