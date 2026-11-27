# Architecture — Solitaire

Solitaire separates **pure Klondike simulation** (`src/game/`) from **React UI & SVG card rendering** (`src/components/`) and **browser adapters** (`audio.ts`, `storage.ts`).

## Module Structure

```text
games/solitaire/
├── docs/                     # Project documentation
├── e2e/
│   └── solitaire.spec.ts     # Playwright end-to-end browser tests
├── public/
│   ├── manifest.webmanifest
│   ├── icons/                # favicon.ico, 32, 180, 192, 512
│   └── graphics/             # cover-hd.png (1280x720), cover-fullhd.png (1920x1080)
└── src/
    ├── main.tsx              # Imports shared styles/tokens.css & game-ui.css
    ├── App.tsx               # State coordination, drag/click/keyboard handlers, timer, auto-complete
    ├── style.css             # Responsive 7-column layout, card overlap, modals
    ├── components/
    │   ├── SuitSvg.tsx       # Inline SVG suit glyphs & royal plum card-back pattern
    │   ├── CardView.tsx      # Face-up / face-down card rendering & drag source
    │   ├── Header.tsx        # Title emblem, Turn 1/3 tabs, stats, Undo/Hint/Tutorial/How to Play
    │   ├── SolitaireBoard.tsx# Stock, Waste, 4 Foundations, 7 Tableau columns
    │   ├── HowToPlayModal.tsx# In-game rules, controls & shortcuts modal
    │   └── GameOverlay.tsx   # PAUSED and WON overlays
    └── game/
        ├── constants.ts      # Scoring rules, pile counts, undo cap, storage key
        ├── types.ts          # Card, CardLocation, DropTarget, MoveHint, GameState
        ├── engine.ts         # Deck, shuffle, deal, legal moves, draw, auto-complete, undo
        ├── hints.ts          # Prioritized hint solver
        ├── tutorial.ts       # Deterministic 3-step guided tutorial deal & evaluator
        ├── audio.ts          # Procedural Web Audio API SFX
        ├── storage.ts        # Safe localStorage persistence (solitaire_v1)
        └── __tests__/
            └── engine.test.ts
```
