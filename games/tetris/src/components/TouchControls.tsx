import React from 'react';

interface TouchControlsProps {
  disabled: boolean;
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  disabled,
  onLeft,
  onRight,
  onDown,
  onRotate,
  onHardDrop,
  onHold,
}) => {
  return (
    <div className="touch-controls game-surface" aria-label="Touch controls">
      <button
        type="button"
        className="game-btn game-btn-secondary pad-btn"
        disabled={disabled}
        onClick={onLeft}
        aria-label="Move left"
      >
        ◀
      </button>
      <button
        type="button"
        className="game-btn game-btn-secondary pad-btn"
        disabled={disabled}
        onClick={onDown}
        aria-label="Soft drop"
      >
        ▼
      </button>
      <button
        type="button"
        className="game-btn game-btn-secondary pad-btn"
        disabled={disabled}
        onClick={onRight}
        aria-label="Move right"
      >
        ▶
      </button>
      <button
        type="button"
        className="game-btn game-btn-secondary pad-btn"
        disabled={disabled}
        onClick={onRotate}
        aria-label="Rotate"
      >
        ↻
      </button>
      <button
        type="button"
        className="game-btn game-btn-secondary pad-btn"
        disabled={disabled}
        onClick={onHold}
        aria-label="Hold piece"
      >
        Hold
      </button>
      <button
        type="button"
        className="game-btn game-btn-primary pad-btn"
        disabled={disabled}
        onClick={onHardDrop}
        aria-label="Hard drop"
      >
        ⤓ Drop
      </button>
    </div>
  );
};
