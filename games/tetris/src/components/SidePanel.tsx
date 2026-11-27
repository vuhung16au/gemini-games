import React from 'react';
import type { PieceType } from '../game/constants';
import { PiecePreviewSvg } from './PiecePreviewSvg';

interface SidePanelProps {
  hold: PieceType | null;
  canHold: boolean;
  nextQueue: PieceType[];
  score: number;
  highScore: number;
  level: number;
  lines: number;
  ghostEnabled: boolean;
  onToggleGhost: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  hold,
  canHold,
  nextQueue,
  score,
  highScore,
  level,
  lines,
  ghostEnabled,
  onToggleGhost,
}) => {
  return (
    <aside className="side-panel">
      <div
        className={`panel-card game-card ${!canHold ? 'is-locked' : ''}`}
        data-testid="hold-box"
        data-hold-type={hold ?? 'none'}
      >
        <span className="panel-label">HOLD (C)</span>
        <div className="preview-box">
          <PiecePreviewSvg type={hold} size={52} />
        </div>
      </div>

      <div className="panel-card game-card stats-card">
        <div className="stat-row">
          <span className="panel-label">SCORE</span>
          <span className="stat-val" data-testid="score-value">
            {score}
          </span>
        </div>
        <div className="stat-row">
          <span className="panel-label">BEST</span>
          <span className="stat-val">{highScore}</span>
        </div>
        <div className="stat-row">
          <span className="panel-label">LEVEL</span>
          <span className="stat-val" data-testid="level-value">
            {level}
          </span>
        </div>
        <div className="stat-row">
          <span className="panel-label">LINES</span>
          <span className="stat-val" data-testid="lines-value">
            {lines}
          </span>
        </div>
      </div>

      <div className="panel-card game-card">
        <span className="panel-label">NEXT</span>
        <div className="next-list">
          {nextQueue.slice(0, 3).map((pieceType, idx) => (
            <div key={idx} className="preview-box">
              <PiecePreviewSvg type={pieceType} size={46} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`game-btn action-btn ghost-toggle ${
          ghostEnabled ? 'game-btn-primary' : 'game-btn-secondary'
        }`}
        aria-pressed={ghostEnabled}
        onClick={onToggleGhost}
      >
        Ghost: {ghostEnabled ? 'ON' : 'OFF'}
      </button>
    </aside>
  );
};
