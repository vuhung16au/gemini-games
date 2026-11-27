# Architecture — Cozy Town Tycoon

Cozy Town Tycoon separates **pure economy & offline progression** (`src/game/`) from **pixel-art Canvas rendering** (`canvasScene.ts`) and **React management UI** (`src/components/`).

## Module Structure

```text
games/cozy-town-tycoon/
├── docs/                   # Project documentation
├── e2e/
│   └── bakery.spec.ts      # Playwright end-to-end browser tests
└── src/
    ├── main.tsx
    ├── App.tsx             # Game engine hook host, Help/Tutorial/Hint state
    ├── hooks/useGameEngine.ts # Tick loop, customer simulation, auto-save
    ├── styles/pixel.css    # Cozy 16-bit pixel UI styling
    ├── components/
    │   ├── HUD.tsx         # Title emblem, coins, auto/s, counter, Help/Tutorial/Hint/Mute/Reset
    │   ├── BakeryCanvas.tsx# Pixel bakery canvas + Tap-to-Bake progress bar
    │   ├── ManagementPanel.tsx # Products, Upgrades, Staff, and Town preview tabs
    │   ├── WelcomeBackModal.tsx # Offline earnings reward summary
    │   └── HowToPlayModal.tsx # In-game rules & progression guide
    └── game/
        ├── config.ts       # Products, 5 upgrade tiers, staff costs, offline caps
        ├── types.ts        # GameState, OfflineSummary, CustomerEntity
        ├── economy.ts      # Pure bake, sell, upgrade, staff, and offline math
        ├── hints.ts        # Smart next-action advisor
        ├── canvasScene.ts  # 16-bit procedural pixel-art Canvas 2D renderer
        ├── audio.ts        # Procedural Web Audio API SFX
        ├── storage.ts      # Safe localStorage persistence (cozy_town_tycoon_v1)
        └── __tests__/
            └── economy.test.ts
```
