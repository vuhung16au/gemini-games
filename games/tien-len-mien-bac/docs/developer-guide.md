# Developer Guide — Tiến Lên Miền Bắc

## Project Layout

```text
games/tien-len-mien-bac/
├── docs/               # Project documentation (6 files)
├── e2e/                # Playwright E2E spec (port 4186)
├── public/             # manifest.webmanifest, icons/, graphics/
├── src/
│   ├── components/     # React UI components
│   ├── game/           # Pure rules, AI, hints, engine, tutorial, audio, storage + unit tests
│   ├── App.tsx
│   ├── main.tsx
│   └── style.css
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Tuning & Extending Mechanics

- **Scoring (`src/game/engine.ts`):** Adjust base win bonus (`+10`), card penalty (`1 pt/card`), `Thối 2` (`-10`), `Thối Tứ quý` (`-10`), or `Chặt Heo` (`+10` / `+15`) inside `computeRoundScores` and `playCards`.
- **AI Strategy (`src/game/ai.ts`):** Tune `chooseAiAction` thresholds (e.g., when AI conserves `2`s or leads multi-card combos).
- **Hints (`src/game/hints.ts`):** Adjust `scoreHintCombo` weights to change tie-breaking between straights, pairs, and singles.

## Testing & Verification Workflow

```bash
npm install
npm test            # Runs Vitest unit tests (src/game/rules.test.ts, engine.test.ts)
npm run test:e2e    # Runs Playwright Chromium tests (playwright.config.ts on 127.0.0.1:4186)
npx tsc --noEmit    # Strict TypeScript compilation check
npm run build       # Static production build into dist/
```

When adding E2E assertions, prefer `getByTestId(...)` attributes (`card-*`, `play-btn`, `pass-btn`, `handoff-curtain`, `guidance-banner`) to avoid strict-mode collisions with bilingual labels.
