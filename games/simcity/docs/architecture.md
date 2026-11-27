# SimCity 3D — Architecture

SimCity 3D separates pure deterministic simulation, 3D WebGL rendering, procedural audio, and React HUD overlays:

1. **Pure Simulation (`src/game/`):**
   - `types.ts` & `constants.ts`: `20×20` grid, tool costs/upkeep, population/job curves, and milestones.
   - `maps.ts`: Seeded terrain presets (`riverside`, `islands`, `plains`) and `STARTER_TOWN_PLACEMENTS`.
   - `engine.ts`: Immutable `applyTool()`, BFS power/water network propagation (`recomputeCityMetrics()`), land value/pollution fields, RCI demand, and `stepSimulationTick()`.
   - `hints.ts` & `tutorial.ts`: Priority-ordered Mayor Advisor hints and 5-step onboarding tracker.
   - `storage.ts`: Safe `try/catch` `localStorage` persistence under `simcity_v1`.
2. **Three.js 3D Renderer (`src/renderer/`):**
   - `BuildingFactory.ts`: Cached low-poly geometry/material builders for terrain, 4-bit auto-tiled roads/bridges, R/C/I L0–L4 buildings, wind turbines, water towers, parks, and civic plazas.
   - `TrafficSystem.ts`: Miniature 3D cars traversing connected road tiles with night headlights.
   - `CityScene.ts`: `WebGLRenderer`, damped orbit/pan/zoom camera, ground-plane raycasting, construction pop-in animations, dust particles, Data Overlays, Day/Sunset/Night lighting, and `.dispose()` cleanup.
3. **Web Audio (`src/audio/sfx.ts`):** Procedural Web Audio API sound effects unlocked on first user gesture.
4. **React HUD (`src/components/` & `src/App.tsx`):** `TopHUD`, `ToolDock`, `TileInspector`, `AdvisorToast`, `HowToPlayModal`, and `NewCityModal`.
