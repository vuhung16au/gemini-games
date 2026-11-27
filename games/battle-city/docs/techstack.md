# Battle City (1985) — Tech Stack

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Choice | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 | Strict typing across simulation, renderer, and UI |
| **2D Renderer** | HTML5 Canvas 2D | Crisp `416×416` pixel-art sprites and sub-tile terrain destruction |
| **UI / HUD** | React 18 | Title screen, Famicom sidebar, overlays, touch controls, and modals |
| **Build Tool** | Vite 5 (`base: './'`) | Fast HMR and static `dist/` output |
| **Audio** | Web Audio API | Zero-asset 8-bit chiptune SFX |
| **Unit Testing** | Vitest | Deterministic physics, collision, power-up, and storage tests |
| **E2E Testing** | Playwright | Real browser 1P/2P gameplay, modals, and persistence tests |
