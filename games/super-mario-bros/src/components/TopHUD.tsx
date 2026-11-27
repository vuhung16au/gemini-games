import React from 'react';
import type { MarioState } from '../game/types';

interface TopHUDProps {
  state: MarioState;
  muted: boolean;
  onTogglePause: () => void;
  onStartTutorial: () => void;
  onRequestHint: () => void;
  onOpenHelp: () => void;
  onToggleMute: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  state,
  muted,
  onTogglePause,
  onStartTutorial,
  onRequestHint,
  onOpenHelp,
  onToggleMute,
}) => {
  const p = state.players[0];

  return (
    <header className="smb-topbar">
      <div className="smb-brand">
        <img src="./icons/icon-192.png" alt="Super Mario Bros emblem" className="smb-emblem" />
        <div>
          <h1 className="smb-title">Super Mario Bros. (1985)</h1>
          <span className="smb-sub">World 1-1 to 1-4 · NES Classic</span>
        </div>
      </div>

      <div className="smb-hud-stats">
        <div className="smb-stat" data-testid="hud-score">
          <span>MARIO</span>
          <strong>{String(p.score).padStart(6, '0')}</strong>
        </div>
        <div className="smb-stat" data-testid="hud-coins">
          <span>COINS</span>
          <strong>×{String(p.coins).padStart(2, '0')}</strong>
        </div>
        <div className="smb-stat" data-testid="hud-world">
          <span>WORLD</span>
          <strong>{state.isTutorial ? 'TUT' : state.levelId}</strong>
        </div>
        <div className="smb-stat" data-testid="hud-time">
          <span>TIME</span>
          <strong>{Math.ceil(state.timeLeft)}</strong>
        </div>
        <div className="smb-stat" data-testid="hud-lives">
          <span>LIVES</span>
          <strong>❤️ {p.lives}</strong>
        </div>
      </div>

      <div className="smb-actions">
        {state.phase !== 'title' && (
          <button
            type="button"
            className="smb-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePause();
            }}
          >
            {state.phase === 'paused' ? '▶ Resume' : '⏸ Pause'}
          </button>
        )}

        <button
          type="button"
          className="smb-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            onStartTutorial();
          }}
        >
          Tutorial
        </button>

        <button
          type="button"
          className="smb-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRequestHint();
          }}
        >
          💡 Hint
        </button>

        <button
          type="button"
          className="smb-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenHelp();
          }}
        >
          ? Help
        </button>

        <button
          type="button"
          className="smb-pill-btn"
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          aria-pressed={muted}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  );
};
