# Architecture — Checkers

Checkers separates **pure rules & AI search** (`src/game/`) from **React UI components** (`src/components/`) and **browser adapters** (`audio.ts`, `storage.ts`).

## Module Structure

```text
games/checkers/
├── docs/                   # Project documentation
├── e2e/
│   └── checkers.spec.ts    # Playwright end-to-end browser tests
└── src/
    ├── main.tsx            # Imports shared styles/tokens.css & game-ui.css
    ├── App.tsx             # Root state, AI turn scheduler, keyboard shortcuts, persistence
    ├── style.css           # 8x8 board, piece styling, indicators, and modal
    ├── components/
    │   ├── Header.tsx      # Mode/difficulty tabs, piece counts, turn pill, Undo/Hint/Mute
    │   ├── CheckersBoard.tsx # 8x8 grid, playable dark squares, move/capture dots, kings
    │   └── WinOverlay.tsx  # Game-over victory/defeat dialog
    └── game/
        ├── constants.ts    # Board size (8), AI search depths, storage key
        ├── types.ts        # Player, Piece, Move, GameState, SaveData
        ├── rules.ts        # Legal moves, mandatory captures, multi-jumps, kinging, undo
        ├── ai.ts           # Turn sequence expansion + alpha-beta minimax search
        ├── audio.ts        # Procedural Web Audio API SFX
        ├── storage.ts      # Safe localStorage persistence (checkers_v1)
        └── __tests__/
            └── rules.test.ts
```

## Turn & Multi-Jump Flow
1. `getLegalMovesForPlayer` returns only capture jumps whenever any capture exists; otherwise it returns diagonal step moves.
2. When a capture is executed and the piece does not crown, `executeMove` checks for follow-up jumps from `move.to`. If available, `forcedJumpFrom` locks the turn to that piece until the jump chain completes.
3. In `vs-ai` mode, `App.tsx` schedules `chooseBestMove` via `setTimeout` (`280 ms`) for each AI hop so multi-jumps animate step by step.
