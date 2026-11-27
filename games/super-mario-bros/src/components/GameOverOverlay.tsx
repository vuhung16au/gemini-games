import React from 'react';
import type { MarioState } from '../game/types';

interface GameOverOverlayProps {
  state: MarioState;
  onRetry: () => void;
  onBackToTitle: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  state,
  onRetry,
  onBackToTitle,
}) => {
  const p = state.players[0];

  return (
    <div className="smb-overlay" data-testid="game-over-overlay">
      <h2 className="smb-gameover-title">GAME OVER</h2>
      <p className="smb-hero-sub">
        Final Score: {p.score} · High Score: {state.highScore}
      </p>
      <div className="smb-mode-row">
        <button type="button" className="smb-primary-btn" onClick={onRetry}>
          Try Again
        </button>
        <button type="button" className="smb-outline-btn" onClick={onBackToTitle}>
          Level Select
        </button>
      </div>
    </div>
  );
};
