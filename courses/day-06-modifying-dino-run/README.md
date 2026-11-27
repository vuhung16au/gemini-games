# Day 6 — Modifying Your First Game (`Dino Run`)

**Estimated Time:** 1 Hour · **Previous:** [Day 5](../day-05-tech-stack-deep-dive/README.md) · **Next:** [Day 7](../day-07-building-a-board-game/README.md)

---

## Overview & Key Concepts
Before building a game from scratch, the fastest way to build intuition is **modifying a working game** using AI prompts. Today you will customize [`games/dino-run/`](../../games/dino-run/docs/README.md): changing its visual palette, tuning its physics speed, and adding a brand-new obstacle—all verified by Vitest and Playwright!

---

## Learning Objectives & Outcomes
By the end of Day 6, you will be able to:
1. Create a safe Git feature branch for experimenting on an existing game.
2. Prompt Google `agy` to modify rendering colors and simulation constants cleanly.
3. Add a new obstacle type across `types.ts`, `engine.ts`, `canvasRenderer.ts`, and `engine.test.ts`.
4. Verify your changes with `npm test`, `npm run test:e2e`, `tsc --noEmit`, and `npm run build`.

---

## Step-by-Step Guide

### 1. Create a Practice Git Branch
```bash
git checkout -b day-06-dino-mod
```

### 2. Inspect the Files You Will Modify
- [`games/dino-run/src/game/constants.ts`](../../games/dino-run/src/game/constants.ts) — Speed (`BASE_SPEED`, `MAX_SPEED`, `SPEED_INCREMENT`)
- [`games/dino-run/src/game/types.ts`](../../games/dino-run/src/game/types.ts) & [`engine.ts`](../../games/dino-run/src/game/engine.ts) — Obstacle spawning & collision
- [`games/dino-run/src/renderer/canvasRenderer.ts`](../../games/dino-run/src/renderer/canvasRenderer.ts) — Sky background color & obstacle drawing

### 3. Prompt `agy` to Customize Colors & Speed
Use the sample prompts below one at a time, then preview live with:
```bash
cd games/dino-run && npm run dev
```

### 4. Prompt `agy` to Add a New Obstacle + Unit Test
Ask `agy` to add a new obstacle (e.g., a rolling **Desert Boulder** or **Meteor**), draw it in `canvasRenderer.ts`, and add a Vitest unit test in `src/game/__tests__/engine.test.ts`.

### 5. Run the Full Verification Gate
```bash
cd games/dino-run
npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## Sample `agy` Prompts

**Prompt 1 — Change Background Color:**
```text
In games/dino-run/src/renderer/canvasRenderer.ts, change the Classic Desert daytime background to a warm sunset peach (#fce7d6) while keeping high contrast for the deep-purple T-Rex and score text. Verify with npm test and npm run build.
```

**Prompt 2 — Change Speed:**
```text
In games/dino-run/src/game/constants.ts, increase BASE_SPEED from 290 to 340 and SPEED_INCREMENT from 5.8 to 7.5 so the game feels snappier. Run npm test in games/dino-run to confirm all unit tests still pass.
```

**Prompt 3 — Add a New Obstacle:**
```text
/plan Add a new "boulder" obstacle to Classic mode in games/dino-run/ (types.ts, engine.ts, canvasRenderer.ts) that rolls along the ground slightly faster than cacti, and add a Vitest test for boulder collision in src/game/__tests__/engine.test.ts.
```

---

## Key Takeaways
- Small, focused prompts + immediate verification (`npm test`, `npm run dev`) make vibe coding fast and predictable.
- Always update unit tests when adding new gameplay entities.

---

## Exercises & Challenges
1. Add a **Double-Jump** or **Shield Power-Up** to `Dino Run` on your `day-06-dino-mod` branch.
2. **Challenge:** Add a new Playwright assertion in `games/dino-run/e2e/dino.spec.ts` that verifies your new feature works in Chromium, then commit your branch locally.
