[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 1 天 — 游戏开发入门与 Vibe Coding

**预计用时：** 1 小时 · **上一篇：** [课程目录](../README.zh.md) · **下一篇：** [第 2 天](../day-02-game-dev-concepts/README.zh.md)

---

## 概览与核心概念
今天你将探索 **Gemini Games** 项目，了解 **Vibe Coding** 在实践中的工作方式，并在本地启动包含 16 款游戏的统一大厅——全程无需手动编写一行代码。

- **结构化 Vibe Coding：** 你只需用通俗的自然语言描述*想要实现的效果或想了解的内容*，由 Google `agy` 自动规划并生成代码与资源，然后**用一条简单的自动化命令验证结果**。
- **本地优先的网页游戏：** 本项目中的每款游戏都可直接在浏览器离线运行，并可一键打包部署为静态网站。

---

## 学习目标与成果
完成第 1 天后，你将能够：
1. 说明 AI 智能体如何帮助非技术背景的创作者完成策划、制作、美术与测试。
2. 使用 `npm run dev` 在本地启动统一的 Gemini Games 游戏大厅。
3. 用自然语言让 `agy` 总结项目、介绍技术栈并讲解游戏功能。

---

## 分步指南

### 1. 检查本地环境
```bash
node -v   # 建议 Node.js 20+
npm -v
git --version
```

### 2. 安装依赖并启动游戏大厅
在仓库根目录运行：
```bash
npm install
npm run dev
```
打开 Vite 输出的本地地址（例如 `http://localhost:5173`），尝试以下操作：
- 按分类筛选（`益智`、`棋类`、`街机`、`模拟`、`卡牌`）。
- 按 `/` 搜索，使用 `方向键` 移动卡片焦点，按 `Enter` 启动 **恐龙快跑 (Dino Run)** 或 **模拟城市 3D (SimCity 3D)**。
- 切换 `EN` / `中文` / `VI` 语言、浅色/深色主题，并收藏一款游戏。

### 3. 用通俗提示词探索项目
无需阅读代码文件——直接使用下方提示词让 `agy` 为你讲解全局。

---

## 示例 `agy` 提示词
尝试向你的 AI 智能体提问：
```text
Summarise this project in plain English (or Chinese) for a non-technical learner, including what all 16 games are and how the Hub brings them together.
```
```text
Introduce the tech stack used in this project and explain what each tool does in simple, everyday language.
```

---

## 核心要点
- Vibe Coding 让非 IT 创作者只需描述期望效果即可打造真实的网页游戏。
- 一条 `npm run dev` 命令即可同时运行根目录游戏大厅与全部 16 款独立游戏。

---

## 练习与挑战（纯提示词 Vibe Coding）

使用下方示例提示词向 Google `agy` 提问——无需手动编写代码：

1. **深入理解项目：** 让 `agy` 按类型与画面风格汇总全部 16 款游戏。
   ```text
   Summarise the project and group all 16 games by category (Puzzle, Board, Arcade, Simulation, Card) and visual style (2D, 3D, or Board/Card).
   ```
2. **改进现有功能：** 让 `agy` 优化三语空搜索提示文案。
   ```text
   Improve the Hub's empty-search message so it gently reminds players they can press "/" to search or click Reset Filters, in English, Chinese, and Vietnamese. Verify everything passes.
   ```
3. **实现新功能：** 让 `agy` 在大厅添加一个 **“🎲 随机畅玩”** 按钮。
   ```text
   /plan Add a "Surprise Me" button to the Hub header (with English, Chinese, and Vietnamese labels) that picks and opens a random game from the visible list, and verify with automated tests.
   ```
4. **完善测试 / 文档：** 让 `agy` 核对三语根 `README` 是否完整列出全部 16 款游戏。
   ```text
   Check that the root README files in English, Chinese, and Vietnamese list all 16 games accurately, and run the project's documentation compliance check.
   ```
5. **创建新游戏：** 让 `agy` 从零搭建一个极简的 **“猜数字 (Guess the Number)”** 益智小游戏。
   ```text
   /plan Create a simple "Guess the Number" puzzle game following the project's AGENTS.md rules, with a 1-100 range, Higher/Lower hints, How to Play, Tutorial, and automated tests.
   ```
