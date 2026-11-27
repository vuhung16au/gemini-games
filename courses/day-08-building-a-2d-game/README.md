# Day 8 — Building Your First 2D Canvas Game from Scratch

**Estimated Time:** 1 Hour · **Previous:** [Day 7](../day-07-building-a-board-game/README.md) · **Next:** [Day 9](../day-09-building-a-3d-game/README.md)

---

## Overview & Key Concepts
Today you will step up from turn-based boards to a **real-time 60fps HTML5 Canvas 2D game** from scratch (e.g., **Breakout** or **Snake** in `games/breakout/`, Playwright port **`4190`**).

Key 2D real-time patterns you will apply:
- **Clamped `dt` Game Loop:** `const dt = Math.min(0.05, (now - last) / 1000)` + `visibilitychange` auto-pause.
- **Collision Math:** Circle-vs-AABB bounce (for Breakout) or grid occupancy (for Snake) in pure TypeScript `src/game/engine.ts`.
- **Responsive Input:** Keyboard (`Arrows` / `WASD`, `Space`, `preventDefault()`) + Pointer/Touch controls (`touch-action: none`).

---

## Learning Objectives & Outcomes
By the end of Day 8, you will be able to:
1. Architect a real-time 2D Canvas game with decoupled `src/game/` simulation and `src/renderer/canvasRenderer.ts`.
2. Add procedural Web Audio API sound effects (bounce, brick break, combo chime, game over).
3. Test real-time Canvas gameplay deterministically with Vitest and in Chromium with Playwright.

---

## Step-by-Step Guide

### 1. Create a Feature Branch
```bash
git checkout -b day-08-2d-breakout
```

### 2. Study an Existing 2D Canvas Reference in This Repo
Skim [`games/battle-city/docs/architecture.md`](../../games/battle-city/docs/architecture.md) or [`games/tetris/docs/architecture.md`](../../games/tetris/docs/architecture.md) to see how `requestAnimationFrame`, input refs, and React HUD overlays work together without causing 60fps React re-render lag.

### 3. Prompt `agy` with `/plan` to Build Your 2D Game
Use the sample prompt below, review the plan (collision math, levels, port `4190`), and approve execution.

### 4. Verify Standalone & Unified Hub
```bash
cd games/breakout && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
cd ../.. && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## Sample `agy` Prompts

```text
/plan Build a new 2D HTML5 Canvas game "Breakout" in games/breakout/ following AGENTS.md completely:
- Pure simulation in src/game/ (paddle movement, circle-vs-AABB brick & paddle angle bounce, 5 brick layouts, power-ups: Wide Paddle & Multi-Ball, lives, combo scoring, localStorage breakout_v1)
- Crisp Canvas 2D renderer using styles/theme.ts colors, procedural Web Audio SFX + Mute
- Keyboard (Arrows/A-D/Space) + pointer/touch drag controls, visibilitychange auto-pause
- How to Play modal, 3-step Tutorial, live Hint tip, original icons & covers in public/, all 6 docs in docs/
- Vitest unit tests + Playwright E2E tests on dedicated port 4190
- Register in src/registry/games.ts (category: Arcade) and update root tests
```

---

## Key Takeaways
- Keep per-frame physics inside `useRef` + `requestAnimationFrame`, syncing only HUD counters (score, lives, level) to React state.
- Pure collision functions in `src/game/` let Vitest verify tricky bounce angles without ever opening a browser.

---

## Exercises & Challenges
1. Play through Level 1 and Level 2 on both desktop keyboard and mobile touch viewport (using browser DevTools responsive mode).
2. **Challenge:** Ask `agy` to add a **Boss Brick** (requires 3 hits, cracks visually after each hit) plus a unit test verifying 3-hit destruction.
