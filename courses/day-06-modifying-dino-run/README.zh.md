[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 6 天 — 改造你的第一款游戏（`Dino Run`）

**预计用时：** 1 小时 · **上一篇：** [第 5 天](../day-05-tech-stack-deep-dive/README.zh.md) · **下一篇：** [第 7 天](../day-07-building-a-board-game/README.zh.md)

---

## 概览与核心概念
在从零构建游戏之前，建立直觉最快的方式是用 AI 提示词**改造一款已可运行的游戏**。今天你将定制 [`games/dino-run/`](../../games/dino-run/docs/README.zh.md)：修改配色、调整物理速度，并添加全新障碍物——且全部通过 Vitest 与 Playwright 验证！

---

## 学习目标与成果
完成第 6 天后，你将能够：
1. 为改造现有游戏创建安全的 Git 特性分支。
2. 提示 Google `agy` 干净地修改渲染颜色与模拟常量。
3. 跨越 `types.ts`、`engine.ts`、`canvasRenderer.ts` 与 `engine.test.ts` 添加新的障碍物类型。
4. 使用 `npm test`、`npm run test:e2e`、`tsc --noEmit` 与 `npm run build` 验证改动。

---

## 分步指南

### 1. 创建练习 Git 分支
```bash
git checkout -b day-06-dino-mod
```

### 2. 查看即将修改的文件
- [`games/dino-run/src/game/constants.ts`](../../games/dino-run/src/game/constants.ts) — 速度常量（`BASE_SPEED`、`MAX_SPEED`、`SPEED_INCREMENT`）
- [`games/dino-run/src/game/types.ts`](../../games/dino-run/src/game/types.ts) & [`engine.ts`](../../games/dino-run/src/game/engine.ts) — 障碍物生成与碰撞检测
- [`games/dino-run/src/renderer/canvasRenderer.ts`](../../games/dino-run/src/renderer/canvasRenderer.ts) — 天空背景色与障碍物绘制

### 3. 提示 `agy` 定制配色与速度
逐条使用下方的示例提示词，然后运行预览：
```bash
cd games/dino-run && npm run dev
```

### 4. 提示 `agy` 添加新障碍物与单元测试
让 `agy` 添加一种新障碍物（例如滚动的**沙漠巨石**或**陨石**），在 `canvasRenderer.ts` 中绘制它，并在 `src/game/__tests__/engine.test.ts` 中补全 Vitest 单元测试。

### 5. 运行完整验证门槛
```bash
cd games/dino-run
npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## 示例 `agy` 提示词

**提示词 1 — 修改背景色：**
```text
In games/dino-run/src/renderer/canvasRenderer.ts, change the Classic Desert daytime background to a warm sunset peach (#fce7d6) while keeping high contrast for the deep-purple T-Rex and score text. Verify with npm test and npm run build.
```

**提示词 2 — 调整速度：**
```text
In games/dino-run/src/game/constants.ts, increase BASE_SPEED from 290 to 340 and SPEED_INCREMENT from 5.8 to 7.5 so the game feels snappier. Run npm test in games/dino-run to confirm all unit tests still pass.
```

**提示词 3 — 添加新障碍物：**
```text
/plan Add a new "boulder" obstacle to Classic mode in games/dino-run/ (types.ts, engine.ts, canvasRenderer.ts) that rolls along the ground slightly faster than cacti, and add a Vitest test for boulder collision in src/game/__tests__/engine.test.ts.
```

---

## 核心要点
- 小步聚焦的提示词 + 即时验证（`npm test`、`npm run dev`）让 Vibe Coding 快速且可控。
- 新增游戏实体时务必同步更新单元测试。

---

## 练习与挑战
1. 在你的 `day-06-dino-mod` 分支上为 `Dino Run` 添加**二段跳**或**护盾道具**。
2. **挑战：** 在 `games/dino-run/e2e/dino.spec.ts` 中新增一条 Playwright 断言，在 Chromium 中验证你的新功能，并在本地分支提交代码。
