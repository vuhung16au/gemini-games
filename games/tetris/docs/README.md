# Tetris — Classic Falling Blocks Arcade

A Guideline-accurate **Tetris** web game modeled on `freetetris.org`, built with **React 18 + TypeScript + Vite + HTML5 Canvas 2D**, shared `styles/` tokens, **SRS rotation with wall kicks**, **7-bag randomizer**, **Hold**, **Ghost piece**, **Smart Hints**, **Tutorial** mode, and procedural Web Audio API sound effects.

## Features
- **Guideline Mechanics:** 10×20 board, 7-bag randomizer, 3-piece Next queue, Hold slot (once per drop), Ghost piece preview, SRS rotation with wall kicks, and 450 ms lock delay.
- **Learning & Assist Tools:** In-game **How to Play** modal, 3-step interactive **Tutorial**, and **Smart Placement Hint** overlay.
- **Zero External Assets:** HiDPI Canvas 2D blocks, inline SVG piece previews, procedural Web Audio API SFX, and safe `localStorage` persistence (`tetris_v1`).

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, dev server, testing, and build commands
- [architecture.md](./architecture.md) — Module layout, fixed-timestep loop, SRS kicks, and hints
- [techstack.md](./techstack.md) — Languages, frameworks, rendering, testing, and deployment
- [user-guide.md](./user-guide.md) — Controls, scoring, tutorial, and settings
- [developer-guide.md](./developer-guide.md) — Extending/tuning Tetris, running Vitest & Playwright, and building
