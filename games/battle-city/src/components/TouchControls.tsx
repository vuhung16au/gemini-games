import React from 'react';
import type { Direction } from '../game/types';

interface TouchControlsProps {
  onDirChange: (dir: Direction | null) => void;
  onFireChange: (firing: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onDirChange, onFireChange }) => {
  const bindDir = (dir: Direction) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      onDirChange(dir);
    },
    onPointerUp: () => onDirChange(null),
    onPointerCancel: () => onDirChange(null),
    onPointerLeave: () => onDirChange(null),
  });

  return (
    <div className="bc-touch-controls" aria-label="Touch Controls">
      <div className="bc-dpad">
        <button type="button" className="dpad-btn up" aria-label="Move Up" {...bindDir('up')}>
          ▲
        </button>
        <button type="button" className="dpad-btn left" aria-label="Move Left" {...bindDir('left')}>
          ◀
        </button>
        <button
          type="button"
          className="dpad-btn right"
          aria-label="Move Right"
          {...bindDir('right')}
        >
          ▶
        </button>
        <button type="button" className="dpad-btn down" aria-label="Move Down" {...bindDir('down')}>
          ▼
        </button>
      </div>

      <button
        type="button"
        className="bc-fire-btn"
        aria-label="Fire Cannon"
        onPointerDown={(e) => {
          e.preventDefault();
          onFireChange(true);
        }}
        onPointerUp={() => onFireChange(false)}
        onPointerCancel={() => onFireChange(false)}
        onPointerLeave={() => onFireChange(false)}
      >
        FIRE
      </button>
    </div>
  );
};
