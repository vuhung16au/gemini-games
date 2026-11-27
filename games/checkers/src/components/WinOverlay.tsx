import React from 'react';
import type { GameMode } from '../game/constants';
import type { Player } from '../game/types';

interface WinOverlayProps {
  winner: Player | null;
  mode: GameMode;
  moveCount: number;
  onNewGame: () => void;
}

export const WinOverlay: React.FC<WinOverlayProps> = ({
  winner,
  mode,
  moveCount,
  onNewGame,
}) => {
  if (!winner) return null;

  const title =
    mode === 'vs-ai'
      ? winner === 'red'
        ? 'You Win!'
        : 'AI Wins!'
      : `${winner === 'red' ? 'Red' : 'Black'} Wins!`;

  return (
    <div className="game-overlay-backdrop" role="dialog" aria-label={title}>
      <div className="game-card checkers-modal">
        <h2
          className={`modal-title ${
            winner === 'red' ? 'winner-red' : 'winner-black'
          }`}
        >
          {title}
        </h2>
        <p className="modal-subtitle">Completed in {moveCount} moves.</p>
        <button
          type="button"
          className="game-btn game-btn-primary"
          onClick={onNewGame}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
