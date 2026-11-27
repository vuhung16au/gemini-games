[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 数独 — 经典数字逻辑谜题

一款参考 `sudoku.com` 打造的简洁响应式 **9×9 数独** 网页游戏，基于 **React 18 + TypeScript + Vite**、共享 `styles/` 设计令牌与程序化 Web Audio API 音效构建。

## 核心特性
- **唯一解谜题生成：** 每道题均通过回溯算法生成并验证唯一解，提供 **简单**、**中等**、**困难** 与 **专家** 四个难度。
- **完备辅助工具：** 铅笔 **草稿笔记**（自动清除同行/列/宫冲突草稿）、**撤销**（最多 50 步）、**擦除**、**提示**、**暂停/继续** 计时以及 **3 次失误** 限制。
- **智能高亮：** 自动高亮当前选中格所在行、列、3×3 宫格以及全盘相同数字。
- **零外部资源：** 100% 离线可用，配备合成 Web Audio API 音效与 `localStorage` 持久化（`sudoku_v1`）。

## 文档索引
- [QUICKSTART.md](./QUICKSTART.md) — 本地安装、开发服务器、测试与构建命令
- [architecture.md](./architecture.md) — 模块布局、状态机、生成器/求解器与数据流
- [techstack.md](./techstack.md) — 语言、框架、测试与部署规范
- [user-guide.md](./user-guide.md) — 规则、键盘/触控操作、草稿、提示与设置
- [developer-guide.md](./developer-guide.md) — 扩展/调优数独、运行 Vitest & Playwright 与构建
