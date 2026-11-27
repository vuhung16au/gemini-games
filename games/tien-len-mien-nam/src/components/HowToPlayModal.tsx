import React from 'react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="game-overlay-backdrop tl-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tl-help-title"
      onClick={onClose}
    >
      <div
        className="game-card tl-help-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tl-help-header">
          <h2 id="tl-help-title">
            Luật Chơi Tiến Lên Miền Nam / How to Play
          </h2>
          <button
            type="button"
            className="game-btn game-btn-secondary tl-btn-sm"
            onClick={onClose}
            aria-label="Close How to Play"
          >
            ✕
          </button>
        </div>

        <div className="tl-help-body">
          <section>
            <h3>1. Mục tiêu &amp; Thứ tự bài / Objective &amp; Card Order</h3>
            <p>
              Đánh hết 13 lá bài trên tay trước các đối thủ. Thứ tự từ nhỏ đến
              lớn: <strong>3 &lt; 4 &lt; … &lt; J &lt; Q &lt; K &lt; A &lt; 2 (Heo)</strong>.
              Chất đồng hạng: <strong>♠ &lt; ♣ &lt; ♦ &lt; ♥</strong>.
            </p>
            <p className="tl-en-note">
              Be first to empty your 13-card hand. Rank order: 3 lowest up to 2
              (highest). Suit tie-breaker: ♠ &lt; ♣ &lt; ♦ &lt; ♥.
            </p>
          </section>

          <section>
            <h3>2. Các bộ hợp lệ / Valid Combos</h3>
            <ul>
              <li>
                <strong>Lẻ / Single:</strong> 1 lá bất kỳ.
              </li>
              <li>
                <strong>Đôi / Pair:</strong> 2 lá cùng số.
              </li>
              <li>
                <strong>Sám cô / Triple:</strong> 3 lá cùng số.
              </li>
              <li>
                <strong>Sảnh / Straight:</strong> 3 lá trở lên liên tiếp (không
                cần đồng chất, <em>không chứa lá 2</em>).
              </li>
            </ul>
          </section>

          <section>
            <h3>3. Luật Chặt Heo / Bomb &amp; Cut Hierarchy</h3>
            <ul>
              <li>
                <strong>3 Đôi thông (3 Consec. Pairs):</strong> Chặt 1 Heo (2)
                hoặc 3 Đôi thông nhỏ hơn.
              </li>
              <li>
                <strong>Tứ quý (Four of a Kind):</strong> Chặt 1 Heo, Đôi Heo, 3
                Đôi thông, hoặc Tứ quý nhỏ hơn.
              </li>
              <li>
                <strong>4 Đôi thông (4 Consec. Pairs):</strong> Chặt tất cả các
                bộ trên và 4 Đôi thông nhỏ hơn.
              </li>
            </ul>
          </section>

          <section>
            <h3>4. Tới Trắng &amp; Vòng mở màn / Instant Win &amp; Opening</h3>
            <p>
              <strong>Tới Trắng (Instant Win):</strong> Thắng ngay khi chia bài
              nếu có <strong>Sảnh Rồng (3→A)</strong>, <strong>6 Đôi</strong>,
              hoặc <strong>Tứ quý 2</strong>. Ván đầu tiên ưu tiên người giữ{' '}
              <strong>3♠</strong> (hoặc lá nhỏ nhất ở bàn 2P/3P).
            </p>
          </section>
        </div>

        <div className="tl-help-footer">
          <button
            type="button"
            className="game-btn game-btn-primary"
            onClick={onClose}
            data-testid="close-help-btn"
          >
            Đã hiểu / Got It
          </button>
        </div>
      </div>
    </div>
  );
};
