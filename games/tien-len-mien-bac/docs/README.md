**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Tiến Lên Miền Bắc — Northern Thirteen Card Game

**Tiến Lên Miền Bắc** is an authentic Vietnamese 52-card shedding game enforcing strict Northern Vietnamese suit and color matching rules, built with TypeScript, React 18, and Vite.

## Key Features

- **Authentic Strict Northern Rules:**
  - Single cards beat singles **of the same suit** (except `2`, which beats any non-2 card; higher-suit `2` beats lower-suit `2`).
  - Pairs (`Đôi`) must **match color** (`♠♣` black or `♦♥` red) and only beat same-color pairs.
  - Triples (`Sám cô`) only beat triples matching the **exact 3 suits**.
  - Straights (`Sảnh`, length `>= 3`, excluding `2`) must be **same suit** and beat same-length, same-suit straights.
  - **Tứ quý** (Four-of-a-Kind) cuts any single `2` (**Chặt Heo**) or smaller Tứ quý (**Chặt chồng**).
  - First turn opens with `3♠` when dealt, and **Thối 2** warns and blocks finishing with `2` as the last play.
- **2P / 3P / 4P × Dual Modes:** Play `vs AI` (1 Human + 1–3 smart AI opponents) or `Pass & Play` (local hotseat with a Privacy Handoff Curtain).
- **Bilingual VN + EN UI & Guidance:** Complete Vietnamese + English labels, `? Help` modal, 3-step guided `Tutorial`, `💡 Hint` (`getNorthernHint`), and procedural Web Audio SFX with Mute toggle.

## Controls Summary

- **Click / Tap Cards:** Select or deselect cards in your hand.
- **Buttons:** `Đánh / Play`, `Bỏ lượt / Pass`, `Bỏ chọn / Clear`, `Xếp bài / Sort`, `💡 Hint`, `Tutorial`, `?`.
- **Keyboard:** `Enter` (Play), `P` (Pass), `H` (Hint), `S` (Sort), `Esc` (Clear selection / Close modal).

## Documentation Index

- [QUICKSTART.md](./QUICKSTART.md) — Setup, dev server, testing, and production build commands
- [architecture.md](./architecture.md) — Pure engine (`src/game/`), React UI (`src/components/`), audio, and storage
- [techstack.md](./techstack.md) — Languages, frameworks, and test tools aligned with `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Complete Northern rules, controls, scoring, and settings
- [developer-guide.md](./developer-guide.md) — Project layout, extending rules/AI, testing, and build workflow
