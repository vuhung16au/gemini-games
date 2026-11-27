**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)

# Tiến Lên Miền Nam — Southern Thirteen Card Game

**Tiến Lên Miền Nam** is an authentic Southern Vietnamese 52-card shedding game built with TypeScript, React 18, and Vite. Play solo against smart AI opponents or pass a single device locally in **Pass & Play** mode with **2, 3, or 4 players**.

## Key Features

- **Authentic Southern Rules:** Rank order `3 < 4 < … < A < 2` with suit tie-breaking `♠ < ♣ < ♦ < ♥`, flexible mixed-suit straights (`>= 3` cards, no `2`), and opening round priority (`3♠` or lowest dealt card).
- **Chặt Heo (Bomb / Cut) Hierarchy:**
  - **3 Đôi thông** (3 consecutive pairs) cuts single `2` or smaller 3 Đôi thông.
  - **Tứ quý** (Four of a Kind) cuts single `2`, pair of `2`s, 3 Đôi thông, or smaller Tứ quý.
  - **4 Đôi thông** (4 consecutive pairs) cuts all of the above plus smaller 4 Đôi thông.
- **Tới Trắng (Instant Win on Deal):** Automatic victory for **Sảnh Rồng (`3→A`)**, **6 Đôi**, or **Tứ quý `2`**.
- **2–4 Players × Dual Modes:** Switch seamlessly between `2P`, `3P`, `4P` and `vs AI` or `Pass & Play` (with Privacy Handoff Curtain).
- **Bilingual VN + EN Interface:** All actions (`Đánh / Play`, `Bỏ lượt / Pass`, `Xếp bài / Sort`), rules modal, 3-step Tutorial, and `💡 Gợi ý / Hint`.
- **Procedural Audio & Local Persistence:** Zero external assets; Web Audio SFX with Mute toggle and `localStorage` persistence under `tien_len_mien_nam_v1`.

## Documentation Index

- [Quickstart Guide](file:///Users/vuhung/Desktop/gemini-games/games/tien-len-mien-nam/docs/QUICKSTART.md)
- [Architecture](file:///Users/vuhung/Desktop/gemini-games/games/tien-len-mien-nam/docs/architecture.md)
- [Tech Stack](file:///Users/vuhung/Desktop/gemini-games/games/tien-len-mien-nam/docs/techstack.md)
- [User Guide](file:///Users/vuhung/Desktop/gemini-games/games/tien-len-mien-nam/docs/user-guide.md)
- [Developer Guide](file:///Users/vuhung/Desktop/gemini-games/games/tien-len-mien-nam/docs/developer-guide.md)
