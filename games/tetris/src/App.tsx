import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GameOverlay } from './components/GameOverlay';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SidePanel } from './components/SidePanel';
import { TouchControls } from './components/TouchControls';
import { SoundEngine } from './game/audio';
import { RESTART_COOLDOWN_MS, type PieceType } from './game/constants';
import {
  createGameState,
  hardDrop,
  holdCurrentPiece,
  moveHorizontal,
  rotatePiece,
  softDrop,
  startGame,
  stepFrame,
  togglePause,
} from './game/engine';
import { findBestPlacement } from './game/hints';
import { configureHiDPICanvas, renderTetris } from './game/renderer';
import { loadSaveData, saveSaveData } from './game/storage';
import { TUTORIAL_STEPS, createTutorialState } from './game/tutorial';
import type {
  GamePhase,
  GameState,
  PlacementHint,
  SaveData,
} from './game/types';

interface HudSnapshot {
  phase: GamePhase;
  score: number;
  highScore: number;
  lines: number;
  level: number;
  hold: PieceType | null;
  canHold: boolean;
  nextQueue: PieceType[];
  ghostEnabled: boolean;
  canRestart: boolean;
  isTutorial: boolean;
  tutorialStep: number;
  tutorialCompleted: boolean;
}

export const App: React.FC = () => {
  const initialSave = useRef<SaveData>(loadSaveData());
  const stateRef = useRef<GameState>(
    createGameState(
      initialSave.current.highScore,
      initialSave.current.ghostEnabled,
    ),
  );
  const soundRef = useRef<SoundEngine>(
    new SoundEngine(initialSave.current.muted),
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hintRef = useRef<PlacementHint | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const [muted, setMuted] = useState(initialSave.current.muted);
  const [showHelp, setShowHelp] = useState(false);
  const [hintBanner, setHintBanner] = useState<string | null>(null);
  const [hud, setHud] = useState<HudSnapshot>(() => {
    const s = stateRef.current;
    return {
      phase: s.phase,
      score: s.score,
      highScore: s.highScore,
      lines: s.lines,
      level: s.level,
      hold: s.hold,
      canHold: s.canHold,
      nextQueue: [...s.nextQueue],
      ghostEnabled: s.ghostEnabled,
      canRestart: false,
      isTutorial: s.isTutorial,
      tutorialStep: s.tutorialStep,
      tutorialCompleted: s.tutorialCompleted,
    };
  });

  const persist = useCallback((s: GameState, isMuted: boolean) => {
    saveSaveData({
      highScore: s.highScore,
      bestLines: Math.max(initialSave.current.bestLines, s.lines),
      bestLevel: Math.max(initialSave.current.bestLevel, s.level),
      muted: isMuted,
      ghostEnabled: s.ghostEnabled,
    });
  }, []);

  const syncHud = useCallback(() => {
    const s = stateRef.current;
    const canRestart =
      s.phase === 'GAME_OVER' && s.gameOverElapsedMs >= RESTART_COOLDOWN_MS;
    setHud({
      phase: s.phase,
      score: s.score,
      highScore: s.highScore,
      lines: s.lines,
      level: s.level,
      hold: s.hold,
      canHold: s.canHold,
      nextQueue: s.nextQueue.slice(0, 3),
      ghostEnabled: s.ghostEnabled,
      canRestart,
      isTutorial: s.isTutorial,
      tutorialStep: s.tutorialStep,
      tutorialCompleted: s.tutorialCompleted,
    });
  }, []);

  const clearHint = useCallback(() => {
    hintRef.current = null;
    setHintBanner(null);
  }, []);

  const handleStart = useCallback(() => {
    soundRef.current.unlock();
    clearHint();
    startGame(stateRef.current, true);
    syncHud();
  }, [clearHint, syncHud]);

  const handleNewGame = useCallback(() => {
    soundRef.current.unlock();
    clearHint();
    const s = stateRef.current;
    Object.assign(s, createGameState(s.highScore, s.ghostEnabled));
    s.phase = 'PLAYING';
    syncHud();
  }, [clearHint, syncHud]);

  const handleStartTutorial = useCallback(() => {
    soundRef.current.unlock();
    clearHint();
    const s = stateRef.current;
    Object.assign(s, createTutorialState(s.highScore, s.ghostEnabled));
    syncHud();
  }, [clearHint, syncHud]);

  const handleTogglePause = useCallback(() => {
    if (togglePause(stateRef.current)) {
      syncHud();
    }
  }, [syncHud]);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundRef.current.setMuted(next);
      if (!next) soundRef.current.unlock();
      persist(stateRef.current, next);
      return next;
    });
  }, [persist]);

  const handleToggleGhost = useCallback(() => {
    const s = stateRef.current;
    s.ghostEnabled = !s.ghostEnabled;
    persist(s, soundRef.current.isMuted());
    syncHud();
  }, [persist, syncHud]);

  const handleHint = useCallback(() => {
    soundRef.current.unlock();
    const found = findBestPlacement(stateRef.current);
    hintRef.current = found;
    setHintBanner(found ? found.reason : null);
  }, []);

  const handleMoveHorizontal = useCallback(
    (delta: number) => {
      soundRef.current.unlock();
      if (moveHorizontal(stateRef.current, delta)) {
        soundRef.current.playMove();
      }
    },
    [],
  );

  const handleRotate = useCallback(
    (dir: 1 | -1) => {
      soundRef.current.unlock();
      if (rotatePiece(stateRef.current, dir)) {
        soundRef.current.playRotate();
        syncHud();
      }
    },
    [syncHud],
  );

  const handleSoftDrop = useCallback(() => {
    soundRef.current.unlock();
    const ev = softDrop(stateRef.current);
    if (ev.linesCleared > 0) {
      soundRef.current.playLineClear(ev.linesCleared);
      clearHint();
    } else if (ev.locked) {
      soundRef.current.playLock();
      clearHint();
    }
    if (ev.gameOver) {
      soundRef.current.playGameOver();
    }
    if (ev.stateChanged) {
      persist(stateRef.current, soundRef.current.isMuted());
      syncHud();
    }
  }, [clearHint, persist, syncHud]);

  const handleHardDrop = useCallback(() => {
    soundRef.current.unlock();
    const ev = hardDrop(stateRef.current);
    clearHint();
    if (ev.linesCleared > 0) {
      soundRef.current.playLineClear(ev.linesCleared);
    } else if (ev.locked) {
      soundRef.current.playLock();
    }
    if (ev.gameOver) {
      soundRef.current.playGameOver();
    }
    if (ev.stateChanged) {
      persist(stateRef.current, soundRef.current.isMuted());
      syncHud();
    }
  }, [clearHint, persist, syncHud]);

  const handleHold = useCallback(() => {
    soundRef.current.unlock();
    if (holdCurrentPiece(stateRef.current)) {
      clearHint();
      soundRef.current.playRotate();
      syncHud();
    }
  }, [clearHint, syncHud]);

  // Animation loop + HiDPI + visibilitychange pause
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    configureHiDPICanvas(canvas, ctx);

    const onResize = () => configureHiDPICanvas(canvas, ctx);
    const onVisibility = () => {
      if (document.hidden) {
        lastTimeRef.current = null;
        if (stateRef.current.phase === 'PLAYING') {
          stateRef.current.phase = 'PAUSED';
          syncHud();
        }
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    let rafId = 0;
    const loop = (ts: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = ts;
      }
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;

      const s = stateRef.current;
      if (!showHelp) {
        const ev = stepFrame(s, dt);
        if (ev.linesCleared > 0) {
          soundRef.current.playLineClear(ev.linesCleared);
          clearHint();
        } else if (ev.locked) {
          soundRef.current.playLock();
          clearHint();
        }
        if (ev.gameOver) {
          soundRef.current.playGameOver();
        }
        if (ev.stateChanged || s.phase === 'GAME_OVER') {
          if (ev.locked || ev.gameOver) {
            persist(s, soundRef.current.isMuted());
          }
          syncHud();
        }
      }

      renderTetris(ctx, s, hintRef.current);
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [clearHint, persist, showHelp, syncHud]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        e.preventDefault();
      }

      if (e.code === 'Escape') {
        setShowHelp(false);
        clearHint();
        return;
      }

      if (showHelp) return;

      const s = stateRef.current;
      if (s.phase === 'START' && e.code === 'Space' && !e.repeat) {
        handleStart();
        return;
      }

      if (s.phase === 'GAME_OVER' && e.code === 'Space' && !e.repeat) {
        if (startGame(s, false)) {
          clearHint();
          syncHud();
        }
        return;
      }

      if (e.code === 'KeyP' && !e.repeat) {
        handleTogglePause();
        return;
      }

      if (s.phase !== 'PLAYING') return;

      if (e.code === 'ArrowLeft') {
        handleMoveHorizontal(-1);
      } else if (e.code === 'ArrowRight') {
        handleMoveHorizontal(1);
      } else if (e.code === 'ArrowDown') {
        handleSoftDrop();
      } else if ((e.code === 'ArrowUp' || e.code === 'KeyX') && !e.repeat) {
        handleRotate(1);
      } else if (e.code === 'KeyZ' && !e.repeat) {
        handleRotate(-1);
      } else if (e.code === 'Space' && !e.repeat) {
        handleHardDrop();
      } else if (
        (e.code === 'KeyC' ||
          e.code === 'ShiftLeft' ||
          e.code === 'ShiftRight') &&
        !e.repeat
      ) {
        handleHold();
      } else if (e.code === 'KeyH' && !e.repeat) {
        handleHint();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    clearHint,
    handleHardDrop,
    handleHint,
    handleHold,
    handleMoveHorizontal,
    handleRotate,
    handleSoftDrop,
    handleStart,
    handleTogglePause,
    showHelp,
    syncHud,
  ]);

  return (
    <main className="tetris-page">
      <div className="tetris-shell">
        <Header
          phase={hud.phase}
          isTutorial={hud.isTutorial}
          muted={muted}
          onStartTutorial={handleStartTutorial}
          onOpenHelp={() => setShowHelp(true)}
          onHint={handleHint}
          onTogglePause={handleTogglePause}
          onToggleMute={handleToggleMute}
          onNewGame={handleNewGame}
        />

        {(hud.isTutorial || hintBanner) && (
          <div className="guidance-banner" role="status" data-testid="guidance-banner">
            {hud.isTutorial ? (
              hud.tutorialCompleted ? (
                <div className="tutorial-done">
                  <span>Tutorial complete! Ready for a full Tetris run?</span>
                  <button
                    type="button"
                    className="game-btn game-btn-primary banner-btn"
                    onClick={handleNewGame}
                  >
                    Start Full Game
                  </button>
                </div>
              ) : (
                <span>{TUTORIAL_STEPS[hud.tutorialStep]}</span>
              )
            ) : (
              <span>Hint: {hintBanner}</span>
            )}
          </div>
        )}

        <div className="tetris-layout">
          <div className="board-container">
            <canvas
              ref={canvasRef}
              className="tetris-canvas game-surface"
              aria-label="Tetris board"
            />
            <GameOverlay
              phase={hud.phase}
              score={hud.score}
              highScore={hud.highScore}
              lines={hud.lines}
              level={hud.level}
              canRestart={hud.canRestart}
              onStart={handleStart}
              onResume={handleTogglePause}
              onRestart={handleNewGame}
            />
          </div>

          <SidePanel
            hold={hud.hold}
            canHold={hud.canHold}
            nextQueue={hud.nextQueue}
            score={hud.score}
            highScore={hud.highScore}
            level={hud.level}
            lines={hud.lines}
            ghostEnabled={hud.ghostEnabled}
            onToggleGhost={handleToggleGhost}
          />
        </div>

        <TouchControls
          disabled={hud.phase !== 'PLAYING'}
          onLeft={() => handleMoveHorizontal(-1)}
          onRight={() => handleMoveHorizontal(1)}
          onDown={handleSoftDrop}
          onRotate={() => handleRotate(1)}
          onHardDrop={handleHardDrop}
          onHold={handleHold}
        />
      </div>

      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </main>
  );
};

export default App;
