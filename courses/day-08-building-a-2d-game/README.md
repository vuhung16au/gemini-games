**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Day 8 — Building Your First 2D Arcade Game from Scratch

**Estimated Time:** 1 Hour · **Previous:** [Day 7](../day-07-building-a-board-game/README.md) · **Next:** [Day 9](../day-09-building-a-3d-game/README.md)

---

## Overview & Key Concepts
Today you will step up from turn-based boards to a **real-time 60fps 2D Canvas arcade game** from scratch (such as **Breakout** or **Snake**).

Key 2D arcade ideas you will ask `agy` to handle:
- **Smooth Motion & Auto-Pause:** The game runs smoothly at 60 frames per second and pauses automatically when you switch tabs.
- **Bouncing & Collisions:** The ball bounces realistically off bricks and the paddle based on where it hits.
- **Desktop + Touch Controls:** Works smoothly with both keyboard (`Arrows`/`WASD`/`Space`) and mouse/touch dragging.

---

## Learning Objectives & Outcomes
By the end of Day 8, you will be able to:
1. Describe a real-time 2D arcade game (levels, power-ups, controls, sound effects) in plain English to `agy`.
2. Verify both physics rules (`make test GAME=breakout`) and live browser play (`make test-e2e GAME=breakout`).

---

## Step-by-Step Guide

### 1. Create a Feature Branch
```bash
git checkout -b day-08-2d-breakout
```

### 2. Prompt `agy` with `/plan` to Build Your 2D Arcade Game
Paste the sample prompt below, review `agy`'s plan, and approve execution.

### 3. Verify Standalone & Unified Hub
```bash
make verify GAME=breakout
make verify
```

---

## Sample `agy` Prompts

```text
/plan Build a new 2D arcade game "Breakout" in games/breakout/ following AGENTS.md completely:
- Smooth paddle & bouncing ball physics, 5 brick layouts, power-ups (Wide Paddle & Multi-Ball), lives, and combo scoring
- Crisp 2D Canvas graphics matching the Gemini Games theme, plus retro Web Audio SFX & Mute toggle
- Works with Keyboard (Arrows/A-D/Space) and mouse/touch drag, and auto-pauses when switching tabs
- How to Play modal, 3-step Tutorial, live Hint tip, original icons & covers, multilingual READMEs, and >=70% test coverage
```

---

## Key Takeaways
- You describe the *arcade feel* (combos, power-ups, responsive touch/keyboard), and `agy` uses the repo's Canvas 2D patterns automatically.
- `make verify GAME=<slug>` ensures physics, UI, docs, and browser tests all pass.

---

## Exercises & Challenges (Prompt-Only Vibe Coding)

Use Google `agy` with the sample prompts below—no manual coding required:

1. **Understand the Project:** Ask `agy` to explain how 2D arcade games like `Battle City` or `Breakout` stay smooth at 60fps.
   ```text
   Explain in plain English how 2D Canvas games in this project keep movement smooth at 60fps and handle keyboard + touch controls without scrolling the page.
   ```
2. **Improve a Feature:** Ask `agy` to tune paddle bounce angles and add escalating combo sound pitches.
   ```text
   In Breakout, refine paddle edge-hit bounce angles so corner shots feel snappier, and raise the Web Audio chime pitch as the player's brick-break combo grows. Verify with make verify GAME=breakout.
   ```
3. **Implement a New Feature:** Ask `agy` to add a **3-Hit Boss Brick** that shows cracks after each hit.
   ```text
   /plan Add a "Boss Brick" (takes 3 hits, shows visual cracks after each hit, awards bonus points) to Breakout with automated unit tests. Verify with make verify GAME=breakout.
   ```
4. **Improve Tests / Docs:** Ask `agy` to add mobile touch-drag browser tests and update `Breakout`'s user guide.
   ```text
   Add a Playwright browser test confirming Breakout's paddle responds to touch/pointer dragging on mobile viewports, and document mobile controls in Breakout's user guide.
   ```
5. **Create a New Game:** Ask `agy` to build another classic 2D Canvas arcade game: **Classic Snake** or **Neon Pong**.
   ```text
   /plan Create "Classic Snake" following AGENTS.md, with wall-wrap toggle, speed levels, food combos, How to Play, Tutorial, Hint, and automated unit + browser tests.
   ```
