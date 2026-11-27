**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# 1024 — Sliding Number Puzzle

A responsive **1024** puzzle web game modeled on `1024game.org`, built with **React 18 + TypeScript + Vite**, shared `styles/` tokens, **Smart Hints**, **Tutorial** mode, **Undo**, and procedural Web Audio API sound effects.

## Features
- **Classic 1024 Progression:** Starts with `1` (90%) and `2` (10%) tiles and climbs through powers of two up to `1024` (with **Keep Going** to push past `2048+`).
- **Smooth Animations:** Ghost merged-tile transitions, new-tile pop-in, and floating `+score` popups.
- **Assist & Learning:** **Undo** (up to 10 steps), **Smart Hint** direction evaluator, **How to Play** modal, and a 3-step **Tutorial** mode.

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, dev server, testing, and build commands
- [architecture.md](./architecture.md) — Module layout, merge rules, hints, and tutorial
- [techstack.md](./techstack.md) — Languages, frameworks, testing, and deployment
- [user-guide.md](./user-guide.md) — Rules, controls, undo, tutorial, and settings
- [developer-guide.md](./developer-guide.md) — Extending/tuning 1024, running Vitest & Playwright, and building
