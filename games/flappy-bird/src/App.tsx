import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GameOverCard } from './components/GameOverCard';
import { HowToPlayModal } from './components/HowToPlayModal';
import { MuteButton } from './components/MuteButton';
import { ScoreHud } from './components/ScoreHud';
import { StartOverlay } from './components/StartOverlay';
import { SoundEngine } from './game/audio';
import { RESTART_COOLDOWN_MS } from './game/constants';
import {
  createInitialState,
  flap,
  stepFrame,
  tryRestart,
} from './game/engine';
import { configureHiDPICanvas, renderGame } from './game/renderer';
import { loadSaveData, saveSaveData } from './game/storage';
import type { GamePhase, GameState } from './game/types';

interface HudSnapshot {
  phase: GamePhase;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  canRestart: boolean;
  isTutorial: boolean;
  tutorialCompleted: boolean;
  hintEnabled: boolean;
}

export const App: React.FC = () => {
  const initialSave = useRef(loadSaveData());
  const stateRef = useRef<GameState>(
    createInitialState(initialSave.current.bestScore),
  );
  const soundRef = useRef<SoundEngine>(
    new SoundEngine(initialSave.current.muted),
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const [muted, setMuted] = useState<boolean>(initialSave.current.muted);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [hud, setHud] = useState<HudSnapshot>({
    phase: 'START',
    score: 0,
    bestScore: initialSave.current.bestScore,
    isNewBest: false,
    canRestart: false,
    isTutorial: false,
    tutorialCompleted: false,
    hintEnabled: false,
  });

  const syncHudFromState = useCallback(() => {
    const s = stateRef.current;
    const canRestart =
      s.phase === 'GAME_OVER' && s.gameOverElapsedMs >= RESTART_COOLDOWN_MS;

    setHud((prev) => {
      if (
        prev.phase === s.phase &&
        prev.score === s.score &&
        prev.bestScore === s.bestScore &&
        prev.isNewBest === s.isNewBest &&
        prev.canRestart === canRestart &&
        prev.isTutorial === s.isTutorial &&
        prev.tutorialCompleted === s.tutorialCompleted &&
        prev.hintEnabled === s.hintEnabled
      ) {
        return prev;
      }
      return {
        phase: s.phase,
        score: s.score,
        bestScore: s.bestScore,
        isNewBest: s.isNewBest,
        canRestart,
        isTutorial: s.isTutorial,
        tutorialCompleted: s.tutorialCompleted,
        hintEnabled: s.hintEnabled,
      };
    });
  }, []);

  const handleRestart = useCallback(() => {
    if (tryRestart(stateRef.current)) {
      syncHudFromState();
    }
  }, [syncHudFromState]);

  const handleAction = useCallback(() => {
    if (showHelp) return;
    const s = stateRef.current;
    soundRef.current.unlock();

    if (s.phase === 'GAME_OVER') {
      handleRestart();
      return;
    }

    const events = flap(s);
    if (events.flapped) {
      soundRef.current.playFlap();
    }
    if (events.stateChanged) {
      syncHudFromState();
    }
  }, [handleRestart, showHelp, syncHudFromState]);

  const handleToggleTutorial = useCallback(() => {
    const s = stateRef.current;
    const nextTutorial = !s.isTutorial;
    Object.assign(
      s,
      createInitialState(s.bestScore, {
        isTutorial: nextTutorial,
        hintEnabled: nextTutorial ? true : s.hintEnabled,
      }),
    );
    syncHudFromState();
  }, [syncHudFromState]);

  const handleToggleHint = useCallback(() => {
    const s = stateRef.current;
    s.hintEnabled = !s.hintEnabled;
    syncHudFromState();
  }, [syncHudFromState]);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundRef.current.setMuted(next);
      if (!next) {
        soundRef.current.unlock();
      }
      saveSaveData({
        bestScore: stateRef.current.bestScore,
        muted: next,
      });
      return next;
    });
  }, []);

  // Main animation loop + HiDPI resize + visibilitychange handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    configureHiDPICanvas(canvas, ctx);

    const handleResize = () => configureHiDPICanvas(canvas, ctx);
    const handleVisibility = () => {
      if (document.hidden) {
        lastTimeRef.current = null;
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    let rafId = 0;
    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const s = stateRef.current;
      if (!showHelp) {
        const events = stepFrame(s, dt);

        if (events.scored) {
          soundRef.current.playScore();
        }
        if (events.hit) {
          soundRef.current.playHit();
          saveSaveData({
            bestScore: s.bestScore,
            muted: soundRef.current.isMuted(),
          });
        }

        if (
          events.scored ||
          events.hit ||
          events.stateChanged ||
          s.phase === 'GAME_OVER'
        ) {
          syncHudFromState();
        }
      }

      renderGame(ctx, s);
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [showHelp, syncHudFromState]);

  // Keyboard controls (Space, ArrowUp, Enter on Game Over)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setShowHelp(false);
        return;
      }
      if (showHelp) return;

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (e.repeat) return;
        handleAction();
      } else if (
        e.code === 'Enter' &&
        stateRef.current.phase === 'GAME_OVER'
      ) {
        e.preventDefault();
        if (e.repeat) return;
        handleRestart();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAction, handleRestart, showHelp]);

  return (
    <main className="viewport">
      <section
        className="game-stage"
        aria-label="Flappy Bird Game"
        onPointerDown={(e) => {
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          handleAction();
        }}
      >
        <canvas ref={canvasRef} className="game-canvas" />

        <div
          className="stage-top-tools"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="stage-pill-btn"
            aria-label="How to Play"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setShowHelp(true);
            }}
          >
            ? Help
          </button>
          <button
            type="button"
            className={`stage-pill-btn ${hud.isTutorial ? 'is-active' : ''}`}
            aria-pressed={hud.isTutorial}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleTutorial();
            }}
          >
            Tutorial
          </button>
          <button
            type="button"
            className={`stage-pill-btn ${hud.hintEnabled ? 'is-active' : ''}`}
            aria-pressed={hud.hintEnabled}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleHint();
            }}
          >
            💡 Hint
          </button>
        </div>

        <MuteButton muted={muted} onToggle={handleToggleMute} />

        {hud.isTutorial && (
          <div
            className="tutorial-toast"
            role="status"
            data-testid="guidance-banner"
          >
            {hud.tutorialCompleted
              ? 'Practice complete! Click Tutorial again for Classic Mode.'
              : 'Practice Mode: Wide 190px pipes — clear 2 pipes!'}
          </div>
        )}

        {hud.phase === 'START' && <StartOverlay />}
        {hud.phase === 'PLAYING' && <ScoreHud score={hud.score} />}
        {hud.phase === 'GAME_OVER' && (
          <GameOverCard
            score={hud.score}
            bestScore={hud.bestScore}
            isNewBest={hud.isNewBest}
            canRestart={hud.canRestart}
            onRestart={handleRestart}
          />
        )}

        <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </section>
    </main>
  );
};

export default App;
