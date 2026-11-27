import React from 'react';
import type { GameMode, PlayerCount } from '../game/types';

interface HeaderProps {
  playerCount: PlayerCount;
  mode: GameMode;
  roundNumber: number;
  wins: number;
  bestScore: number;
  isTutorial: boolean;
  muted: boolean;
  onChangePlayerCount: (count: PlayerCount) => void;
  onChangeMode: (mode: GameMode) => void;
  onStartTutorial: () => void;
  onOpenHelp: () => void;
  onToggleMute: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  playerCount,
  mode,
  roundNumber,
  wins,
  bestScore,
  isTutorial,
  muted,
  onChangePlayerCount,
  onChangeMode,
  onStartTutorial,
  onOpenHelp,
  onToggleMute,
  onNewGame,
}) => {
  return (
    <header className="tl-header">
      <div className="tl-header-top">
        <div className="tl-brand-group">
          <img
            src="./icons/icon-192.png"
            alt="Tiến Lên Miền Nam icon"
            className="tl-emblem"
            width={32}
            height={32}
          />
          <div className="tl-title-wrap">
            <h1 className="tl-title">Tiến Lên Miền Nam</h1>
            <span className="tl-subtitle">
              Ván {roundNumber} · Thắng / Wins:{' '}
              <strong data-testid="wins-display">{wins}</strong> · Điểm cao / Best:{' '}
              <strong data-testid="best-score-display">{bestScore}</strong>
            </span>
          </div>
        </div>

        <div className="tl-header-actions">
          <button
            type="button"
            className="game-btn game-btn-secondary tl-btn-sm"
            onClick={onOpenHelp}
            aria-label="How to Play"
            data-testid="help-btn"
          >
            ? Luật / Help
          </button>
          <button
            type="button"
            className={`game-btn tl-btn-sm ${
              isTutorial ? 'game-btn-primary' : 'game-btn-secondary'
            }`}
            onClick={onStartTutorial}
            data-testid="tutorial-btn"
          >
            Tutorial
          </button>
          <button
            type="button"
            className="game-btn game-btn-secondary tl-icon-btn"
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            aria-pressed={muted}
            data-testid="mute-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            className="game-btn game-btn-primary tl-btn-sm"
            onClick={onNewGame}
            data-testid="new-game-btn"
          >
            Ván mới / New
          </button>
        </div>
      </div>

      <div className="tl-header-bar">
        <div
          className="tl-tabs"
          role="tablist"
          aria-label="Player count"
        >
          {([2, 3, 4] as const).map((count) => (
            <button
              key={count}
              type="button"
              role="tab"
              aria-selected={playerCount === count && !isTutorial}
              data-testid={`player-count-${count}`}
              className={`tl-tab ${
                playerCount === count && !isTutorial ? 'is-active' : ''
              }`}
              onClick={() => onChangePlayerCount(count)}
            >
              {count}P
            </button>
          ))}
        </div>

        <div
          className="tl-tabs"
          role="tablist"
          aria-label="Game mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'vs-ai' && !isTutorial}
            data-testid="mode-vs-ai"
            className={`tl-tab ${
              mode === 'vs-ai' && !isTutorial ? 'is-active' : ''
            }`}
            onClick={() => onChangeMode('vs-ai')}
          >
            vs AI
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'pass-and-play' && !isTutorial}
            data-testid="mode-pass-play"
            className={`tl-tab ${
              mode === 'pass-and-play' && !isTutorial ? 'is-active' : ''
            }`}
            onClick={() => onChangeMode('pass-and-play')}
          >
            Pass & Play
          </button>
        </div>
      </div>
    </header>
  );
};
