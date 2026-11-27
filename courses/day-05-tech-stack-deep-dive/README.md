**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Day 5 — Tech Stack Deep Dive

**Estimated Time:** 1 Hour · **Previous:** [Day 4](../day-04-dev-tools-and-ai-agents/README.md) · **Next:** [Day 6](../day-06-modifying-dino-run/README.md)

---

## Overview & Key Concepts
Today you will learn *why* this repository chooses each technology in [`docs/techstack.md`](../../docs/techstack.md) and [`techstacks/techstack.md`](../../techstacks/techstack.md), and when to pick **CSS/SVG**, **HTML5 Canvas 2D**, or **Three.js**.

| Rendering Layer | Best For | Examples in This Repo |
| :--- | :--- | :--- |
| **CSS Grid + SVG + React** | Board, puzzle, and card games | `1024`, `checkers`, `sudoku`, `solitaire`, `ta-la-phom`, `tan-do` |
| **HTML5 Canvas 2D** | Fast 60fps arcade, platformers, pixel art | `dino-run`, `flappy-bird`, `tetris`, `battle-city`, `super-mario-bros` |
| **Vanilla Three.js (WebGL)** | 3D worlds, cameras, lighting, raycasting | `simcity` |

---

## Learning Objectives & Outcomes
By the end of Day 5, you will be able to:
1. Choose the right rendering layer (CSS/SVG vs. Canvas 2D vs. Three.js) for any new game idea.
2. Explain the role of **TypeScript**, **Vite**, **React**, **Web Audio API**, **Vitest**, and **Playwright**.
3. Read and understand a minimal Canvas 2D draw loop and Three.js scene setup.

---

## Step-by-Step Guide

### 1. Core Foundation
- **TypeScript (`strict: true`):** Catches invalid state, coordinates, and missing fields at compile time (`npx tsc --noEmit`).
- **Vite (`base: './'`):** Instant hot reload during `npm run dev` and clean static `dist/` bundles.
- **React 18:** Renders accessible HUDs, modals (`HowToPlayModal`), buttons, and overlays on top of your game canvas.

### 2. Compare Three Real Renderers in This Repo
Open one file from each rendering tier:
1. **CSS/SVG:** [`games/checkers/src/components/CheckersBoard.tsx`](../../games/checkers/src/components/CheckersBoard.tsx)
2. **HTML5 Canvas 2D:** [`games/battle-city/src/renderer/canvasRenderer.ts`](../../games/battle-city/src/renderer/canvasRenderer.ts)
3. **Three.js 3D:** [`games/simcity/src/renderer/CityScene.ts`](../../games/simcity/src/renderer/CityScene.ts)

### 3. Testing Stack
- **Vitest:** Runs pure TypeScript unit tests in Node (`src/**/*.test.ts`).
- **Playwright:** Launches real Chromium, clicks buttons, presses keys, verifies zero console errors, and checks `localStorage` persistence (`e2e/*.spec.ts`).

---

## Sample `agy` Prompts
```text
Compare how games/dino-run/src/renderer/canvasRenderer.ts (Canvas 2D) and games/simcity/src/renderer/CityScene.ts (Three.js) handle the animation loop, resizing, and cleanup on unmount.
```

---

## Key Takeaways
- Use the simplest rendering tool that fits your game's mechanics: CSS/SVG for boards/cards, Canvas 2D for 2D action, Three.js for 3D worlds.
- Always keep React for HUD/menus and procedural Web Audio API for zero-asset sound effects.

---

## Exercises & Challenges
1. Read [`docs/techstack.md`](../../docs/techstack.md) and list 3 reasons why this project avoids external runtime CDNs.
2. **Challenge:** Open [`styles/tokens.css`](../../styles/tokens.css) and [`styles/theme.ts`](../../styles/theme.ts) to see how CSS variables and Canvas/Three.js colors stay synchronized.
