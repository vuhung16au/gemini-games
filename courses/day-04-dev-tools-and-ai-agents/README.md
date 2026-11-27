# Day 4 — Developer Tools & AI Coding Agents

**Estimated Time:** 1 Hour · **Previous:** [Day 3](../day-03-project-architecture/README.md) · **Next:** [Day 5](../day-05-tech-stack-deep-dive/README.md)

---

## Overview & Key Concepts
Modern vibe-coding game development combines four essential tools: **Node.js & npm**, **Git & GitHub (`gh`)**, **Cloudflare Workers (`wrangler`)**, and **AI coding agents (Google `agy`)**.

```mermaid
flowchart LR
  Dev["You + Google agy (/plan -> Implement -> Verify)"] --> Local["Node.js & npm (dev, test, build)"]
  Local --> Git["Git & GitHub CLI (git + gh)"]
  Local --> CF["Cloudflare Workers (wrangler deploy)"]
```

---

## Learning Objectives & Outcomes
By the end of Day 4, you will be able to:
1. Run project lifecycle scripts with `npm` (`dev`, `test`, `test:e2e`, `build`, `deploy`).
2. Create feature branches, commit, and manage repositories using `git` and `gh`.
3. Understand how [`wrangler.jsonc`](../../wrangler.jsonc) deploys `dist/` to Cloudflare Workers Static Assets.
4. Use Google `agy` effectively with `/plan`, `AGENTS.md`, and verification gates.

---

## Step-by-Step Guide

### 1. Node.js & npm Scripts
Inspect [`package.json`](../../package.json):
```bash
npm run dev        # Start local Vite dev server
npm test           # Run Vitest unit tests
npm run test:e2e   # Run Playwright Chromium tests
npm run build      # Type-check (tsc) + build static dist/
npm run deploy     # Build dist/ + deploy via wrangler
```

### 2. Git & GitHub CLI (`git` + `gh`)
Always isolate experiments on a branch before asking an AI agent to make large edits:
```bash
git status
git checkout -b practice-day-4
# ...make changes, test, then switch back:
git checkout main
git branch -d practice-day-4
```
Check GitHub CLI auth:
```bash
gh auth status
```

### 3. Cloudflare Workers (`wrangler`)
Open [`wrangler.jsonc`](../../wrangler.jsonc) and note how static hosting requires zero server code:
- `"assets": { "directory": "./dist", "not_found_handling": "single-page-application" }`
- Validate a deployment safely without publishing:
```bash
npm run build && npx wrangler deploy --dry-run
```

### 4. Working Effectively with Google `agy`
- **Start with `/plan`:** For any non-trivial feature or new game, prefix your prompt with `/plan` so `agy` researches first and aligns on design decisions before editing files.
- **Anchor on `AGENTS.md`:** Mention `AGENTS.md` compliance so `agy` remembers docs, icons/covers, How to Play, Tutorial, Hints, and tests.
- **Demand verification:** Always ask `agy` to run `npm test && npm run test:e2e && npx tsc --noEmit && npm run build`.

---

## Sample `agy` Prompts
```text
/plan Review games/dino-run/ and propose 3 small gameplay improvements we could implement safely on a new git branch.
```

---

## Key Takeaways
- Use `git` branches for safe experimentation and `wrangler deploy --dry-run` to validate builds before publishing.
- `/plan` + `AGENTS.md` + automated tests turn AI agents into reliable engineering partners.

---

## Exercises & Challenges
1. Run `npx wrangler deploy --dry-run` after `npm run build` and observe how many static files Wrangler detects in `dist/`.
2. **Challenge:** Inspect `git log --oneline -n 5` to see how commits in this repository are structured.
