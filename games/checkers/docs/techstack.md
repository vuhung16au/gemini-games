# Tech Stack — Checkers

Aligned with [techstack.md](../../../techstacks/techstack.md) and [STYLE_GUIDE.md](../../../styles/STYLE_GUIDE.md):

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (strict) | `tsc --noEmit` verified |
| **UI Framework** | React 18 | Accessible 8×8 CSS Grid board, controls, and overlays |
| **Build Tool** | Vite (`base: './'`) | Instant HMR locally; static `dist/` output |
| **Styling** | Shared `styles/tokens.css` & `game-ui.css` | `HSC-QuestionBanks` palette (`softivory`, `deepcharcoal`, `bookpurple`, `lawpurple`, `bookred`, `warmstone`) |
| **Audio** | Web Audio API | Zero external audio files |
| **Unit Testing** | Vitest | Pure rules, multi-jump, crowning, and AI tests (`npm test`) |
| **E2E Testing** | Playwright (Chromium) | Real browser gameplay, AI response, undo, and persistence (`npm run test:e2e`) |
| **Deployment** | Local-first now; Cloudflare-ready later | Clean static `vite build` |
