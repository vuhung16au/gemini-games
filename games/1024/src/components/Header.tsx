import React from 'react';

interface HeaderProps {
  score: number;
  bestScore: number;
  lastScoreDelta: number;
  moveCount: number;
  canUndo: boolean;
  isTutorial: boolean;
  muted: boolean;
  onUndo: () => void;
  onHint: () => void;
  onStartTutorial: () => void;
  onOpenHelp: () => void;
  onNewGame: () => void;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  lastScoreDelta,
  moveCount,
  canUndo,
  isTutorial,
  muted,
  onUndo,
  onHint,
  onStartTutorial,
  onOpenHelp,
  onNewGame,
  onToggleMute,
}) => {
  return (
    <header className="game-header">
      <div className="header-top">
        <div className="title-block">
          <div className="title-row">
            <img
              src="./icons/icon-192.png"
              alt="1024 icon"
              className="title-emblem"
              width={40}
              height={40}
            />
            <h1 className="game-title">1024</h1>
          </div>
          <p className="game-subtitle">
            Join the numbers and get to the <strong>1024</strong> tile!
          </p>
        </div>

        <div className="scores-row">
          <div className="score-box">
            <span className="score-label">SCORE</span>
            <span className="score-value">{score}</span>
            {lastScoreDelta > 0 && (
              <span key={moveCount} className="score-delta">
                +{lastScoreDelta}
              </span>
            )}
          </div>
          <div className="score-box">
            <span className="score-label">BEST</span>
            <span className="score-value">{bestScore}</span>
          </div>
        </div>
      </div>

      <div className="controls-row">
        <div className="controls-left">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo last move (Z)"
          >
            Undo
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onHint}
            title="Hint (H)"
          >
            💡 Hint
          </button>
          <button
            type="button"
            className={`btn ${isTutorial ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onStartTutorial}
          >
            Tutorial
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenHelp}
            aria-label="How to Play"
          >
            ? Help
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNewGame}
          >
            New Game
          </button>
        </div>

        <button
          type="button"
          className={`btn btn-mute ${muted ? 'is-muted' : ''}`}
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
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
