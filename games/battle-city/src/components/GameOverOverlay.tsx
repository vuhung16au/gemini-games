import React from 'react';
import type { BattleState } from '../game/types';

interface GameOverOverlayProps {
  state: BattleState;
  onRetry: () => void;
  onBackToTitle: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  state,
  onRetry,
  onBackToTitle,
}) => {
  const [p1, p2] = state.players;
  const eagleDead = state.grid[24 * 26 + 12] === 'eagle_dead';

  return (
    <div className="bc-overlay-card danger" data-testid="game-over-overlay">
      <h2 className="bc-gameover-title">GAME OVER</h2>
      <p className="bc-hero-sub">
        {eagleDead ? 'The Eagle HQ was destroyed!' : 'All tanks lost in battle.'}
      </p>

      <div className="bc-final-scores">
        <div>P1 Score: {p1.score}</div>
        {state.mode === '2p' && <div>P2 Score: {p2.score}</div>}
        <div>High Score: {state.highScore}</div>
      </div>

      <div className="bc-mode-buttons">
        <button type="button" className="bc-primary-btn" onClick={onRetry}>
          Play Again
        </button>
        <button type="button" className="bc-outline-btn" onClick={onBackToTitle}>
          Mode Select
        </button>
      </div>
    </div>
  );
};
