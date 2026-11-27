import React from 'react';
import type { Player } from '../game/types';

interface PrivacyCurtainProps {
  player: Player;
  onReveal: () => void;
}

export const PrivacyCurtain: React.FC<PrivacyCurtainProps> = ({
  player,
  onReveal,
}) => {
  const playerNumber = player.id + 1;

  return (
    <div
      className="game-overlay-backdrop tl-privacy-curtain"
      data-testid="privacy-curtain"
      role="dialog"
      aria-modal="true"
      aria-label={`Pass device to Player ${playerNumber}`}
    >
      <div className="game-card tl-curtain-card">
        <span className="game-badge">PASS &amp; PLAY</span>
        <h2 className="tl-curtain-title">
          Chuyển máy cho Người chơi {playerNumber} / Pass device to Player{' '}
          {playerNumber}
        </h2>
        <p className="tl-curtain-sub">
          Ẩn bài để giữ bí mật với các người chơi khác. Nhấn nút bên dưới khi
          bạn đã cầm máy.
          <br />
          Cards are hidden for privacy. Tap below when ready.
        </p>
        <button
          type="button"
          className="game-btn game-btn-primary tl-curtain-btn"
          onClick={onReveal}
          data-testid="reveal-hand-btn"
        >
          Xem bài / Reveal Hand
        </button>
      </div>
    </div>
  );
};
