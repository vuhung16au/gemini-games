---
name: create-game
description: Scaffold a new AGENTS.md-compliant game in games/<slug>/ with pure simulation, React HUD, How to Play, Tutorial, Hints, tests, docs, artwork, and unified hub registration. Use whenever creating a new game in gemini-games.
---

# Create a New Game in `gemini-games`

Follow this checklist whenever adding `games/<slug>/` so every game meets `AGENTS.md` on the first pass.

## 1. Pre-Flight Discovery
1. Pick a unique lowercase `<slug>` (e.g., `minesweeper`, `tic-tac-toe`).
2. Find the next unused Playwright port in `games/*/playwright.config.ts` (avoid duplicates; `scripts/check-compliance.mjs` fails on port collisions).
3. Choose the rendering tier from `techstacks/techstack.md`:
   - **Board / Puzzle / Card:** React + CSS Grid + inline `.svg`
   - **2D Real-Time Arcade:** HTML5 Canvas 2D + React HUD
   - **3D WebGL:** Vanilla Three.js + React HUD

## 2. Required Directory Structure
```text
games/<slug>/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── docs/
│   ├── README.md
│   ├── README.zh.md
│   ├── README.vi.md
│   ├── QUICKSTART.md
│   ├── architecture.md
│   ├── techstack.md
│   ├── user-guide.md
│   └── developer-guide.md
├── public/
│   ├── manifest.webmanifest
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── icon-32.png
│   │   ├── apple-touch-icon.png
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── graphics/
│       ├── cover-hd.png
│       └── cover-fullhd.png
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── style.css
│   ├── game/          # Pure simulation (zero DOM/Canvas imports)
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── engine.ts
│   │   ├── hints.ts
│   │   ├── tutorial.ts
│   │   ├── storage.ts
│   │   └── __tests__/engine.test.ts
│   ├── audio/sfx.ts   # Procedural Web Audio API (outside src/game/)
│   ├── renderer/      # Canvas 2D or Three.js (outside src/game/)
│   └── components/    # React HUD, HowToPlayModal, overlays
└── e2e/
    └── <slug>.spec.ts
```

## 3. Mandatory Mechanics & Styles
- Import `../../../styles/tokens.css` and `../../../styles/game-ui.css` in `src/main.tsx` before `./style.css`, and use `../../../styles/theme.ts` for Canvas/Three.js colors.
- Include **How to Play** modal, **Tutorial** mode, **Hints**, accessible **Mute** toggle (`e.stopPropagation()`), `visibilitychange` auto-pause, and safe `localStorage` persistence (`<game_name>_v1`).
- Keep zero external runtime CDN URLs in `index.html` or `src/`.
- Configure `vite.config.ts` with `base: './'` and `coverage` thresholds (`>= 70%` statements, branches, functions, lines on `src/game/**/*.ts`).
- Add `"lint": "eslint -c ../../eslint.config.mjs src"`, `"test": "vitest run --coverage"`, and `"test:fast": "vitest run"` to `package.json`.

## 4. Hub Registration & Multilingual Copy
1. Register the game in `src/registry/games.ts`.
2. Add `zh` and `vi` entries in `src/i18n/translations.ts`.
3. Update root `src/registry/__tests__/games.test.ts` game count & slug list, and add a launch check in `e2e/hub.spec.ts`.

## 5. Mandatory Verification Gate
Run after your final edit and report exact observed counts & coverage:
```bash
make lint GAME=<slug> && make typecheck GAME=<slug> && make test GAME=<slug> && make build GAME=<slug> && make test-e2e GAME=<slug>
make verify
```
