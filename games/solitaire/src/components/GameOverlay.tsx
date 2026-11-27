import React from 'react';
import { formatTime } from '../game/engine';
import type { GameStatus } from '../game/types';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  moves: number;
  elapsedSeconds: number;
  onResume: () => void;
  onNewGame: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  status,
  score,
  moves,
  elapsedSeconds,
  onResume,
  onNewGame,
}) => {
  if (status === 'PLAYING') return null;

  return (
    <div
      className="game-overlay-backdrop"
      role="dialog"
      aria-label={status === 'PAUSED' ? 'Game Paused' : 'You Won Solitaire'}
    >
      <div className="game-card solitaire-modal">
        {status === 'PAUSED' ? (
          <>
            <h2 className="modal-title">Game Paused</h2>
            <p className="modal-subtitle">
              Time: {formatTime(elapsedSeconds)} • Score: {score}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="game-btn game-btn-primary"
                onClick={onResume}
              >
                Resume
              </button>
              <button
                type="button"
                className="game-btn game-btn-secondary"
                onClick={onNewGame}
              >
                New Game
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="modal-title">You Won!</h2>
            <p className="modal-subtitle">All 4 Foundations completed!</p>
            <div className="modal-stats">
              <div>
                <span className="modal-stat-label">Score</span>
                <span className="modal-stat-value">{score}</span>
              </div>
              <div>
                <span className="modal-stat-label">Time</span>
                <span className="modal-stat-value">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <div>
                <span className="modal-stat-label">Moves</span>
                <span className="modal-stat-value">{moves}</span>
              </div>
            </div>
            <button
              type="button"
              className="game-btn game-btn-primary"
              onClick={onNewGame}
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
