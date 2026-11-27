[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 5 天 — 技术栈深度解析

**预计用时：** 1 小时 · **上一篇：** [第 4 天](../day-04-dev-tools-and-ai-agents/README.zh.md) · **下一篇：** [第 6 天](../day-06-modifying-dino-run/README.zh.md)

---

## 概览与核心概念
今天你将了解本仓库为何选择 [`docs/techstack.md`](../../docs/techstack.md) 与 [`techstacks/techstack.md`](../../techstacks/techstack.md) 中的各项技术，以及何时选用 **CSS/SVG**、**HTML5 Canvas 2D** 或 **Three.js**。

| 渲染层 | 最适合的场景 | 本仓库示例 |
| :--- | :--- | :--- |
| **CSS Grid + SVG + React** | 棋盘、益智与卡牌游戏 | `1024`、`checkers`、`sudoku`、`minesweeper`、`solitaire`、`ta-la-phom` |
| **HTML5 Canvas 2D** | 高帧率 60fps 街机、横版跳跃、像素风 | `dino-run`、`flappy-bird`、`tetris`、`battle-city`、`super-mario-bros` |
| **Vanilla Three.js (WebGL)** | 3D 世界、相机、光照、射线拾取 | `simcity` |

---

## 学习目标与成果
完成第 5 天后，你将能够：
1. 为任何新游戏创意选择合适的渲染层（CSS/SVG、Canvas 2D 或 Three.js）。
2. 说明 **TypeScript**、**Vite**、**React**、**Web Audio API**、**Vitest** 与 **Playwright** 的各自职责。
3. 读懂基础的 Canvas 2D 绘制循环与 Three.js 场景搭建。

---

## 分步指南

### 1. 核心基础栈
- **TypeScript (`strict: true`)：** 在编译阶段捕获非法状态、坐标错误与缺失字段（`npx tsc --noEmit`）。
- **Vite (`base: './'`)：** 在 `npm run dev` 下提供毫秒级热更新，并输出纯净静态 `dist/` 包。
- **React 18：** 在游戏画布之上渲染可访问的 HUD、弹窗（`HowToPlayModal`）、按钮与覆盖层。

### 2. 对比仓库中的三类真实渲染器
打开每一层的一个代表文件：
1. **CSS/SVG：** [`games/checkers/src/components/CheckersBoard.tsx`](../../games/checkers/src/components/CheckersBoard.tsx)
2. **HTML5 Canvas 2D：** [`games/battle-city/src/renderer/canvasRenderer.ts`](../../games/battle-city/src/renderer/canvasRenderer.ts)
3. **Three.js 3D：** [`games/simcity/src/renderer/CityScene.ts`](../../games/simcity/src/renderer/CityScene.ts)

### 3. 测试技术栈
- **Vitest：** 在 Node 中极速运行纯 TypeScript 单元测试（`src/**/*.test.ts`）。
- **Playwright：** 启动真实 Chromium，模拟点击、按键、校验零控制台报错，并验证 `localStorage` 持久化（`e2e/*.spec.ts`）。

---

## 示例 `agy` 提示词
```text
Compare how games/dino-run/src/renderer/canvasRenderer.ts (Canvas 2D) and games/simcity/src/renderer/CityScene.ts (Three.js) handle the animation loop, resizing, and cleanup on unmount.
```

---

## 核心要点
- 选用最贴合游戏机制的极简渲染工具：棋牌用 CSS/SVG，2D 动作游戏用 Canvas 2D，3D 世界用 Three.js。
- 始终用 React 管理 HUD/菜单，用程序化 Web Audio API 实现零音频资源音效。

---

## 练习与挑战
1. 阅读 [`docs/techstack.md`](../../docs/techstack.md)，列出本项目避免外部运行时 CDN 的 3 个原因。
2. **挑战：** 打开 [`styles/tokens.css`](../../styles/tokens.css) 与 [`styles/theme.ts`](../../styles/theme.ts)，观察 CSS 变量与 Canvas/Three.js 颜色如何保持同步。
