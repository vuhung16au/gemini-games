**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Sudoku — Classic Number Puzzle

A clean, responsive **9×9 Sudoku** web game modeled on `sudoku.com`, built with **React 18 + TypeScript + Vite**, shared `styles/` tokens, and procedural Web Audio API sound effects.

## Features
- **Uniquely Solvable Puzzles:** Every puzzle is generated via backtracking and verified for a unique solution across **Easy**, **Medium**, **Hard**, and **Expert** difficulties.
- **Full Assist Tools:** Pencil **Notes** (with automatic peer-note clearing), **Undo** (up to 50 steps), **Erase**, **Hint**, **Pause/Resume** timer, and **3-Mistake** limit.
- **Smart Highlighting:** Highlights the selected row, column, 3×3 box, and matching digits across the board.
- **Zero External Assets:** 100% offline-capable with synthesized Web Audio API SFX and `localStorage` persistence (`sudoku_v1`).

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, dev server, testing, and build commands
- [architecture.md](./architecture.md) — Module layout, state machine, generator/solver, and data flow
- [techstack.md](./techstack.md) — Languages, frameworks, testing, and deployment alignment
- [user-guide.md](./user-guide.md) — Rules, keyboard/touch controls, notes, hints, and settings
- [developer-guide.md](./developer-guide.md) — Extending/tuning Sudoku, running Vitest & Playwright, and building
