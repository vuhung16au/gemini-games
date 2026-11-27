**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

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

## Exercises & Challenges (Prompt-Only Vibe Coding)

Use Google `agy` with the sample prompts below—no manual coding required:

1. **Understand the Project:** Ask `agy` to map all games by category and rendering engine.
   ```text
   Inspect src/registry/games.ts and games/*/package.json, then summarize all games grouped by category (Puzzle, Board, Arcade, Simulation, Card) and rendering layer.
   ```
2. **Improve a Feature:** Ask `agy` to make the Hub's empty-search message more helpful.
   ```text
   In src/components/Dashboard.tsx and src/i18n/translations.ts, improve the empty-filter message so it reminds players they can press "/" to search or click Reset Filters across en, zh, and vi. Verify with make test and make lint.
   ```
3. **Implement a New Feature:** Ask `agy` to add a **"🎲 Surprise Me"** button that launches a random game.
   ```text
   /plan Add a "Surprise Me" button in src/components/Dashboard.tsx (with en/zh/vi labels in src/i18n/translations.ts) that picks and opens a random game from visibleGames. Add a unit test in Dashboard.test.tsx and verify with make verify.
   ```
4. **Improve Tests / Docs:** Ask `agy` to check and update the root `README.md` game count if needed and verify all docs links.
   ```text
   Verify that README.md, README.zh.md, and README.vi.md list every game in src/registry/games.ts, then run make check-docs.
   ```
5. **Create a New Game:** Ask `agy` to scaffold a minimal **"Guess the Number"** mini-game.
   ```text
   /plan Create a simple "Guess the Number" puzzle game in games/guess-number/ following AGENTS.md and .agents/skills/create-game/SKILL.md, with 1-100 range, hints (Higher/Lower), How to Play, Tutorial, Vitest >=70% coverage, and Playwright E2E.
   ```
