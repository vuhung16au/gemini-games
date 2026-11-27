import React from 'react';
import type { GameMode, PlayerCount } from '../game/types';

interface HeaderProps {
  playerCount: PlayerCount;
  mode: GameMode;
  round: number;
  bestScore: number;
  muted: boolean;
  tutorialMode: boolean;
  onSelectPlayerCount: (count: PlayerCount) => void;
  onSelectMode: (mode: GameMode) => void;
  onHint: () => void;
  onStartTutorial: () => void;
  onOpenHelp: () => void;
  onToggleMute: (e: React.MouseEvent) => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  playerCount,
  mode,
  round,
  bestScore,
  muted,
  tutorialMode,
  onSelectPlayerCount,
  onSelectMode,
  onHint,
  onStartTutorial,
  onOpenHelp,
  onToggleMute,
  onNewGame,
}) => {
  return (
    <header className="tala-header">
      <div className="header-brand">
        <img
          src="./icons/icon-192.png"
          alt="Tá Lả Phỏm emblem"
          className="header-emblem"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="header-titles">
          <h1>Tá Lả (Phỏm)</h1>
          <div className="header-meta">
            <span data-testid="round-display">Vòng {round}/4</span>
            <span aria-hidden="true">·</span>
            <span data-testid="best-score-display">Kỷ lục / Best: {bestScore}</span>
          </div>
        </div>
      </div>

      <div className="header-controls">
        <div className="segmented-group" role="tablist" aria-label="Player count">
          {([2, 3, 4] as const).map((count) => (
            <button
              key={count}
              type="button"
              role="tab"
              aria-selected={playerCount === count}
              data-testid={`player-count-${count}`}
              className={`seg-btn ${playerCount === count ? 'is-active' : ''}`}
              onClick={() => onSelectPlayerCount(count)}
            >
              {count}P
            </button>
          ))}
        </div>

        <div className="segmented-group" role="tablist" aria-label="Game mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'vs-ai'}
            data-testid="mode-vs-ai"
            className={`seg-btn ${mode === 'vs-ai' ? 'is-active' : ''}`}
            onClick={() => onSelectMode('vs-ai')}
          >
            vs AI
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'pass-and-play'}
            data-testid="mode-pass-play"
            className={`seg-btn ${mode === 'pass-and-play' ? 'is-active' : ''}`}
            onClick={() => onSelectMode('pass-and-play')}
          >
            Pass &amp; Play
          </button>
        </div>

        <button
          type="button"
          className="game-btn game-btn-secondary btn-compact"
          data-testid="hint-btn"
          onClick={onHint}
        >
          💡 Hint
        </button>

        <button
          type="button"
          className={`game-btn btn-compact ${tutorialMode ? 'game-btn-primary' : 'game-btn-secondary'}`}
          data-testid="tutorial-btn"
          onClick={onStartTutorial}
        >
          Tutorial
        </button>

        <button
          type="button"
          className="game-btn game-btn-secondary btn-compact"
          data-testid="help-btn"
          aria-label="How to Play"
          onClick={onOpenHelp}
        >
          ? Help
        </button>

        <button
          type="button"
          className="game-btn game-btn-secondary btn-compact"
          data-testid="mute-btn"
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          aria-pressed={muted}
          onClick={onToggleMute}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        <button
          type="button"
          className="game-btn game-btn-primary btn-compact"
          data-testid="new-game-btn"
          onClick={onNewGame}
        >
          Ván mới / New
        </button>
      </div>
    </header>
  );
};
