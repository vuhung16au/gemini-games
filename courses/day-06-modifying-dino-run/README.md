**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Day 6 — Modifying Your First Game (`Dino Run`)

**Estimated Time:** 1 Hour · **Previous:** [Day 5](../day-05-tech-stack-deep-dive/README.md) · **Next:** [Day 7](../day-07-building-a-board-game/README.md)

---

## Overview & Key Concepts
Before building a game from scratch, the fastest way to learn vibe coding is **customizing a working game** with plain-language prompts. Today you will customize **Dino Run**: changing its visual palette, tuning its speed, and adding a brand-new obstacle—all verified automatically with `make`!

---

## Learning Objectives & Outcomes
By the end of Day 6, you will be able to:
1. Create a safe Git feature branch before customizing a game.
2. Prompt Google `agy` in plain English to change colors, speed, and obstacles—without touching code yourself.
3. Verify every change with `make dev GAME=dino-run` and `make verify GAME=dino-run`.

---

## Step-by-Step Guide

### 1. Create a Practice Git Branch
```bash
git checkout -b day-06-dino-mod
```

### 2. Preview `Dino Run` Live
```bash
make dev GAME=dino-run
```

### 3. Prompt `agy` to Customize Colors, Speed & Obstacles
Use the sample prompts below one at a time, watch the live preview update, and run the automated check:
```bash
make verify GAME=dino-run
```

---

## Sample `agy` Prompts

**Prompt 1 — Change Background Color:**
```text
Change Dino Run's Classic Desert daytime sky to a warm sunset peach (#fce7d6) while keeping strong contrast for the dinosaur and score text. Verify that tests and build pass.
```

**Prompt 2 — Make the Game Snappier:**
```text
Make Dino Run start slightly faster and speed up a bit quicker so the action feels snappier, then run Dino Run's unit tests to confirm everything passes.
```

**Prompt 3 — Add a New Obstacle:**
```text
/plan Add a new rolling "desert boulder" obstacle to Classic mode in Dino Run that rolls slightly faster than cacti, and add automated unit tests for boulder collisions.
```

---

## Key Takeaways
- Small, plain-language prompts + immediate `make verify GAME=dino-run` checks make vibe coding fast and predictable.
- You never need to know which internal file holds speed or colors—just describe what you want!

---

## Exercises & Challenges (Prompt-Only Vibe Coding)

Use Google `agy` with the sample prompts below—no manual coding required:

1. **Understand the Project:** Ask `agy` to explain `Dino Run`'s features and difficulty progression in plain English.
   ```text
   Explain the features in the game "Dino Run", including how the game gets harder over time, how Day/Night cycles work, and what the Tutorial and Hint markers do.
   ```
2. **Improve a Feature:** Ask `agy` to make the Day/Night sky transition smoothly instead of snapping instantly.
   ```text
   Improve Dino Run's Classic mode so the sky smoothly blends between Day and Night every 700 points instead of switching abruptly. Verify with make verify GAME=dino-run.
   ```
3. **Implement a New Feature:** Ask `agy` to add a **Double-Jump** or **Shield Power-Up** on your branch.
   ```text
   /plan Add an optional Double-Jump mechanic to Dino Run Classic mode with a small jump-charge indicator on the screen. Verify with make verify GAME=dino-run.
   ```
4. **Improve Tests / Docs:** Ask `agy` to add a browser test for your new feature and update `Dino Run`'s user guide.
   ```text
   Add a Playwright browser test confirming the new Double-Jump feature works in Dino Run, and document it in Dino Run's user guide.
   ```
5. **Create a New Game:** Ask `agy` to build a similar endless runner: **"Space Astro Runner"**.
   ```text
   /plan Create a similar endless runner "Space Astro Runner" following AGENTS.md, where an astronaut dodges asteroids and laser drones with gravity-flip controls, How to Play, Tutorial, Hint, and automated tests.
   ```
