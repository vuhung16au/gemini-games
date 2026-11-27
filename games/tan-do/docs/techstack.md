# Tech Stack — Tấn Đỡ (Bài Tấn)

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 (`strict: true`) | Compile-time safety for card state, bout phases, and UI props |
| **UI Framework** | React 18 | Accessible DOM card table, Privacy Curtain, and bilingual HUD |
| **Build Tool** | Vite 5 (`base: './'`) | Fast local HMR and portable static `dist/` production bundle |
| **Styling** | Shared `tokens.css` & `game-ui.css` + crisp SVG/CSS cards | Zero external fonts, zero CDN calls, `100dvh` scrollbar-free layout |
| **Audio** | Web Audio API (`SoundEngine`) | Procedural attack, defend, clear, take, and win SFX |
| **Persistence** | Browser `localStorage` (`tan_do_v1`) | Safe `try/catch` storage for wins, score, mode, player count, and mute |
| **Unit Testing** | Vitest 2 | Deterministic verification of Bài Tấn rules, AI, hints, and storage |
| **E2E Testing** | Playwright (`@playwright/test`) | Chromium verification on port `4188` across AI & Pass-and-Play flows |
