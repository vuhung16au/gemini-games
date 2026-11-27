**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Day 5 — The Tech Stack Behind Vibe Coding

**Estimated Time:** 1 Hour · **Previous:** [Day 4](../day-04-dev-tools-and-ai-agents/README.md) · **Next:** [Day 6](../day-06-modifying-dino-run/README.md)

---

## Overview & Key Concepts
Even when `agy` writes the code for you, understanding **what each technology in the tech stack does** helps you ask for the right kind of game! Today you will learn why this project uses **TypeScript, Vite, React**, and three visual layers: **CSS/SVG**, **HTML5 Canvas 2D**, and **Three.js**.

| Visual Technology | Best Used For | Examples in This Repo |
| :--- | :--- | :--- |
| **CSS Grid + SVG + React** | Board, puzzle, and card games | `1024`, `checkers`, `sudoku`, `minesweeper`, `solitaire`, `ta-la-phom` |
| **HTML5 Canvas 2D** | Fast 60fps arcade, platformers, pixel art | `dino-run`, `flappy-bird`, `tetris`, `battle-city`, `super-mario-bros` |
| **Three.js (3D WebGL)** | 3D worlds, cameras, lighting, shadows | `simcity` |

---

## Learning Objectives & Outcomes
By the end of Day 5, you will be able to:
1. Pick the right visual style (**Board/Card**, **2D Canvas**, or **3D Three.js**) when describing a new game to `agy`.
2. Explain in plain English what **TypeScript**, **Vite**, **React**, **Web Audio**, **Vitest**, and **Playwright** do.
3. Understand why this project avoids external CDNs so games work offline and load fast.

---

## Step-by-Step Guide

### 1. The 6 Core Building Blocks (In Plain English)
- **TypeScript:** Adds safety checks so typos and missing fields are caught before players ever see them.
- **Vite:** Gives you instant live preview while building (`make dev`) and bundles everything cleanly (`make build`).
- **React:** Powers the menus, buttons, scoreboards, **How to Play** popups, and **Tutorial** overlays.
- **Web Audio API:** Generates retro beeps and chimes mathematically—zero `.mp3` files needed!
- **Vitest & Playwright:** Automatically test rules and real browser clicks/keys.

---

## Sample `agy` Prompts
```text
Introduce the tech stack used in this project in plain English, and explain when I should ask for CSS/SVG vs. Canvas 2D vs. Three.js when creating a new game.
```
```text
Explain why Gemini Games keeps zero external CDN links and generates sound effects mathematically instead of downloading MP3 files.
```

---

## Key Takeaways
- Knowing *which* visual layer fits your idea (Board/Card, 2D Arcade, or 3D World) makes your prompts 10× clearer.
- TypeScript + Vite + React + Vitest + Playwright form the reliable backbone behind every game here.

---

## Exercises & Challenges (Prompt-Only Vibe Coding)

Use Google `agy` with the sample prompts below—no manual coding required:

1. **Understand the Project:** Ask `agy` to explain how shared colors and fonts stay consistent across all 16 games.
   ```text
   Explain in plain English how the shared style guide keeps colors, buttons, and Light/Dark themes consistent across the Hub and all 16 games.
   ```
2. **Improve a Feature:** Ask `agy` to make `Tetris`'s Ghost piece preview easier to see against both light and dark backgrounds.
   ```text
   Improve the contrast of Tetris's Ghost piece outline so players can clearly see where the block will land, and verify with make verify GAME=tetris.
   ```
3. **Implement a New Feature:** Ask `agy` to add a **"High-Contrast Mode"** toggle to `Sudoku`.
   ```text
   /plan Add a High-Contrast Mode toggle to Sudoku (saved with player settings) that makes selected cells and mistake highlights extra clear. Verify with make verify GAME=sudoku.
   ```
4. **Improve Tests / Docs:** Ask `agy` to add a mobile-screen browser test for `Minesweeper`.
   ```text
   Add a Playwright browser test for Minesweeper confirming the Easy 9x9 board fits cleanly on a mobile phone screen (390x844) with no horizontal scrolling. Run make test-e2e GAME=minesweeper.
   ```
5. **Create a New Game:** Ask `agy` to build a **"Memory Card Match"** game using crisp SVG cards.
   ```text
   /plan Create a "Memory Match" card-flipping puzzle game following AGENTS.md, with a 4x4 grid, custom SVG card icons, move counter, How to Play, Tutorial, Hint, and automated tests.
   ```
