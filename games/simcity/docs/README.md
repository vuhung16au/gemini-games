# SimCity 3D

**SimCity 3D** is a low-poly 3D browser city builder and urban simulation game—the first 3D title in the Gemini Games collection.

## Key Features
- **Interactive 3D Diorama:** Built with Three.js featuring auto-tiling roads and bridges, evolving Residential/Commercial/Industrial buildings (L0–L4), animated wind turbines, factory smoke, miniature road traffic, and Day / Sunset / Night lighting.
- **Road-Conducted Utilities:** Power Plants (`+35 MW`) and Water Towers (`+35`) distribute utilities across connected roads and adjacent zones via BFS graph traversal.
- **RCI Demand & Budget:** Dynamic Residential, Commercial, and Industrial demand, adjustable tax rates (`5%–15%`), monthly upkeep/revenue, land value, pollution, and 6 city milestones (`Hamlet` to `Megalopolis`).
- **3D Data Overlays & Guidance:** Toggle Power, Water, and Land Value overlays, inspect any tile, follow the 5-step Tutorial, or consult the Mayor Advisor Hint.

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, test, and build commands
- [architecture.md](./architecture.md) — Simulation, Three.js renderer, audio, and React HUD architecture
- [techstack.md](./techstack.md) — Stack and dependencies aligned with `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Rules, controls, RCI zoning, utilities, and persistence
- [developer-guide.md](./developer-guide.md) — Tuning constants, adding buildings, testing, and builds
