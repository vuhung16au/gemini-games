# Developer Guide — Sudoku

## Tuning & Extending
- **Difficulty Clue Counts:** Edit `DIFFICULTY_CLUES` in `src/game/constants.ts` (`easy: 42`, `medium: 34`, `hard: 28`, `expert: 23`).
- **Mistake Limit & Undo Depth:** Adjust `MAX_MISTAKES` (`3`) or `MAX_UNDO_HISTORY` (`50`) in `src/game/constants.ts`.
- **Shared Theme:** Colors come from `../../../styles/tokens.css` imported in `src/main.tsx`.

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

## Notes for CI / Deployment
- `vite.config.ts` sets `base: './'` and scopes Vitest to `src/**/*.test.ts` so Playwright specs in `e2e/` run separately via `npm run test:e2e`.
- The production `dist/` directory is 100% static and ready for future Cloudflare deployment without backend dependencies.
