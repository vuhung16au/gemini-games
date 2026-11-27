# Checkers — Classic Board Game

A responsive **8×8 American Checkers** web game modeled on `247checkers.com`, built with **React 18 + TypeScript + Vite**, shared `styles/` tokens, an alpha-beta AI opponent, and procedural Web Audio API sound effects.

## Features
- **Game Modes:** Play **vs AI** (Easy, Medium, Hard) or **2 Players** locally on the same board.
- **Authentic American Checkers Rules:** Mandatory captures, forced multi-jump chains, crowning (Kings move diagonally forward and backward), and win detection by elimination or stalemate.
- **Helpful Controls:** Legal move & capture indicators, **Hint** move suggestion, **Undo**, **New Game**, and **Mute** toggle.
- **Zero External Assets:** Procedural Web Audio API SFX and safe `localStorage` persistence (`checkers_v1`).

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, dev server, testing, and build commands
- [architecture.md](./architecture.md) — Module layout, rules engine, AI minimax search, and data flow
- [techstack.md](./techstack.md) — Languages, frameworks, testing, and deployment alignment
- [user-guide.md](./user-guide.md) — Rules, controls, multi-jumps, kinging, and settings
- [developer-guide.md](./developer-guide.md) — Extending/tuning AI & rules, running Vitest & Playwright, and building
