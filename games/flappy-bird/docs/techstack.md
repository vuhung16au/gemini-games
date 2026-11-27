# Tech Stack — Flappy Bird

Aligned with [techstack.md](../../../techstacks/techstack.md) and [STYLE_GUIDE.md](../../../styles/STYLE_GUIDE.md):

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (strict) | `tsc --noEmit` verified |
| **UI Framework** | React 18 | Overlays synced only on state/score changes |
| **2D Renderer** | HTML5 Canvas 2D (HiDPI) | Fixed-timestep `1/120 s` accumulator loop |
| **Build Tool** | Vite (`base: './'`) | Serves standalone and inside the root unified MPA hub |
| **Styling** | Shared `styles/tokens.css` & `game-ui.css` | `HSC-QuestionBanks` palette for UI chrome |
| **Audio** | Web Audio API | Zero external audio files |
| **Unit Testing** | Vitest | Determinism, circle-AABB collision, medals, storage (`npm test`) |
| **E2E Testing** | Playwright (Chromium) | Flap start, Help modal, Tutorial, Hint, Mute persistence (`npm run test:e2e`) |
| **Deployment** | Local-first now; Cloudflare-ready later | Clean static `vite build` |
