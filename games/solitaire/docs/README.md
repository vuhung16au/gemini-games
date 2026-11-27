# Solitaire — Classic Klondike Card Game

A clean, responsive **Klondike Solitaire** web game modeled on `solitaired.com`, built with **React 18 + TypeScript + Vite**, custom crisp **SVG playing cards**, shared `styles/` tokens, **Smart Hints**, **Tutorial** mode, **Auto-Complete**, and procedural Web Audio API sound effects.

## Features
- **Turn 1 & Turn 3 Modes:** Switch between Draw 1 and Draw 3 (fanned waste pile) with full stock recycling.
- **Smooth Controls:** Click-to-move, double-click (or second click) quick-send to Foundation, HTML5 drag-and-drop, and keyboard shortcuts (`D`, `H`, `Z`, `P`).
- **Guided Learning:** Includes an in-game **How to Play** modal, a 3-step interactive **Tutorial** mode, and **Smart Hints**.
- **Zero External Assets:** Inline SVG suits/card backs, procedural Web Audio API SFX, and safe `localStorage` persistence (`solitaire_v1`).

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, dev server, testing, and build commands
- [architecture.md](./architecture.md) — Module layout, Klondike state machine, hints, and tutorial
- [techstack.md](./techstack.md) — Languages, frameworks, SVG graphics, testing, and deployment alignment
- [user-guide.md](./user-guide.md) — Rules, controls, Turn 1/3 scoring, tutorial, and settings
- [developer-guide.md](./developer-guide.md) — Extending/tuning rules, running Vitest & Playwright, and building
