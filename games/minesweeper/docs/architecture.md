# Minesweeper — Architecture

- **Pure Simulation (`src/game/`):**
  - `types.ts` & `constants.ts`: `PRESET_CONFIGS` (`easy` 9×9/10, `medium` 16×16/40, `hard` 30×16/99) and `clampCustomConfig()` (`5–24` rows, `5–36` cols).
  - `engine.ts`: `createMinesweeperState`, first-click-safe `revealCell` with BFS flood-fill, `toggleFlag`, and `chordCell`.
  - `hints.ts` & `tutorial.ts`: Deterministic neighbor-deduction solver (`getMinesweeperHint`) and 3-step Tutorial.
  - `storage.ts`: Safe `localStorage` persistence under `minesweeper_v1` (`bestTimes`, `difficulty`, `muted`).
- **Web Audio (`src/audio/sfx.ts`):** Procedural reveal, flag, win, and explosion SFX.
- **React UI (`src/App.tsx`, `src/components/`):** Responsive CSS Grid board, LCD mine counter & timer, `CustomBoardModal`, and `HowToPlayModal`.
