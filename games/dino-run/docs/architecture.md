# Dino Run — Architecture

- **Pure Simulation (`src/game/`):**
  - `types.ts` & `constants.ts`: `640×220` logical canvas, gravity/fast-fall physics, speed ramp, and Classic/404 Math obstacle definitions.
  - `engine.ts`: Fixed-timestep-safe `stepDino()`, `triggerJump()`, `setDucking()`, Day/Night cycle (every 700 pts), 100-pt milestones, and `350ms` post-crash restart cooldown.
  - `hints.ts` & `tutorial.ts`: Contextual tips and 3-step interactive Tutorial.
  - `storage.ts`: Safe `localStorage` persistence under `dino_run_v1`.
- **Pixel-Art Renderer (`src/renderer/canvasRenderer.ts`):** Crisp `2×` pixel-art T-Rex sprites (idle, run1/run2, duck1/duck2, crashed), desert cacti, pterodactyls, 404 math blocks, and optional visual timing hints.
- **Web Audio (`src/audio/sfx.ts`):** Procedural jump, milestone, and crash tones.
- **React UI (`src/App.tsx`, `src/components/HowToPlayModal.tsx`):** Theme tabs, HUD, overlays, and touch/pointer controls.
