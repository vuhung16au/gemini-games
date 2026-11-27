[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 攻防王牌 (Tấn Đỡ / Bài Tấn) — 越南主牌攻防纸牌游戏

**Tấn Đỡ (Bài Tấn)** 是一款经典的越南 52 张攻防纸牌游戏，使用 TypeScript、React 18 与 Vite 5 构建。支持在 2、3 或 4 人席位中对战智能 AI，或与好友在同一台设备上本地传机游玩。

## 核心特性
- **地道 Bài Tấn 规则：** 每位玩家发 8 张牌，亮出 **Nọc** 牌堆底牌作为 **Chất Trưởng**（主花色），点数大小顺序为 `2 < 3 < ... < K < A`，支持同点数起手进攻、同点数补攻（**Tấn thêm**）以及收牌（**Ôm bài / Take**）跳过回合。
- **2P / 3P / 4P × 双模式：** 在 **vs AI** 与 **Pass & Play**（热座传机，带隐私遮挡幕布）之间无缝切换。
- **双语界面：** 清晰的越南语与英语操作标签（`Tấn / Attack`、`Đỡ / Defend`、`Tấn thêm / Throw-in`、`Ôm bài / Take`、`Thôi / Done`）。
- **内置引导与音效：** 3 步交互式教学、智能 `💡 提示` 顾问、双语 `? 帮助` 弹窗，以及带静音记忆的程序化 Web Audio 音效（`tan_do_v1`）。

## 操作摘要
- **点击 / 轻触手牌：** 选中 1 张牌（或起手进攻时选中多张同点数牌）。
- **点击桌面槽位（防守时）：** 点击桌面上未防守的进攻牌，即可用已选牌进行防守。
- **操作按钮：** `Tấn / Attack`、`Đỡ / Defend`、`Tấn thêm / Throw-in`、`Thôi / Done`、`Ôm bài / Take`、`💡 Hint`、`⇅ Xếp / Sort`。
- **键盘快捷键：** `H` 触发提示；`Esc` 关闭帮助弹窗。

## 文档索引
- [快速开始指南](./QUICKSTART.md)
- [架构设计](./architecture.md)
- [技术栈](./techstack.md)
- [用户指南](./user-guide.md)
- [开发者指南](./developer-guide.md)
