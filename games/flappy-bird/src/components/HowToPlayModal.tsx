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
      aria-label="How to Play Flappy Bird"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="game-card flappy-howto-modal"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="flappy-modal-title">How to Play Flappy Bird</h2>
        <div className="howto-body">
          <p>
            <strong>Objective:</strong> Tap or press Space to keep the bird
            airborne and fly cleanly through the gaps between pipes.
          </p>
          <ul>
            <li>
              <strong>Controls:</strong> Press <strong>Space</strong>,{' '}
              <strong>Arrow Up</strong>, or <strong>Click / Tap</strong>{' '}
              anywhere on the screen to flap.
            </li>
            <li>
              <strong>Progressive Challenge:</strong> Pipe gaps start at{' '}
              <code>145 px</code> and gradually tighten to <code>120 px</code>{' '}
              as your score increases.
            </li>
            <li>
              <strong>Medals:</strong> Bronze (10+), Silver (20+), Gold (30+),
              Platinum (40+).
            </li>
            <li>
              <strong>Practice &amp; Hint:</strong> Try <strong>Tutorial</strong>{' '}
              mode for wider practice pipes, or toggle <strong>Hint</strong> to
              highlight the target flight corridor!
            </li>
          </ul>
        </div>
        <button
          type="button"
          className="game-btn game-btn-primary"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          Got It
        </button>
      </div>
    </div>
  );
};
