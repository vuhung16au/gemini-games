import React from 'react';

interface TouchControlsProps {
  onMoveLeft: (down: boolean) => void;
  onMoveRight: (down: boolean) => void;
  onJump: (down: boolean) => void;
  onFire: (down: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onJump,
  onFire,
}) => {
  const bind = (cb: (down: boolean) => void) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      cb(true);
    },
    onPointerUp: () => cb(false),
    onPointerCancel: () => cb(false),
    onPointerLeave: () => cb(false),
  });

  return (
    <div className="smb-touch-controls" aria-label="Touch Controls">
      <div className="smb-touch-left">
        <button type="button" className="smb-touch-btn" aria-label="Move Left" {...bind(onMoveLeft)}>
          ◀
        </button>
        <button type="button" className="smb-touch-btn" aria-label="Move Right" {...bind(onMoveRight)}>
          ▶
        </button>
      </div>
      <div className="smb-touch-right">
        <button type="button" className="smb-touch-btn action" aria-label="Run or Fire" {...bind(onFire)}>
          B
        </button>
        <button type="button" className="smb-touch-btn jump" aria-label="Jump" {...bind(onJump)}>
          A
        </button>
      </div>
    </div>
  );
};
