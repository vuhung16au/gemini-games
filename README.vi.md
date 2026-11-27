[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Gemini Games

Một chiếc web game hub gọn nhẹ, chạy **100% offline** theo kiểu local-first, gom trọn **16 tựa game 2D & 3D chơi thẳng trên trình duyệt**. Toàn bộ được build bằng **TypeScript, Vite, React, HTML5 Canvas 2D và Three.js**, rồi deploy tĩnh lên **Cloudflare Workers Static Assets** (hoặc **Vercel** nếu thích).

- **Chơi thử bản Live Demo:** **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**
- **Chạy lẹ trên máy:** [QUICKSTART.vi.md](./QUICKSTART.vi.md) (`git clone`, `make dev`, `make verify`, `make deploy`)
- **Khóa học Vibe Coding 9 Ngày:** [courses/](./courses/README.vi.md) — Lộ trình thực hành bằng prompt dành cho người không chuyên IT: hiểu tech stack, độ lại game có sẵn và tự tay "sai" AI agent làm game 2D/3D mới toanh.

Ngó qua giao diện của em nó ở đây nha:

[![Gemini Games Live Demo](./images/demo-screenshot.png)](https://gemini-games.vuhung16plus.workers.dev/)

## Có gì hay ho?
- **Dashboard 4 cột siêu mượt:** Lọc game theo thể loại (`Tất cả`, `Giải đố`, `Cờ`, `Arcade`, `Mô phỏng`, `Đánh bài`), bấm `/` để search tới đâu ra tới đó, ghim **Yêu thích**, xem lại **Chơi gần đây**, bật tắt **Light/Dark mode**, đổi qua lại **3 ngôn ngữ (`English`, `中文`, `Tiếng Việt`)**, và điều khiển full bằng bàn phím (`Phím mũi tên`, `Enter`, `Esc`).
- **16 game tự thân vận động:** Không phụ thuộc CDN bên ngoài lúc chạy, âm thanh SFX tự tạo bằng Web Audio (có nút Mute nhớ trạng thái đàng hoàng), tích hợp sẵn **How to Play**, **Tutorial** và **Hints** trong game, kèm full bài **Vitest unit test** lẫn **Playwright E2E** cho chắc kèo.
- **Tặng kèm giáo trình Vibe Coding (`courses/`):** Học vibe coding theo kiểu thực chiến—xem source code như một artifact được sinh ra từ ý tưởng rõ ràng, xong xuôi thì chốt hạ bằng `make verify`.

## Bộ sưu tập 16 game

| Game | Thể loại | Thư mục |
| :--- | :--- | :--- |
| **1024** | Giải đố | [`games/1024/`](./games/1024/docs/README.vi.md) |
| **Battle City 1985** | Arcade | [`games/battle-city/`](./games/battle-city/docs/README.vi.md) |
| **Cờ Đam (Checkers)** | Cờ | [`games/checkers/`](./games/checkers/docs/README.vi.md) |
| **Cozy Town Tycoon** | Mô phỏng | [`games/cozy-town-tycoon/`](./games/cozy-town-tycoon/docs/README.vi.md) |
| **Dino Run** | Arcade | [`games/dino-run/`](./games/dino-run/docs/README.vi.md) |
| **Flappy Bird** | Arcade | [`games/flappy-bird/`](./games/flappy-bird/docs/README.vi.md) |
| **Dò Mìn (Minesweeper)** | Giải đố | [`games/minesweeper/`](./games/minesweeper/docs/README.vi.md) |
| **SimCity 3D** | Mô phỏng | [`games/simcity/`](./games/simcity/docs/README.vi.md) |
| **Solitaire** | Đánh bài | [`games/solitaire/`](./games/solitaire/docs/README.vi.md) |
| **Sudoku** | Giải đố | [`games/sudoku/`](./games/sudoku/docs/README.vi.md) |
| **Super Mario Bros. 1985** | Arcade | [`games/super-mario-bros/`](./games/super-mario-bros/docs/README.vi.md) |
| **Tá Lả (Phỏm)** | Đánh bài | [`games/ta-la-phom/`](./games/ta-la-phom/docs/README.vi.md) |
| **Tấn Đỡ (Bài Tấn)** | Đánh bài | [`games/tan-do/`](./games/tan-do/docs/README.vi.md) |
| **Tetris** | Arcade | [`games/tetris/`](./games/tetris/docs/README.vi.md) |
| **Tiến Lên Miền Bắc** | Đánh bài | [`games/tien-len-mien-bac/`](./games/tien-len-mien-bac/docs/README.vi.md) |
| **Tiến Lên Miền Nam** | Đánh bài | [`games/tien-len-mien-nam/`](./games/tien-len-mien-nam/docs/README.vi.md) |

## Các file quan trọng trong repo
- [QUICKSTART.vi.md](./QUICKSTART.vi.md) — Mấy lệnh build, chạy dev, test và deploy cơ bản
- [courses/README.vi.md](./courses/README.vi.md) — Khóa học làm game 9 ngày (Vibe Coding & AI Agents)
- [docs/architecture.md](./docs/architecture.md) — Kiến trúc Hub, cấu trúc từng game và multi-entry build (có kèm sơ đồ Mermaid)
- [docs/developer-guide.md](./docs/developer-guide.md) — Luồng dev, checklist `AGENTS.md` và các cổng verify
- [docs/techstack.md](./docs/techstack.md) — Nền tảng tech stack, lớp render 2D/3D, testing và Cloudflare hosting
- [AGENTS.md](./AGENTS.md) — Bộ luật bắt buộc về cấu trúc game, assets, docs, đa ngôn ngữ và verify
- [techstacks/techstack.md](./techstacks/techstack.md) — Hướng dẫn chọn tech stack cho game web 2D & 3D
- [styles/STYLE_GUIDE.md](./styles/STYLE_GUIDE.md) — Bảng màu dùng chung, quy tắc khung hình, điều khiển và lưu data
- [styles/tokens.css](./styles/tokens.css) & [styles/theme.ts](./styles/theme.ts) — Biến CSS Light/Dark và bảng màu cho Canvas/Three.js
- [src/registry/games.ts](./src/registry/games.ts) — Nơi đăng ký danh sách game cho Hub
- [src/components/Dashboard.tsx](./src/components/Dashboard.tsx) — Giao diện Dashboard 4 cột ở trang chủ
- [vite.config.ts](./vite.config.ts) — Cấu hình Vite multi-entry & plugin phục vụ assets `/games/<slug>/*`
- [wrangler.jsonc](./wrangler.jsonc) — Cấu hình deploy lên Cloudflare Workers Static Assets
- [package.json](./package.json) — Các script gốc (`dev`, `build`, `test`, `test:e2e`, `deploy`)
