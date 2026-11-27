# Web Game Development Tech Stack (2D & 3D)

A practical, modern web-based tech stack for building both **2D** and **3D** browser games—sharing a consistent TypeScript + Vite foundation while choosing the right rendering and physics tools for each dimension.

---

## 1. Core Shared Foundation (2D & 3D)

Use this same base across every game project so tooling, builds, and workflows stay consistent:

| Layer | Recommended Tool | Why |
| :--- | :--- | :--- |
| **Language** | **TypeScript** | Catches state, vector, and entity bugs at compile time; essential as game logic grows. |
| **Build & Dev Server** | **Vite** | Instant HMR, fast production bundles, native TypeScript/ES modules, and easy GLSL/WASM/asset imports. |
| **UI / HUD / Menus** | **React** (or Vanilla HTML/CSS) | Rendering menus, HUDs, inventories, and modals in DOM overlays is faster to build and much more accessible than drawing UI on `<canvas>`. |
| **State Bridge** | **Zustand** | Lightweight store ideal for syncing game state (score, HP, inventory, pause state) between the 60fps game loop and React UI without re-render bottlenecks. |
| **Testing** | **Vitest** | Fast unit testing for deterministic game logic (collision math, scoring, economy formulas, procedural generation). |

---

## 2. 2D Web Games Stack

Choose the 2D rendering layer based on the complexity of the game:

### Rendering / Engine Options

1. **HTML5 Canvas 2D API (Vanilla)** — *Best for simple arcade & puzzle games*
   - **Use for:** Flappy Bird, Snake, Tetris, Pong, Breakout, minimalist arcade games.
   - **Pros:** Zero dependencies, tiny bundle size, total control over the game loop.
   - **Cons:** You write your own camera, sprite batching, and scene management.

2. **Phaser 3** — *Best all-in-one 2D game framework*
   - **Use for:** Platformers, top-down RPGs, metroidvanias, shoot-'em-ups, tilemap-based games.
   - **Pros:** Batteries included—scenes, tilemaps (Tiled), sprite animations, cameras, tweens, input, and built-in Arcade / Matter.js physics.
   - **Cons:** More opinionated structure; heavier bundle than Canvas 2D.

3. **PixiJS (v8)** — *Best high-performance 2D renderer*
   - **Use for:** Tycoon/simulation games, card/board games, bullet-hell games with thousands of sprites, or custom architectures where you want WebGL/WebGPU speed without a rigid engine.
   - **Pros:** Blazing fast WebGPU/WebGL2 rendering, filters/shaders, great TypeScript support, pairs cleanly with React HUDs.
   - **Cons:** Renderer only—you bring your own game loop, physics, and audio.

### 2D Physics
- **Custom AABB / Circle Collision:** Best for simple arcade games and tight platformers where "game feel" matters more than realistic rigid-body simulation.
- **Matter.js:** Easy-to-use 2D rigid-body physics (ragdolls, stacks, pendulums, Angry Birds–style games).
- **Rapier 2D (`@dimforge/rapier2d-compat`):** Rust/WASM-powered 2D physics—fast, deterministic, and great when you have many colliding bodies.

---

## 3. 3D Web Games Stack (Three.js)

**Three.js** is the right choice for 3D web games—it has the largest ecosystem, mature tooling, WebGL2 + WebGPU (`WebGPURenderer`) support, and abundant learning resources.

### Two Ways to Use Three.js

| Approach | Best For | Pros |
| :--- | :--- | :--- |
| **Vanilla Three.js + TypeScript** | Engine-style projects, performance-critical games, full imperative control | Direct access to the render loop, zero React overhead inside the scene, straightforward memory disposal. |
| **React Three Fiber (R3F) + `@react-three/drei`** | Rapid iteration, React-heavy HUDs, component-driven scenes | Declarative scene graph, huge helper library (`drei` for cameras, controls, environments, instancing), still runs at 60fps via `useFrame`. |

> **Recommendation:** Start with **Vanilla Three.js + TypeScript** if you want a classic imperative game loop and clean separation between game engine and UI. Choose **React Three Fiber + `@react-three/drei`** if you love React and want faster prototyping with ready-made 3D helpers.

### 3D Physics
- **Rapier 3D (`@dimforge/rapier3d-compat` or `@react-three/rapier`)** — **Recommended default.** Fast WASM rigid-body physics, character controllers, raycasting, and sensors.
- **Jolt Physics (`jolt-physics`)** — Great for complex vehicles, large open worlds, or heavy physics simulations.
- **cannon-es** — Lightweight pure-JS option for simpler physics needs.

### Post-Processing & Shaders
- **`postprocessing` (pmndrs)** (or `@react-three/postprocessing` with R3F) — Efficient single-pass bloom, tone mapping, vignette, SSAO, and outlines.
- **Shaders:** GLSL for WebGL, or **TSL (Three.js Shading Language)** for future-proof WebGPU + WebGL compatibility.

### 3D Asset Pipeline
- **Model Format:** **`.glb` (binary glTF 2.0)** — The standard for web 3D.
- **Authoring:** **Blender** (modeling, UV unwrapping, rigging, animations, glTF export).
- **Optimization:** **`gltf-transform`** (Draco/Meshopt geometry compression + KTX2/WebP texture compression) to keep download sizes small and load times fast.

---

## 4. Shared Game Systems (2D & 3D)

- **Audio:**
  - **Howler.js** — Reliable cross-browser audio playback, audio sprites, and 3D spatial audio.
  - **Web Audio API** — Great for procedural/retro sound effects (zero audio files to load).
- **Input:**
  - Native **Keyboard, Pointer/Mouse, Touch, and Gamepad APIs**.
  - **nipplejs** (optional) for mobile virtual joysticks.
- **Architecture & Loop:**
  - Use a **fixed-timestep physics loop** (accumulator pattern) decoupled from `requestAnimationFrame` rendering so physics behaves identically on 60Hz, 120Hz, and 144Hz monitors.
  - Optional ECS (Entity Component System): **bitECS** (max performance) or **miniplex** (ergonomic TypeScript) for games with hundreds/thousands of active entities.
- **Debugging & Tuning:**
  - **`lil-gui`** — Live tweak panels for gravity, camera, lighting, and shader uniforms.
  - **`stats.js`** (or **`r3f-perf`**) — Monitor FPS, frame time, draw calls, and GPU memory.
- **Multiplayer (Optional):**
  - **Colyseus** — Authoritative TypeScript multiplayer game server with state syncing.
  - **Cloudflare Workers + Durable Objects** — Serverless WebSocket rooms at the edge.

---

## 5. Build & Deployment

- **Current Phase (Now — Local Only):** Games are built, tested, and played locally (`vite dev` / `vite preview`). We are **not** deploying to Cloudflare yet—no live deployment pipeline, CI/CD, or Wrangler configuration is needed right now.
- **Future Publishing Target (Later — Cloudflare):** Later on, when we are ready to publish, games will be deployed on **Cloudflare** (Cloudflare Workers with Static Assets / Cloudflare Pages) directly from Vite's static `dist/` output.
  - **Stay Cloudflare-Ready:** Keep each game a clean static `vite build` with zero Node-only runtime dependencies in client code so publishing later is a drop-in step.
  - **Future Backend / Multiplayer:** If we add leaderboards or real-time multiplayer later, we can extend the same Cloudflare stack with **Cloudflare Workers + Durable Objects** (or D1/KV).

---

## 6. Quick Decision Matrix (TL;DR)

| Game Type | Recommended Stack |
| :--- | :--- |
| **Simple 2D Arcade / Puzzle** (e.g., Flappy Bird) | TypeScript + Vite + **HTML5 Canvas 2D** + Web Audio API (+ optional **React** for HUD/menus) |
| **Full-Featured 2D Game** (Platformer, RPG, Shooter) | TypeScript + Vite + **Phaser 3** + Tiled + Howler.js |
| **2D Tycoon / Sim / Card / UI-Heavy Game** | TypeScript + Vite + **React** + **PixiJS v8** (or Canvas 2D) + Zustand |
| **3D Game (Imperative / Custom Loop)** | TypeScript + Vite + **Three.js** + **Rapier 3D** + `postprocessing` + `lil-gui` + Howler.js |
| **3D Game (Declarative / React-Integrated)** | TypeScript + Vite + **React** + **React Three Fiber** + `drei` + `@react-three/rapier` + Zustand |
