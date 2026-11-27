import React from 'react';
import type { GamePhase } from '../game/types';

interface HeaderProps {
  phase: GamePhase;
  isTutorial: boolean;
  muted: boolean;
  onStartTutorial: () => void;
  onOpenHelp: () => void;
  onHint: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  phase,
  isTutorial,
  muted,
  onStartTutorial,
  onOpenHelp,
  onHint,
  onTogglePause,
  onToggleMute,
  onNewGame,
}) => {
  return (
    <header className="tetris-header">
      <div className="brand-group">
        <img
          src="./icons/icon-192.png"
          alt="Tetris icon"
          className="title-emblem"
          width={34}
          height={34}
        />
        <h1 className="tetris-title">Tetris</h1>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="game-btn game-btn-secondary action-btn"
          onClick={onOpenHelp}
          aria-label="How to Play"
        >
          ? How to Play
        </button>
        <button
          type="button"
          className={`game-btn action-btn ${
            isTutorial ? 'game-btn-primary' : 'game-btn-secondary'
          }`}
          onClick={onStartTutorial}
        >
          Tutorial
        </button>
        <button
          type="button"
          className="game-btn game-btn-secondary action-btn"
          disabled={phase !== 'PLAYING'}
          onClick={onHint}
          title="Hint (H)"
        >
          💡 Hint
        </button>
        <button
          type="button"
          className="game-btn game-btn-secondary action-btn"
          disabled={phase !== 'PLAYING' && phase !== 'PAUSED'}
          onClick={onTogglePause}
          aria-label={phase === 'PAUSED' ? 'Resume game' : 'Pause game'}
        >
          {phase === 'PAUSED' ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          type="button"
          className="game-btn game-btn-secondary icon-btn"
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          aria-pressed={muted}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          type="button"
          className="game-btn game-btn-primary action-btn"
          onClick={onNewGame}
        >
          New Game
        </button>
      </div>
    </header>
  );
};
