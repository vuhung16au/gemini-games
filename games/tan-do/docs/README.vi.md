[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tấn Đỡ (Bài Tấn) — Đấu Bài Công Thủ Cực Gắt

**Tấn Đỡ (Bài Tấn)** là game bài 52 lá công – thủ kinh điển của Việt Nam, được build bằng TypeScript, React 18 và Vite 5. Bạn có thể thử sức với **AI** đánh khá rát hoặc rủ hội bạn chơi **Pass & Play** 2, 3, 4 người ngay trên một thiết bị.

## Có gì hay?
- **Luật Bài Tấn chuẩn chỉ:** Chia mỗi nhà 8 lá, lật lá đáy **Nọc** làm **Chất Trưởng**, thứ tự quân `2 < 3 < ... < K < A`. Mở màn tấn công bằng 1 hoặc nhiều lá cùng số, đánh bồi (**Tấn thêm**) cùng số trên bàn và **Ôm bài** khi đỡ hết nổi.
- **2P / 3P / 4P × 2 chế độ:** Chuyển mượt giữa **vs AI** và **Pass & Play** (có Màn che riêng tư mỗi khi đổi lượt).
- **Song ngữ VN + EN rõ ràng:** Mọi nút hành động đều hiển thị song ngữ (`Tấn / Attack`, `Đỡ / Defend`, `Tấn thêm / Throw-in`, `Ôm bài / Take`, `Thôi / Done`) cho ai cũng dễ hiểu.
- **Đầy đủ trợ giúp & SFX:** Có **Tutorial** tương tác 3 bước, nút **Hints** (`💡 Hint`) mách nước, hộp thoại **How to Play** (`? Trợ giúp`) và Web Audio **SFX** kèm nút **Mute** lưu vào `localStorage` (`tan_do_v1`).

## Điều khiển nhanh
- **Click / Chạm lá bài:** Chọn 1 lá (hoặc nhiều lá cùng số khi mở lượt tấn công) trên tay.
- **Click ô trên bàn (lúc đang Đỡ):** Chọn lá tấn công chưa được đỡ trên bàn để dùng lá đang cầm đè lên.
- **Các nút hành động:** `Tấn / Attack`, `Đỡ / Defend`, `Tấn thêm / Throw-in`, `Thôi / Done`, `Ôm bài / Take`, `💡 Hint`, `⇅ Xếp / Sort`.
- **Phím tắt:** `H` để bật **Hints**; `Esc` để đóng hộp thoại Trợ giúp.

## Tài liệu chi tiết
- [QUICKSTART.md](./QUICKSTART.md) — Hướng dẫn nhanh: cài đặt, chạy dev, test và build
- [architecture.md](./architecture.md) — Kiến trúc engine, state và UI
- [techstack.md](./techstack.md) — Tech stack chi tiết
- [user-guide.md](./user-guide.md) — Luật Bài Tấn đầy đủ và hướng dẫn thao tác
- [developer-guide.md](./developer-guide.md) — Dành cho dev muốn tùy biến luật, **AI** hoặc chạy test
