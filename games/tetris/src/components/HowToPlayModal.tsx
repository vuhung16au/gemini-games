import React from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="game-overlay-backdrop"
      role="dialog"
      aria-label="How to Play Tetris"
      onClick={onClose}
    >
      <div
        className="game-card tetris-modal howto-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">How to Play Tetris</h2>

        <div className="howto-body">
          <p>
            <strong>Objective:</strong> Stack falling Tetrominoes to complete
            full horizontal lines. Clearing lines scores points and advances the
            level speed.
          </p>
          <ul>
            <li>
              <strong>Move Left / Right:</strong> <code>←</code> /{' '}
              <code>→</code>
            </li>
            <li>
              <strong>Rotate:</strong> <code>↑</code> or <code>X</code>{' '}
              (clockwise), <code>Z</code> (counter-clockwise)
            </li>
            <li>
              <strong>Soft Drop:</strong> <code>↓</code> (+1 pt/cell)
            </li>
            <li>
              <strong>Hard Drop:</strong> <code>Space</code> (+2 pts/cell)
            </li>
            <li>
              <strong>Hold Piece:</strong> <code>C</code> or <code>Shift</code>{' '}
              (once per drop)
            </li>
            <li>
              <strong>Line Clears:</strong> Single <code>100</code> • Double{' '}
              <code>300</code> • Triple <code>500</code> • Tetris (4){' '}
              <code>800</code> × Level
            </li>
          </ul>
        </div>

        <button
          type="button"
          className="game-btn game-btn-primary"
          onClick={onClose}
        >
          Got It
        </button>
      </div>
    </div>
  );
};
