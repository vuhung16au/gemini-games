# Tech Stack — Tiến Lên Miền Nam

Aligned with [techstack.md](file:///Users/vuhung/Desktop/gemini-games/techstacks/techstack.md):

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 (`strict: true`) | Type-safe card rules, AI heuristics, and UI props |
| **UI Framework** | React 18.3 | Declarative table layout, overlays, and modals |
| **Build Tool** | Vite 5.4 (`base: './'`) | Fast HMR dev server and drop-in static bundle |
| **Styling** | Shared CSS (`tokens.css`, `game-ui.css`) + local `style.css` | Editorial palette, `100dvh` scrollbar-free table, inline SVG cards |
| **Audio** | Web Audio API (`src/game/audio.ts`) | Procedural card, bomb, pass, and win SFX with zero external files |
| **Persistence** | `window.localStorage` (`tien_len_mien_nam_v1`) | Safe `try/catch` persistence for wins, best score, mode, and mute |
| **Unit Testing** | Vitest 2.0 | Deterministic rules, Chặt Heo, Tới Trắng, AI, and storage tests |
| **E2E Testing** | Playwright 1.49 (`127.0.0.1:4187`) | Full browser verification for 2P–4P, Pass & Play curtain, Tutorial, and persistence |
