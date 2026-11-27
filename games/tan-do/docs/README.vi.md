[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tấn Đỡ (Bài Tấn) — Game Bài Tấn Công & Phòng Thủ Việt Nam

**Tấn Đỡ (Bài Tấn)** là trò chơi bài 52 lá tấn công và phòng thủ kinh điển của Việt Nam, xây dựng với TypeScript, React 18 và Vite 5. Chơi đấu với đối thủ AI thông minh hoặc chuyền tay trên một thiết bị cùng bạn bè với 2, 3 hoặc 4 người chơi.

## Tính năng chính
- **Luật Bài Tấn Chuẩn:** Chia 8 lá mỗi người, lật lá đáy **Nọc** làm **Chất Trưởng**, thứ tự quân `2 < 3 < ... < K < A`, tấn công mở màn cùng số, đánh bồi cùng số (**Tấn thêm**) và **Ôm bài** bỏ lượt.
- **2P / 3P / 4P × 2 Chế độ:** Chuyển đổi mượt mà giữa **vs AI** và **Pass & Play** (chuyền tay có Màn che Riêng tư).
- **Giao diện Song ngữ VN + EN:** Nhãn hành động Tiếng Việt & Tiếng Anh rõ ràng (`Tấn / Attack`, `Đỡ / Defend`, `Tấn thêm / Throw-in`, `Ôm bài / Take`, `Thôi / Done`).
- **Hướng dẫn & Âm thanh:** Tutorial tương tác 3 bước, cố vấn `💡 Hint` thông minh, hộp thoại `? Trợ giúp` song ngữ và âm thanh Web Audio kèm lưu nút tắt tiếng (`tan_do_v1`).

## Tóm tắt Điều khiển
- **Nhấp / Chạm Lá bài:** Chọn 1 lá (hoặc nhiều lá cùng số khi mở lượt tấn công) trên tay.
- **Nhấp Ô trên Bàn (khi Đỡ):** Nhấp vào lá tấn công chưa được đỡ trên bàn để đỡ bằng lá đã chọn.
- **Nút Hành động:** `Tấn / Attack`, `Đỡ / Defend`, `Tấn thêm / Throw-in`, `Thôi / Done`, `Ôm bài / Take`, `💡 Hint`, `⇅ Xếp / Sort`.
- **Bàn phím:** `H` bật Gợi ý; `Esc` đóng hộp thoại Trợ giúp.

## Danh mục tài liệu
- [Hướng dẫn Nhanh](./QUICKSTART.md)
- [Kiến trúc](./architecture.md)
- [Tech Stack](./techstack.md)
- [Hướng dẫn Người chơi](./user-guide.md)
- [Hướng dẫn Lập trình viên](./developer-guide.md)
