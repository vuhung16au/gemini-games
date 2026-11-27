import React from 'react';
import type { MarioState } from '../game/types';

interface VictoryOverlayProps {
  state: MarioState;
  onPlayAgain: () => void;
  onBackToTitle: () => void;
}

export const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  state,
  onPlayAgain,
  onBackToTitle,
}) => {
  const p = state.players[0];

  return (
    <div className="smb-overlay" data-testid="victory-overlay">
      <h2 className="smb-hero-title">COURSE CLEAR!</h2>
      <p className="smb-toad-quote">
        &ldquo;THANK YOU MARIO!
        <br />
        BUT OUR PRINCESS IS IN ANOTHER CASTLE!&rdquo;
      </p>
      <p className="smb-hero-sub">
        Final Score: {p.score} · High Score: {state.highScore} · (Worlds 2–8: TODO)
      </p>
      <div className="smb-mode-row">
        <button type="button" className="smb-primary-btn" onClick={onPlayAgain}>
          Replay World 1-1
        </button>
        <button type="button" className="smb-outline-btn" onClick={onBackToTitle}>
          Level Select
        </button>
      </div>
    </div>
  );
};
