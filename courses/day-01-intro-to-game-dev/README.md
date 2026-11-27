# Day 1 — Introduction to Game Development & Vibe Coding

**Estimated Time:** 1 Hour · **Previous:** [Course Index](../README.md) · **Next:** [Day 2](../day-02-game-dev-concepts/README.md)

---

## Overview & Key Concepts
Today you will explore the **Gemini Games** repository, understand what **vibe coding** with AI agents means in practice, and run the unified 15-game Dashboard on your own machine.

- **Vibe Coding (Structured):** Describing *what* you want to build in clear natural language, letting an AI coding agent (`agy`) plan and generate code/assets, and **verifying every change with automated tests**.
- **Local-First Web Games:** Every game in this repo runs offline in a browser with zero external CDNs, then compiles into a static `dist/` folder for Cloudflare Workers.

---

## Learning Objectives & Outcomes
By the end of Day 1, you will be able to:
1. Explain how AI coding agents accelerate planning, coding, asset creation, and testing.
2. Run the unified Gemini Games Dashboard locally with `npm run dev`.
3. Inspect the 15 existing games and open any game's `docs/` folder.

---

## Step-by-Step Guide

### 1. Check Your Environment
```bash
node -v   # Node.js 20+ recommended
npm -v
git --version
```

### 2. Install Dependencies & Launch the Hub
From the repository root:
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (e.g., `http://localhost:5173`). Try:
- Filtering by category (`Puzzle`, `Board`, `Arcade`, `Simulation`, `Card`).
- Pressing `/` to search, `Arrow` keys to move across cards, and `Enter` to launch **Dino Run** or **SimCity 3D**.
- Toggling Dark/Light theme and starring a favorite game.

### 3. Tour the Key Reference Files
Read these three files to see how the project stays consistent:
- [`README.md`](../../README.md) — Project overview and all 15 games
- [`QUICKSTART.md`](../../QUICKSTART.md) — Everyday commands
- [`AGENTS.md`](../../AGENTS.md) — The "contract" every AI agent follows when building games here

---

## Sample `agy` Prompts
Try asking your AI agent:
```text
Explain the folder structure of this repository and list all 15 games grouped by rendering technology (Canvas 2D, Three.js, CSS/SVG).
```
```text
Run npm test at the repository root and explain what each passing test verifies.
```

---

## Key Takeaways
- Vibe coding works best when paired with a clear rulebook ([`AGENTS.md`](../../AGENTS.md)) and automated tests.
- One `npm run dev` command serves both the root Dashboard and all 15 standalone games.

---

## Exercises & Challenges
1. Launch **3 different games** (one Canvas 2D, one CSS/SVG Card/Board, and `SimCity 3D`) and open each game's **? Help** modal and **Tutorial**.
2. Run `npm test` at the repository root and confirm all tests pass.
3. **Challenge:** Open `games/dino-run/docs/README.md` and note how its documentation matches `AGENTS.md`.
