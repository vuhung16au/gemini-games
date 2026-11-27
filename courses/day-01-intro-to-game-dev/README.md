**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Day 1 — Introduction to Game Development & Vibe Coding

**Estimated Time:** 1 Hour · **Previous:** [Course Index](../README.md) · **Next:** [Day 2](../day-02-game-dev-concepts/README.md)

---

## Overview & Key Concepts
Today you will explore the **Gemini Games** repository, understand what **vibe coding** with AI agents means in practice, and run the unified 16-game Dashboard on your own machine—without writing a single line of code yourself.

- **Try the Live Demo First:** Play all 16 games online right now at **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**.
- **Vibe Coding vs. Traditional Coding:** In traditional coding, you spend months memorizing syntax and writing code line by line. In **vibe coding**, **your ideas, player experience, and clear intent are what matter most**—you can treat the **source code as an artifact** generated from your prompts and verified with automated checks (`make verify`).
- **Learn Tools & Tech Stack As You Go:** This course does not teach `git`, `make`, `agy`, TypeScript, or React as dry standalone manuals—you will pick them up naturally by playing, asking `agy`, and building.
- **100% Offline or Cloud-Ready:** Every game runs **100% offline** in your browser once cloned, and you can publish your customized hub to **Cloudflare Workers** (or alternatively **Vercel**).

---

## Learning Objectives & Outcomes
By the end of Day 1, you will be able to:
1. Explain why ideas and clear intent matter more than manual syntax in vibe coding (treating source code as an artifact).
2. Clone the repository and launch the unified Gemini Games Dashboard locally (`100%` offline) with `make dev`.
3. Ask `agy` in plain English to summarize the project, introduce the tech stack, and explain game features.

---

## Step-by-Step Guide

### 1. Try the Live Demo & Check Your Environment
First, open **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)** to see what you are about to run and customize. Then check your local tools:
```bash
node -v   # Node.js 20+ recommended
npm -v
git --version
```

### 2. Clone the Repository
```bash
git clone https://github.com/vuhung16au/gemini-games.git
cd gemini-games
```

### 3. Install Dependencies & Launch the Hub (100% Offline)
From the repository root:
```bash
npm install
make dev
```
Open the local URL printed by Vite (e.g., `http://localhost:5173`). Try:
- Filtering by category (`Puzzle`, `Board`, `Arcade`, `Simulation`, `Card`).
- Pressing `/` to search, `Arrow` keys to move across cards, and `Enter` to launch **Dino Run** or **SimCity 3D**.
- Switching between `EN`, `中文`, and `VI`, toggling Dark/Light mode, and starring a favorite game.

### 3. Explore the Project with Plain-Language Prompts
You don't need to read code files—just ask `agy` to explain the big picture using the prompts below.

---

## Sample `agy` Prompts
Try asking your AI agent:
```text
Summarise this project in plain English for a non-technical learner, including
what all 16 games are and how the Hub brings them together.
```
```text
Introduce the tech stack used in this project and explain what each tool does
in simple, everyday language.
```

---

## Key Takeaways
- Vibe coding lets non-IT creators build real browser games by describing outcomes in plain language.
- One `npm run dev` command serves both the root Dashboard and all 16 standalone games.

---

## Exercises & Challenges (Prompt-Only Vibe Coding)

Use Google `agy` with the sample prompts below—no manual coding required:

1. **Understand the Project:** Ask `agy` to summarize all 16 games grouped by genre and visual style.
   ```text
   Summarise the project and group all 16 games by category (Puzzle, Board,
   Arcade, Simulation, Card) and visual style (2D, 3D, or Board/Card).
   ```
2. **Improve a Feature:** Ask `agy` to make the Hub's empty-search message friendlier across all 3 languages.
   ```text
   Improve the Hub's empty-search message so it gently reminds players they can
   press "/" to search or click Reset Filters, in English, Chinese, and
   Vietnamese. Verify everything passes.
   ```
3. **Implement a New Feature:** Ask `agy` to add a **"🎲 Surprise Me"** button that launches a random game.
   ```text
   /plan Add a "Surprise Me" button to the Hub header (with English, Chinese, and
   Vietnamese labels) that picks and opens a random game from the visible list,
   and verify with automated tests.
   ```
4. **Improve Tests / Docs:** Ask `agy` to verify that the root `README` game list is complete in all 3 languages.
   ```text
   Check that the root README files in English, Chinese, and Vietnamese list all
   16 games accurately, and run the project's documentation compliance check.
   ```
5. **Create a New Game:** Ask `agy` to build a simple **"Guess the Number"** mini-game.
   ```text
   /plan Create a simple "Guess the Number" puzzle game following the project's
   AGENTS.md rules, with a 1-100 range, Higher/Lower hints, How to Play,
   Tutorial, and automated tests.
   ```
