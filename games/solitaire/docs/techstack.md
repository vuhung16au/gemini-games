# Tech Stack — Solitaire

Aligned with [techstack.md](../../../techstacks/techstack.md) and [STYLE_GUIDE.md](../../../styles/STYLE_GUIDE.md):

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (strict) | `tsc --noEmit` verified |
| **UI Framework** | React 18 | Responsive 7-column card grid, modals, and drag-and-drop |
| **Graphics** | Inline SVG + Generated PNG/ICO | Crisp vector suits & card backs; generated `icons/` and HD/Full-HD `graphics/` |
| **Build Tool** | Vite (`base: './'`) | Serves standalone and inside the root unified MPA hub |
| **Styling** | Shared `styles/tokens.css` & `game-ui.css` | `HSC-QuestionBanks` palette (`softivory`, `deepcharcoal`, `bookpurple`, `lawpurple`, `warmstone`) |
| **Audio** | Web Audio API | Procedural card slide, foundation chime, and win fanfare |
| **Unit Testing** | Vitest | Pure Klondike rules, hints, tutorial, auto-complete (`npm test`) |
| **E2E Testing** | Playwright (Chromium) | Browser gameplay, Tutorial, How to Play, and persistence (`npm run test:e2e`) |
| **Deployment** | Local-first now; Cloudflare-ready later | Clean static `vite build` |
