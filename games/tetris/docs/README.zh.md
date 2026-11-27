[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 俄罗斯方块 — 经典方块街机游戏

一款严格遵循官方指南标准的 **俄罗斯方块 (Tetris)** 网页游戏，参考 `freetetris.org` 打造，采用 **React 18 + TypeScript + Vite + HTML5 Canvas 2D** 与共享 `styles/` 设计令牌，支持 **SRS 踢墙旋转**、**7-bag 随机序列**、**暂存 (Hold)**、**幽灵块投影**、**智能提示**、**教学模式** 以及程序化 Web Audio API 音效。

## 核心特性
- **指南级机制：** 10×20 棋盘、7-bag 随机生成器、3 块 Next 预览队列、暂存槽位（每次下落可用一次）、幽灵落点预览、SRS 踢墙旋转以及 450 ms 锁定延迟。
- **学习与辅助工具：** 内置 **玩法说明** 弹窗、3 步交互式 **教学模式** 与 **智能落点提示** 覆盖层。
- **零外部资源：** HiDPI Canvas 2D 方块绘制、内联 SVG 预览、程序化 Web Audio API 音效与安全的 `localStorage` 持久化（`tetris_v1`）。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、开发服务器、测试与构建命令
- [architecture.md](./architecture.md) — 模块布局、固定步长循环、SRS 踢墙与提示
- [techstack.md](./techstack.md) — 语言、框架、渲染、测试与部署
- [user-guide.md](./user-guide.md) — 操作、计分、教学与设置
- [developer-guide.md](./developer-guide.md) — 扩展/调优俄罗斯方块、运行 Vitest & Playwright 与构建
