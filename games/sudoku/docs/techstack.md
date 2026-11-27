# Tech Stack — Sudoku

Aligned with [techstack.md](../../../techstacks/techstack.md) and [STYLE_GUIDE.md](../../../styles/STYLE_GUIDE.md):

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (strict) | `tsc --noEmit` verified |
| **UI Framework** | React 18 | DOM-based 9×9 grid, number pad, and modals |
| **Build Tool** | Vite (`base: './'`) | Instant HMR locally; static `dist/` output |
| **Styling** | Shared `styles/tokens.css` & `game-ui.css` + CSS Grid | `HSC-QuestionBanks` palette (`softivory`, `deepcharcoal`, `bookpurple`, `bookred`, `warmstone`) |
| **Audio** | Web Audio API | Zero external audio files |
| **Unit Testing** | Vitest | Pure generator, solver, and engine tests (`npm test`) |
| **E2E Testing** | Playwright (Chromium) | Real browser UI & persistence tests (`npm run test:e2e`) |
| **Deployment** | Local-first now; Cloudflare-ready later | Clean static `vite build` |
