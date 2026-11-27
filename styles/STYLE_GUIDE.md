# Gemini Games — Shared Style & Behavior Guide

All games in `games/*` share a unified visual identity and consistent player-facing behavior.

---

## 1. Color Palette (Sourced from `HSC-QuestionBanks/frontend`)

Defined in [tokens.css](file:///Users/vuhung/Desktop/gemini-games/styles/tokens.css) (CSS) and [theme.ts](file:///Users/vuhung/Desktop/gemini-games/styles/theme.ts) (Canvas 2D / Three.js):

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--color-softivory` | `rgb(242, 239, 235)` / `#f2efeb` | Default page & warm UI surface background |
| `--color-bookwhite` | `rgb(255, 255, 255)` / `#ffffff` | Elevated cards, HUD panels, modals |
| `--color-deepcharcoal` | `rgb(48, 44, 42)` / `#302c2a` | Primary text, strong borders, crisp outlines |
| `--color-warmstone` | `rgb(145, 139, 131)` / `#918b83` | Muted borders, board frames, secondary chrome |
| `--color-bookpurple` | `rgb(60, 16, 83)` / `#3c1053` | Primary brand accent, primary CTA buttons, focus rings |
| `--color-lawpurple` | `rgb(181, 24, 37)` / `#b51825` | Secondary ruby accent, high-tier / danger actions |
| `--color-bookred` | `rgb(242, 18, 12)` / `#f2120c` | `"NEW"` badges, critical alerts, destructive indicators |
| `--color-bookblack` | `rgb(0, 0, 0)` / `#000000` | High-contrast shadows when needed |

---

## 2. Shared UI & Behavior Standards

Every game (2D or 3D) should follow these UX and engineering conventions:

1. **Zero External Runtime Assets / CDNs:**
   - Use system font stacks (`--font-sans`, `--font-mono`), procedural Canvas/Three.js rendering, and Web Audio API SFX so games load instantly and work offline.
2. **Responsive, Scrollbar-Free Viewport:**
   - Fit comfortably inside `100dvh` on both desktop and mobile portrait viewports.
   - Apply `touch-action: manipulation` (or `touch-action: none` on swipe/drag surfaces) and `user-select: none` on active game areas.
3. **Consistent Controls & Input Safety:**
   - Prevent default browser scrolling on `Space` and `Arrow*` keys.
   - Ignore `KeyboardEvent.repeat` for discrete actions (flaps, puzzle moves, jumps).
   - Ignore keyboard shortcuts when `ctrlKey`, `metaKey`, or `altKey` is held.
4. **Audio & Mute Behavior:**
   - Initialize/resume `AudioContext` on the first user gesture.
   - Provide a top-corner Mute toggle (`aria-label`, `aria-pressed`) that calls `e.stopPropagation()` so clicking it never triggers a game action.
5. **Lifecycle & Persistence:**
   - Handle `visibilitychange` (clamp `dt` or pause) so switching browser tabs never breaks physics or timers.
   - Enforce a short post-Game-Over input cooldown (`~400ms`) for instant-tap arcade games to prevent accidental restarts.
   - Persist `{ bestScore, muted }` (and any game-specific save state) under a versioned `localStorage` key (`<game_name>_v1`) wrapped in `try/catch`.

---

## 3. How to Use in Any Game

### CSS / React Overlays
Import the shared stylesheets before your game's local `style.css` in `src/main.tsx`:

```ts
import '../../../styles/tokens.css';
import '../../../styles/game-ui.css';
import './style.css';
```

### Canvas 2D / Three.js
Import `THEME_COLORS` from `../../../styles/theme` for matching backgrounds, HUD strokes, or 3D materials.
