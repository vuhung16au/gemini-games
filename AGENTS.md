# AGENTS.md — Gemini Games Repository Master Policy

This file is the **master policy index** for all AI coding agents (`agy`, Codex, Claude Code, Cursor, GitHub Copilot) working in this repository.

> **Mandatory Rule:** Before creating or modifying any game, Hub component, or course module, read and follow all **5 modular policy files** in `docs/agents/`:

---

## Policy Index

| # | Policy | Scope & Summary | Document |
| :---: | :--- | :--- | :--- |
| **1** | **Mandatory `docs/` Folder per Game** | Every `games/<slug>/docs/` must contain `README.md` (+ `README.zh.md`, `README.vi.md`), `QUICKSTART.md`, `architecture.md`, `techstack.md`, `user-guide.md`, and `developer-guide.md`. | [01-docs-structure.md](./docs/agents/01-docs-structure.md) |
| **2** | **Tech Stack & Deployment Policy** | Shared TypeScript + Vite + React + Vitest + Playwright; 2D Canvas/Phaser/PixiJS or 3D Three.js/Rapier; 100% offline local-first with clean static `dist/` (`base: './'`) for Cloudflare Workers or Vercel. | [02-tech-stack-and-deployment.md](./docs/agents/02-tech-stack-and-deployment.md) |
| **3** | **Shared Styles, Behavior, i18n & Courses** | Shared `tokens.css` / `game-ui.css` / `theme.ts`, zero external CDNs, input/visibility/mute/`localStorage` rules, How to Play + Tutorial + Hints, `en`/`zh`/`vi` i18n, and plain-language `courses/` rules (5 exercises/day, wrapped prompts). | [03-styles-behavior-and-i18n.md](./docs/agents/03-styles-behavior-and-i18n.md) |
| **4** | **Game Title, Icons, Graphics & Hub** | Original `manifest.webmanifest`, `public/icons/*` (`favicon.ico`, `32`, `180`, `192`, `512`), `public/graphics/` (`cover-hd.png`, `cover-fullhd.png`), `index.html` tags, in-game emblem, and [games.ts](./src/registry/games.ts) registration. | [04-assets-and-hub-registration.md](./docs/agents/04-assets-and-hub-registration.md) |
| **5** | **Testing (Unit + E2E) & Verification Gate** | Vitest (`>= 70%` statements, branches, functions, lines) + Playwright E2E + `make lint`, `make typecheck`, `make test`, `make build`, `make test-e2e`, and root `make verify`. | [05-testing-and-verification.md](./docs/agents/05-testing-and-verification.md) |

---

## Mandatory AI Agent Completion Rule

> Never report a game creation or modification task as complete until `make lint GAME=<slug>`, `make typecheck GAME=<slug>`, `make test GAME=<slug>`, `make build GAME=<slug>`, `make test-e2e GAME=<slug>`, and root `make verify` exit `0` after the **final** edit. Always cite the exact observed test counts and coverage percentages from the final run.
