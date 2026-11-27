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
      aria-label="How to Play Checkers"
      onClick={onClose}
    >
      <div
        className="game-card checkers-modal howto-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">How to Play Checkers</h2>
        <div className="howto-body">
          <p>
            <strong>Objective:</strong> Capture all of your opponent&apos;s
            pieces or block them so they have no legal moves left.
          </p>
          <ul>
            <li>
              <strong>Diagonal Movement:</strong> Regular pieces move forward
              diagonally one square onto dark squares.
            </li>
            <li>
              <strong>Mandatory Captures &amp; Multi-Jumps:</strong> If a jump
              is available, you must take it—and continue jumping if another
              capture is available from the landing square.
            </li>
            <li>
              <strong>Kings (♛):</strong> Reaching the opposite back row crowns
              your piece as a King, letting it move and jump forward or
              backward.
            </li>
            <li>
              <strong>Shortcuts:</strong> <strong>Z</strong> Undo •{' '}
              <strong>H</strong> Hint
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
