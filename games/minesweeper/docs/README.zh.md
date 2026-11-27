[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 扫雷 (Minesweeper)

经典逻辑益智扫雷游戏，提供 **初级（`9×9`，10 雷 — 默认）**、**中级（`16×16`，40 雷）**、**高级（`30×16`，99 雷）** 与 **自定义** 棋盘尺寸。

## 核心特性
- **首次点击安全保护：** 地雷在首次翻开后才布设，确保开局 3×3 区域安全。
- **泛洪展开与和弦快开：** 点击 `0` 雷格子会自动连锁展开；点击已满足周围雷数的数字格可一键快开其余未插旗邻居。
- **智能推理提示与教学：** 逻辑边界求解器（`💡 Hint`）、3 步教学引导、触屏插旗模式切换以及 `? 帮助` 弹窗。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、测试与构建命令
- [architecture.md](./architecture.md) — 纯规则引擎、求解器提示、Web Audio 与 React UI
- [techstack.md](./techstack.md) — 与 `/techstacks/techstack.md` 对齐的技术栈
- [user-guide.md](./user-guide.md) — 规则、操作、难度预设与持久化
- [developer-guide.md](./developer-guide.md) — 自定义预设、测试与验证流程
