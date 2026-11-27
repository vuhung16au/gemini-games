import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sfx } from './audio/sfx';
import { CustomBoardModal } from './components/CustomBoardModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { PRESET_CONFIGS } from './game/constants';
import {
  chordCell,
  createMinesweeperState,
  revealCell,
  toggleFlag,
} from './game/engine';
import { getMinesweeperHint } from './game/hints';
import { loadMinesweeperSave, saveMinesweeperData } from './game/storage';
import { getTutorialProgress } from './game/tutorial';
import type {
  BoardConfig,
  DifficultyPreset,
  MinesweeperHint,
  MinesweeperState,
} from './game/types';

export const App: React.FC = () => {
  const initialSave = useMemo(() => loadMinesweeperSave(), []);
  const [muted, setMuted] = useState(initialSave.muted);
  const [bestTimes, setBestTimes] = useState(initialSave.bestTimes);
  const [flagMode, setFlagMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [activeHint, setActiveHint] = useState<MinesweeperHint | null>(null);

  const [gameState, setGameState] = useState<MinesweeperState>(() => {
    const preset =
      initialSave.difficulty === 'custom'
        ? PRESET_CONFIGS.easy
        : PRESET_CONFIGS[initialSave.difficulty];
    return createMinesweeperState(preset);
  });

  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    saveMinesweeperData({
      bestTimes,
      difficulty: gameState.config.difficulty,
      muted,
    });
  }, [bestTimes, gameState.config.difficulty, muted]);

  // 1-second game timer (paused when tab is hidden)
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setGameState((prev) =>
        prev.status === 'playing'
          ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }
          : prev,
      );
    }, 1000);

    return () => window.clearInterval(id);
  }, [gameState.status]);

  const handleReset = useCallback((config: BoardConfig, isTutorial = false) => {
    setActiveHint(null);
    setGameState(createMinesweeperState(config, { isTutorial }));
  }, []);

  const handleSelectDifficulty = useCallback(
    (diff: Exclude<DifficultyPreset, 'custom'>) => {
      handleReset(PRESET_CONFIGS[diff]);
    },
    [handleReset],
  );

  const recordWinTime = useCallback(
    (state: MinesweeperState) => {
      const diff = state.config.difficulty;
      if (diff === 'custom') return;
      setBestTimes((prev) => {
        const cur = prev[diff];
        if (cur === undefined || state.elapsedSeconds < cur) {
          return { ...prev, [diff]: state.elapsedSeconds };
        }
        return prev;
      });
    },
    [],
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setActiveHint(null);
      const cell = gameState.cells[row * gameState.config.cols + col];
      if (!cell) return;

      if (cell.revealed && cell.adjacentMines > 0) {
        const res = chordCell(gameState, row, col);
        if (res.changed) {
          setGameState(res.state);
          if (res.exploded) sfx.play('explode');
          else if (res.won) {
            sfx.play('win');
            recordWinTime(res.state);
          } else sfx.play('reveal');
        }
        return;
      }

      if (flagMode) {
        const res = toggleFlag(gameState, row, col);
        if (res.changed) {
          setGameState(res.state);
          sfx.play('flag');
        }
        return;
      }

      const res = revealCell(gameState, row, col);
      if (res.changed) {
        setGameState(res.state);
        if (res.exploded) sfx.play('explode');
        else if (res.won) {
          sfx.play('win');
          recordWinTime(res.state);
        } else sfx.play('reveal');
      }
    },
    [flagMode, gameState, recordWinTime],
  );

  const handleCellContextMenu = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      setActiveHint(null);
      const res = toggleFlag(gameState, row, col);
      if (res.changed) {
        setGameState(res.state);
        sfx.play('flag');
      }
    },
    [gameState],
  );

  const tutorialProgress = useMemo(() => getTutorialProgress(gameState), [gameState]);
  const minesRemaining = gameState.config.mines - gameState.flagsCount;
  const currentBest =
    gameState.config.difficulty !== 'custom'
      ? bestTimes[gameState.config.difficulty]
      : undefined;

  return (
    <div className="ms-shell">
      <header className="ms-topbar">
        <div className="ms-brand">
          <img src="./icons/icon-192.png" alt="Minesweeper emblem" className="ms-emblem" />
          <div>
            <h1 className="ms-title">Minesweeper</h1>
            <span className="ms-sub">
              {gameState.config.rows}×{gameState.config.cols} · {gameState.config.mines} Mines
              {currentBest !== undefined ? ` · Best ${currentBest}s` : ''}
            </span>
          </div>
        </div>

        <div className="ms-diff-tabs" role="group" aria-label="Difficulty">
          {(
            [
              ['easy', 'Easy 9×9'],
              ['medium', 'Medium 16×16'],
              ['hard', 'Hard 30×16'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`ms-pill-btn ${gameState.config.difficulty === id ? 'active' : ''}`}
              aria-pressed={gameState.config.difficulty === id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectDifficulty(id);
              }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`ms-pill-btn ${gameState.config.difficulty === 'custom' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCustomOpen(true);
            }}
          >
            Custom…
          </button>
        </div>

        <div className="ms-actions">
          <button
            type="button"
            className={`ms-pill-btn ${flagMode ? 'active' : ''}`}
            aria-pressed={flagMode}
            onClick={(e) => {
              e.stopPropagation();
              setFlagMode((v) => !v);
            }}
          >
            🚩 Flag Mode
          </button>

          <button
            type="button"
            className={`ms-pill-btn ${gameState.isTutorial ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleReset(PRESET_CONFIGS.easy, true);
            }}
          >
            Tutorial
          </button>

          <button
            type="button"
            className="ms-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveHint(getMinesweeperHint(gameState));
            }}
          >
            💡 Hint
          </button>

          <button
            type="button"
            className="ms-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              setHelpOpen(true);
            }}
          >
            ? Help
          </button>

          <button
            type="button"
            className="ms-pill-btn"
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            aria-pressed={muted}
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {gameState.isTutorial && (
        <div className="ms-toast" role="status" data-testid="tutorial-toast">
          <span className="ms-toast-badge">
            {tutorialProgress.completed ? 'Done' : `Step ${tutorialProgress.stepIndex + 1}/3`}
          </span>
          <span>
            <strong>{tutorialProgress.step?.title ?? 'Tutorial Complete!'}</strong>{' '}
            {tutorialProgress.step?.instruction ?? 'Great sweeping! Finish the board or try Medium/Hard.'}
          </span>
        </div>
      )}

      {!gameState.isTutorial && activeHint && (
        <div className="ms-toast" role="status" data-testid="hint-toast">
          <span className="ms-toast-badge">Hint</span>
          <span>{activeHint.message}</span>
          <button
            type="button"
            className="ms-close-btn"
            onClick={() => setActiveHint(null)}
            aria-label="Dismiss hint"
          >
            ✕
          </button>
        </div>
      )}

      <main className="ms-board-wrap">
        <div className="ms-cabinet">
          <div className="ms-lcd-bar">
            <div className="ms-lcd" data-testid="mine-counter" aria-label="Mines remaining">
              {String(minesRemaining).padStart(3, '0')}
            </div>

            <button
              type="button"
              className="ms-face-btn"
              onClick={() => handleReset(gameState.config, gameState.isTutorial)}
              aria-label="New Game"
            >
              {gameState.status === 'won'
                ? '😎'
                : gameState.status === 'lost'
                  ? '😵'
                  : '🙂'}
            </button>

            <div className="ms-lcd" data-testid="timer-display" aria-label="Elapsed seconds">
              {String(Math.min(999, gameState.elapsedSeconds)).padStart(3, '0')}
            </div>
          </div>

          <div className="ms-grid-scroll">
            <div
              className="ms-grid"
              role="grid"
              aria-label="Minesweeper board"
              style={{
                gridTemplateColumns: `repeat(${gameState.config.cols}, var(--cell-size))`,
              }}
            >
              {gameState.cells.map((cell) => {
                const isHinted =
                  activeHint?.row === cell.row && activeHint?.col === cell.col;
                const cls = [
                  'ms-cell',
                  cell.revealed ? 'revealed' : 'hidden',
                  cell.exploded ? 'exploded' : '',
                  cell.revealed && cell.adjacentMines > 0 ? `n-${cell.adjacentMines}` : '',
                  isHinted ? 'hinted' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={`${cell.row}-${cell.col}`}
                    type="button"
                    role="gridcell"
                    className={cls}
                    data-cell={`${cell.row}-${cell.col}`}
                    aria-label={`Row ${cell.row + 1} Col ${cell.col + 1}${
                      cell.flagged ? ' flagged' : ''
                    }${cell.revealed ? ` revealed ${cell.adjacentMines}` : ''}`}
                    onClick={() => handleCellClick(cell.row, cell.col)}
                    onContextMenu={(e) => handleCellContextMenu(e, cell.row, cell.col)}
                  >
                    {!cell.revealed && cell.flagged && '🚩'}
                    {cell.revealed && cell.hasMine && '💣'}
                    {cell.revealed && !cell.hasMine && cell.adjacentMines > 0 && cell.adjacentMines}
                  </button>
                );
              })}
            </div>
          </div>

          {(gameState.status === 'won' || gameState.status === 'lost') && (
            <div className="ms-result-banner" data-testid="result-banner">
              <strong>
                {gameState.status === 'won'
                  ? `You Cleared the Board in ${gameState.elapsedSeconds}s!`
                  : 'Boom! You hit a mine.'}
              </strong>
              <button
                type="button"
                className="ms-primary-btn"
                onClick={() => handleReset(gameState.config)}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </main>

      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <CustomBoardModal
        open={customOpen}
        initialConfig={gameState.config}
        onClose={() => setCustomOpen(false)}
        onApply={(cfg) => {
          setCustomOpen(false);
          handleReset(cfg);
        }}
      />
    </div>
  );
};
