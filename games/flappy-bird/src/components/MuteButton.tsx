import React from 'react';

interface MuteButtonProps {
  muted: boolean;
  onToggle: () => void;
}

export const MuteButton: React.FC<MuteButtonProps> = ({ muted, onToggle }) => {
  return (
    <button
      type="button"
      className={`mute-button ${muted ? 'is-muted' : ''}`}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
      aria-pressed={muted}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
};
