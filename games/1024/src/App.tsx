import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SoundEngine } from './game/audio';
import {
  createInitialState,
  keepGoing,
  move,
  undo,
} from './game/engine';
import { findBestDirection } from './game/hints';
import { loadSaveData, saveSaveData } from './game/storage';
import {
  TUTORIAL_STEPS,
  createTutorialBoardState,
  getTutorialProgress,
} from './game/tutorial';
import type { Direction, GameState } from './game/types';

export const App: React.FC = () => {
  const initialSave = useRef(loadSaveData());
  const soundRef = useRef<SoundEngine>(
    new SoundEngine(initialSave.current.muted),
  );

  const [muted, setMuted] = useState<boolean>(initialSave.current.muted);
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(initialSave.current.bestScore),
  );
  const [hintBanner, setHintBanner] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isTutorial, setIsTutorial] = useState(false);

  const persist = useCallback((bestScore: number, isMuted: boolean) => {
    saveSaveData({ bestScore, muted: isMuted });
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
      soundRef.current.unlock();
      setHintBanner(null);

      setGameState((prev) => {
        const result = move(prev, direction, isTutorial ? () => 0.99 : Math.random);
        if (!result.moved) {
          return prev;
        }

        if (result.wonNow) {
          soundRef.current.playWin();
        } else if (result.gameOverNow) {
          soundRef.current.playGameOver();
        } else if (result.merged) {
          const maxMerged = result.state.tiles.reduce(
            (max, t) => (t.isMerged && t.value > max ? t.value : max),
            2,
          );
          soundRef.current.playMerge(maxMerged);
        } else {
          soundRef.current.playSlide();
        }

        if (result.state.bestScore > prev.bestScore) {
          persist(result.state.bestScore, soundRef.current.isMuted());
        }

        return result.state;
      });
    },
    [isTutorial, persist],
  );

  const handleNewGame = useCallback(() => {
    soundRef.current.unlock();
    setIsTutorial(false);
    setHintBanner(null);
    setGameState((prev) => createInitialState(prev.bestScore));
  }, []);

  const handleStartTutorial = useCallback(() => {
    soundRef.current.unlock();
    setHintBanner(null);
    setIsTutorial(true);
    setGameState((prev) => createTutorialBoardState(prev.bestScore));
  }, []);

  const handleHint = useCallback(() => {
    soundRef.current.unlock();
    const best = findBestDirection(gameState);
    setHintBanner(best ? best.reason : 'No legal moves remaining.');
  }, [gameState]);

  const handleKeepGoing = useCallback(() => {
    soundRef.current.unlock();
    setGameState((prev) => keepGoing(prev));
  }, []);

  const handleUndo = useCallback(() => {
    soundRef.current.unlock();
    setHintBanner(null);
    setGameState((prev) => undo(prev));
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      soundRef.current.setMuted(nextMuted);
      if (!nextMuted) {
        soundRef.current.unlock();
      }
      persist(gameState.bestScore, nextMuted);
      return nextMuted;
    });
  }, [gameState.bestScore, persist]);

  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      KeyW: 'up',
      KeyS: 'down',
      KeyA: 'left',
      KeyD: 'right',
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.code === 'Escape') {
        setShowHelp(false);
        return;
      }

      if (showHelp) return;

      const dir = keyMap[e.code];
      if (dir) {
        e.preventDefault();
        if (e.repeat) return;
        handleMove(dir);
        return;
      }

      if (e.code === 'KeyZ' && !e.repeat) {
        e.preventDefault();
        handleUndo();
      } else if (e.code === 'KeyH' && !e.repeat) {
        e.preventDefault();
        handleHint();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleHint, handleMove, handleUndo, showHelp]);

  const tutorialProgress = isTutorial ? getTutorialProgress(gameState) : null;

  return (
    <main className="page">
      <div className="game-shell">
        <Header
          score={gameState.score}
          bestScore={gameState.bestScore}
          lastScoreDelta={gameState.lastScoreDelta}
          moveCount={gameState.moveCount}
          canUndo={gameState.history.length > 0}
          isTutorial={isTutorial}
          muted={muted}
          onUndo={handleUndo}
          onHint={handleHint}
          onStartTutorial={handleStartTutorial}
          onOpenHelp={() => setShowHelp(true)}
          onNewGame={handleNewGame}
          onToggleMute={handleToggleMute}
        />

        {(isTutorial || hintBanner) && (
          <div className="guidance-banner" role="status" data-testid="guidance-banner">
            {isTutorial && tutorialProgress ? (
              tutorialProgress.completed ? (
                <div className="tutorial-done">
                  <span>Tutorial complete! Ready for a full 1024 run?</span>
                  <button
                    type="button"
                    className="btn btn-primary banner-btn"
                    onClick={handleNewGame}
                  >
                    Start Full Game
                  </button>
                </div>
              ) : (
                <span>{TUTORIAL_STEPS[tutorialProgress.step]}</span>
              )
            ) : (
              <span>Hint: {hintBanner}</span>
            )}
          </div>
        )}

        <Board
          tiles={gameState.tiles}
          status={gameState.status}
          score={gameState.score}
          onMove={handleMove}
          onKeepGoing={handleKeepGoing}
          onNewGame={handleNewGame}
        />

        <footer className="game-footer">
          Use <strong>Arrow keys</strong>, <strong>WASD</strong>, or{' '}
          <strong>swipe</strong> • <strong>Z</strong> Undo • <strong>H</strong>{' '}
          Hint
        </footer>
      </div>

      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </main>
  );
};

export default App;
