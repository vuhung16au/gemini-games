# Tech Stack — Tetris

Aligned with [techstack.md](../../../techstacks/techstack.md) and [STYLE_GUIDE.md](../../../styles/STYLE_GUIDE.md):

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (strict) | `tsc --noEmit` verified |
| **UI Framework** | React 18 | HUD, Hold/Next previews, Touch pad, and modals |
| **2D Renderer** | HTML5 Canvas 2D (HiDPI) | Fixed-timestep `1/120 s` accumulator loop |
| **Graphics** | Inline SVG + Generated PNG/ICO | Crisp SVG Hold/Next previews; generated `icons/` and HD/Full-HD `graphics/` |
| **Build Tool** | Vite (`base: './'`) | Serves standalone and inside the root unified MPA hub |
| **Styling** | Shared `styles/tokens.css`, `game-ui.css`, `theme.ts` | `HSC-QuestionBanks` palette (`softivory`, `deepcharcoal`, `bookpurple`, `lawpurple`, `warmstone`) |
| **Audio** | Web Audio API | Zero external audio files |
| **Unit Testing** | Vitest | 7-bag, SRS kicks, scoring, hints, tutorial (`npm test`) |
| **E2E Testing** | Playwright (Chromium) | Real browser gameplay, Tutorial, How to Play, Mute persistence (`npm run test:e2e`) |
| **Deployment** | Local-first now; Cloudflare-ready later | Clean static `vite build` |
