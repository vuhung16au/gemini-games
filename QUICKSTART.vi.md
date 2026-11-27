[English](./QUICKSTART.md) | [中文](./QUICKSTART.zh.md) | **Tiếng Việt**

# Gemini Games — Chạy nhanh trong 1 nốt nhạc

Muốn chơi thử ngay cả **16 game** thì ghé thẳng bản live tại **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**, còn thích vọc vạch thì clone repo về máy chạy **100% offline** luôn cho máu!

## Chuẩn bị đồ nghề
- **Node.js** 20+ và **npm**
- **Git** (để clone repo về máy)
- **Wrangler CLI** (đã cài sẵn trong devDependencies; chừng nào muốn deploy lên Cloudflare thì chạy `npx wrangler login` phát là xong)

---

## 1. Clone, Cài đặt & Chạy local (100% Offline)

```bash
git clone https://github.com/vuhung16au/gemini-games.git
cd gemini-games
npm install

# Bật dev server cho Hub chính (Dashboard + cả 16 game)
make dev
# Hoặc: npm run dev
```

Muốn mở riêng lẻ đúng 1 game cho nhẹ nhàng:

```bash
make dev GAME=<game-slug>
# Hoặc: cd games/<game-slug> && npm install && npm run dev
```

Gõ `make list-games` để xem danh sách đầy đủ cả 16 game nha.

---

## 2. Test, Lint & Verify cho chắc kèo

```bash
# Chạy unit test cho Hub chính (Vitest + coverage >=70%)
make test

# Chạy unit test cho cả Hub chính + toàn bộ 16 game
make test-all

# Chạy E2E test trên trình duyệt cho Hub chính (Playwright)
make test-e2e

# Check ESLint và TypeScript strict mode
make lint
make typecheck

# Chạy full combo verify của repo (lint, typecheck, test, build, test-e2e, check-docs)
make verify
```

Mọi lệnh `make` đều nhận `GAME=<game-slug>` luôn nhé (ví dụ: `make verify GAME=minesweeper`).

---

## 3. Build & Preview bản Production

```bash
# Typecheck rồi build Hub chính + cả 16 game ra thư mục tĩnh dist/
make build

# Xem thử bản build tĩnh dist/ ngay tại máy (100% offline)
make preview
```

---

## 4. Deploy lên mây (Cloudflare Workers hoặc Vercel)

### Cách A: Cloudflare Workers Static Assets (Mặc định)
Cấu hình sẵn trong [wrangler.jsonc](./wrangler.jsonc) rồi:

```bash
# Chạy thử dry-run để check gói build trước khi lên sóng
make deploy-dry-run

# Build dist/ và deploy thẳng lên Cloudflare Workers
make deploy
```

### Cách B: Vercel (Phương án dự phòng)
Vì `dist/` là static bundle hoàn toàn nên đẩy lên Vercel cũng mượt luôn:

```bash
make build
npx vercel --prod dist
```

---

## 5. Học Vibe Coding cùng repo này
Mới nhập môn vibe coding? Nhảy ngay vào khóa học thực hành 9 ngày tại [courses/README.vi.md](./courses/README.vi.md) nha!
