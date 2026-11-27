import React from 'react';
import { formatTime } from '../game/engine';
import type { DrawMode, GameStatus } from '../game/types';

interface HeaderProps {
  drawMode: DrawMode;
  score: number;
  moves: number;
  elapsedSeconds: number;
  status: GameStatus;
  canUndo: boolean;
  showAutoComplete: boolean;
  isTutorial: boolean;
  muted: boolean;
  onChangeDrawMode: (mode: DrawMode) => void;
  onUndo: () => void;
  onHint: () => void;
  onAutoComplete: () => void;
  onStartTutorial: () => void;
  onOpenHelp: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  drawMode,
  score,
  moves,
  elapsedSeconds,
  status,
  canUndo,
  showAutoComplete,
  isTutorial,
  muted,
  onChangeDrawMode,
  onUndo,
  onHint,
  onAutoComplete,
  onStartTutorial,
  onOpenHelp,
  onTogglePause,
  onToggleMute,
  onNewGame,
}) => {
  return (
    <header className="solitaire-header">
      <div className="header-top">
        <div className="brand-group">
          <img
            src="./icons/icon-192.png"
            alt="Solitaire icon"
            className="title-emblem"
            width={34}
            height={34}
          />
          <h1 className="solitaire-title">Solitaire</h1>

          <div
            className="draw-tabs"
            role="tablist"
            aria-label="Draw mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={drawMode === 1 && !isTutorial}
              className={`draw-tab ${drawMode === 1 && !isTutorial ? 'is-active' : ''}`}
              onClick={() => onChangeDrawMode(1)}
            >
              Turn 1
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={drawMode === 3 && !isTutorial}
              className={`draw-tab ${drawMode === 3 && !isTutorial ? 'is-active' : ''}`}
              onClick={() => onChangeDrawMode(3)}
            >
              Turn 3
            </button>
          </div>
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
      </div>

      <div className="header-bar">
        <div className="stats-group">
          <span className="stat-pill" data-testid="score-display">
            Score: {score}
          </span>
          <span className="stat-pill" data-testid="moves-display">
            Moves: {moves}
          </span>
          <button
            type="button"
            className="stat-pill timer-pill"
            data-testid="timer-display"
            onClick={onTogglePause}
            aria-label={status === 'PAUSED' ? 'Resume game' : 'Pause game'}
          >
            {formatTime(elapsedSeconds)} {status === 'PAUSED' ? '▶' : '⏸'}
          </button>
        </div>

        <div className="tools-group">
          {showAutoComplete && (
            <button
              type="button"
              className="game-btn game-btn-primary action-btn"
              onClick={onAutoComplete}
            >
              ✨ Auto-Complete
            </button>
          )}
          <button
            type="button"
            className="game-btn game-btn-secondary action-btn"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Z)"
          >
            ↩ Undo
          </button>
          <button
            type="button"
            className="game-btn game-btn-secondary action-btn"
            onClick={onHint}
            title="Hint (H)"
          >
            💡 Hint
          </button>
        </div>
      </div>
    </header>
  );
};
