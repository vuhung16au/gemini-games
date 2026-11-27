import React from 'react';
import type { AIDifficulty, GameMode } from '../game/constants';
import type { Player } from '../game/types';

interface HeaderProps {
  mode: GameMode;
  difficulty: AIDifficulty;
  currentPlayer: Player;
  redCount: number;
  blackCount: number;
  wins: number;
  losses: number;
  canUndo: boolean;
  muted: boolean;
  isAIThinking: boolean;
  mustContinueJump: boolean;
  isTutorial: boolean;
  onChangeMode: (mode: GameMode) => void;
  onChangeDifficulty: (difficulty: AIDifficulty) => void;
  onUndo: () => void;
  onHint: () => void;
  onStartTutorial: () => void;
  onOpenHelp: () => void;
  onNewGame: () => void;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  difficulty,
  currentPlayer,
  redCount,
  blackCount,
  wins,
  losses,
  canUndo,
  muted,
  isAIThinking,
  mustContinueJump,
  isTutorial,
  onChangeMode,
  onChangeDifficulty,
  onUndo,
  onHint,
  onStartTutorial,
  onOpenHelp,
  onNewGame,
  onToggleMute,
}) => {
  const turnLabel = isAIThinking
    ? 'AI is thinking…'
    : mustContinueJump
      ? `${currentPlayer === 'red' ? 'Red' : 'Black'} must continue jump!`
      : `${currentPlayer === 'red' ? 'Red' : 'Black'}'s Turn`;

  return (
    <header className="checkers-header">
      <div className="header-top">
        <div className="brand-block">
          <img
            src="./icons/icon-192.png"
            alt="Checkers icon"
            className="title-emblem"
            width={34}
            height={34}
          />
          <h1 className="checkers-title">Checkers</h1>
          <span className="record-badge">
            W: {wins} • L: {losses}
          </span>
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

      <div className="mode-row">
        <div className="segmented-control" role="tablist" aria-label="Game Mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'vs-ai'}
            className={`seg-btn ${mode === 'vs-ai' ? 'is-active' : ''}`}
            onClick={() => onChangeMode('vs-ai')}
          >
            vs AI
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'two-player'}
            className={`seg-btn ${mode === 'two-player' ? 'is-active' : ''}`}
            onClick={() => onChangeMode('two-player')}
          >
            2 Players
          </button>
        </div>

        {mode === 'vs-ai' && (
          <div
            className="segmented-control"
            role="tablist"
            aria-label="AI Difficulty"
          >
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                role="tab"
                aria-selected={difficulty === diff}
                className={`seg-btn ${difficulty === diff ? 'is-active' : ''}`}
                onClick={() => onChangeDifficulty(diff)}
              >
                {diff[0].toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="status-bar">
        <div className="piece-counters">
          <span className="counter-pill" data-testid="red-count">
            <span className="dot dot-red" /> Red: {redCount}
          </span>
          <span className="counter-pill" data-testid="black-count">
            <span className="dot dot-black" /> Black: {blackCount}
          </span>
        </div>

        <div
          className={`turn-pill ${
            currentPlayer === 'red' ? 'turn-red' : 'turn-black'
          }`}
          data-testid="turn-indicator"
        >
          {turnLabel}
        </div>
      </div>

      <div className="toolbar-row">
        <button
          type="button"
          className="game-btn game-btn-secondary tool-btn"
          disabled={!canUndo || isAIThinking}
          onClick={onUndo}
        >
          ↩ Undo
        </button>
        <button
          type="button"
          className="game-btn game-btn-secondary tool-btn"
          disabled={isAIThinking}
          onClick={onHint}
        >
          💡 Hint
        </button>
      </div>
    </header>
  );
};
