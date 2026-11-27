# 1. Mandatory `docs/` Folder per Game

Every game project/folder (`games/<game-name>/`) **must** include a `docs/` folder containing the following documentation files:

```text
games/<game-name>/
├── docs/
│   ├── README.md           # Overview, features, controls summary, and doc index
│   ├── QUICKSTART.md       # Local setup, dev server, test, and build commands
│   ├── architecture.md     # Module structure, game loop/state machine, rendering & persistence
│   ├── techstack.md        # Stack & dependencies used, aligned with /techstacks/techstack.md
│   ├── user-guide.md       # Rules, desktop/mobile controls, scoring/progression, settings
│   └── developer-guide.md  # Project layout, tuning/extending mechanics, testing & build workflow
└── ...
```

## Required Contents
- **`docs/README.md`**: High-level summary of the game, key features, and links to all documents in `docs/` (plus `README.zh.md` and `README.vi.md` per [03-styles-behavior-and-i18n.md](./03-styles-behavior-and-i18n.md)).
- **`docs/QUICKSTART.md`**: Exact commands to run locally (`npm install`, `npm run dev`, `npm test`, `npm run build`, `npm run preview`).
- **`docs/architecture.md`**: Separation between pure simulation (`src/game/`), renderer/audio/storage, and React UI overlays (`src/components/`), plus state transitions and data flow.
- **`docs/techstack.md`**: Explicit list of languages, frameworks, rendering/physics libraries, audio, and test tools used, referencing [techstack.md](../../techstacks/techstack.md).
- **`docs/user-guide.md`**: Player-facing instructions—objective, keyboard/mouse/touch controls, scoring/win/loss rules, and mute/persistence behavior.
- **`docs/developer-guide.md`**: How to modify constants/tuning parameters, run and write Vitest unit tests and Playwright E2E tests, type-check (`tsc --noEmit`), and produce a static `vite build` (`dist/`).
