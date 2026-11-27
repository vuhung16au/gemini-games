# Cozy Town Tycoon — Product Requirements Document (v1)

## 1. Overview
**Cozy Town Tycoon** is a browser-playable, cozy 16-bit pixel-art bakery tycoon built with **React + TypeScript + Vite** and an **HTML5 `<canvas>`** pixel-art scene. The player starts with a single neighborhood bakery, taps to bake fresh pastries onto the display counter, watches pixel-art townsfolk walk in and buy them for coins, hires staff to automate the shop, and upgrades equipment across 5 tiers—with earnings continuing to grow offline.

The economy is tuned so a clear sense of progression shows up within the first **1–5 minutes** of play.

---

## 2. Scope (v1)
- **Single Bakery Shop**: A cozy pixel-art bakery interior with an animated brick oven, wooden display counter, walking customers, and hired staff behind the counter.
- **Town Expansion Teaser**: A visible locked **Town** tab / signpost previewing future v2 town plots (Cozy Café, Flower Shop, Bookshop).
- **Zero External Asset Dependencies**: All pixel-art sprites and retro sound effects are rendered procedurally via Canvas 2D sprite matrices and Web Audio API.

---

## 3. Core Gameplay Loop
1. **Tap to Bake**: Clicking/tapping the bakery oven (or the accessible Bake button) adds bake progress toward the currently selected product. When a bake completes, 1 item is added to the display counter (up to current display capacity).
2. **Auto-Sell to Customers**: Pixel-art customers walk in from the shop door at regular intervals, stop at the counter, purchase a stocked item (prioritizing highest-value stocked goods), spawn floating `+coins` feedback, and leave happily.
3. **Reinvest**: Spend coins on:
   - Unlocking higher-value **Products** (3 total).
   - Purchasing **Equipment & Shop Upgrades** (5 sequential tiers).
   - Hiring & leveling up **Staff** (Apprentice Baker & Friendly Cashier).
4. **Offline Growth**: When the player leaves and returns after more than 10 seconds, offline earnings are calculated from automated production/sales (capped at **8 hours**) and presented in a **Welcome Back!** modal.

---

## 4. Products (3)
| ID | Product | Unlock Cost | Taps to Bake | Base Sell Price | Notes |
| --- | --- | --- | --- | --- | --- |
| `bread` | Country Bread | Free (Unlocked) | 1 | 3 coins | Fast starter item |
| `croissant` | Butter Croissant | 75 coins | 2 | 12 coins | Reachable in ~1 min |
| `tart` | Berry Tart | 400 coins | 3 | 45 coins | High-margin pastry |

- Players can switch their active baking product at any time among unlocked products.
- Staff bakers automatically bake the player's currently selected product (or highest unlocked product if desired; defaults to active product so players feel in control).

---

## 5. Upgrade Tiers (5)
| Tier | Name | Cost | Effect |
| --- | --- | --- | --- |
| 1 | Cast-Iron Oven | 25 coins | `+1` bake progress per tap (2/tap) |
| 2 | Warm Display Case | 180 coins | `+4` display capacity & `+35%` customer arrival speed |
| 3 | Stone Hearth | 800 coins | `2x` bake progress per tap & `+25%` sell value |
| 4 | Cozy Neon Sign | 2,200 coins | `+50%` customer arrival speed & `+20%` tip chance (1.5x sale) |
| 5 | Master Patisserie | 6,000 coins | `2x` all coin earnings & `+6` display capacity |

---

## 6. Staff Roles (2)
| ID | Role | Base Cost | Scaling | Effect per Level |
| --- | --- | --- | --- | --- |
| `baker` | Apprentice Baker | 120 coins | `floor(base * 1.45^lvl)` | Auto-bakes items into the display counter (`0.5 * lvl` bake-progress/sec, scaling smoothly) |
| `cashier` | Friendly Cashier | 550 coins | `floor(base * 1.45^lvl)` | `+15%` coin value per level & faster customer checkout |

---

## 7. Persistence & Offline Earnings
- **Storage**: Auto-saved to `localStorage` under a versioned key (`cozy_town_tycoon_v1`) every 2 seconds and on `beforeunload`.
- **Offline Formula**:
  - `elapsedSeconds = clamp((now - lastSavedAt) / 1000, 0, 28800)` (8-hour cap).
  - Requires `elapsedSeconds >= 10` and `estimatedCoinsPerSec > 0` to show the **Welcome Back!** modal.
  - `offlineCoins = floor(elapsedSeconds * estimatedCoinsPerSec)`.
- **Reset Save**: Available in the HUD with a confirmation step.

---

## 8. UI/UX & Technical Requirements
- **Stack**: React 18, TypeScript, Vite, HTML5 Canvas 2D (`imageSmoothingEnabled = false`, `image-rendering: pixelated`), Vitest for unit tests.
- **Responsive Layout**: Side-by-side layout on desktop (Canvas scene + Management Panel) and stacked layout on mobile viewports.
- **Audio**: Lightweight Web Audio API retro SFX for baking, coin chimes, and upgrades, with a persistent Mute toggle.
- **Verification**:
  - Unit tests covering economy formulas, upgrade effects, staff scaling, 8-hour offline earnings cap, and storage serialization.
  - Clean TypeScript compilation (`tsc --noEmit`) and production build (`vite build`).
