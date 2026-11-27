[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 模拟城市 3D (SimCity 3D)

**SimCity 3D** 是一款低多边形 3D 浏览器城市建设与都市模拟游戏——也是 Gemini Games 合集中的首款 3D 作品。

## 核心特性
- **交互式 3D 沙盘：** 基于 Three.js 构建，包含自动拼接道路与桥梁、可成长的住宅/商业/工业建筑（L0–L4）、旋转风力发电机、工厂烟雾、微型道路车流以及 白天 / 日落 / 夜晚 光照切换。
- **沿路传导市政设施：** 发电厂（`+35 MW`）与水塔（`+35`）通过 BFS 图遍历沿着连通道路向相邻区域输送电力与水源。
- **RCI 需求与财政预算：** 动态住宅/商业/工业需求、可调税率（`5%–15%`）、月度维护与税收、地价、污染度以及 6 个城市里程碑（从 `Hamlet` 到 `Megalopolis`）。
- **3D 数据图层与引导：** 支持切换电力、供水与地价热力图层、检查任意地块、跟随 5 步教学模式或咨询市长顾问提示。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、测试与构建命令
- [architecture.md](./architecture.md) — 模拟层、Three.js 渲染器、音效与 React HUD 架构
- [techstack.md](./techstack.md) — 与 `/techstacks/techstack.md` 对齐的技术栈与依赖
- [user-guide.md](./user-guide.md) — 规则、操作、RCI 分区、市政与持久化
- [developer-guide.md](./developer-guide.md) — 调整常量、添加建筑、测试与构建
