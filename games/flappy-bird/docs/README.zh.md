[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 像素飞鸟 — 网页街机版

一款帧率无关的 **Flappy Bird** 街机网页游戏，基于 **React 18 + TypeScript + Vite + HTML5 Canvas 2D** 与共享 `styles/` 设计令牌构建，支持 **练习教学** 模式、**飞行走廊提示** 以及程序化 Web Audio API 音效。

## 核心特性
- **确定性固定步长物理：** 在 `60Hz`、`120Hz` 与 `144Hz+` 显示器上呈现完全一致的飞行轨迹（`1/120 s` 物理步长与 `0.05 s` 切页限幅）。
- **渐进难度与奖牌：** 管道间隙从 `145 px` 逐步收窄至 `120 px`，并颁发铜牌（`10+`）、银牌（`20+`）、金牌（`30+`）与白金奖牌（`40+`）。
- **辅助与学习：** 内置 **玩法说明** 弹窗、**练习教学** 模式（更宽的 `190 px` 管道）与 **提示** 目标飞行走廊覆盖层。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、开发服务器、测试与构建命令
- [architecture.md](./architecture.md) — 模块布局、固定步长循环、碰撞与 Canvas 渲染器
- [techstack.md](./techstack.md) — 语言、框架、渲染、测试与部署
- [user-guide.md](./user-guide.md) — 操作、奖牌、教学、提示与设置
- [developer-guide.md](./developer-guide.md) — 调整物理常量、运行 Vitest & Playwright 与构建
