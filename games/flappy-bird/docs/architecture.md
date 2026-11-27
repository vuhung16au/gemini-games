# Architecture — Flappy Bird

Flappy Bird separates **pure fixed-timestep physics & collision** (`src/game/`) from **HiDPI Canvas 2D rendering** (`renderer.ts`) and **React UI overlays** (`src/components/`).

## Module Structure

```text
games/flappy-bird/
├── docs/                   # Project documentation
├── e2e/
│   └── flappy.spec.ts      # Playwright end-to-end browser tests
└── src/
    ├── main.tsx            # Imports shared styles/tokens.css & game-ui.css
    ├── App.tsx             # RAF loop, keyboard/pointer input, Tutorial, Hint, Help, Mute
    ├── style.css           # Responsive 2:3 stage, overlays, scoreboard card, modals
    ├── components/
    │   ├── StartOverlay.tsx
    │   ├── ScoreHud.tsx
    │   ├── GameOverCard.tsx
    │   ├── MuteButton.tsx
    │   └── HowToPlayModal.tsx
    └── game/
        ├── constants.ts    # 400x600 geometry, physics, progressive gap, medals
        ├── types.ts        # GameState, Bird, PipePair, Particle, SaveData
        ├── collision.ts    # Circle-vs-AABB pipe shaft/cap & ground checks
        ├── engine.ts       # Fixed-timestep 1/120s simulation & state machine
        ├── renderer.ts     # HiDPI Canvas 2D, 4-layer parallax, particles, hint corridor
        ├── audio.ts        # Procedural Web Audio API SFX
        ├── storage.ts      # Safe localStorage persistence (flappy_bird_v1)
        └── __tests__/
            ├── collision.test.ts
            └── engine.test.ts
```
