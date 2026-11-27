# Gemini Games — Architecture

**Gemini Games** is a multi-entry Vite + React + TypeScript monorepo that serves a unified 4-column **Dashboard** at `/` and **15 self-contained 2D & 3D web games** under `games/<slug>/`.

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
  Browser["Browser / Player"] --> CF["Cloudflare Workers Static Assets (dist/)"]
  CF --> Hub["Root Unified Hub (index.html + src/App.tsx)"]
  Hub --> Dash["Dashboard.tsx (Search, Category Tabs, Favorites, Recents, Light/Dark Theme)"]
  Hub --> Player["Iframe Game Player (#/play/slug)"]
  Player --> Games["15 Standalone Games (games/*/index.html)"]
  Dash -->|Persists gemini_games_hub_v1| LS["Browser localStorage"]
  Games -->|Persists game_name_v1| LS
```

- **Unified Hub (`src/`):** Manages game discovery ([`src/registry/games.ts`](../src/registry/games.ts)), hub preferences ([`src/registry/hubStorage.ts`](../src/registry/hubStorage.ts)), and embeds each selected game cleanly inside an isolated `<iframe>` route (`#/play/<slug>`).
- **Standalone Games (`games/<slug>/`):** Every game is a complete Vite sub-app with its own `index.html`, `package.json`, `docs/`, `public/` assets, Vitest suite, and Playwright E2E suite.

---

## 2. Per-Game Module Architecture

Every game separates pure deterministic simulation from rendering, audio, persistence, and React UI overlays:

```mermaid
flowchart LR
  UI["React HUD & Modals (src/components/, src/App.tsx)"] -->|User Input & Commands| Sim["Pure Simulation (src/game/)"]
  Sim -->|Read-Only State Snapshot| UI
  Sim -->|Frame State| Render["Renderer (Canvas 2D / Three.js / CSS-SVG Cards)"]
  Sim -->|Sound Events| Audio["Web Audio API SFX (sfx.ts / audio.ts)"]
  Sim -->|Save / Load| Store["Safe localStorage Wrapper (storage.ts)"]
```

- **Pure Simulation (`src/game/`):** Framework-free TypeScript rules, physics, AI opponents, tutorial state, and hints—tested deterministically in Node via Vitest.
- **Rendering Layer:** Uses HTML5 Canvas 2D (`battle-city`, `dino-run`, `flappy-bird`, `super-mario-bros`, `tetris`, `cozy-town-tycoon`), Vanilla Three.js (`simcity`), or CSS/SVG (`1024`, `checkers`, `sudoku`, `solitaire`, `ta-la-phom`, `tan-do`, `tien-len-mien-bac`, `tien-len-mien-nam`).
- **Shared Design System (`styles/`):** All games import [`styles/tokens.css`](../styles/tokens.css), [`styles/game-ui.css`](../styles/game-ui.css), and [`styles/theme.ts`](../styles/theme.ts).

---

## 3. Multi-Entry Build & Asset Pipeline

```mermaid
flowchart LR
  Vite["vite.config.ts (base: './')"] --> Discover["discoverGameSlugs() scans games/*/index.html"]
  Discover --> Rollup["Multi-Entry Rollup Build (main + 15 game entries)"]
  Vite --> Plugin["gamePublicAssetsPlugin()"]
  Plugin -->|Dev Server| DevServe["Serves games/slug/public/* at /games/slug/*"]
  Plugin -->|Production Build| CopyDist["Copies public/* into dist/games/slug/"]
  Rollup --> Dist["dist/ (Static Output)"]
  CopyDist --> Dist
  Dist --> Wrangler["wrangler.jsonc -> Cloudflare Workers"]
```

- During `npm run dev`, [`vite.config.ts`](../vite.config.ts) mounts a middleware serving each game's `public/` directory at `/games/<slug>/*`.
- During `npm run build`, Rollup bundles `index.html` plus all 15 `games/*/index.html` entries into `dist/`, and `closeBundle()` copies every game's `public/` icons, manifests, and HD/Full-HD cover graphics into `dist/games/<slug>/`.
