# 4. Mandatory Game Title, Icons & Graphics Assets

Every game project (`games/<game-name>/`) **must** have its own distinct **game title**, **multi-size icons**, and **HD / Full-HD graphics** inside `public/`:

```text
games/<game-name>/public/
├── manifest.webmanifest
├── icons/
│   ├── favicon.ico            # 32x32 ICO browser favicon
│   ├── icon-32.png            # 32x32 PNG favicon
│   ├── apple-touch-icon.png   # 180x180 iOS home screen icon
│   ├── icon-192.png           # 192x192 PWA icon
│   └── icon-512.png           # 512x512 PWA / store icon
└── graphics/
    ├── cover-hd.png           # 1280x720 (HD 16:9)
    └── cover-fullhd.png       # 1920x1080 (Full HD 16:9)
```

- **`index.html`:** Include a distinct `<title>`, `<meta name="description">`, `<meta name="theme-color" content="#3c1053" />`, `<link rel="icon" href="./icons/favicon.ico" sizes="any" />`, `<link rel="icon" type="image/png" sizes="32x32" href="./icons/icon-32.png" />`, `<link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon.png" />`, `<link rel="manifest" href="./manifest.webmanifest" />`, and Open Graph tags (`og:title`, `og:description`, `og:image: ./graphics/cover-hd.png`).
- **In-Game Emblem:** Display `./icons/icon-192.png` as a clean rounded emblem beside or above the game title in the header or start screen.
- **Creating Original Graphics:** Always create our own original game graphics (never download or hotlink third-party assets):
  - **Prefer `.svg` format** for crisp, lightweight, scalable vector icons, sprites, and UI graphics whenever suitable.
  - **Ask `agy` (Antigravity / `image-generator`)** to generate custom raster images or cover artwork when rich illustrated graphics are needed, then derive the required `icons/` and `graphics/` sizes (`favicon.ico`, `icon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `cover-hd.png`, `cover-fullhd.png`).
- **Unified Hub Registration:** Use relative `<script type="module" src="./src/main.tsx"></script>` in `games/<game-name>/index.html` and add the game entry to [games.ts](../../src/registry/games.ts) so it is served automatically in the root 4-column Dashboard (`npm run dev` at the repository root).
