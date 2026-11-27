---
name: canvas-and-threejs-patterns
description: Reusable 2D Canvas, Three.js WebGL, fixed-timestep loop, input, visibilitychange, and procedural Web Audio SFX patterns used in gemini-games.
---

# Canvas 2D, Three.js & Web Audio Patterns

## 1. Frame-Rate-Independent Game Loop
- Clamp frame delta: `const dt = Math.min(0.05, (now - last) / 1000);`
- Keep per-frame simulation state in `useRef` inside `requestAnimationFrame`; sync only HUD counters (score, lives, level, status) to React state so 60fps loops never trigger excessive React re-renders.
- Listen to `document.addEventListener('visibilitychange', ...)` to auto-pause when `document.hidden` is true.

## 2. Input & Viewport Hygiene
- Call `e.preventDefault()` on `Space` and `Arrow*` keys; ignore `e.repeat` and modifier keys (`e.ctrlKey || e.metaKey || e.altKey`).
- Disable accidental touch scroll/selection on playfields (`touch-action: none; user-select: none;`).
- Use `styles/theme.ts` tokens (`softivory`, `deepcharcoal`, `bookpurple`, `lawpurple`, `bookred`, `warmstone`) for Canvas/3D colors.

## 3. HiDPI Canvas 2D & Three.js Cleanup
- Scale Canvas 2D backing store by `Math.min(window.devicePixelRatio || 1, 2)`.
- For Three.js (`games/simcity/` pattern): wrap `WebGLRenderer` creation in `try/catch` for graceful fallback, use `ResizeObserver`, and `.dispose()` geometries, materials, and renderer on unmount.

## 4. Zero-Asset Procedural Web Audio SFX
- Lazy-initialize `AudioContext` on the first user gesture, honor `muted` state persisted in `<game_name>_v1`, and call `e.stopPropagation()` on the Mute button.
