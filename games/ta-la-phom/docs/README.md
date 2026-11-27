# Tá Lả (Phỏm) — Vietnamese Classic Card Game

An authentic, offline-ready web implementation of **Tá Lả (Phỏm)** built with TypeScript, React 18, and Vite 5.

## Features

- **Authentic 4-Round Rules:** 52-card deck, 10 cards for the dealer and 9 for other players, remaining **Nọc** draw pile, strict **Ăn / Eat** validation (must form a valid Phỏm with at most 1 eaten card per meld), Round 4 **Hạ Phỏm / Meld** & **Gửi bài / Lay Off**, instant **Ù**, and **Móm / Cháy** detection.
- **Optimal Backtracking Solver (`solveOptimalMelds`):** Exhaustively minimizes deadwood points (`A=1`, `2–10=face`, `J=11`, `Q=12`, `K=13`) while covering all eaten cards.
- **2–4 Players × Dual Modes:** Play `2P`, `3P`, or `4P` against smart AI (`vs AI`) or locally with friends (`Pass & Play`) featuring a **Privacy Handoff Curtain**.
- **Bilingual VN + EN UI & Guidance:** Vietnamese + English labels, `? Help` modal, `💡 Hint` (`getPhomHint`), 3-step `Tutorial` (`Draw/Eat -> Discard -> Form Phỏm`), and procedural Web Audio SFX with mute toggle.
- **Zero Scrollbars (`100dvh`):** Responsive card-table layout with crisp CSS/SVG playing cards (`♠ ♣ ♦ ♥`) and safe `localStorage` persistence (`ta_la_phom_v1`).

## Documentation Index

- [Quickstart Guide](./QUICKSTART.md)
- [Architecture](./architecture.md)
- [Tech Stack](./techstack.md)
- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
