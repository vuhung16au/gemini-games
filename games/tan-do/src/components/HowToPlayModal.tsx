import React from 'react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tan-help-title"
      onClick={onClose}
    >
      <div className="game-card help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="tan-help-title">Luật chơi Tấn Đỡ / How to Play Bài Tấn</h2>
          <button
            type="button"
            className="game-btn game-btn-secondary icon-btn"
            aria-label="Close help modal"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <section>
            <h3>Mục tiêu / Objective</h3>
            <p>
              <strong>VN:</strong> Mỗi người được chia 8 lá. Đánh hết bài trên tay sau khi{' '}
              <strong>Nọc</strong> (bài rút) đã cạn để giành chiến thắng!
            </p>
            <p>
              <strong>EN:</strong> Each player starts with 8 cards. Be the first to empty your
              hand after the draw pile (<strong>Nọc</strong>) runs out!
            </p>
          </section>

          <section>
            <h3>Thứ tự &amp; Chất Trưởng / Ranks &amp; Trump</h3>
            <ul>
              <li>
                <strong>Thứ tự / Rank order:</strong>{' '}
                <code>2 &lt; 3 &lt; 4 &lt; 5 &lt; 6 &lt; 7 &lt; 8 &lt; 9 &lt; 10 &lt; J &lt; Q &lt; K &lt; A</code>
              </li>
              <li>
                <strong>Chất Trưởng / Trump Suit:</strong> Lá cuối của Nọc được lật ngửa làm{' '}
                <em>Chất Trưởng</em>. Lá Trưởng thắng mọi lá thường khác chất!
              </li>
            </ul>
          </section>

          <section>
            <h3>Tấn &amp; Đỡ / Attack &amp; Defend</h3>
            <ul>
              <li>
                <strong>Tấn / Attack:</strong> Người Tấn đánh 1 lá (hoặc nhiều lá cùng số) xuống
                bàn.
              </li>
              <li>
                <strong>Đỡ / Defend:</strong> Người Đỡ phải dùng lá <em>cùng chất lớn hơn</em>{' '}
                hoặc <em>lá Trưởng</em> để chặn từng lá tấn (nếu lá tấn là Trưởng thì phải dùng
                Trưởng lớn hơn).
              </li>
              <li>
                <strong>Tấn thêm / Throw-in:</strong> Sau khi đỡ, người Tấn (và các người chơi
                khác ở bàn 3P/4P) có thể đánh thêm lá có <em>cùng số</em> với bất kỳ lá nào đang
                nằm trên bàn (tối đa 6 cặp hoặc bằng số bài còn lại của Người Đỡ).
              </li>
              <li>
                <strong>Kết thúc vòng / Resolution:</strong> Đỡ hết và mọi người nhấn{' '}
                <em>Thôi / Done</em> → dọn bàn, rút bù đủ 8 lá từ Nọc, Người Đỡ lên làm Người
                Tấn. Nếu nhấn <em>Ôm bài / Take</em> → Người Đỡ nhận hết bài trên bàn và mất lượt!
              </li>
            </ul>
          </section>

          <section>
            <h3>Chế độ &amp; Điều khiển / Modes &amp; Controls</h3>
            <ul>
              <li>
                <strong>2P / 3P / 4P × vs AI / Pass &amp; Play:</strong> Chơi với máy thông minh
                hoặc chuyền tay nhiều người với màn che bảo mật bài.
              </li>
              <li>
                <strong>Thao tác / Controls:</strong> Chạm/nhấp chọn bài trên tay rồi nhấn nút
                hành động, hoặc chạm trực tiếp vào lá tấn đang chờ đỡ trên bàn.
              </li>
            </ul>
          </section>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="game-btn game-btn-primary"
            onClick={onClose}
          >
            Đã hiểu / Got It
          </button>
        </div>
      </div>
    </div>
  );
};
