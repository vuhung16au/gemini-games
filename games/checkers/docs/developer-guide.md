# Developer Guide — Checkers

## Tuning & Extending
- **AI Search Depth:** Adjust `AI_DEPTH` in `src/game/constants.ts` (`easy: 1`, `medium: 3`, `hard: 5`).
- **Heuristic Weights:** Tune piece/king values, advancement, center control, and edge safety in `evaluateBoard` inside `src/game/ai.ts`.
- **Shared Theme:** Colors are inherited from `../../../styles/tokens.css` imported in `src/main.tsx`.

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
