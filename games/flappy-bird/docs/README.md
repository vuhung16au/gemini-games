# Flappy Bird — Web Arcade Edition

A frame-rate-independent **Flappy Bird** arcade web game built with **React 18 + TypeScript + Vite + HTML5 Canvas 2D**, shared `styles/` tokens, **Practice Tutorial** mode, **Flight-Corridor Hint**, and procedural Web Audio API sound effects.

## Features
- **Deterministic Fixed-Timestep Physics:** Identical trajectories across `60Hz`, `120Hz`, and `144Hz+` displays (`1/120 s` step with `0.05 s` tab-switch clamp).
- **Progressive Difficulty & Medals:** Pipe gap narrows from `145 px` down to `120 px`, awarding Bronze (`10+`), Silver (`20+`), Gold (`30+`), and Platinum (`40+`) medals.
- **Assist & Learning:** In-game **How to Play** modal, **Practice Tutorial** (wider `190 px` pipes), and **Hint** target corridor overlay.

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, dev server, testing, and build commands
- [architecture.md](./architecture.md) — Module layout, fixed-timestep loop, collision, and Canvas renderer
- [techstack.md](./techstack.md) — Languages, frameworks, rendering, testing, and deployment
- [user-guide.md](./user-guide.md) — Controls, medals, tutorial, hints, and settings
- [developer-guide.md](./developer-guide.md) — Tuning physics constants, running Vitest & Playwright, and building
