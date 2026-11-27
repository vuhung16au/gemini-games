[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 第 1 天 — 游戏开发入门与 Vibe Coding

**预计用时：** 1 小时 · **上一篇：** [课程目录](../README.zh.md) · **下一篇：** [第 2 天](../day-02-game-dev-concepts/README.zh.md)

---

## 概览与核心概念
今天你将探索 **Gemini Games** 仓库，理解如何借助 AI 智能体进行 **Vibe Coding**，并在本地启动包含多款游戏的统一游戏大厅。

- **结构化 Vibe Coding：** 用清晰的自然语言描述*想要实现的目标*，让 AI 编程智能体（`agy`）规划并生成代码与资源，然后**通过自动化测试验证每一次修改**。
- **本地优先的网页游戏：** 仓库中的每款游戏都可离线在浏览器运行（零外部 CDN），并可打包为静态 `dist/` 目录部署到 Cloudflare Workers。

---

## 学习目标与成果
完成第 1 天后，你将能够：
1. 说明 AI 编程智能体如何加速规划、编码、美术资源生成与测试。
2. 使用 `npm run dev` 在本地启动统一的 Gemini Games 游戏大厅。
3. 浏览现有游戏，并打开任意游戏的 `docs/` 文档目录。

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
- 切换浅色/深色主题、切换语言（`EN` / `中文` / `VI`），并收藏一款游戏。

### 3. 浏览核心参考文件
阅读以下三个文件，了解项目如何保持规范一致：
- [`README.zh.md`](../../README.zh.md) — 项目总览与全部游戏列表
- [`QUICKSTART.md`](../../QUICKSTART.md) — 日常开发与部署命令
- [`AGENTS.md`](../../AGENTS.md) — AI 智能体在本仓库开发游戏时遵循的“契约规范”

---

## 示例 `agy` 提示词
尝试向你的 AI 智能体提问：
```text
Explain the folder structure of this repository and list all games grouped by rendering technology (Canvas 2D, Three.js, CSS/SVG).
```
```text
Run npm test at the repository root and explain what each passing test verifies.
```

---

## 核心要点
- 当 Vibe Coding 与清晰的规范（[`AGENTS.md`](../../AGENTS.md)）和自动化测试结合时，效果最佳。
- 一条 `npm run dev` 命令即可同时服务根目录游戏大厅与所有独立游戏。

---

## 练习与挑战
1. 分别启动 **3 款不同技术栈的游戏**（1 款 Canvas 2D、1 款 CSS/SVG 棋牌/益智、1 款 `SimCity 3D`），并打开每款游戏的 **? 帮助** 弹窗与 **教学模式**。
2. 在仓库根目录运行 `npm test`，确认所有单元测试通过。
3. **挑战：** 打开 `games/dino-run/docs/README.zh.md`，对照检查其文档结构是否符合 `AGENTS.md`。
