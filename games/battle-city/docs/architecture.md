# Battle City (1985) — Architecture

- **Pure Simulation (`src/game/`):**
  - `types.ts` & `constants.ts`: `26×26` sub-tile grid (`416×416` logical px), tank/bullet bounds, enemy stats, and power-up durations.
  - `stages.ts`: 10 stage layouts, 20-tank wave queues with flashing bonus tanks, and the Tutorial stage.
  - `engine.ts`: Fixed-timestep-safe `stepBattle(state, input, dt)` handling NES lane-snapping turn assist, ice physics, half-tile brick carving, Tier-3 steel destruction, Eagle HQ checks, enemy AI, power-ups, and 2P friendly-fire stun.
  - `hints.ts` & `tutorial.ts`: Tactical advisor (`getBattleHint`) and 4-step Tutorial tracker.
  - `storage.ts`: Safe `localStorage` persistence under `battle_city_v1`.
- **Pixel-Art Renderer (`src/renderer/canvasRenderer.ts`):** Procedural crisp Canvas 2D rendering with foreground forest canopy pass.
- **8-Bit Audio (`src/audio/sfx.ts`):** Procedural Web Audio API pulse/triangle/noise chiptune SFX.
- **React HUD (`src/components/` & `src/App.tsx`):** `BattleSidebar`, `TitleOverlay`, `StageClearOverlay`, `GameOverOverlay`, `HowToPlayModal`, and `TouchControls`.
