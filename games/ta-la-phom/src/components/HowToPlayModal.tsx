import React from 'react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div
      className="game-overlay-backdrop modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Luật chơi Tá Lả / How to Play Tá Lả (Phỏm)"
      onClick={onClose}
    >
      <div className="game-card howto-modal" onClick={(e) => e.stopPropagation()}>
        <div className="howto-header">
          <h2>Luật chơi Tá Lả (Phỏm) / How to Play</h2>
          <button
            type="button"
            className="game-btn game-btn-secondary btn-compact"
            onClick={onClose}
            aria-label="Đóng / Close"
          >
            ✕
          </button>
        </div>

        <div className="howto-body">
          <section>
            <h3>1. Mục tiêu &amp; Chia bài / Objective &amp; Deal</h3>
            <p>
              Bộ bài 52 lá. Người chia (cái) nhận <strong>10 lá</strong> và đánh trước; người
              chơi còn lại nhận <strong>9 lá</strong>. Phần còn lại đặt ở <strong>Nọc</strong>.
              Mục tiêu là tạo <strong>Phỏm</strong> và có tổng điểm lá rác thấp nhất sau 4 vòng
              (hoặc <strong>Ù</strong> ngay khi 0 điểm rác).
            </p>
          </section>

          <section>
            <h3>2. Các loại Phỏm hợp lệ / Valid Phỏm Melds</h3>
            <ul>
              <li>
                <strong>Phỏm Sáp (Set):</strong> 3 hoặc 4 lá cùng số khác chất (vd: 7♠ 7♥ 7♦).
              </li>
              <li>
                <strong>Phỏm Dây (Run):</strong> 3+ lá liên tiếp cùng chất (vd: A♠ 2♠ 3♠ hoặc
                9♥ 10♥ J♥). Lưu ý: Q-K-A không hợp lệ.
              </li>
            </ul>
          </section>

          <section>
            <h3>3. Diễn biến 4 vòng / 4-Round Turn Flow</h3>
            <ul>
              <li>
                <strong>Ăn / Eat:</strong> Lấy lá bài người ngay trước vừa đánh <em>chỉ khi</em>{' '}
                ghép được thành Phỏm hợp lệ với bài trên tay. Lá đã ăn không thể đánh bỏ.
              </li>
              <li>
                <strong>Bốc / Draw:</strong> Nếu không ăn, bốc 1 lá từ Nọc.
              </li>
              <li>
                <strong>Đánh / Discard:</strong> Chọn 1 lá rác và nhấn <em>Đánh / Play</em> (hoặc
                nhấp đúp vào lá bài).
              </li>
              <li>
                <strong>Vòng 4 — Hạ Phỏm &amp; Gửi bài / Meld &amp; Lay Off:</strong> Hạ các Phỏm
                xuống bàn và gửi lá lẻ hợp lệ vào Phỏm đã hạ của đối thủ (nếu bạn không bị Móm).
              </li>
            </ul>
          </section>

          <section>
            <h3>4. Tính điểm, Ù &amp; Móm / Scoring</h3>
            <ul>
              <li>
                <strong>Điểm lá rác:</strong> A = 1, 2–10 = đúng số, J = 11, Q = 12, K = 13.
              </li>
              <li>
                <strong>Ù:</strong> Toàn bộ bài tạo thành Phỏm (0 điểm rác) — thắng ngay lập tức!
              </li>
              <li>
                <strong>Móm (Cháy):</strong> Kết thúc vòng 4 với 0 Phỏm — xếp cuối và không được
                gửi bài.
              </li>
            </ul>
          </section>

          <section>
            <h3>5. Chế độ &amp; Phím hỗ trợ / Modes &amp; Tools</h3>
            <p>
              Chọn <strong>2P / 3P / 4P</strong> và chế độ <strong>vs AI</strong> hoặc{' '}
              <strong>Pass &amp; Play</strong> (chơi chung máy với màn chắn bảo mật bài). Dùng{' '}
              <strong>💡 Hint</strong> để xem nước đi tối ưu hoặc <strong>Xếp bài / Sort</strong>{' '}
              để gom Phỏm nhanh.
            </p>
          </section>
        </div>

        <div className="howto-footer">
          <button
            type="button"
            className="game-btn game-btn-primary"
            onClick={onClose}
            data-testid="howto-close-btn"
          >
            Đã hiểu / Got It
          </button>
        </div>
      </div>
    </div>
  );
};
