# Tấn Đỡ (Bài Tấn) — Vietnamese Trump Attack & Defend Card Game

**Tấn Đỡ (Bài Tấn)** is a classic Vietnamese 52-card attack-and-defend game built with TypeScript, React 18, and Vite 5. Play against smart AI opponents or pass a single device locally with friends across 2, 3, or 4 seats.

## Key Features
- **Authentic Bài Tấn Rules:** 8 cards dealt per player, bottom card of **Nọc** revealed as **Chất Trưởng** (Trump Suit), `2 < 3 < ... < K < A` rank hierarchy, same-rank opening attacks, matching-rank throw-ins (**Tấn thêm**), and **Ôm bài / Take** turn-skipping.
- **2P / 3P / 4P × Dual Modes:** Switch seamlessly between **vs AI** and **Pass & Play** (Hotseat with Privacy Handoff Curtain).
- **Bilingual VN + EN Interface:** Clear Vietnamese & English action labels (`Tấn / Attack`, `Đỡ / Defend`, `Tấn thêm / Throw-in`, `Ôm bài / Take`, `Thôi / Done`).
- **In-Game Guidance & Audio:** 3-step interactive Tutorial, smart `💡 Hint` advisor, bilingual `? Help` modal, and procedural Web Audio SFX with Mute persistence (`tan_do_v1`).

## Controls Summary
- **Click / Tap Cards:** Select 1 card (or same-rank cards when opening an attack) in your hand.
- **Table Slot Click (Defending):** Click an undefended attack card on the table to target or immediately defend it with your selected card.
- **Action Buttons:** `Tấn / Attack`, `Đỡ / Defend`, `Tấn thêm / Throw-in`, `Thôi / Done`, `Ôm bài / Take`, `💡 Hint`, `⇅ Xếp / Sort`.
- **Keyboard:** `H` triggers Hint; `Esc` closes the Help modal.

## Documentation Index
- [Quickstart Guide](./QUICKSTART.md)
- [Architecture](./architecture.md)
- [Tech Stack](./techstack.md)
- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
