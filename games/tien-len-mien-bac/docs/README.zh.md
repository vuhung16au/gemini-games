[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)

# 北越十三张 (Tiến Lên Miền Bắc) — 北越传统跑牌游戏

**Tiến Lên Miền Bắc** 是一款地道的越南 52 张跑牌游戏，严格执行北越同花色与同颜色匹配规则，基于 TypeScript、React 18 与 Vite 构建。

## 核心特性

- **地道严谨的北越规则：**
  - 单张只能压制**同花色**的更小单张（`2` 除外，可压制任意非 `2` 单张；大花色 `2` 可压小花色 `2`）。
  - 对子（`Đôi`）必须**同颜色**（黑 `♠♣` 或红 `♦♥`），且只能压制同色对子。
  - 三条（`Sám cô`）只能压制**三种花色完全一致**的更大三条。
  - 顺子（`Sảnh`，长度 `>= 3`，不含 `2`）必须**同花色**，且只能压制同长度同花色顺子。
  - **四条（`Tứ quý`）** 可砍任意单张 `2`（**Chặt Heo**）或更小的四条（**Chặt chồng**）。
  - 首轮持有 `3♠` 者先出，且 **Thối 2** 规则会提示并禁止以 `2` 作为最后一手出牌。
- **2P / 3P / 4P × 双模式：** 支持 `vs AI`（1 名玩家 + 1–3 名智能 AI 对手）或 `Pass & Play`（本地热座传机，带隐私遮挡幕布）。
- **双语界面与引导：** 完整越南语 + 英语标签、`? 帮助` 弹窗、3 步引导 `教学模式`、`💡 提示`（`getNorthernHint`）以及带静音开关的程序化 Web Audio 音效。

## 操作摘要

- **点击 / 轻触卡牌：** 选中或取消选中手牌。
- **按钮：** `Đánh / Play`、`Bỏ lượt / Pass`、`Bỏ chọn / Clear`、`Xếp bài / Sort`、`💡 Hint`、`Tutorial`、`?`。
- **快捷键：** `Enter`（出牌）、`P`（过牌）、`H`（提示）、`S`（理牌）、`Esc`（清空选中 / 关闭弹窗）。

## 文档索引

- [QUICKSTART.md](./QUICKSTART.md) — 安装、开发服务器、测试与生产构建命令
- [architecture.md](./architecture.md) — 纯规则引擎（`src/game/`）、React UI（`src/components/`）、音效与存储
- [techstack.md](./techstack.md) — 与 `/techstacks/techstack.md` 对齐的语言、框架与测试工具
- [user-guide.md](./user-guide.md) — 完整北越规则、操作、计分与设置
- [developer-guide.md](./developer-guide.md) — 项目布局、扩展规则/AI、测试与构建流程
