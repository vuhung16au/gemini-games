# Architecture — 1024

1024 separates **pure sliding/merging simulation** (`src/game/`) from **React UI & CSS-animated board** (`src/components/`) and **browser adapters** (`audio.ts`, `storage.ts`).

## Module Structure

```text
games/1024/
├── docs/                   # Project documentation
├── e2e/
│   └── game1024.spec.ts    # Playwright end-to-end browser tests
└── src/
    ├── main.tsx            # Imports shared styles/tokens.css & game-ui.css
    ├── App.tsx             # Keyboard/swipe state, Tutorial, Hint, Undo, SFX, persistence
    ├── style.css           # Responsive 4x4 grid, tile colors, transitions, modals
    ├── components/
    │   ├── Header.tsx      # Title emblem, Score/Best, Undo/Hint/Tutorial/Help/Mute/New
    │   ├── Board.tsx       # 4x4 grid + ghost merge tile layer + pointer swipe handler
    │   ├── Overlay.tsx     # WON (Keep Going) and GAME_OVER dialogs
    │   └── HowToPlayModal.tsx # In-game rules, controls & shortcuts modal
    └── game/
        ├── constants.ts    # 4x4 grid, 1024 target, 1/2 spawn odds, undo depth
        ├── types.ts        # Tile, Direction, GameState, MoveResult, SaveData
        ├── engine.ts       # Pure single-merge sliding, spawn, undo, keepGoing
        ├── hints.ts        # Heuristic direction recommender
        ├── tutorial.ts     # Deterministic 3-step guided tutorial deal
        ├── audio.ts        # Procedural Web Audio API SFX
        ├── storage.ts      # Safe localStorage persistence (game_1024_v1)
        └── __tests__/
            └── engine.test.ts
```
