[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 1024 — 滑动数字合成益智游戏

一个基于 `1024game.org` 玩法设计的响应式 **1024** 益智网页游戏，采用 **React 18 + TypeScript + Vite** 与共享 `styles/` 设计令牌构建，内置 **智能提示**、**教学模式**、**撤销** 以及程序化 Web Audio API 音效。

## 核心特性
- **经典 1024 进阶：** 初始生成 `1`（90%）和 `2`（10%）方块，按 2 的幂次一路合并至 `1024`（达成后可选择 **继续挑战** `2048+`）。
- **流畅动画：** 合并残影过渡、新方块弹出动画与 `+score` 飘字特效。
- **辅助与教学：** 支持 **撤销**（最多 10 步）、**智能提示** 方向评估、**玩法说明** 弹窗以及 3 步 **教学模式**。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、开发服务器、测试与构建命令
- [architecture.md](./architecture.md) — 模块结构、合并规则、提示与教学系统
- [techstack.md](./techstack.md) — 语言、框架、测试与部署说明
- [user-guide.md](./user-guide.md) — 规则、操作、撤销、教学与设置
- [developer-guide.md](./developer-guide.md) — 扩展/调优 1024、运行 Vitest & Playwright 与构建
