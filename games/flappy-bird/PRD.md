# Product Requirements Document (PRD): Web-Based Flappy Bird

| Field | Specification |
| --- | --- |
| **Product Name** | Flappy Bird (Web Arcade Edition) |
| **Target Platform** | Modern Desktop & Mobile Web Browsers |
| **Tech Stack** | React 18, TypeScript, Vite, HTML5 Canvas 2D, CSS3, Web Audio API, Vitest |
| **Assets & Network** | Zero external image/audio assets or network calls (100% procedural Canvas 2D + Web Audio API) |
| **Deliverable & Deployment** | Modular Vite + React + TypeScript app in `games/flappy-bird/` — run locally now (`vite dev` / `vite preview`); static `vite build` output kept Cloudflare-ready for future publishing (not deployed yet) |

---

## 1. Objective & Scope

Build a responsive, arcade-accurate Flappy Bird web game that runs at identical physical speed across varying display refresh rates (`60Hz`–`144Hz+`) and screen sizes. All game world visuals are procedurally rendered on an HTML5 `<canvas>`, all UI overlays (Start prompt, live Score HUD, Mute toggle, Game Over scoreboard card) are rendered in accessible **React**, and all sound effects are synthesized via the **Web Audio API** for instant load times and offline reliability.

---

## 2. Functional Requirements

### 2.1 Game States & Lifecycle

The game must operate as a finite state machine with three distinct states:

1. **`START` (Idle State):**
   * Bird hovers in place at `BIRD_X` using a smooth sine-wave vertical bobbing animation.
   * Parallax background and foreground ground strip scroll continuously to create a sense of motion.
   * React `StartOverlay` displays the game title and a clear prompt (`"Tap or Press Space to Flap"`).
   * First valid flap input transitions immediately to `PLAYING` and applies the initial upward flap impulse.

2. **`PLAYING` (Active State):**
   * Fixed-timestep physics, pipe spawning, scrolling, collision detection, and scoring are active.
   * React `ScoreHud` displays the live score prominently at the top-center of the viewport.
   * React state updates only when the score increments or the state transitions (never inside the 60fps+ canvas animation loop).

3. **`GAME_OVER` (End State):**
   * Triggered immediately upon collision with a pipe or the ground.
   * Triggers collision feedback (screen flash, damped screen shake, hit SFX); if hit mid-air, the bird falls to the ground plane and stops.
   * Enforces a **400ms input cooldown** before restart inputs are accepted to prevent accidental immediate restarts.
   * React `GameOverCard` displays: Current Score, Best Score (with a `"NEW"` badge if beaten), earned Medal tier, and a Restart button/prompt.

### 2.2 Physics & Collision Engine

* **Frame-Rate Independence (Fixed-Timestep Accumulator):**
  * Decouple simulation from `requestAnimationFrame` rendering using a fixed physics step (`FIXED_DT = 1 / 120`s).
  * Clamp incoming frame delta at `MAX_FRAME_DT = 0.05`s to prevent physics tunneling or spiral-of-death on tab switches or frame hiccups.
* **Bird Kinematics:**
  * Fixed horizontal `BIRD_X = 110` coordinate on the logical canvas.
  * Downward acceleration via constant gravity (`1400 px/s²`), capped at terminal fall velocity (`600 px/s`).
  * Instantaneous upward velocity impulse (`-420 px/s`) upon flap input.
* **Collision Detection:**
  * Use a **forgiving circular hitbox** (`BIRD_HITBOX_RADIUS = 13 px`, ~81% of `BIRD_VISUAL_RADIUS = 16 px`) tested against axis-aligned bounding boxes (AABBs) for top/bottom pipe shafts and pipe caps, as well as the ground plane (`bird.y + BIRD_HITBOX_RADIUS >= PLAYABLE_HEIGHT`).
  * **Ceiling Boundary:** Non-lethal ceiling clamp prevents the bird from flying over pipes: clamp `bird.y = Math.max(BIRD_HITBOX_RADIUS, bird.y)` and `bird.vy = Math.max(0, bird.vy)` on ceiling contact so the bird does not stick.

### 2.3 Pipe Generation, Progressive Difficulty & Scoring

* **Spawning:** Pipes spawn off the right edge of the canvas (`x = LOGICAL_WIDTH + PIPE_CAP_OVERHANG`) at fixed `1.5 s` intervals.
* **Progressive Pipe Gap Tightening:**
  * Pipe gap starts at `145 px` and narrows smoothly as the player's score rises, down to a floor of `120 px`:
    ```ts
    gapHeight(score) = Math.max(120, 145 - Math.floor(score / 2))
    ```
  * Reaches `120 px` at score `50`.
* **Safe Vertical Randomization:** Gap center `y` is sampled uniformly within `[PIPE_MIN_MARGIN + gap / 2, PLAYABLE_HEIGHT - PIPE_MIN_MARGIN - gap / 2]` (`PIPE_MIN_MARGIN = 64 px`, `PLAYABLE_HEIGHT = 504 px`), ensuring every gap is reachable and both top and bottom pipes remain clearly visible.
* **Scoring:** Increment score by `1` exactly once per pipe pair (`pipe.passed = true`) the moment the horizontal center of the pipe pair (`pipe.x + PIPE_WIDTH / 2`) passes `BIRD_X`.
* **Memory Management:** Remove pipe objects from the active array once they fully exit the left edge of the canvas (`pipe.x + PIPE_WIDTH + PIPE_CAP_OVERHANG < 0`).
* **Persistence:** Read and write `{ bestScore: number, muted: boolean }` under the versioned `localStorage` key `flappy_bird_v1`, wrapped in a safe `try/catch` fallback for private browsing or quota errors.

### 2.4 Controls & Input Handling

* **Desktop:** `Space`, `ArrowUp`, or primary pointer press (`pointerdown`) on the game area. Call `e.preventDefault()` on `Space`/`ArrowUp` to prevent page scrolling, and ignore key-repeat events (`if (e.repeat) return`) so holding a key does not auto-flap.
* **Restart Input:** In `GAME_OVER` after the `400 ms` cooldown, `Space`, `Enter`, canvas tap/click, or clicking the Restart button resets to `START` (or starts a fresh run cleanly).
* **Mobile:** Touch tap (`pointerdown`) anywhere on the canvas. Disable double-tap zoom and text selection via CSS (`touch-action: manipulation; user-select: none;`).
* **Tab Visibility:** Handle `visibilitychange` (and frame delta clamping) so switching browser tabs mid-run never causes teleportation or phantom pipe spawns upon return.
* **Audio Toggle:** React `MuteButton` in the top corner stops pointer propagation (`e.stopPropagation()`) so toggling audio never triggers a flap, exposes `aria-label` / `aria-pressed`, and persists mute state in `flappy_bird_v1`.

---

## 3. Visual Design & Game Feel ("Juice")

### 3.1 Canvas Rendering & Responsiveness

* Maintain a consistent `400×600` internal logical coordinate system that scales cleanly via CSS/layout to fit desktop and mobile viewports without stretching, clipping, or scrollbars.
* Handle high-DPI displays (`window.devicePixelRatio`) by scaling the backing canvas buffer and transform matrix so shapes, lines, and sprites render crisply on Retina and mobile screens.

### 3.2 Multi-Layer Parallax Background

Render four distinct visual layers moving at different relative speeds to create depth:

1. **Sky Gradient:** Daytime gradient backdrop.
2. **Clouds:** Slow-moving procedural clouds (10–20% of pipe speed).
3. **Mid-Ground Silhouette:** Distant cityscape or rolling hills (35–45% of pipe speed).
4. **Foreground Ground Strip:** Repeating patterned ground strip (`GROUND_HEIGHT = 96 px`) moving at 100% of pipe speed (pauses on `GAME_OVER`).

### 3.3 Animation & Impact Feedback

* **Bird Rotation:** Tilt upward (`-25°`) on flap; smoothly pitch downward toward `+90°` (nose-dive) as downward velocity increases.
* **Wing Animation:** Cycle through at least 3 wing positions (`up`, `mid`, `down`) faster during flaps/hover and slower while gliding.
* **Particles:** Spawn 3–5 small fading feather/air-puff particles behind the bird on each flap.
* **Collision Feedback:** Trigger a brief white screen flash (`~100 ms`) and a subtle damped screen shake (`~150 ms`) upon impact.

---

## 4. Audio Specifications (Web Audio API)

Synthesize all sound effects procedurally using oscillators, noise buffers, and gain envelopes—no external `.mp3` or `.wav` files:

| Event | Synthesis Profile |
| --- | --- |
| **Flap** | Short upward pitch sweep (triangle/sine wave, ~80 ms) |
| **Score Point** | Crisp two-tone retro chime (e.g., B5 to E6 square/sine wave, ~150 ms) |
| **Collision / Hit** | Low-frequency percussive thud + short white noise burst (~180 ms) |

*Note: Initialize or resume the `AudioContext` on the user's first interaction to comply with browser autoplay policies.*

---

## 5. Tuning Parameters, Geometry & Medal Tiers

All constants are calibrated for the `400×600` logical canvas:

| Parameter | Baseline Value | Notes |
| --- | --- | --- |
| **Logical Canvas** | `400 × 600 px` | `LOGICAL_WIDTH = 400`, `LOGICAL_HEIGHT = 600` |
| **Ground Height** | `96 px` | `PLAYABLE_HEIGHT = 504 px` |
| **Bird X Position** | `110 px` | Fixed horizontal anchor |
| **Bird Visual / Hitbox Radius** | `16 px` / `13 px` | ~81% forgiving circular hitbox |
| **Fixed Physics Step** | `1 / 120 s` | `MAX_FRAME_DT = 0.05 s` frame clamp |
| **Gravity** | `1400 px/s²` | Snappy arc feel |
| **Flap Velocity** | `-420 px/s` | Instantaneous upward impulse |
| **Terminal Velocity** | `600 px/s` | Caps downward speed |
| **Pipe Speed** | `160 px/s` | Horizontal scroll rate |
| **Pipe Width / Cap** | `60 px` / `24 px` tall | Cap overhangs shaft by `4 px` per side |
| **Pipe Min Margin** | `64 px` | Minimum distance from ceiling and ground |
| **Pipe Gap (Progressive)** | `145 px` → `120 px` | `Math.max(120, 145 - Math.floor(score / 2))` |
| **Spawn Interval** | `1.5 s` | Time between new pipe pairs |
| **Restart Cooldown** | `400 ms` | Prevents accidental double-tap restarts |

### Medal Tiers (Game Over Card)

* **Bronze:** Score $\ge$ 10
* **Silver:** Score $\ge$ 20
* **Gold:** Score $\ge$ 30
* **Platinum:** Score $\ge$ 40

---

## 6. Technical Architecture & Project Structure

Separate pure deterministic simulation (`src/game/`) from React UI overlays (`src/components/`) and Canvas rendering so core mechanics can be unit-tested in **Vitest** and the production build remains a clean static `vite build` ready for future Cloudflare deployment:

```text
games/flappy-bird/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx                 # Canvas host, RAF loop integration, React HUD state
    ├── style.css               # Responsive viewport, HUD/card overlay styling
    ├── components/
    │   ├── StartOverlay.tsx    # Title + "Tap or Press Space to Flap"
    │   ├── ScoreHud.tsx        # Live top-center score during PLAYING
    │   ├── GameOverCard.tsx    # Score, Best + NEW badge, Medal, Restart button
    │   └── MuteButton.tsx      # Accessible mute/unmute toggle (stopPropagation)
    └── game/
        ├── constants.ts        # Physics, geometry, progressive gap, medal constants
        ├── types.ts            # GameState, Bird, Pipe, Particle, SaveData
        ├── collision.ts        # Pure circle-vs-AABB and ground collision checks
        ├── engine.ts           # Pure fixed-timestep simulation & state machine
        ├── renderer.ts         # HiDPI Canvas 2D rendering, parallax, particles, shake
        ├── audio.ts            # Procedural Web Audio API SFX + mute handling
        ├── storage.ts          # Safe versioned localStorage (`flappy_bird_v1`)
        └── __tests__/
            ├── collision.test.ts
            └── engine.test.ts
```

---

## 7. Acceptance Criteria & Verification

### Gameplay & UX
* [ ] Game runs at identical physical speed and jump height on 60Hz, 120Hz, and 144Hz monitors via fixed-timestep accumulation.
* [ ] Switching browser tabs mid-run does not cause the bird or pipes to teleport upon returning.
* [ ] Zero console errors and zero external network requests or asset files.
* [ ] Responsive layout fits comfortably on both mobile portrait screens and desktop monitors without scrollbars.
* [ ] Pipe gap progressively tightens from `145 px` toward `120 px` as score increases, staying within safe reachable bounds.
* [ ] High score and mute preference persist across page refreshes via `localStorage` (`flappy_bird_v1`).
* [ ] Mute button silences all synthesized Web Audio SFX without triggering a bird flap.
* [ ] Collision hitboxes feel fair and accurate to the visual bird and pipes; holding `Space`/`ArrowUp` does not auto-flap.

### Technical Verification
* [ ] **Vitest** unit tests pass covering fixed-timestep determinism, circle-vs-AABB & ground collision, progressive pipe gap formula, single-increment scoring, `400 ms` restart cooldown, medal tier mapping, and safe `localStorage` fallback.
* [ ] Clean TypeScript compilation (`tsc --noEmit`) with zero errors.
* [ ] Clean production build (`vite build`) producing static `dist/` output with zero errors.
