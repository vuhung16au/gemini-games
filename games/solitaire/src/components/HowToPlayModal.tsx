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
      aria-label="How to Play Solitaire"
      onClick={onClose}
    >
      <div
        className="game-card solitaire-modal howto-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">How to Play Klondike Solitaire</h2>

        <div className="howto-body">
          <p>
            <strong>Objective:</strong> Build all 4 <strong>Foundation</strong>{' '}
            piles up by suit from <strong>Ace to King</strong> (A, 2, 3 … Q, K).
          </p>
          <ul>
            <li>
              <strong>Tableau Columns:</strong> Stack cards in{' '}
              <em>descending order</em> with <em>alternating colors</em> (e.g.,
              Red 6 onto Black 7).
            </li>
            <li>
              <strong>Empty Columns:</strong> Only a <strong>King</strong> (or
              a stack starting with a King) can fill an empty column.
            </li>
            <li>
              <strong>Stock &amp; Waste:</strong> Click the Stock pile (top left)
              to draw 1 or 3 cards. Click again when empty to recycle.
            </li>
            <li>
              <strong>Controls:</strong> Click a card then click a destination,
              <strong>drag &amp; drop</strong> cards, or{' '}
              <strong>double-click</strong> a card to send it straight to a
              Foundation.
            </li>
            <li>
              <strong>Shortcuts:</strong> <strong>D</strong> Draw •{' '}
              <strong>H</strong> Hint • <strong>Z</strong> Undo •{' '}
              <strong>P</strong> Pause
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
