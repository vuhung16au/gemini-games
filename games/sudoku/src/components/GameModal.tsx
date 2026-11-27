import React from 'react';
import { DIFFICULTY_LABELS, MAX_MISTAKES, type Difficulty } from '../game/constants';
import { formatTime } from '../game/engine';
import type { GameStatus } from '../game/types';

interface GameModalProps {
  status: GameStatus;
  difficulty: Difficulty;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  onResume: () => void;
  onNewGame: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  status,
  difficulty,
  elapsedSeconds,
  mistakes,
  hintsUsed,
  onResume,
  onNewGame,
}) => {
  if (status === 'PLAYING') {
    return null;
  }

  return (
    <div
      className="game-overlay-backdrop"
      role="dialog"
      aria-label={
        status === 'PAUSED'
          ? 'Game Paused'
          : status === 'WON'
            ? 'Puzzle Solved'
            : 'Game Over'
      }
    >
      <div className="game-card sudoku-modal">
        {status === 'PAUSED' && (
          <>
            <h2 className="modal-title">Game Paused</h2>
            <p className="modal-subtitle">
              {DIFFICULTY_LABELS[difficulty]} • {formatTime(elapsedSeconds)}
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
        )}

        {status === 'WON' && (
          <>
            <h2 className="modal-title is-won">Puzzle Solved!</h2>
            <p className="modal-subtitle">
              Completed on <strong>{DIFFICULTY_LABELS[difficulty]}</strong>
            </p>
            <div className="modal-stats">
              <div>
                <span className="modal-stat-label">Time</span>
                <span className="modal-stat-value">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <div>
                <span className="modal-stat-label">Mistakes</span>
                <span className="modal-stat-value">
                  {mistakes}/{MAX_MISTAKES}
                </span>
              </div>
              <div>
                <span className="modal-stat-label">Hints</span>
                <span className="modal-stat-value">{hintsUsed}</span>
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

        {status === 'LOST' && (
          <>
            <h2 className="modal-title is-lost">Game Over</h2>
            <p className="modal-subtitle">
              You made {MAX_MISTAKES}/{MAX_MISTAKES} mistakes.
            </p>
            <button
              type="button"
              className="game-btn game-btn-primary"
              onClick={onNewGame}
            >
              Try New Puzzle
            </button>
          </>
        )}
      </div>
    </div>
  );
};
