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

## 练习与挑战（纯提示词 Vibe Coding）

使用下方示例提示词向 Google `agy` 提问——无需手动编写代码：

1. **深入理解项目：** 让 `agy` 解释 `Dino Run` 的障碍物生成间距与碰撞判定盒。
   ```text
   Read games/dino-run/src/game/engine.ts and explain how obstacle spawn gaps scale with speed and how hitbox forgiving margins work.
   ```
2. **改进现有功能：** 让 `agy` 为 `Dino Run` 的昼夜切换增加平滑渐变过渡。
   ```text
   In games/dino-run/src/renderer/canvasRenderer.ts, add a smooth color-lerp transition when switching between Day and Night every 700 points. Verify with make test GAME=dino-run and make build GAME=dino-run.
   ```
3. **实现新功能：** 让 `agy` 在分支上为 `Dino Run` 添加 **二段跳 (Double-Jump)** 机制。
   ```text
   /plan Add an optional Double-Jump mechanic to Classic mode in games/dino-run/ (types.ts, engine.ts) with a subtle jump-charge indicator on the HUD. Verify with make verify GAME=dino-run.
   ```
4. **完善测试 / 文档：** 让 `agy` 为新功能补充 Playwright E2E 断言并更新 `user-guide.md`。
   ```text
   Add a Playwright assertion in games/dino-run/e2e/dino.spec.ts verifying the new feature works in Chromium, and document it in games/dino-run/docs/user-guide.md. Run make test-e2e GAME=dino-run.
   ```
5. **创建新游戏：** 让 `agy` 打造一款类似的横版跑酷游戏 **“太空宇航员跑酷 (Space Astro Runner)”**。
   ```text
   /plan Create a similar endless runner "Space Astro Runner" in games/space-runner/ following AGENTS.md and .agents/skills/create-game/SKILL.md, dodging asteroids and laser drones with gravity flip controls.
   ```
