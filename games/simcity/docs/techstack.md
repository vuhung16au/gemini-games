# SimCity 3D — Tech Stack

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Choice | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 | Strict typing across simulation, 3D scene, and UI |
| **3D Engine** | Vanilla Three.js (`three` + `@types/three`) | WebGL2 low-poly diorama rendering, raycasting, lighting, and camera |
| **UI / HUD** | React 18 | Accessible DOM overlays, modals, and tool dock |
| **Build Tool** | Vite 5 (`base: './'`) | Fast HMR and static `dist/` output ready for Cloudflare |
| **Audio** | Web Audio API | Zero-asset procedural sound effects |
| **Unit Testing** | Vitest | Deterministic simulation, BFS grid, economy, and storage tests |
| **E2E Testing** | Playwright | Real Chromium WebGL gameplay, HUD, and persistence verification |
