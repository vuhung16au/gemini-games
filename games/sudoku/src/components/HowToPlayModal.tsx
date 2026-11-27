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
      aria-label="How to Play Sudoku"
      onClick={onClose}
    >
      <div
        className="game-card sudoku-modal howto-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">How to Play Sudoku</h2>
        <div className="howto-body">
          <p>
            <strong>Objective:</strong> Fill every row, column, and 3×3 box with
            the digits <strong>1 through 9</strong> without repeating any digit.
          </p>
          <ul>
            <li>
              <strong>Notes (N):</strong> Toggle pencil marks to track candidate
              digits; valid placements automatically clear matching peer notes.
            </li>
            <li>
              <strong>Mistakes:</strong> You can make up to{' '}
              <strong>3 mistakes</strong> per puzzle.
            </li>
            <li>
              <strong>Controls:</strong> Click cells or use{' '}
              <strong>Arrow keys</strong>, type <strong>1–9</strong>,{' '}
              <strong>Backspace</strong> to erase, <strong>Z</strong> Undo,{' '}
              <strong>H</strong> Hint, <strong>P</strong> Pause.
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
