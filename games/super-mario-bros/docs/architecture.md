# Super Mario Bros. (1985) — Architecture

- **Pure Simulation (`src/game/`):**
  - `types.ts` & `constants.ts`: `512×384` logical viewport (`16×12` tiles of `32×32px`), gravity/momentum constants, and a `players: PlayerEntity[]` array future-proofed for `TODO:` 2-Player Co-op.
  - `levels.ts`: Data-driven `LevelDefinition` builders for `1-1`, `1-2`, `1-3`, `1-4`, and `tutorial` (extensible for `TODO:` Worlds 2–8).
  - `engine.ts`: Fixed-timestep-safe `stepMario(state, input, dt)` handling AABB tile resolution, head-bonk `?` blocks & brick smashing, moving platforms, Goomba/Koopa/Shell/Piranha/Bowser AI, Fire Bars, Flagpole, and 1-4 Bridge & Axe collapse.
  - `hints.ts` & `tutorial.ts`: Contextual platforming advisor (`getMarioHint`) and 4-step interactive Tutorial.
  - `storage.ts`: Safe `localStorage` persistence under `super_mario_bros_v1`.
- **Pixel-Art Renderer (`src/renderer/canvasRenderer.ts`):** Theme-aware sky & parallax backdrops, procedural sprites, Fire Bars, and score popups.
- **8-Bit Audio (`src/audio/sfx.ts`):** Procedural Web Audio API pulse/triangle/noise SFX.
- **React HUD (`src/components/` & `src/App.tsx`):** `TopHUD`, `TitleOverlay`, `StageClearOverlay`, `VictoryOverlay`, `GameOverOverlay`, `HowToPlayModal`, and `TouchControls`.
