[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 8 天 — 从零构建你的第一款 2D 街机游戏

**预计用时：** 1 小时 · **上一篇：** [第 7 天](../day-07-building-a-board-game/README.zh.md) · **下一篇：** [第 9 天](../day-09-building-a-3d-game/README.zh.md)

---

## 概览与核心概念
今天你将从回合制棋盘进阶到从零打造 **60fps 实时 2D 街机游戏**（例如 **打砖块 (Breakout)** 或 **贪吃蛇 (Snake)**）。

你会让 `agy` 自动处理的 2D 核心体验：
- **流畅运动与自动暂停：** 游戏以每秒 60 帧流畅运行，切换浏览器标签页时自动暂停。
- **真实反弹与碰撞：** 球体根据撞击挡板的位置与砖块角度自然反弹。
- **桌面 + 触控双支持：** 同时支持键盘（`方向键`/`WASD`/`空格`）与鼠标/触屏拖拽。

---

## 学习目标与成果
完成第 8 天后，你将能够：
1. 用自然语言向 `agy` 描述一款实时 2D 街机游戏（关卡、道具、操作、音效）。
2. 使用 `make test GAME=breakout` 与 `make test-e2e GAME=breakout` 验证物理规则与真实浏览器游玩。

---

## 分步指南

### 1. 创建特性分支
```bash
git checkout -b day-08-2d-breakout
```

### 2. 使用 `/plan` 提示 `agy` 构建 2D 街机游戏
粘贴下方示例提示词，审阅计划并批准执行。

### 3. 验证独立游戏与统一大厅
```bash
make verify GAME=breakout
make verify
```

---

## 示例 `agy` 提示词

```text
/plan Build a new 2D arcade game "Breakout" in games/breakout/ following
AGENTS.md completely:
- Smooth paddle & bouncing ball physics, 5 brick layouts, power-ups (Wide
  Paddle & Multi-Ball), lives, and combo scoring
- Crisp 2D Canvas graphics matching the Gemini Games theme, plus retro Web
  Audio SFX & Mute toggle
- Works with Keyboard (Arrows/A-D/Space) and mouse/touch drag, and auto-pauses
  when switching tabs
- How to Play modal, 3-step Tutorial, live Hint tip, original icons & covers,
  multilingual READMEs, and >=70% test coverage
```

---

## 核心要点
- 你只需描述*街机手感*（连击、道具、触控与键盘），`agy` 会自动套用仓库成熟的 2D Canvas 模式。
- `make verify GAME=<slug>` 确保物理逻辑、UI、文档与浏览器测试全部通过。

---

## 练习与挑战（纯提示词 Vibe Coding）

使用下方示例提示词向 Google `agy` 提问——无需手动编写代码：

1. **深入理解项目：** 让 `agy` 用大白话解释像 `Battle City` 或 `Breakout` 这类 2D 游戏是如何保持 60fps 流畅的。
   ```text
   Explain in plain English how 2D Canvas games in this project keep movement
   smooth at 60fps and handle keyboard + touch controls without scrolling the
   page.
   ```
2. **改进现有功能：** 让 `agy` 优化挡板边缘反弹角度并让连击音效随连击数升高音调。
   ```text
   In Breakout, refine paddle edge-hit bounce angles so corner shots feel
   snappier, and raise the Web Audio chime pitch as the player's brick-break
   combo grows. Verify with make verify GAME=breakout.
   ```
3. **实现新功能：** 让 `agy` 添加一个需要击中 3 次且逐级裂开的 **Boss 砖块**。
   ```text
   /plan Add a "Boss Brick" (takes 3 hits, shows visual cracks after each hit,
   awards bonus points) to Breakout with automated unit tests. Verify with make
   verify GAME=breakout.
   ```
4. **完善测试 / 文档：** 让 `agy` 补充移动端触控拖拽浏览器测试并更新用户指南。
   ```text
   Add a Playwright browser test confirming Breakout's paddle responds to
   touch/pointer dragging on mobile viewports, and document mobile controls in
   Breakout's user guide.
   ```
5. **创建新游戏：** 让 `agy` 打造另一款经典 2D 街机游戏 **贪吃蛇 (Classic Snake)**。
   ```text
   /plan Create "Classic Snake" following AGENTS.md, with wall-wrap toggle, speed
   levels, food combos, How to Play, Tutorial, Hint, and automated unit + browser
   tests.
   ```
