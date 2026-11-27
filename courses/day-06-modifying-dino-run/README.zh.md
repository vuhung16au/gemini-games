[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 6 天 — 改造你的第一款游戏（`Dino Run`）

**预计用时：** 1 小时 · **上一篇：** [第 5 天](../day-05-tech-stack-deep-dive/README.zh.md) · **下一篇：** [第 7 天](../day-07-building-a-board-game/README.zh.md)

---

## 概览与核心概念
在从零制作游戏前，建立 Vibe Coding 直觉最快的方式是用自然语言提示词**改造一款已可运行的游戏**。今天你将定制 **恐龙快跑 (Dino Run)**：更换天空配色、调整跑酷速度并添加全新障碍物——全程用 `make` 自动验证！

---

## 学习目标与成果
完成第 6 天后，你将能够：
1. 在修改游戏前创建安全的 Git 练习分支。
2. 用通俗提示词让 Google `agy` 修改画面配色、游戏节奏与障碍物——无需自己改代码。
3. 使用 `make dev GAME=dino-run` 与 `make verify GAME=dino-run` 验证每次改动。

---

## 分步指南

### 1. 创建练习 Git 分支
```bash
git checkout -b day-06-dino-mod
```

### 2. 实时预览 `Dino Run`
```bash
make dev GAME=dino-run
```

### 3. 提示 `agy` 定制配色、速度与障碍物
逐条使用下方示例提示词，观察实时预览变化，并运行自动检查：
```bash
make verify GAME=dino-run
```

---

## 示例 `agy` 提示词

**提示词 1 — 修改背景色：**
```text
Change Dino Run's Classic Desert daytime sky to a warm sunset peach (#fce7d6) while keeping strong contrast for the dinosaur and score text. Verify that tests and build pass.
```

**提示词 2 — 提升游戏节奏：**
```text
Make Dino Run start slightly faster and speed up a bit quicker so the action feels snappier, then run Dino Run's unit tests to confirm everything passes.
```

**提示词 3 — 添加新障碍物：**
```text
/plan Add a new rolling "desert boulder" obstacle to Classic mode in Dino Run that rolls slightly faster than cacti, and add automated unit tests for boulder collisions.
```

---

## 核心要点
- 小步聚焦的自然语言提示词 + 即时 `make verify GAME=dino-run` 检查，让 Vibe Coding 快速又稳妥。
- 你完全不需要知道速度或颜色写在哪个代码文件里——只需描述你想要的效果！

---

## 练习与挑战（纯提示词 Vibe Coding）

使用下方示例提示词向 Google `agy` 提问——无需手动编写代码：

1. **深入理解项目：** 让 `agy` 用大白话讲解 `Dino Run` 的所有玩法特性与难度节奏。
   ```text
   Explain the features in the game "Dino Run", including how the game gets harder over time, how Day/Night cycles work, and what the Tutorial and Hint markers do.
   ```
2. **改进现有功能：** 让 `agy` 把昼夜切换改为平滑渐变过渡。
   ```text
   Improve Dino Run's Classic mode so the sky smoothly blends between Day and Night every 700 points instead of switching abruptly. Verify with make verify GAME=dino-run.
   ```
3. **实现新功能：** 让 `agy` 在分支上为 `Dino Run` 添加 **二段跳 (Double-Jump)** 机制。
   ```text
   /plan Add an optional Double-Jump mechanic to Dino Run Classic mode with a small jump-charge indicator on the screen. Verify with make verify GAME=dino-run.
   ```
4. **完善测试 / 文档：** 让 `agy` 为新功能补充浏览器测试并更新 `Dino Run` 的用户指南。
   ```text
   Add a Playwright browser test confirming the new Double-Jump feature works in Dino Run, and document it in Dino Run's user guide.
   ```
5. **创建新游戏：** 让 `agy` 打造一款类似的横版跑酷游戏 **“太空宇航员跑酷 (Space Astro Runner)”**。
   ```text
   /plan Create a similar endless runner "Space Astro Runner" following AGENTS.md, where an astronaut dodges asteroids and laser drones with gravity-flip controls, How to Play, Tutorial, Hint, and automated tests.
   ```
