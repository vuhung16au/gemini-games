# Dino Run — Tech Stack

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Choice | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 | Strict typing across physics, renderer, and UI |
| **2D Renderer** | HTML5 Canvas 2D | Crisp `640×220` pixel-art sprites and dual-theme rendering |
| **UI / HUD** | React 18 | Theme switcher, 404 status header, overlays, and modal |
| **Build Tool** | Vite 5 (`base: './'`) | Fast HMR and static `dist/` output |
| **Audio** | Web Audio API | Zero-asset retro jump/milestone/crash SFX |
| **Unit Testing** | Vitest | Deterministic jump/fast-fall, collision, Day/Night, and storage tests |
| **E2E Testing** | Playwright | Real browser gameplay, theme toggle, modals, and persistence tests |
