# Architecture — Sudoku

Sudoku separates **pure deterministic game logic** (`src/game/`) from **React UI components** (`src/components/`) and **browser adapters** (`audio.ts`, `storage.ts`).

## Module Structure

```text
games/sudoku/
├── docs/                   # Project documentation
├── e2e/
│   └── sudoku.spec.ts      # Playwright end-to-end browser tests
└── src/
    ├── main.tsx            # Imports shared styles/tokens.css & game-ui.css
    ├── App.tsx             # Root state, keyboard shortcuts, 1s timer, persistence
    ├── style.css           # Sudoku grid, cell states, numpad, and modal styling
    ├── components/
    │   ├── Header.tsx      # Difficulty tabs, mistakes, pauseable timer, mute, New Game
    │   ├── SudokuBoard.tsx # 9x9 grid, 3x3 borders, peer/digit highlights, notes
    │   ├── ControlsPad.tsx # Undo, Erase, Notes, Hint, and 1–9 remaining counts
    │   └── GameModal.tsx   # PAUSED / WON / LOST overlays
    └── game/
        ├── constants.ts    # Board size (9), clue counts, max mistakes (3), storage key
        ├── types.ts        # CellState, GameState, GameStatus, SaveData
        ├── generator.ts    # Backtracking solver, solution counter, unique puzzle generator
        ├── engine.ts       # Pure state transitions (enterDigit, notes, hint, undo, pause)
        ├── audio.ts        # Procedural Web Audio API SFX
        ├── storage.ts      # Safe localStorage persistence (sudoku_v1)
        └── __tests__/
            └── engine.test.ts
```

## State Machine & Data Flow
- **`PLAYING`:** Timer ticks every second while `document.hidden === false`. Player inputs update `board`, `history`, and `mistakes`.
- **`PAUSED`:** Board digits/notes are hidden and `GameModal` displays Resume / New Game.
- **`WON`:** Triggered when all 81 cells match `solution`; records best time per difficulty and increments `gamesWon` in `sudoku_v1`.
- **`LOST`:** Triggered when `mistakes >= 3`.
