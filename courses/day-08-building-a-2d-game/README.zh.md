[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 8 天 — 从零构建你的第一款 2D Canvas 游戏

**预计用时：** 1 小时 · **上一篇：** [第 7 天](../day-07-building-a-board-game/README.zh.md) · **下一篇：** [第 9 天](../day-09-building-a-3d-game/README.zh.md)

---

## 概览与核心概念
今天你将从回合制棋盘进阶到从零构建 **60fps 实时 HTML5 Canvas 2D 游戏**（例如在 `games/breakout/` 中实现 **打砖块 (Breakout)** 或 **贪吃蛇 (Snake)**，Playwright 端口 **`4190`**）。

你将应用的核心 2D 实时开发模式：
- **限幅 `dt` 游戏循环：** `const dt = Math.min(0.05, (now - last) / 1000)` + `visibilitychange` 自动暂停。
- **碰撞数学：** 在纯 TypeScript `src/game/engine.ts` 中实现圆与 AABB 矩形碰撞反弹（打砖块）或网格占用检测（贪吃蛇）。
- **响应式输入：** 键盘（`方向键` / `WASD`、`空格`、`preventDefault()`）+ 指针/触控操作（`touch-action: none`）。

---

## 学习目标与成果
完成第 8 天后，你将能够：
1. 设计解耦 `src/game/` 模拟层与 `src/renderer/canvasRenderer.ts` 渲染层的实时 2D Canvas 游戏架构。
2. 添加程序化 Web Audio API 音效（反弹、碎砖、连击提示音、游戏结束）。
3. 使用 Vitest 确定性测试实时 Canvas 逻辑，并用 Playwright 在 Chromium 中进行真实交互测试。

---

## 分步指南

### 1. 创建特性分支
```bash
git checkout -b day-08-2d-breakout
```

### 2. 参考仓库中的现有 2D Canvas 游戏
浏览 [`games/battle-city/docs/architecture.md`](../../games/battle-city/docs/architecture.md) 或 [`games/tetris/docs/architecture.md`](../../games/tetris/docs/architecture.md)，观察 `requestAnimationFrame`、输入 `ref` 与 React HUD 覆盖层如何协作，避免 60fps React 重渲染卡顿。

### 3. 使用 `/plan` 提示 `agy` 构建你的 2D 游戏
使用下方示例提示词，审阅计划（碰撞数学、关卡、端口 `4190`）并批准执行。

### 4. 验证独立运行与统一大厅
```bash
cd games/breakout && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
cd ../.. && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## 示例 `agy` 提示词

```text
/plan Build a new 2D HTML5 Canvas game "Breakout" in games/breakout/ following AGENTS.md completely:
- Pure simulation in src/game/ (paddle movement, circle-vs-AABB brick & paddle angle bounce, 5 brick layouts, power-ups: Wide Paddle & Multi-Ball, lives, combo scoring, localStorage breakout_v1)
- Crisp Canvas 2D renderer using styles/theme.ts colors, procedural Web Audio SFX + Mute
- Keyboard (Arrows/A-D/Space) + pointer/touch drag controls, visibilitychange auto-pause
- How to Play modal, 3-step Tutorial, live Hint tip, original icons & covers in public/, all 6 docs in docs/ (plus README.zh.md and README.vi.md)
- Vitest unit tests + Playwright E2E tests on dedicated port 4190
- Register in src/registry/games.ts (category: Arcade) and update root tests
```

---

## 核心要点
- 将每帧物理状态保存在 `useRef` + `requestAnimationFrame` 中，仅把 HUD 计数器（分数、生命、关卡）同步到 React state。
- `src/game/` 中的纯碰撞函数让 Vitest 无需打开浏览器就能验证复杂的反弹角度。

---

## 练习与挑战
1. 在桌面键盘与移动端触控视口（使用浏览器 DevTools 响应式模式）下分别通关第 1 关与第 2 关。
2. **挑战：** 让 `agy` 添加一个**Boss 砖块**（需要击中 3 次，每次受击产生裂纹视觉效果），并补充验证 3 次击碎的单元测试。
