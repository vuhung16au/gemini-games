import React from 'react';
import type { GameStatus } from '../game/types';

interface OverlayProps {
  status: GameStatus;
  score: number;
  onKeepGoing: () => void;
  onNewGame: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({
  status,
  score,
  onKeepGoing,
  onNewGame,
}) => {
  if (status === 'PLAYING') {
    return null;
  }

  const isWon = status === 'WON';

  return (
    <div
      className={`board-overlay ${isWon ? 'overlay-won' : 'overlay-gameover'}`}
      role="dialog"
      aria-label={isWon ? 'You reached 1024!' : 'Game Over'}
    >
      <h2 className="overlay-title">
        {isWon ? 'You reached 1024!' : 'Game Over!'}
      </h2>
      <p className="overlay-subtitle">
        {isWon
          ? `Awesome run — current score: ${score}`
          : `Final score: ${score}`}
      </p>
      <div className="overlay-actions">
        {isWon && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onKeepGoing}
          >
            Keep Going
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={onNewGame}>
          {isWon ? 'New Game' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};
