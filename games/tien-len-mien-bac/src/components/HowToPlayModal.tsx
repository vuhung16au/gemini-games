import React from 'react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div
      className="tl-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Luật Tiến Lên Miền Bắc / How to Play"
      onClick={onClose}
    >
      <div className="game-card tl-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="tl-modal-header">
          <h2>Luật Tiến Lên Miền Bắc / How to Play</h2>
          <button
            type="button"
            className="game-btn game-btn-secondary tl-btn-sm"
            onClick={onClose}
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        <div className="tl-modal-body">
          <section>
            <h3>1. Thứ tự quân bài / Rank &amp; Suit Order</h3>
            <p>
              <strong>Thứ tự giá trị / Rank:</strong> 3 &lt; 4 &lt; 5 &lt; 6 &lt; 7 &lt; 8 &lt; 9 &lt; 10 &lt; J &lt; Q &lt; K &lt; A &lt; <strong>2 (Heo)</strong>.
            </p>
            <p>
              <strong>Thứ tự chất / Suits:</strong> ♠ Bích &lt; ♣ Tép/Chuồn &lt; ♦ Rô &lt; ♥ Cơ.
            </p>
          </section>

          <section>
            <h3>2. Luật Đồng Chất &amp; Đồng Màu (Strict Northern Rules)</h3>
            <ul>
              <li>
                <strong>Lẻ / Single:</strong> Chặt lá lẻ lớn hơn nhưng phải <strong>cùng chất</strong> (ví dụ 9♦ chặt 7♦). Riêng quân <strong>2 (Heo)</strong> chặt được mọi lá lẻ thường khác chất; 2 chất cao hơn chặt 2 chất thấp hơn.
              </li>
              <li>
                <strong>Đôi / Pair:</strong> 2 lá cùng số và phải <strong>cùng màu</strong> (Đôi đen ♠♣ hoặc Đôi đỏ ♦♥). Đôi đen chỉ chặt đôi đen, đôi đỏ chỉ chặt đôi đỏ.
              </li>
              <li>
                <strong>Sám cô / Triple:</strong> 3 lá cùng số; muốn chặt phải lớn hơn và <strong>trùng đúng 3 chất</strong>.
              </li>
              <li>
                <strong>Sảnh / Straight:</strong> Từ 3 lá liên tiếp trở lên (không chứa quân 2) và tất cả phải <strong>cùng một chất</strong>. Chặt sảnh cùng độ dài và cùng chất.
              </li>
              <li>
                <strong>Tứ quý / Four of a Kind:</strong> 4 lá cùng số — dùng để <strong>Chặt Heo</strong> (chặt bất kỳ lá 2 lẻ nào) hoặc chặt Tứ quý nhỏ hơn.
              </li>
            </ul>
          </section>

          <section>
            <h3>3. Mở ván &amp; Luật Thối 2 / Opening &amp; Thối 2</h3>
            <ul>
              <li>
                <strong>Mở ván:</strong> Người cầm <strong>3♠</strong> (nếu có trên bàn) đi trước và phải đánh kèm 3♠ trong lượt đầu.
              </li>
              <li>
                <strong>Thối 2:</strong> Không được đánh quân 2 làm bài cuối cùng để về nhất. Nếu còn kẹt quân 2 cuối ván sẽ bị phạt <strong>Thối 2 (-10 điểm/lá)</strong>.
              </li>
            </ul>
          </section>

          <section>
            <h3>4. Phím tắt / Controls</h3>
            <p>
              Nhấp lá bài để chọn/bỏ chọn · <strong>Enter</strong>: Đánh / Play · <strong>P</strong>: Bỏ lượt / Pass · <strong>H</strong>: Gợi ý / Hint · <strong>S</strong>: Xếp bài / Sort · <strong>Esc</strong>: Bỏ chọn.
            </p>
          </section>
        </div>

        <div className="tl-modal-footer">
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
