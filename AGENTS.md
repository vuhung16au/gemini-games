# AGENTS.md — Gemini Games Repository Guidelines

This file defines the mandatory structure, documentation, tech stack, and style/behavior conventions for all game projects in `games/*`.

---

## 1. Mandatory `docs/` Folder per Game

Every game project/folder (`games/<game-name>/`) **must** include a `docs/` folder containing the following documentation files:

```text
games/<game-name>/
├── docs/
│   ├── README.md           # Overview, features, controls summary, and doc index
│   ├── QUICKSTART.md       # Local setup, dev server, test, and build commands
│   ├── architecture.md     # Module structure, game loop/state machine, rendering & persistence
│   ├── techstack.md        # Stack & dependencies used, aligned with /techstacks/techstack.md
│   ├── user-guide.md       # Rules, desktop/mobile controls, scoring/progression, settings
│   └── developer-guide.md  # Project layout, tuning/extending mechanics, testing & build workflow
└── ...
```

### Required Contents
- **`docs/README.md`**: High-level summary of the game, key features, and links to all documents in `docs/`.
- **`docs/QUICKSTART.md`**: Exact commands to run locally (`npm install`, `npm run dev`, `npm test`, `npm run build`, `npm run preview`).
- **`docs/architecture.md`**: Separation between pure simulation (`src/game/`), renderer/audio/storage, and React UI overlays (`src/components/`), plus state transitions and data flow.
- **`docs/techstack.md`**: Explicit list of languages, frameworks, rendering/physics libraries, audio, and test tools used, referencing [techstack.md](file:///Users/vuhung/Desktop/gemini-games/techstacks/techstack.md).
- **`docs/user-guide.md`**: Player-facing instructions—objective, keyboard/mouse/touch controls, scoring/win/loss rules, and mute/persistence behavior.
- **`docs/developer-guide.md`**: How to modify constants/tuning parameters, run and write Vitest unit tests and Playwright E2E tests, type-check (`tsc --noEmit`), and produce a static `vite build` (`dist/`).

---

## 2. Tech Stack & Deployment Policy

Follow [techstack.md](file:///Users/vuhung/Desktop/gemini-games/techstacks/techstack.md):
- **Shared Foundation:** TypeScript + Vite + React (UI/HUD overlays) + Vitest (unit tests) + Playwright (E2E browser tests).
- **2D Games:** HTML5 Canvas 2D (simple arcade/sim), Phaser 3, or PixiJS v8.
- **3D Games:** Three.js (Vanilla Three.js + TypeScript or React Three Fiber + `@react-three/drei`) + Rapier 3D.
- **Local-First Now, Cloudflare Later:** Games are developed, tested, and played locally (`vite dev` / `vite preview`). Do **not** configure or deploy to Cloudflare yet, but keep `vite.config.ts` (`base: './'`) and client code as a clean static `vite build` so publishing to Cloudflare later is drop-in.

---

## 3. Shared Styles & Behavior

Follow [STYLE_GUIDE.md](file:///Users/vuhung/Desktop/gemini-games/styles/STYLE_GUIDE.md):
- Import [tokens.css](file:///Users/vuhung/Desktop/gemini-games/styles/tokens.css) and [game-ui.css](file:///Users/vuhung/Desktop/gemini-games/styles/game-ui.css) in `src/main.tsx` before local styles, and use [theme.ts](file:///Users/vuhung/Desktop/gemini-games/styles/theme.ts) for Canvas/3D colors (`softivory`, `deepcharcoal`, `bookpurple`, `lawpurple`, `bookred`, `warmstone`).
- Keep zero external network/CDN calls or external image/audio files unless explicitly requested (local static brand icons and covers in `public/icons/` and `public/graphics/` are required).
- Ensure keyboard (`preventDefault` on `Space`/`Arrow*`, ignore `e.repeat` and modifier keys), touch/pointer (`touch-action`, `user-select: none`), `visibilitychange` handling, accessible Mute toggle (`e.stopPropagation()`), and safe `localStorage` persistence (`<game_name>_v1`).
- **In-Game "How to Play", Tutorial Mode & Hints:**
  - Every game must provide an in-game **"How to Play"** modal/panel so players can read the rules, controls, and scoring directly inside the UI.
  - Each game should also include a **"Tutorial"** mode (guided walkthrough or practice step) and **"Hints"** (suggested move/action or contextual tip) whenever feasible for the game's mechanics.
- **Multilingual Support (`en`, `zh`, `vi`):**
  - This project supports **English (`en`)**, **Chinese (`zh`)**, and **Vietnamese (`vi`)**.
  - **All `README.md` files** (the root `README.md`, `courses/README.md`, `courses/day-*/README.md`, and every `games/<game-name>/docs/README.md`) must support all 3 languages via `README.md` (English), `README.zh.md` (中文), and `README.vi.md` (Tiếng Việt), with a language switcher at the top of each file.
  - **Webapp Interface:** The Gemini Games Hub (`src/`) and game interfaces must support switching between English (`en`), Chinese (`zh`), and Vietnamese (`vi`) with `localStorage` persistence.
  - **Courses (`courses/`):** All course index and daily lesson folders (`courses/README.md` and `courses/day-*/`) must support all 3 languages (`README.md`, `README.zh.md`, `README.vi.md`).

---

## 4. Mandatory Game Title, Icons & Graphics Assets

Every game project (`games/<game-name>/`) **must** have its own distinct **game title**, **multi-size icons**, and **HD / Full-HD graphics** inside `public/`:

```text
games/<game-name>/public/
├── manifest.webmanifest
├── icons/
│   ├── favicon.ico            # 32x32 ICO browser favicon
│   ├── icon-32.png            # 32x32 PNG favicon
│   ├── apple-touch-icon.png   # 180x180 iOS home screen icon
│   ├── icon-192.png           # 192x192 PWA icon
│   └── icon-512.png           # 512x512 PWA / store icon
└── graphics/
    ├── cover-hd.png           # 1280x720 (HD 16:9)
    └── cover-fullhd.png       # 1920x1080 (Full HD 16:9)
```

- **`index.html`:** Include a distinct `<title>`, `<meta name="description">`, `<meta name="theme-color" content="#3c1053" />`, `<link rel="icon" href="./icons/favicon.ico" sizes="any" />`, `<link rel="icon" type="image/png" sizes="32x32" href="./icons/icon-32.png" />`, `<link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon.png" />`, `<link rel="manifest" href="./manifest.webmanifest" />`, and Open Graph tags (`og:title`, `og:description`, `og:image: ./graphics/cover-hd.png`).
- **In-Game Emblem:** Display `./icons/icon-192.png` as a clean rounded emblem beside or above the game title in the header or start screen.
- **Creating Original Graphics:** Always create our own original game graphics (never download or hotlink third-party assets):
  - **Prefer `.svg` format** for crisp, lightweight, scalable vector icons, sprites, and UI graphics whenever suitable.
  - **Ask `agy` (Antigravity / `image-generator`)** to generate custom raster images or cover artwork when rich illustrated graphics are needed, then derive the required `icons/` and `graphics/` sizes (`favicon.ico`, `icon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `cover-hd.png`, `cover-fullhd.png`).
- **Unified Hub Registration:** Use relative `<script type="module" src="./src/main.tsx"></script>` in `games/<game-name>/index.html` and add the game entry to [games.ts](file:///Users/vuhung/Desktop/gemini-games/src/registry/games.ts) so it is served automatically in the root 4-column Dashboard (`npm run dev` at the repository root).

---

## 5. Mandatory Testing (Unit + E2E) & Verification Gate

Every game project (`games/<game-name>/`) **must** include both automated test suites:
- **Unit Tests (Vitest):** Cover pure simulation logic, physics/collision/economy rules, state transitions, and safe `localStorage` persistence (`npm test`).
- **E2E Tests (Playwright):** Cover real browser gameplay and UI flows—clean page load with zero console/page errors, primary input controls (keyboard/pointer), HUD/score updates, state transitions (start/play/end/restart), mute toggle, and persistence across reloads (`npm run test:e2e` / `npx playwright test`).

Before considering any game implementation or update complete, run and pass:
1. `make lint GAME=<slug>` (ESLint code quality & React Hooks check)
2. `make typecheck GAME=<slug>` (strict TypeScript compilation `tsc --noEmit`)
3. `make test GAME=<slug>` (Vitest unit tests with `>= 70%` statements, branches, functions, and lines coverage)
4. `make build GAME=<slug>` (clean Vite production build)
5. `make test-e2e GAME=<slug>` (Playwright E2E tests)
6. `make verify` at the repository root (runs `lint`, `typecheck`, `test` with `>= 70%` coverage, `build`, `test-e2e`, and `check-docs` / `scripts/check-compliance.mjs` across all games, docs, multilingual READMEs, icons/covers, `index.html`, `games.ts`, `translations.ts`, unique Playwright ports, zero external CDNs, and blank `.github/workflows/`).

> **Mandatory AI Agent Rule:** Never report a game creation or modification task as complete until the commands above exit `0` after the **final** edit, and always cite the exact observed test counts and coverage percentages from the final run.
