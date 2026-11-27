import React from 'react';
import type { MarioState } from '../game/types';

interface StageClearOverlayProps {
  state: MarioState;
  onNextStage: () => void;
}

export const StageClearOverlay: React.FC<StageClearOverlayProps> = ({ state, onNextStage }) => {
  const p = state.players[0];

  return (
    <div className="smb-overlay" data-testid="stage-clear-overlay">
      <h2 className="smb-hero-title">
        {state.isTutorial ? 'TUTORIAL COMPLETE!' : `WORLD ${state.levelId} CLEAR!`}
      </h2>
      <p className="smb-hero-sub">
        Score: {p.score} · Coins: {p.coins}
      </p>
      <button type="button" className="smb-primary-btn" onClick={onNextStage}>
        {state.isTutorial ? 'Play World 1-1' : 'Next Course'}
      </button>
    </div>
  );
};
