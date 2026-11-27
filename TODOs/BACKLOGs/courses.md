# PRD: 9-Day Game Development Course (Vibe Coding & AI Agents)

## Overview
Build a hands-on, Markdown-based **Game Development with Vibe Coding & AI Agents** course using the `gemini-games` repository as the live codebase.

## Target Audience
- **Beginners** who want to learn web game development through vibe coding and AI coding agents.
- **Intermediate developers** who want to apply modern TypeScript, Vite, Canvas 2D, Three.js, automated testing, and AI-assisted workflows.

## Course Objectives
- Teach web game development fundamentals using vibe coding and AI agents (`agy`).
- Provide structured, hands-on progression from modifying an existing 2D game (`Dino Run`) to building a Board game, a 2D Canvas game, and a 3D Three.js game from scratch.
- Train students to collaborate with AI agents for planning (`/plan`), code generation, original asset creation (`.svg` / `image-generator`), automated testing (Vitest + Playwright), and Cloudflare deployment.

## Schedule & Deliverable Format
- **Duration:** **9 Days** — 1 module per day (~1 hour per module).
- **Format:** Markdown files saved under `courses/`:
  - `courses/README.md` (course overview, prerequisites, 9-day Mermaid roadmap, and index)
  - `courses/day-01-intro-to-game-dev/README.md`
  - `courses/day-02-game-dev-concepts/README.md`
  - `courses/day-03-project-architecture/README.md`
  - `courses/day-04-dev-tools-and-ai-agents/README.md`
  - `courses/day-05-tech-stack-deep-dive/README.md`
  - `courses/day-06-modifying-dino-run/README.md`
  - `courses/day-07-building-a-board-game/README.md`
  - `courses/day-08-building-a-2d-game/README.md`
  - `courses/day-09-building-a-3d-game/README.md`

## Curriculum Outline
- **Day 1 — Introduction to Game Development:** Project overview, vibe coding & AI agents, tech stack tour, and local environment setup.
- **Day 2 — Understanding Game Development Concepts:** Software architecture principles, pure simulation vs. renderer separation, fixed-timestep loops, and automated testing / TDD.
- **Day 3 — Understanding This Project's Architecture:** Monorepo layout, multi-entry `vite.config.ts`, hub registry (`src/registry/games.ts`), and `games/dino-run/` walkthrough.
- **Day 4 — Developer Tools & AI Agents:** `Node.js` & `npm`, `git` & GitHub CLI (`gh`), Cloudflare Workers (`wrangler`), and Google `agy` (`/plan`, `AGENTS.md`).
- **Day 5 — Tech Stack Deep Dive:** `TypeScript`, `Vite`, `React`, `HTML5 Canvas 2D`, `Three.js`, `CSS`, `SVG`, `Vitest`, and `Playwright` (aligned with `docs/techstack.md`).
- **Day 6 — Modifying Your First Game (`Dino Run`):** Git branch safety (`day-06-dino-mod`), modifying background color & speed, adding a new obstacle via AI prompts, and updating tests.
- **Day 7 — Building a Board Game from Scratch:** Building Tic Tac Toe (`games/tic-tac-toe/`, Playwright port `4189`), `AGENTS.md` compliance, original `.svg`/AI assets, and hub registration.
- **Day 8 — Building a 2D Canvas Game from Scratch:** Fixed-timestep 2D Canvas game (`games/<slug>/`, Playwright port `4190`), Web Audio SFX, How to Play, Tutorial, and Hints.
- **Day 9 — Building a 3D Game from Scratch & Deployment:** Vanilla Three.js 3D game (referencing `games/simcity/`, Playwright port `4191` with WebGL flags) and deploying via `npm run deploy` to Cloudflare Workers.

## Required Per-Module Sections
Every daily `README.md` must include:
1. Brief overview of objectives & key concepts
2. Learning objectives & outcomes
3. Step-by-step hands-on guide referencing real repo files & commands
4. Copy-pasteable sample `agy` prompts
5. Key takeaways & summary
6. Exercises & challenges

## Definition of Done
- `courses/README.md` and all 9 `courses/day-01..09-*/README.md` files created.
- Every relative Markdown link resolves to an existing file on disk.
- Root `README.md` links to `courses/README.md`.
- Changes committed and pushed to `main`.
