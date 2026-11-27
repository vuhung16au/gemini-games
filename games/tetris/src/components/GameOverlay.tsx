import React from 'react';
import type { GamePhase } from '../game/types';

interface GameOverlayProps {
  phase: GamePhase;
  score: number;
  highScore: number;
  lines: number;
  level: number;
  canRestart: boolean;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  phase,
  score,
  highScore,
  lines,
  level,
  canRestart,
  onStart,
  onResume,
  onRestart,
}) => {
  if (phase === 'PLAYING') return null;

  return (
    <div
      className="game-overlay-backdrop"
      role="dialog"
      aria-label={
        phase === 'START'
          ? 'Start Tetris'
          : phase === 'PAUSED'
            ? 'Game Paused'
            : 'Game Over'
      }
    >
      <div className="game-card tetris-modal">
        {phase === 'START' && (
          <>
            <h2 className="modal-title">Ready to Stack?</h2>
            <p className="modal-subtitle">
              Clear lines, master SRS wall kicks, and beat your high score.
            </p>
            <button
              type="button"
              className="game-btn game-btn-primary"
              onClick={onStart}
            >
              Start Game
            </button>
          </>
        )}

        {phase === 'PAUSED' && (
          <>
            <h2 className="modal-title">Game Paused</h2>
            <p className="modal-subtitle">
              Score: {score} • Level: {level}
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
                onClick={onRestart}
              >
                Restart
              </button>
            </div>
          </>
        )}

        {phase === 'GAME_OVER' && (
          <>
            <h2 className="modal-title is-over">Game Over</h2>
            <div className="modal-stats">
              <div>
                <span className="modal-stat-label">Score</span>
                <span className="modal-stat-value">{score}</span>
              </div>
              <div>
                <span className="modal-stat-label">Best</span>
                <span className="modal-stat-value">{highScore}</span>
              </div>
              <div>
                <span className="modal-stat-label">Lines</span>
                <span className="modal-stat-value">{lines}</span>
              </div>
            </div>
            <button
              type="button"
              className="game-btn game-btn-primary"
              disabled={!canRestart}
              onClick={onRestart}
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
