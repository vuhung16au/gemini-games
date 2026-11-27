# Tech Stack — Cozy Town Tycoon

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (strict) | `tsc --noEmit` verified |
| **UI Framework** | React 18 | HUD, tabbed management panel, and modals |
| **2D Renderer** | HTML5 Canvas 2D (pixelated) | Procedural pixel-art bakery scene & sprites |
| **Build Tool** | Vite (`base: './'`) | Serves standalone and inside the root unified MPA hub |
| **Audio** | Web Audio API | Zero external audio files |
| **Unit Testing** | Vitest | Economy formulas, scaling, offline 8h cap, hints (`npm test`) |
| **E2E Testing** | Playwright (Chromium) | Baking, Hint, Tutorial, Help modal, Mute persistence (`npm run test:e2e`) |
| **Deployment** | Local-first now; Cloudflare-ready later | Clean static `vite build` |
