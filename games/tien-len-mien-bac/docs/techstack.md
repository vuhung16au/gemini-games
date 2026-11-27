# Tech Stack — Tiến Lên Miền Bắc

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 (`strict: true`) | Compile-time safety for card combos, rules, and state transitions |
| **UI Framework** | React 18.3 | Declarative card table, modals, overlays, and responsive HUD |
| **Styling & Cards** | Shared CSS tokens (`tokens.css`, `game-ui.css`) + CSS/SVG | Crisp vector suits (`♠ ♣ ♦ ♥`), zero external fonts/CDNs, `100dvh` fit |
| **Build Tool** | Vite 5.4 (`base: './'`) | Fast HMR dev server and clean static `dist/` bundle |
| **Audio** | Procedural Web Audio API | Zero-asset SFX for card selection, plays, passes, Chặt Heo, and victory |
| **Persistence** | `localStorage` (`tien_len_mien_bac_v1`) | Safe `try/catch` storage for wins, scores, mute, and mode preferences |
| **Unit Testing** | Vitest 2.0 | Deterministic tests for Northern rules, AI, hints, tutorial, and storage |
| **E2E Testing** | Playwright (`@playwright/test` 1.49) | Headless Chromium verification of UI flows, viewport fit, and persistence |
