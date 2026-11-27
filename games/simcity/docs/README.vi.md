[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# SimCity 3D — Xây Thành Phố Low-Poly

**SimCity 3D** là game xây dựng và mô phỏng đô thị 3D low-poly ngay trên trình duyệt — cũng là tựa game **Three.js** 3D đầu tiên trong bộ sưu tập Gemini Games.

## Tính năng chính
- **Sa bàn 3D tương tác:** Dựng bằng **Three.js** với đường sá và cầu tự động nối, các khu Dân cư / Thương mại / Công nghiệp tự phát triển theo cấp (`L0–L4`), tua-bin gió quay, khói nhà máy bay lên, xe cộ chạy ngoài đường và ánh sáng Ngày / Hoàng hôn / Đêm.
- **Điện nước chạy theo đường bộ:** Nhà máy điện (`+35 MW`) và Tháp nước (`+35`) phân phối điện nước dọc theo mạng lưới đường nối liền qua thuật toán **BFS**.
- **Nhu cầu RCI & Ngân sách:** Cân bằng nhu cầu Dân cư, Thương mại, Công nghiệp; chỉnh thuế suất (`5%–15%`), theo dõi thu/chi hàng tháng, giá đất, ô nhiễm và chinh phục 6 cột mốc đô thị (từ `Hamlet` đến `Megalopolis`).
- **Lớp phủ dữ liệu 3D & Hướng dẫn:** Bật/tắt lớp phủ Điện, Nước, Giá đất, soi chi tiết từng ô đất, làm theo **Tutorial** 5 bước hoặc hỏi ý kiến Cố vấn Thị trưởng.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, test và lệnh build ở local
- [architecture.md](./architecture.md) — Mô phỏng game, trình vẽ **Three.js**, **SFX** và kiến trúc React **HUD**
- [techstack.md](./techstack.md) — Tech stack và thư viện chuẩn theo `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, quy hoạch RCI, điện nước và lưu `localStorage`
- [developer-guide.md](./developer-guide.md) — Tinh chỉnh hằng số, thêm công trình, chạy test và build
