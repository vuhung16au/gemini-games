# Developer Guide — Tá Lả (Phỏm)

## Project Layout

- `src/game/phom.ts`: Core Phỏm validation (`isValidPhom`), optimal backtracking solver (`solveOptimalMelds`), lay-off detection (`findLayOffOptions`), and `Ù` checks (`canDeclareU`).
- `src/game/engine.ts`: Pure state transitions (`createNewGame`, `eatLastDiscard`, `drawFromNoc`, `meldOptimalPhoms`, `layOffSingleCard`, `discardCard`, `declareU`).
- `src/game/ai.ts`: AI heuristics (`shouldAiEat`, `chooseAiDiscardCardId`, `runAiStep`).
- `src/game/hints.ts` & `src/game/tutorial.ts`: Tactical hint generator and 3-step scripted tutorial.

## Tuning & Extending Mechanics

- **Eaten-Card Rules:** `solveOptimalMelds` accepts `{ maxEatenPerMeld }` (default `1`) to enforce the standard rule of at most one eaten card per Phỏm.
- **AI Heuristics:** Adjust penalty/bonus weights in `chooseAiDiscardCardId` (`src/game/ai.ts`) to tune AI aggression when holding pairs (`Cạ`) or avoiding feeding the next player.
- **Scoring:** Modify `finishWithU` and `finishByPoints` in `src/game/engine.ts` to customize match point deltas.

## Testing & Verification Workflow

Run all checks inside `games/ta-la-phom/`:

```bash
npm test              # Vitest unit tests (src/game/__tests__/*.test.ts)
npm run test:e2e      # Playwright E2E tests on http://127.0.0.1:4185
npx tsc --noEmit      # Strict TypeScript check
npm run build         # Production static Vite build (dist/)
```
