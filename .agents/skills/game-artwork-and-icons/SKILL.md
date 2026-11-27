---
name: game-artwork-and-icons
description: Create original game artwork, multi-size PWA icons, HD/Full-HD cover graphics, manifest.webmanifest, and index.html wiring for games in gemini-games without external hotlinks.
---

# Original Game Artwork, Icons & Covers

Every game in `games/<slug>/` must ship original local assets in `public/` with zero third-party downloads or external CDNs.

## 1. Required Files in `games/<slug>/public/`
- `manifest.webmanifest`
- `icons/favicon.ico` (`32×32`)
- `icons/icon-32.png` (`32×32`)
- `icons/apple-touch-icon.png` (`180×180`)
- `icons/icon-192.png` (`192×192`)
- `icons/icon-512.png` (`512×512`)
- `graphics/cover-hd.png` (`1280×720`, 16:9)
- `graphics/cover-fullhd.png` (`1920×1080`, 16:9)

## 2. Generation Workflow
1. **In-Game Sprites & UI:** Prefer crisp inline `.svg` for cards, board pieces, and HUD icons.
2. **Cover & App Emblem:** Use `image-generator` to generate:
   - A square app emblem (used to derive `icon-512.png`, `icon-192.png`, `apple-touch-icon.png`, `icon-32.png`, `favicon.ico`).
   - A 16:9 cover illustration (used to derive `cover-fullhd.png` `1920×1080` and `cover-hd.png` `1280×720`).
3. **Derive Exact Sizes (macOS `sips` + Python Pillow for `.ico`):**
   ```bash
   sips -s format png -z 512 512 emblem.jpg --out public/icons/icon-512.png
   sips -s format png -z 192 192 emblem.jpg --out public/icons/icon-192.png
   sips -s format png -z 180 180 emblem.jpg --out public/icons/apple-touch-icon.png
   sips -s format png -z 32 32 emblem.jpg --out public/icons/icon-32.png
   sips -s format png -z 1080 1920 cover.jpg --out public/graphics/cover-fullhd.png
   sips -s format png -z 720 1280 cover.jpg --out public/graphics/cover-hd.png
   ```
   Convert `icon-32.png` to `public/icons/favicon.ico`.

## 3. `index.html` & In-Game Emblem
- Wire `./icons/favicon.ico`, `./icons/icon-32.png`, `./icons/apple-touch-icon.png`, `./manifest.webmanifest`, `./graphics/cover-hd.png` (`og:image`), `#3c1053` (`theme-color`), and `./src/main.tsx`.
- Display `./icons/icon-192.png` as a rounded emblem beside/above the game title in the header or start overlay.
- Verify with `make check-docs`.
