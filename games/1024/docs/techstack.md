# Tech Stack — 1024

Aligned with [techstack.md](../../../techstacks/techstack.md) and [STYLE_GUIDE.md](../../../styles/STYLE_GUIDE.md):

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (strict) | `tsc --noEmit` verified |
| **UI Framework** | React 18 | CSS-animated 4×4 tile grid, overlays, and modals |
| **Build Tool** | Vite (`base: './'`) | Serves standalone and inside the root unified MPA hub |
| **Styling** | Shared `styles/tokens.css` & `game-ui.css` | `HSC-QuestionBanks` palette (`softivory`, `deepcharcoal`, `bookpurple`, `warmstone`) |
| **Audio** | Web Audio API | Zero external audio files |
| **Unit Testing** | Vitest | Sliding, single-merge, win/loss, hints, tutorial (`npm test`) |
| **E2E Testing** | Playwright (Chromium) | Real browser moves, undo, tutorial, help modal, mute persistence (`npm run test:e2e`) |
| **Deployment** | Local-first now; Cloudflare-ready later | Clean static `vite build` |
