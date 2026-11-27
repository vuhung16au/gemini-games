[English](./QUICKSTART.md) | [中文](./QUICKSTART.zh.md) | **Tiếng Việt**

# Gemini Games — Hướng dẫn nhanh

Bạn có thể chơi thử trực tuyến cả **16 trò chơi** tại **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**, hoặc clone về máy để chạy **100% ngoại tuyến**.

## Yêu cầu hệ thống
- **Node.js** 20+ và **npm**
- **Git** (để clone kho mã nguồn)
- **Wrangler CLI** (đã cài sẵn trong devDependencies; chỉ cần chạy `npx wrangler login` khi muốn triển khai lên Cloudflare)

---

## 1. Clone, Cài đặt & Chạy tại máy (100% Ngoại tuyến)

```bash
git clone https://github.com/vuhung16au/gemini-games.git
cd gemini-games
npm install

# Khởi chạy máy chủ phát triển cho Hub thống nhất (Bảng điều khiển + cả 16 game)
make dev
# Hoặc: npm run dev
```

Để chạy riêng lẻ một trò chơi:

```bash
make dev GAME=<game-slug>
# Hoặc: cd games/<game-slug> && npm install && npm run dev
```

Xem danh sách đầy đủ 16 game bằng lệnh `make list-games`.

---

## 2. Kiểm thử, Kiểm tra mã & Xác minh

```bash
# Chạy unit test cho Hub gốc (Vitest + độ phủ >=70%)
make test

# Chạy unit test cho cả Hub gốc + toàn bộ 16 trò chơi
make test-all

# Chạy kiểm thử trình duyệt E2E cho Hub gốc (Playwright)
make test-e2e

# Chạy ESLint và kiểm tra TypeScript nghiêm ngặt
make lint
make typecheck

# Chạy toàn bộ cổng xác minh của dự án (lint, typecheck, test, build, test-e2e, check-docs)
make verify
```

Mọi lệnh `make` đều hỗ trợ `GAME=<game-slug>` (ví dụ: `make verify GAME=minesweeper`).

---

## 3. Build & Xem trước bản Production

```bash
# Kiểm tra kiểu và đóng gói Hub gốc + cả 16 game vào thư mục tĩnh dist/
make build

# Xem trước bản build tĩnh dist/ tại máy (100% ngoại tuyến)
make preview
```

---

## 4. Triển khai (Cloudflare Workers hoặc Vercel)

### Cách A: Cloudflare Workers Static Assets (Mặc định)
Được cấu hình trong [wrangler.jsonc](./wrangler.jsonc):

```bash
# Kiểm tra đóng gói thử nghiệm mà chưa phát hành
make deploy-dry-run

# Build dist/ và triển khai lên Cloudflare Workers
make deploy
```

### Cách B: Vercel (Thay thế)
Vì `dist/` là gói tĩnh hoàn toàn, bạn cũng có thể triển khai lên Vercel:

```bash
make build
npx vercel --prod dist
```

---

## 5. Học Vibe Coding cùng dự án này
Mới làm quen với dự án? Hãy bắt đầu khóa học thực hành 9 ngày tại [courses/README.vi.md](./courses/README.vi.md).
