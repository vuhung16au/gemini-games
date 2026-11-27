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
      aria-label="How to Play 1024"
      onClick={onClose}
    >
      <div
        className="game-card modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">How to Play 1024</h2>
        <div className="howto-body">
          <p>
            <strong>Objective:</strong> Slide numbered tiles on the 4×4 grid to
            combine matching numbers and create the <strong>1024</strong> tile!
          </p>
          <ul>
            <li>
              <strong>Progression:</strong> <code>1 + 1 = 2</code>,{' '}
              <code>2 + 2 = 4</code>, <code>4 + 4 = 8</code> … up to{' '}
              <code>1024</code>.
            </li>
            <li>
              <strong>Controls:</strong> Use <strong>Arrow keys</strong>,{' '}
              <strong>WASD</strong>, or <strong>swipe</strong> on touch/mouse.
            </li>
            <li>
              <strong>Shortcuts:</strong> <strong>Z</strong> Undo •{' '}
              <strong>H</strong> Hint
            </li>
            <li>
              <strong>Keep Going:</strong> After reaching 1024, you can keep
              playing to chase 2048 and higher!
            </li>
          </ul>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onClose}
        >
          Got It
        </button>
      </div>
    </div>
  );
};
