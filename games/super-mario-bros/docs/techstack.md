# Super Mario Bros. (1985) — Tech Stack

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Choice | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 | Strict typing across physics, level schemas, renderer, and UI |
| **2D Renderer** | HTML5 Canvas 2D | Crisp `512×384` pixel-art sprites and parallax worlds |
| **UI / HUD** | React 18 | NES-style top HUD, level select, modals, and mobile touch controls |
| **Build Tool** | Vite 5 (`base: './'`) | Fast HMR and static `dist/` output |
| **Audio** | Web Audio API | Zero-asset 8-bit chiptune SFX |
| **Unit Testing** | Vitest | Deterministic physics, power-ups, enemies, 1-4 Axe, and storage tests |
| **E2E Testing** | Playwright | Real browser gameplay, level select, modals, and persistence tests |
