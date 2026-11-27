import React from 'react';
import {
  DIFFICULTY_LABELS,
  MAX_MISTAKES,
  type Difficulty,
} from '../game/constants';
import { formatTime } from '../game/engine';
import type { GameStatus } from '../game/types';

interface HeaderProps {
  difficulty: Difficulty;
  mistakes: number;
  elapsedSeconds: number;
  bestTime?: number;
  status: GameStatus;
  isTutorial: boolean;
  muted: boolean;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onStartTutorial: () => void;
  onOpenHelp: () => void;
  onNewGame: () => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  mistakes,
  elapsedSeconds,
  bestTime,
  status,
  isTutorial,
  muted,
  onChangeDifficulty,
  onTogglePause,
  onToggleMute,
  onStartTutorial,
  onOpenHelp,
  onNewGame,
}) => {
  return (
    <header className="sudoku-header">
      <div className="header-top">
        <div className="brand-group">
          <img
            src="./icons/icon-192.png"
            alt="Sudoku icon"
            className="title-emblem"
            width={34}
            height={34}
          />
          <h1 className="sudoku-title">Sudoku</h1>
          {bestTime !== undefined && (
            <span className="best-badge">Best: {formatTime(bestTime)}</span>
          )}
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="game-btn game-btn-secondary action-btn"
            onClick={onOpenHelp}
            aria-label="How to Play"
          >
            ? Help
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

      <div className="header-meta">
        <div className="difficulty-tabs" role="tablist" aria-label="Difficulty">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              role="tab"
              aria-selected={difficulty === diff}
              className={`diff-tab ${difficulty === diff ? 'is-active' : ''}`}
              onClick={() => onChangeDifficulty(diff)}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>

        <div className="stats-strip">
          <span
            className={`stat-pill ${mistakes > 0 ? 'has-mistakes' : ''}`}
            data-testid="mistakes-counter"
          >
            Mistakes: {mistakes}/{MAX_MISTAKES}
          </span>
          <button
            type="button"
            className="stat-pill timer-pill"
            onClick={onTogglePause}
            aria-label={status === 'PAUSED' ? 'Resume game' : 'Pause game'}
            data-testid="timer-display"
          >
            {formatTime(elapsedSeconds)} {status === 'PAUSED' ? '▶' : '⏸'}
          </button>
        </div>
      </div>
    </header>
  );
};
