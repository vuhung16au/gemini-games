import React from 'react';
import type { GameMode, PlayerCount, SaveData } from '../game/types';

interface HeaderProps {
  playerCount: PlayerCount;
  mode: GameMode;
  saveData: SaveData;
  isTutorial: boolean;
  onSelectPlayerCount: (count: PlayerCount) => void;
  onSelectMode: (mode: GameMode) => void;
  onNewGame: () => void;
  onStartTutorial: () => void;
  onHint: () => void;
  onOpenHelp: () => void;
  onToggleMute: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  playerCount,
  mode,
  saveData,
  isTutorial,
  onSelectPlayerCount,
  onSelectMode,
  onNewGame,
  onStartTutorial,
  onHint,
  onOpenHelp,
  onToggleMute,
}) => {
  return (
    <header className="tl-header">
      <div className="tl-brand">
        <img
          src="./icons/icon-192.png"
          alt="Tiến Lên Miền Bắc Emblem"
          className="tl-emblem"
        />
        <div className="tl-brand-text">
          <h1 className="tl-title">Tiến Lên Miền Bắc</h1>
          <span className="tl-subtitle">Northern Thirteen</span>
        </div>
      </div>

      <div className="tl-header-controls">
        <div className="tl-segmented" role="tablist" aria-label="Số người chơi / Players">
          {([2, 3, 4] as PlayerCount[]).map((count) => (
            <button
              key={count}
              type="button"
              role="tab"
              aria-selected={playerCount === count && !isTutorial}
              className={`tl-seg-btn ${playerCount === count && !isTutorial ? 'active' : ''}`}
              onClick={() => onSelectPlayerCount(count)}
              data-testid={`players-${count}`}
            >
              {count}P
            </button>
          ))}
        </div>

        <div className="tl-segmented" role="tablist" aria-label="Chế độ / Mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'ai' && !isTutorial}
            className={`tl-seg-btn ${mode === 'ai' && !isTutorial ? 'active' : ''}`}
            onClick={() => onSelectMode('ai')}
            data-testid="mode-ai"
          >
            vs AI
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'hotseat' && !isTutorial}
            className={`tl-seg-btn ${mode === 'hotseat' && !isTutorial ? 'active' : ''}`}
            onClick={() => onSelectMode('hotseat')}
            data-testid="mode-hotseat"
          >
            Pass &amp; Play
          </button>
        </div>

        <div className="tl-stats-pill" data-testid="stats-display">
          <span>Thắng/Wins: {saveData.wins}</span>
          <span className="tl-dot">·</span>
          <span>Điểm/Score: {saveData.totalScore}</span>
        </div>

        <div className="tl-action-group">
          <button
            type="button"
            className="game-btn game-btn-secondary tl-btn-sm"
            onClick={onStartTutorial}
            data-testid="tutorial-btn"
          >
            Tutorial
          </button>
          <button
            type="button"
            className="game-btn game-btn-secondary tl-btn-sm"
            onClick={onHint}
            data-testid="hint-btn"
          >
            💡 Hint
          </button>
          <button
            type="button"
            className="game-btn game-btn-secondary tl-btn-sm"
            onClick={onOpenHelp}
            aria-label="Luật chơi / How to Play"
            data-testid="help-btn"
          >
            ?
          </button>
          <button
            type="button"
            className="game-btn game-btn-secondary tl-btn-sm"
            onClick={onToggleMute}
            aria-label={saveData.muted ? 'Unmute sound effects' : 'Mute sound effects'}
            aria-pressed={saveData.muted}
            data-testid="mute-btn"
          >
            {saveData.muted ? '🔇' : '🔊'}
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
    </header>
  );
};
