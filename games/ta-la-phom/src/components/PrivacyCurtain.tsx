import React from 'react';

interface PrivacyCurtainProps {
  playerNumber: number;
  round: number;
  onReveal: () => void;
}

export const PrivacyCurtain: React.FC<PrivacyCurtainProps> = ({
  playerNumber,
  round,
  onReveal,
}) => {
  return (
    <div
      className="game-overlay-backdrop privacy-curtain"
      data-testid="privacy-curtain"
      role="dialog"
      aria-modal="true"
      aria-label={`Pass device to Player ${playerNumber}`}
    >
      <div className="game-card privacy-card">
        <span className="game-badge">Vòng {round}/4 · Pass &amp; Play</span>
        <h2>
          Chuyển máy cho Người chơi {playerNumber}
          <span className="subtitle-en">Pass device to Player {playerNumber}</span>
        </h2>
        <p className="privacy-desc">
          Bài của mọi người đang được úp để bảo mật. Nhấn nút bên dưới khi Người chơi{' '}
          {playerNumber} sẵn sàng xem bài.
        </p>
        <button
          type="button"
          className="game-btn game-btn-primary privacy-reveal-btn"
          data-testid="reveal-hand-btn"
          onClick={onReveal}
        >
          Xem bài / Reveal Hand
        </button>
      </div>
    </div>
  );
};
