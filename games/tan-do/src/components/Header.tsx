import React from 'react';
import { SUIT_INFO } from '../game/constants';
import type { GameMode, PlayerCount, Suit } from '../game/types';

interface HeaderProps {
  playerCount: PlayerCount;
  mode: GameMode;
  trumpSuit: Suit;
  nocCount: number;
  wins: number;
  score: number;
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
  trumpSuit,
  nocCount,
  wins,
  score,
  isTutorial,
  muted,
  onChangePlayerCount,
  onChangeMode,
  onStartTutorial,
  onOpenHelp,
  onToggleMute,
  onNewGame,
}) => {
  const trumpInfo = SUIT_INFO[trumpSuit];

  return (
    <header className="tan-header">
      <div className="header-top">
        <div className="brand-group">
          <img
            src="./icons/icon-192.png"
            alt="Tấn Đỡ emblem"
            className="title-emblem"
            width={30}
            height={30}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="title-stack">
            <h1 className="tan-title">Tấn Đỡ · Bài Tấn</h1>
          </div>

          <div
            className="seg-tabs"
            role="tablist"
            aria-label="Player count"
          >
            {([2, 3, 4] as PlayerCount[]).map((count) => (
              <button
                key={count}
                type="button"
                role="tab"
                data-testid={`player-count-${count}`}
                aria-selected={!isTutorial && playerCount === count}
                className={`seg-tab ${
                  !isTutorial && playerCount === count ? 'is-active' : ''
                }`}
                onClick={() => onChangePlayerCount(count)}
              >
                {count}P
              </button>
            ))}
          </div>

          <div
            className="seg-tabs"
            role="tablist"
            aria-label="Game mode"
          >
            <button
              type="button"
              role="tab"
              data-testid="mode-ai"
              aria-selected={!isTutorial && mode === 'ai'}
              className={`seg-tab ${
                !isTutorial && mode === 'ai' ? 'is-active' : ''
              }`}
              onClick={() => onChangeMode('ai')}
            >
              vs AI
            </button>
            <button
              type="button"
              role="tab"
              data-testid="mode-pass-and-play"
              aria-selected={!isTutorial && mode === 'pass-and-play'}
              className={`seg-tab ${
                !isTutorial && mode === 'pass-and-play' ? 'is-active' : ''
              }`}
              onClick={() => onChangeMode('pass-and-play')}
            >
              Pass &amp; Play
            </button>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="game-btn game-btn-secondary compact-btn"
            data-testid="btn-help"
            onClick={onOpenHelp}
            aria-label="How to Play / Luật chơi"
          >
            ? Help
          </button>
          <button
            type="button"
            className={`game-btn compact-btn ${
              isTutorial ? 'game-btn-primary' : 'game-btn-secondary'
            }`}
            data-testid="btn-tutorial"
            onClick={onStartTutorial}
          >
            Tutorial
          </button>
          <button
            type="button"
            className="game-btn game-btn-secondary icon-btn"
            data-testid="btn-mute"
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
            className="game-btn game-btn-primary compact-btn"
            data-testid="btn-new-game"
            onClick={onNewGame}
          >
            Ván mới / New
          </button>
        </div>
      </div>

      <div className="header-stats">
        <span
          className={`stat-pill trump-pill ${trumpInfo.isRed ? 'is-red' : 'is-black'}`}
          data-testid="trump-display"
        >
          Trưởng / Trump: {trumpInfo.symbol} {trumpInfo.nameVi}
        </span>
        <span className="stat-pill" data-testid="noc-count-display">
          Nọc / Deck: {nocCount}
        </span>
        <span className="stat-pill" data-testid="wins-display">
          Thắng / Wins: {wins}
        </span>
        <span className="stat-pill" data-testid="score-display">
          Điểm / Score: {score}
        </span>
      </div>
    </header>
  );
};
