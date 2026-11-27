# 2. Tech Stack & Deployment Policy

Follow [techstack.md](../../techstacks/techstack.md):

- **Shared Foundation:** TypeScript + Vite + React (UI/HUD overlays) + Vitest (unit tests) + Playwright (E2E browser tests).
- **2D Games:** HTML5 Canvas 2D (simple arcade/sim), Phaser 3, or PixiJS v8.
- **3D Games:** Three.js (Vanilla Three.js + TypeScript or React Three Fiber + `@react-three/drei`) + Rapier 3D.
- **Local-First Now, Cloud-Ready:** Games are developed, tested, and played **100% offline** locally (`vite dev` / `vite preview`). Keep `vite.config.ts` (`base: './'`) and client code as a clean static `vite build` (`dist/`) so publishing to **Cloudflare Workers Static Assets** (default) or **Vercel** is drop-in.
