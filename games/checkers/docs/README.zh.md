[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 国际跳棋 — 经典棋盘游戏

一款参考 `247checkers.com` 打造的响应式 **8×8 美式跳棋** 网页游戏，使用 **React 18 + TypeScript + Vite** 与共享 `styles/` 设计令牌开发，内置 Alpha-Beta 剪枝 AI 对手与程序化 Web Audio API 音效。

## 核心特性
- **多种对战模式：** 支持 **人机对战**（简单、中等、困难）或 **本地双人** 同屏对弈。
- **地道美式跳棋规则：** 强制吃子、强制连续跳吃、升变王棋（王棋可斜向前进或后退），以及吃光或无子可动判胜。
- **贴心辅助控制：** 合法走法与吃子高亮提示、**提示** 推荐走法、**撤销**、**新游戏** 与 **静音** 开关。
- **零外部资源：** 程序化 Web Audio API 音效与安全的 `localStorage` 持久化（`checkers_v1`）。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、开发服务器、测试与构建命令
- [architecture.md](./architecture.md) — 模块布局、规则引擎、AI 极小化极大搜索与数据流
- [techstack.md](./techstack.md) — 语言、框架、测试与部署规范
- [user-guide.md](./user-guide.md) — 规则、操作、连跳、升王与设置
- [developer-guide.md](./developer-guide.md) — 扩展/调优 AI 与规则、运行 Vitest & Playwright 与构建
