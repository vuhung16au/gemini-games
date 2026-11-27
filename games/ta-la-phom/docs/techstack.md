# Tech Stack — Tá Lả (Phỏm)

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 (`strict: true`) | Type-safe game state, card modeling, and Phỏm solver |
| **UI Framework** | React 18 (`react`, `react-dom`) | Declarative HUD, table seats, cards, modals, and curtains |
| **Bundler / Dev** | Vite 5 (`base: './'`) | Fast local dev server and static Cloudflare-ready `dist/` build |
| **Styling** | Shared `tokens.css` & `game-ui.css` + CSS Grid/Flexbox + inline SVG | Zero external fonts/CDNs; crisp playing cards inside `100dvh` |
| **Audio** | Web Audio API (`SoundEngine`) | Procedural card draw, eat, discard, meld, and win SFX |
| **Persistence** | Browser `localStorage` (`ta_la_phom_v1`) | Safe `try/catch` storage for best score, stats, mode, and mute state |
| **Unit Testing** | Vitest 2 (`src/**/*.test.ts`) | Solver, engine, AI, hints, tutorial, and storage tests |
| **E2E Testing** | Playwright (`@playwright/test`, port `4185`) | Real browser verification of UI, modes, tutorial, and persistence |
