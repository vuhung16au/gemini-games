# Developer Guide — Tiến Lên Miền Nam

## Project Layout

- `src/game/combos.ts`: Core deck generation, Southern rank/suit comparators (`cardValue`, `compareCards`), combo parser (`detectCombo`), beating logic (`canBeat`, `isCutPlay`), `checkToiTrang`, and `generateAllCombos`.
- `src/game/engine.ts`: Pure immutable reducers (`createNewGame`, `playCards`, `passTurn`, `toggleCardSelection`, `cycleSortMode`, `revealPassAndPlayHand`) and penalty scoring (`computeHandPenalties`).
- `src/game/ai.ts` & `src/game/hints.ts`: Heuristic evaluation for lead vs. response plays (`chooseAiPlay`, `getSouthernHint`).
- `src/game/tutorial.ts`: Deterministic 3-step interactive Tutorial (`createTutorialGame`, `handleTutorialPlay`).
- `src/components/`: Stateless/controlled React components styled via `../../../styles/tokens.css`, `../../../styles/game-ui.css`, and `src/style.css`.

## Tuning Gameplay Parameters

- **AI Reaction Speed:** Adjust `AI_THINK_DELAY_MS` (`520` ms) in `src/game/constants.ts`.
- **Penalty Weights:** Adjust `computeHandPenalties` (`3` for black `2`, `6` for red `2`, `6`/`8`/`10` for leftover bombs) and Chặt Heo in-round bonus (`5`) in `src/game/engine.ts`.
- **AI Conservativeness:** Tune `scoreLeadCombo` and `scoreResponseCombo` weights in `src/game/ai.ts`.

## Testing & Verification Workflow

```bash
# 1. Unit tests (Vitest)
npm test

# 2. E2E browser tests (Playwright on http://127.0.0.1:4187)
npm run test:e2e

# 3. Strict TypeScript check
npx tsc --noEmit

# 4. Production build (static dist/)
npm run build
```

When adding new E2E tests in `e2e/tien-len.spec.ts`, prefer `page.getByTestId(...)` for buttons or counters whose bilingual labels may match multiple elements.
