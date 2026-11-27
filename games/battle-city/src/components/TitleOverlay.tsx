import React from 'react';
import { TOTAL_STAGES } from '../game/constants';
import type { GameMode } from '../game/types';

interface TitleOverlayProps {
  selectedStage: number;
  highScore: number;
  onSelectStage: (stage: number) => void;
  onStartGame: (mode: GameMode, stage: number) => void;
  onStartTutorial: () => void;
}

export const TitleOverlay: React.FC<TitleOverlayProps> = ({
  selectedStage,
  highScore,
  onSelectStage,
  onStartGame,
  onStartTutorial,
}) => {
  return (
    <div className="bc-overlay-card" data-testid="title-overlay">
      <div className="bc-title-hero">
        <img src="./icons/icon-192.png" alt="Battle City emblem" className="bc-hero-icon" />
        <div>
          <h2 className="bc-hero-heading">BATTLE CITY</h2>
          <p className="bc-hero-sub">1985 Famicom / NES Edition · HI {highScore}</p>
        </div>
      </div>

      <div className="bc-stage-picker">
        <span>Stage:</span>
        <button
          type="button"
          className="bc-mini-btn"
          onClick={() => onSelectStage(selectedStage <= 1 ? TOTAL_STAGES : selectedStage - 1)}
          aria-label="Previous stage"
        >
          ◀
        </button>
        <strong data-testid="selected-stage">{selectedStage}</strong>
        <button
          type="button"
          className="bc-mini-btn"
          onClick={() => onSelectStage(selectedStage >= TOTAL_STAGES ? 1 : selectedStage + 1)}
          aria-label="Next stage"
        >
          ▶
        </button>
      </div>

      <div className="bc-mode-buttons">
        <button
          type="button"
          className="bc-primary-btn"
          onClick={() => onStartGame('1p', selectedStage)}
        >
          1 Player
        </button>
        <button
          type="button"
          className="bc-primary-btn secondary"
          onClick={() => onStartGame('2p', selectedStage)}
        >
          2 Players (Co-op)
        </button>
        <button type="button" className="bc-outline-btn" onClick={onStartTutorial}>
          Tutorial
        </button>
      </div>

      <div className="bc-controls-summary">
        <div>
          <strong>1P:</strong> WASD or Arrows + Space/Enter
        </div>
        <div>
          <strong>2P Co-op:</strong> P1 (WASD + Space) · P2 (Arrows + Enter)
        </div>
      </div>
    </div>
  );
};
