[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tiến Lên Miền Nam — Game Bài Truyền Thống Miền Nam

**Tiến Lên Miền Nam** là trò chơi đánh bài 52 lá chuẩn miền Nam Việt Nam, xây dựng bằng TypeScript, React 18 và Vite. Chơi đơn đấu với AI thông minh hoặc chuyền tay trên một thiết bị ở chế độ **Pass & Play** với **2, 3 hoặc 4 người chơi**.

## Tính năng chính

- **Luật Miền Nam Chuẩn:** Thứ tự `3 < 4 < … < A < 2` kèm phân chất `♠ < ♣ < ♦ < ♥`, sảnh hỗn hợp chất linh hoạt (`>= 3` lá, không gồm `2`) và quyền đánh đầu ván (`3♠` hoặc lá nhỏ nhất).
- **Hệ thống Chặt Heo:**
  - **3 Đôi thông** chặt được `2` lẻ hoặc 3 Đôi thông nhỏ hơn.
  - **Tứ quý** chặt được `2` lẻ, đôi `2`, 3 Đôi thông hoặc Tứ quý nhỏ hơn.
  - **4 Đôi thông** chặt được tất cả các bộ trên và 4 Đôi thông nhỏ hơn.
- **Tới Trắng (Thắng Ngay Khi Chia):** Tự động thắng với **Sảnh Rồng (`3→A`)**, **6 Đôi**, hoặc **Tứ quý `2`**.
- **2–4 Người chơi × 2 Chế độ:** Chuyển đổi mượt mà giữa `2P`, `3P`, `4P` và `vs AI` hoặc `Pass & Play` (có Màn che Riêng tư).
- **Giao diện Song ngữ VN + EN:** Mọi hành động (`Đánh / Play`, `Bỏ lượt / Pass`, `Xếp bài / Sort`), hộp thoại luật, Tutorial 3 bước và `💡 Gợi ý / Hint`.
- **Âm thanh Tự tạo & Lưu trữ Cục bộ:** Không tài nguyên ngoài; âm thanh Web Audio kèm nút Tắt tiếng và lưu `localStorage` dưới khóa `tien_len_mien_nam_v1`.

## Danh mục tài liệu

- [Hướng dẫn Nhanh](./QUICKSTART.md)
- [Kiến trúc](./architecture.md)
- [Tech Stack](./techstack.md)
- [Hướng dẫn Người chơi](./user-guide.md)
- [Hướng dẫn Lập trình viên](./developer-guide.md)
