[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 纸牌接龙 — 经典克朗代克纸牌游戏

一款清爽响应式的 **克朗代克纸牌接龙 (Klondike Solitaire)** 网页游戏，参考 `solitaired.com` 打造，基于 **React 18 + TypeScript + Vite**、自定义高清 **SVG 扑克牌**、共享 `styles/` 设计令牌、**智能提示**、**教学模式**、**自动收牌** 以及程序化 Web Audio API 音效。

## 核心特性
- **翻 1 张 & 翻 3 张模式：** 支持在翻 1 张与翻 3 张（扇形废牌堆）之间切换，并支持完整牌库循环。
- **流畅操控：** 点击移动、双击（或二次点击）快速归位至回收堆、HTML5 拖拽以及键盘快捷键（`D`、`H`、`Z`、`P`）。
- **引导学习：** 内置 **玩法说明** 弹窗、3 步交互式 **教学模式** 与 **智能提示**。
- **零外部资源：** 内联 SVG 花色/牌背、程序化 Web Audio API 音效与安全的 `localStorage` 持久化（`solitaire_v1`）。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、开发服务器、测试与构建命令
- [architecture.md](./architecture.md) — 模块布局、克朗代克状态机、提示与教学
- [techstack.md](./techstack.md) — 语言、框架、SVG 图形、测试与部署规范
- [user-guide.md](./user-guide.md) — 规则、操作、翻 1/3 张计分、教学与设置
- [developer-guide.md](./developer-guide.md) — 扩展/调优规则、运行 Vitest & Playwright 与构建
