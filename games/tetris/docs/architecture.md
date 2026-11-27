# Architecture — Tetris

Tetris separates **pure deterministic simulation** (`src/game/`) from **React HUD & controls** (`src/components/`) and **HiDPI Canvas 2D rendering** (`renderer.ts`).

## Module Structure

```text
games/tetris/
├── docs/                     # Project documentation
├── e2e/
│   └── tetris.spec.ts        # Playwright end-to-end browser tests
├── public/
│   ├── manifest.webmanifest
│   ├── icons/                # favicon.ico, 32, 180, 192, 512
│   └── graphics/             # cover-hd.png (1280x720), cover-fullhd.png (1920x1080)
└── src/
    ├── main.tsx              # Imports shared styles/tokens.css & game-ui.css
    ├── App.tsx               # RAF fixed-timestep host, keyboard/visibility handlers, HUD sync
    ├── style.css             # Responsive board/side-panel layout, touch pad, modals
    ├── components/
    │   ├── PiecePreviewSvg.tsx # Inline SVG mini-tetromino previews (Hold & Next)
    │   ├── Header.tsx        # Title emblem, How to Play, Tutorial, Hint, Pause, Mute, New Game
    │   ├── SidePanel.tsx     # Hold, Score/Best/Level/Lines, Next (3), Ghost toggle
    │   ├── TouchControls.tsx # Mobile/pointer arcade buttons
    │   ├── HowToPlayModal.tsx# In-game rules, controls & scoring modal
    │   └── GameOverlay.tsx   # START / PAUSED / GAME_OVER overlays
    └── game/
        ├── constants.ts      # 10x20 grid, tetromino shapes, SRS kicks, gravity curve
        ├── types.ts          # PieceType, ActivePiece, PlacementHint, GameState, SaveData
        ├── engine.ts         # 7-bag, SRS wall kicks, fixed-timestep loop, Hold, line clears
        ├── hints.ts          # Heuristic placement solver (lines, holes, height, bumpiness)
        ├── tutorial.ts       # Deterministic 3-step guided tutorial
        ├── renderer.ts       # HiDPI Canvas 2D board, ghost, dashed hint outline, line flash
        ├── audio.ts          # Procedural Web Audio API SFX
        ├── storage.ts        # Safe localStorage persistence (tetris_v1)
        └── __tests__/
            └── engine.test.ts
```
