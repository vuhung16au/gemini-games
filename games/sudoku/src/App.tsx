import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ControlsPad } from './components/ControlsPad';
import { GameModal } from './components/GameModal';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SudokuBoard } from './components/SudokuBoard';
import { SoundEngine } from './game/audio';
import { BOARD_SIZE, type Difficulty } from './game/constants';
import {
  createGameState,
  enterDigit,
  eraseSelectedCell,
  getRemainingDigitCounts,
  selectCell,
  tickSecond,
  toggleNotesMode,
  togglePause,
  undoMove,
  useHint,
} from './game/engine';
import { loadSaveData, saveSaveData } from './game/storage';
import {
  SUDOKU_TUTORIAL_STEPS,
  createSudokuTutorialState,
  getSudokuTutorialProgress,
} from './game/tutorial';
import type { CellCoord, GameState, SaveData } from './game/types';

export const App: React.FC = () => {
  const initialSave = useRef<SaveData>(loadSaveData());
  const soundRef = useRef<SoundEngine>(
    new SoundEngine(initialSave.current.muted),
  );

  const [saveData, setSaveData] = useState<SaveData>(initialSave.current);
  const [gameState, setGameState] = useState<GameState>(() =>
    createGameState(initialSave.current.difficulty),
  );
  const [showHelp, setShowHelp] = useState(false);
  const [isTutorial, setIsTutorial] = useState(false);

  const remainingCounts = useMemo(
    () => getRemainingDigitCounts(gameState.board),
    [gameState.board],
  );

  const persistSave = useCallback((nextSave: SaveData) => {
    setSaveData(nextSave);
    saveSaveData(nextSave);
  }, []);

  const handleWon = useCallback(
    (difficulty: Difficulty, elapsedSeconds: number) => {
      soundRef.current.playWin();
      setSaveData((prev) => {
        const prevBest = prev.bestTimes[difficulty];
        const nextBest =
          prevBest === undefined
            ? elapsedSeconds
            : Math.min(prevBest, elapsedSeconds);
        const next: SaveData = {
          ...prev,
          gamesWon: prev.gamesWon + 1,
          bestTimes: {
            ...prev.bestTimes,
            [difficulty]: nextBest,
          },
        };
        saveSaveData(next);
        return next;
      });
    },
    [],
  );

  const handleSelectCell = useCallback((coord: CellCoord) => {
    soundRef.current.unlock();
    setGameState((prev) => selectCell(prev, coord));
  }, []);

  const handleEnterDigit = useCallback(
    (digit: number) => {
      soundRef.current.unlock();
      setGameState((prev) => {
        const res = enterDigit(prev, digit);
        if (!res.changed) return prev;
        if (res.wonNow) {
          handleWon(res.state.difficulty, res.state.elapsedSeconds);
        } else if (res.isMistake) {
          soundRef.current.playError();
        } else {
          soundRef.current.playPlace();
        }
        return res.state;
      });
    },
    [handleWon],
  );

  const handleErase = useCallback(() => {
    soundRef.current.unlock();
    setGameState((prev) => eraseSelectedCell(prev).state);
  }, []);

  const handleUndo = useCallback(() => {
    soundRef.current.unlock();
    setGameState((prev) => undoMove(prev));
  }, []);

  const handleToggleNotes = useCallback(() => {
    soundRef.current.unlock();
    setGameState((prev) => toggleNotesMode(prev));
  }, []);

  const handleHint = useCallback(() => {
    soundRef.current.unlock();
    setGameState((prev) => {
      const res = useHint(prev);
      if (!res.changed) return prev;
      if (res.wonNow) {
        handleWon(res.state.difficulty, res.state.elapsedSeconds);
      } else {
        soundRef.current.playPlace();
      }
      return res.state;
    });
  }, [handleWon]);

  const handleNewGame = useCallback(
    (diff: Difficulty = gameState.difficulty) => {
      soundRef.current.unlock();
      setIsTutorial(false);
      setGameState(createGameState(diff));
    },
    [gameState.difficulty],
  );

  const handleStartTutorial = useCallback(() => {
    soundRef.current.unlock();
    setIsTutorial(true);
    setGameState(createSudokuTutorialState());
  }, []);

  const handleChangeDifficulty = useCallback(
    (diff: Difficulty) => {
      soundRef.current.unlock();
      setIsTutorial(false);
      persistSave({ ...saveData, difficulty: diff });
      setGameState(createGameState(diff));
    },
    [persistSave, saveData],
  );

  const handleTogglePause = useCallback(() => {
    setGameState((prev) => togglePause(prev));
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = !saveData.muted;
    soundRef.current.setMuted(nextMuted);
    if (!nextMuted) soundRef.current.unlock();
    persistSave({ ...saveData, muted: nextMuted });
  }, [persistSave, saveData]);

  // 1-second timer paused when tab is hidden or help modal is open
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!document.hidden && !showHelp) {
        setGameState((prev) => tickSecond(prev));
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [showHelp]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === 'Escape') {
        setShowHelp(false);
        return;
      }
      if (showHelp) return;

      if (
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        e.preventDefault();
        if (e.repeat) return;

        setGameState((prev) => {
          const current = prev.selected ?? { row: 0, col: 0 };
          let { row, col } = current;
          if (prev.selected) {
            if (e.code === 'ArrowUp') row = (row + BOARD_SIZE - 1) % BOARD_SIZE;
            if (e.code === 'ArrowDown') row = (row + 1) % BOARD_SIZE;
            if (e.code === 'ArrowLeft') col = (col + BOARD_SIZE - 1) % BOARD_SIZE;
            if (e.code === 'ArrowRight') col = (col + 1) % BOARD_SIZE;
          }
          return selectCell(prev, { row, col });
        });
        return;
      }

      if (e.repeat) return;

      if (e.key >= '1' && e.key <= '9') {
        handleEnterDigit(Number(e.key));
      } else if (e.code === 'Backspace' || e.code === 'Delete' || e.key === '0') {
        e.preventDefault();
        handleErase();
      } else if (e.code === 'KeyN') {
        handleToggleNotes();
      } else if (e.code === 'KeyZ') {
        handleUndo();
      } else if (e.code === 'KeyH') {
        handleHint();
      } else if (e.code === 'KeyP') {
        handleTogglePause();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleEnterDigit,
    handleErase,
    handleHint,
    handleToggleNotes,
    handleTogglePause,
    handleUndo,
    showHelp,
  ]);

  const tutorialProgress = isTutorial ? getSudokuTutorialProgress(gameState) : null;

  return (
    <main className="sudoku-page">
      <div className="sudoku-shell">
        <Header
          difficulty={gameState.difficulty}
          mistakes={gameState.mistakes}
          elapsedSeconds={gameState.elapsedSeconds}
          bestTime={saveData.bestTimes[gameState.difficulty]}
          status={gameState.status}
          isTutorial={isTutorial}
          muted={saveData.muted}
          onChangeDifficulty={handleChangeDifficulty}
          onTogglePause={handleTogglePause}
          onToggleMute={handleToggleMute}
          onStartTutorial={handleStartTutorial}
          onOpenHelp={() => setShowHelp(true)}
          onNewGame={() => handleNewGame()}
        />

        {isTutorial && tutorialProgress && (
          <div className="guidance-banner" role="status" data-testid="guidance-banner">
            {tutorialProgress.completed
              ? 'Tutorial complete!'
              : SUDOKU_TUTORIAL_STEPS[tutorialProgress.step]}
          </div>
        )}

        <div className="board-stage">
          <SudokuBoard
            board={gameState.board}
            selected={gameState.selected}
            isPaused={gameState.status === 'PAUSED'}
            onSelectCell={handleSelectCell}
          />
          <GameModal
            status={gameState.status}
            difficulty={gameState.difficulty}
            elapsedSeconds={gameState.elapsedSeconds}
            mistakes={gameState.mistakes}
            hintsUsed={gameState.hintsUsed}
            onResume={handleTogglePause}
            onNewGame={() => handleNewGame()}
          />
        </div>

        <ControlsPad
          notesMode={gameState.notesMode}
          canUndo={gameState.history.length > 0 && gameState.status === 'PLAYING'}
          remainingCounts={remainingCounts}
          onUndo={handleUndo}
          onErase={handleErase}
          onToggleNotes={handleToggleNotes}
          onHint={handleHint}
          onEnterDigit={handleEnterDigit}
        />

        <footer className="sudoku-footer">
          Arrows to move • 1–9 to fill • <strong>N</strong> Notes •{' '}
          <strong>Z</strong> Undo • <strong>H</strong> Hint
        </footer>
      </div>

      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </main>
  );
};

export default App;
