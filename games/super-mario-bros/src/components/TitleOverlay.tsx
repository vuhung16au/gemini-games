import React from 'react';
import { WORLD_1_LEVELS } from '../game/constants';
import type { LevelId } from '../game/types';

interface TitleOverlayProps {
  selectedLevel: LevelId;
  highScore: number;
  onSelectLevel: (level: LevelId) => void;
  onStartGame: (level: LevelId) => void;
  onStartTutorial: () => void;
}

export const TitleOverlay: React.FC<TitleOverlayProps> = ({
  selectedLevel,
  highScore,
  onSelectLevel,
  onStartGame,
  onStartTutorial,
}) => {
  return (
    <div className="smb-overlay" data-testid="title-overlay">
      <div className="smb-hero-row">
        <img src="./icons/icon-192.png" alt="Mushroom block" className="smb-hero-icon" />
        <div>
          <h2 className="smb-hero-title">SUPER MARIO BROS.</h2>
          <p className="smb-hero-sub">1985 NES Edition · HI-SCORE {highScore}</p>
        </div>
      </div>

      <div className="smb-level-select" role="group" aria-label="Select World 1 Level">
        {WORLD_1_LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            className={`smb-lvl-btn ${selectedLevel === lvl ? 'active' : ''}`}
            onClick={() => onSelectLevel(lvl)}
            data-level-btn={lvl}
          >
            World {lvl}
          </button>
        ))}
      </div>

      <div className="smb-mode-row">
        <button
          type="button"
          className="smb-primary-btn"
          onClick={() => onStartGame(selectedLevel)}
        >
          1 Player Start
        </button>
        <button
          type="button"
          className="smb-disabled-btn"
          disabled
          title="Planned for future release (TODO)"
        >
          2 Players (TODO)
        </button>
        <button type="button" className="smb-outline-btn" onClick={onStartTutorial}>
          Tutorial
        </button>
      </div>

      <p className="smb-roadmap-note">
        World 1 (1-1 to 1-4) playable now · Worlds 2–8 &amp; 2-Player Co-op: TODO
      </p>
    </div>
  );
};
