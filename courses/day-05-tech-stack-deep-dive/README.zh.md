[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 5 天 — 理解 Vibe Coding 背后的技术栈

**预计用时：** 1 小时 · **上一篇：** [第 4 天](../day-04-dev-tools-and-ai-agents/README.zh.md) · **下一篇：** [第 6 天](../day-06-modifying-dino-run/README.zh.md)

---

## 概览与核心概念
即使代码由 `agy` 自动编写，了解**技术栈中每个工具的作用**也能帮你提出更精准的创意！今天你将用通俗的方式理解为什么本项目采用 **TypeScript、Vite、React** 以及三种画面层：**CSS/SVG**、**HTML5 Canvas 2D** 与 **Three.js**。

| 画面技术 | 最适合的游戏类型 | 本项目示例 |
| :--- | :--- | :--- |
| **CSS Grid + SVG + React** | 棋盘、益智与卡牌游戏 | `1024`、`checkers`、`sudoku`、`minesweeper`、`solitaire`、`ta-la-phom` |
| **HTML5 Canvas 2D** | 60fps 街机、横版跳跃、像素风 | `dino-run`、`flappy-bird`、`tetris`、`battle-city`、`super-mario-bros` |
| **Three.js (3D WebGL)** | 3D 世界、视角、光照与阴影 | `simcity` |

---

## 学习目标与成果
完成第 5 天后，你将能够：
1. 在向 `agy` 描述新游戏时，选对合适的画面形式（**棋牌 UI**、**2D 画布** 或 **3D 世界**）。
2. 用通俗语言说明 **TypeScript**、**Vite**、**React**、**Web Audio**、**Vitest** 与 **Playwright** 的职责。
3. 理解为什么本项目不使用外部 CDN，从而实现离线可玩与极速加载。

---

## 分步指南

### 1. 6 大核心组件（大白话版）
- **TypeScript：** 在运行前自动检查拼写错误和遗漏，减少游戏崩溃。
- **Vite：** 在开发时提供即时预览（`make dev`），发布时把游戏打包得又小又快（`make build`）。
- **React：** 负责菜单、按钮、计分板、**玩法说明**弹窗和**教学引导**界面。
- **Web Audio API：** 用数学公式实时合成复古音效——无需下载任何 `.mp3` 文件！
- **Vitest & Playwright：** 自动验证游戏规则与真实浏览器点击按键。

---

## 示例 `agy` 提示词
```text
Introduce the tech stack used in this project in plain English (or Chinese),
and explain when I should ask for CSS/SVG vs. Canvas 2D vs. Three.js when
creating a new game.
```
```text
Explain why Gemini Games keeps zero external CDN links and generates sound
effects mathematically instead of downloading MP3 files.
```

---

## 核心要点
- 知道哪种画面层适合自己的想法，能让你的提示词清晰 10 倍。
- TypeScript + Vite + React + Vitest + Playwright 共同构成每款游戏背后的稳定底座。

---

## 练习与挑战（纯提示词 Vibe Coding）

使用下方示例提示词向 Google `agy` 提问——无需手动编写代码：

1. **深入理解项目：** 让 `agy` 解释全部 16 款游戏如何保持统一的配色与主题风格。
   ```text
   Explain in plain English how the shared style guide keeps colors, buttons, and
   Light/Dark themes consistent across the Hub and all 16 games.
   ```
2. **改进现有功能：** 让 `agy` 提高 `Tetris` 幽灵落点预览块的轮廓清晰度。
   ```text
   Improve the contrast of Tetris's Ghost piece outline so players can clearly
   see where the block will land, and verify with make verify GAME=tetris.
   ```
3. **实现新功能：** 让 `agy` 为 `Sudoku` 添加 **“高对比度模式”** 开关。
   ```text
   /plan Add a High-Contrast Mode toggle to Sudoku (saved with player settings)
   that makes selected cells and mistake highlights extra clear. Verify with make
   verify GAME=sudoku.
   ```
4. **完善测试 / 文档：** 让 `agy` 为 `Minesweeper` 增加手机屏幕尺寸的浏览器测试。
   ```text
   Add a Playwright browser test for Minesweeper confirming the Easy 9x9 board
   fits cleanly on a mobile phone screen (390x844) with no horizontal scrolling.
   Run make test-e2e GAME=minesweeper.
   ```
5. **创建新游戏：** 让 `agy` 打造一款带原创 SVG 图案的 **“记忆翻牌配对 (Memory Match)”** 游戏。
   ```text
   /plan Create a "Memory Match" card-flipping puzzle game following AGENTS.md,
   with a 4x4 grid, custom SVG card icons, move counter, How to Play, Tutorial,
   Hint, and automated tests.
   ```
