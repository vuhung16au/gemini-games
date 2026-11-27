# 3. Shared Styles, Behavior, i18n & Course Rules

Follow [STYLE_GUIDE.md](../../styles/STYLE_GUIDE.md):

- **Shared Tokens & Theme:** Import [tokens.css](../../styles/tokens.css) and [game-ui.css](../../styles/game-ui.css) in `src/main.tsx` before local styles, and use [theme.ts](../../styles/theme.ts) for Canvas/3D colors (`softivory`, `deepcharcoal`, `bookpurple`, `lawpurple`, `bookred`, `warmstone`).
- **Zero External Runtime CDNs:** Keep zero external network/CDN calls or external image/audio files unless explicitly requested (local static brand icons and covers in `public/icons/` and `public/graphics/` are required).
- **Input, Visibility, Audio & Persistence:** Ensure keyboard (`preventDefault` on `Space`/`Arrow*`, ignore `e.repeat` and modifier keys), touch/pointer (`touch-action`, `user-select: none`), `visibilitychange` handling, accessible Mute toggle (`e.stopPropagation()`), and safe `localStorage` persistence (`<game_name>_v1`).
- **In-Game "How to Play", Tutorial Mode & Hints:**
  - Every game must provide an in-game **"How to Play"** modal/panel so players can read the rules, controls, and scoring directly inside the UI.
  - Each game should also include a **"Tutorial"** mode (guided walkthrough or practice step) and **"Hints"** (suggested move/action or contextual tip) whenever feasible for the game's mechanics.

## Multilingual Support (`en`, `zh`, `vi`)
- This project supports **English (`en`)**, **Chinese (`zh`)**, and **Vietnamese (`vi`)**.
- **All `README.md` files** (the root `README.md`, `courses/README.md`, `courses/day-*/README.md`, and every `games/<game-name>/docs/README.md`) must support all 3 languages via `README.md` (English), `README.zh.md` (中文), and `README.vi.md` (Tiếng Việt), with a language switcher at the top of each file.
- **Webapp Interface:** The Gemini Games Hub (`src/`) and game interfaces must support switching between English (`en`), Chinese (`zh`), and Vietnamese (`vi`) with `localStorage` persistence.

## Courses (`courses/`) Curriculum Rules
- All course index and daily lesson folders (`courses/README.md` and `courses/day-*/`) must support all 3 languages (`README.md`, `README.zh.md`, `README.vi.md`).
- **Course Philosophy & Audience:** Our `courses/` curriculum is **hands-on focused**, **vibe coding (prompt-driven)**—never asking students to write code manually—and **tailored for non-IT, non-tech learners** who want to understand the **tech stack behind vibe coding** in plain, practical language.
- **Plain-Language, High-Level Prompts Only:** Never ask learners to read, trace, or explain low-level code files (e.g., never write *"Read `games/dino-run/src/game/engine.ts`..."*). Keep every sample prompt, walkthrough, and exercise in high-level, everyday English/Chinese/Vietnamese focused on features, user experience, testing concepts, Cloudflare/Vercel setup/deployment, and the overall tech stack (letting `agy` locate internal files automatically).
- **Readable Prompt Blocks:** Wrap long lines in ````text` prompt blocks (`<= 78` content characters) so learners can read full prompts without horizontal scrolling.
- **Course Delivery Loop:** Every lesson follows a simple 4-step vibe-coding flow: **Play / Explore -> Ask `agy` in plain language -> Prompt `agy` to improve or build -> Verify with `make`**.
- **Daily Exercises & Challenges:** Each daily lesson must include **exactly 5** prompt-only exercises (with sample prompts) covering: understanding the project, improving a feature, implementing a new feature, improving tests/docs, and creating a new/similar game.
