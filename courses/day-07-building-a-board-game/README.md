# Day 7 — Building Your First Board Game from Scratch

**Estimated Time:** 1 Hour · **Previous:** [Day 6](../day-06-modifying-dino-run/README.md) · **Next:** [Day 8](../day-08-building-a-2d-game/README.md)

---

## Overview & Key Concepts
Today you will build a complete, **`AGENTS.md`-compliant** board game from scratch—**Tic Tac Toe** (`games/tic-tac-toe/`)—with both **vs AI (Minimax)** and **2-Player Local** modes, original artwork, 6 docs, automated tests, and unified Dashboard registration!

```mermaid
flowchart TD
  Plan["1. /plan Tic Tac Toe"] --> Sim["2. Pure Rules + Minimax AI (src/game/)"]
  Sim --> UI["3. React CSS/SVG Board + How to Play / Tutorial / Hints"]
  UI --> Art["4. Original SVG / agy Icons & Covers (public/)"]
  Art --> Docs["5. 6 Docs (docs/) + Hub Registration (games.ts)"]
  Docs --> Verify["6. Vitest + Playwright (port 4189) + tsc + vite build"]
```

---

## Learning Objectives & Outcomes
By the end of Day 7, you will be able to:
1. Drive a full new-game implementation from `/plan` to production build using `agy`.
2. Enforce every [`AGENTS.md`](../../AGENTS.md) standard: `docs/`, `public/icons/*`, `public/graphics/*`, `How to Play`, `Tutorial`, `Hints`, Vitest, and Playwright.
3. Register a new game in [`src/registry/games.ts`](../../src/registry/games.ts) and assign a fresh Playwright port (`4189+`).

---

## Step-by-Step Guide

### 1. Create a Feature Branch
```bash
git checkout -b day-07-tic-tac-toe
```

### 2. Review `AGENTS.md` Constraints Before Prompting
- **Dedicated Playwright Port:** Ports `4175`–`4188` are already used; assign **`4189`** for `games/tic-tac-toe/playwright.config.ts`.
- **Original Graphics:** Prefer crisp `.svg` sprites for the board (`X` / `O`) and ask `agy` (`image-generator`) to generate `public/icons/*` and `public/graphics/*`.
- **Shared Styles:** Import `../../../styles/tokens.css` and `../../../styles/game-ui.css` in `src/main.tsx`.

### 3. Use `/plan` with `agy` to Build `games/tic-tac-toe/`
Paste the sample prompt below, review `agy`'s plan, and approve execution.

### 4. Verify Both Standalone and Unified Hub
```bash
cd games/tic-tac-toe && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
cd ../.. && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## Sample `agy` Prompts

**Planning & Implementation Prompt:**
```text
/plan Implement a new board game "Tic Tac Toe" in games/tic-tac-toe/ following AGENTS.md completely:
- Modes: vs AI (Easy + Unbeatable Minimax) and 2-Player Local
- Clean pure simulation in src/game/ (win/draw detection, Minimax AI, smart Hint, 3-step Tutorial, localStorage tic_tac_toe_v1)
- Crisp CSS/SVG X & O board using shared styles/tokens.css and styles/game-ui.css
- Web Audio SFX + Mute toggle, How to Play modal, original icons & HD/Full-HD covers in public/, and all 6 docs in docs/
- Vitest unit tests + Playwright E2E tests on dedicated port 4189
- Register in src/registry/games.ts (category: Board) and update root tests
```

---

## Key Takeaways
- Board games are the ideal first "from scratch" project because turn-based rules and Minimax AI are easy to unit-test deterministically.
- Assigning a unique Playwright port prevents conflicts across the monorepo.

---

## Exercises & Challenges
1. Play a full match against **Unbeatable Minimax AI** and verify it never loses.
2. **Challenge:** Extend Tic Tac Toe with a **4×4 Grid Mode** or **Best-of-5 Series Scoreboard** using a follow-up prompt and add a unit test for it.
