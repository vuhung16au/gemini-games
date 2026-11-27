[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 恐龙快跑 — 404 跑酷

一款灵感源自 Chrome 离线 404 小恐龙游戏与 HSC QuestionBanks 404 证明跑酷（`DinoGame.tsx`）的无尽霸王龙跑酷游戏。

## 核心特性
- **两种可选模式：**
  - **经典沙漠：** 像素仙人掌、扇翅翼龙、云朵，以及每 700 分切换一次的昼夜循环。
  - **404 数学证明跑酷：** 戴学士帽的小恐龙在方格纸与漂浮数学公式背景上躲避 `∑`、`∫`、`[A]` 与带翅的 `−` / `÷0` 障碍。
- **灵敏操作：** `空格`/`上键`/`W` 跳跃，`下键`/`S` 蹲伏或空中速降，同时支持触控与鼠标点击。
- **引导与持久化：** 内置 **玩法说明**、3 步 **教学模式**、实时 **提示** 时机标记（`JUMP ↑` / `DUCK ↓`），以及 `localStorage` 持久化（`dino_run_v1`）。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、测试与构建命令
- [architecture.md](./architecture.md) — 模拟引擎、Canvas 2D 渲染器、Web Audio 音效与 React UI
- [techstack.md](./techstack.md) — 与 `/techstacks/techstack.md` 对齐的技术栈
- [user-guide.md](./user-guide.md) — 规则、操作、模式与持久化
- [developer-guide.md](./developer-guide.md) — 调整常量、添加障碍物与验证命令
