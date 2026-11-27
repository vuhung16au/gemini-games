import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sfx } from './audio/sfx';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './game/constants';
import {
  createDinoState,
  setDucking,
  startDinoRun,
  stepDino,
  triggerJump,
} from './game/engine';
import { getDinoHint } from './game/hints';
import { loadDinoSave, saveDinoData } from './game/storage';
import { getTutorialProgress } from './game/tutorial';
import type { DinoHint, DinoState, DinoTheme } from './game/types';
import { renderDinoCanvas } from './renderer/canvasRenderer';

export const App: React.FC = () => {
  const initialSave = useMemo(() => loadDinoSave(), []);
  const [muted, setMuted] = useState(initialSave.muted);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showTimingHint, setShowTimingHint] = useState(false);
  const [activeHint, setActiveHint] = useState<DinoHint | null>(null);

  const [dinoState, setDinoState] = useState<DinoState>(() =>
    createDinoState({ highScore: initialSave.highScore, theme: initialSave.theme }),
  );

  const stateRef = useRef(dinoState);
  stateRef.current = dinoState;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    saveDinoData({
      highScore: dinoState.highScore,
      theme: dinoState.theme,
      muted,
    });
  }, [dinoState.highScore, dinoState.theme, muted]);

  const handleJump = useCallback(() => {
    sfx.unlock();
    const next = triggerJump(stateRef.current, performance.now());
    if (next.soundQueue.length > 0) sfx.playBatch(next.soundQueue);
    stateRef.current = next;
    setDinoState(next);
  }, []);

  const handleDuck = useCallback((ducking: boolean) => {
    const next = setDucking(stateRef.current, ducking);
    stateRef.current = next;
    setDinoState(next);
  }, []);

  const handleSwitchTheme = useCallback((theme: DinoTheme) => {
    setDinoState((prev) => ({
      ...prev,
      theme,
      isNight: false,
    }));
  }, []);

  const handleStartTutorial = useCallback(() => {
    sfx.unlock();
    setActiveHint(null);
    setShowTimingHint(true);
    const next = startDinoRun(stateRef.current, { isTutorial: true });
    stateRef.current = next;
    setDinoState(next);
  }, []);

  // Keyboard bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === 'Space' || e.code.startsWith('Arrow')) {
        e.preventDefault();
      }
      if (e.repeat) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        handleJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        handleDuck(true);
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (helpOpen) {
          setHelpOpen(false);
          return;
        }
        setDinoState((prev) =>
          prev.status === 'running'
            ? { ...prev, status: 'paused' }
            : prev.status === 'paused'
              ? { ...prev, status: 'running' }
              : prev,
        );
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        handleDuck(false);
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        setDinoState((prev) =>
          prev.status === 'running' ? { ...prev, status: 'paused' } : prev,
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [handleDuck, handleJump, helpOpen]);

  // RAF loop
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const cur = stateRef.current;
      if (cur.status === 'running') {
        const next = stepDino(cur, dt, now);
        if (next.soundQueue.length > 0) {
          sfx.playBatch(next.soundQueue);
        }
        stateRef.current = next;
        setDinoState(next);
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        renderDinoCanvas(ctx, stateRef.current, showTimingHint);
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [showTimingHint]);

  const tutorialProgress = useMemo(() => getTutorialProgress(dinoState), [dinoState]);

  return (
    <div className="dino-shell">
      <header className="dino-topbar">
        <div className="dino-brand">
          <img src="./icons/icon-192.png" alt="Dino Run emblem" className="dino-emblem" />
          <div>
            <h1 className="dino-title">Dino Run</h1>
            <span className="dino-sub">404 Offline Runner · Chrome &amp; HSC Edition</span>
          </div>
        </div>

        <div className="dino-actions">
          <div className="dino-theme-tabs" role="group" aria-label="Runner Theme">
            <button
              type="button"
              className={`dino-pill-btn ${dinoState.theme === 'classic' ? 'active' : ''}`}
              aria-pressed={dinoState.theme === 'classic'}
              onClick={(e) => {
                e.stopPropagation();
                handleSwitchTheme('classic');
              }}
            >
              🌵 Classic
            </button>
            <button
              type="button"
              className={`dino-pill-btn ${dinoState.theme === 'math404' ? 'active' : ''}`}
              aria-pressed={dinoState.theme === 'math404'}
              onClick={(e) => {
                e.stopPropagation();
                handleSwitchTheme('math404');
              }}
            >
              🎓 404 Math
            </button>
          </div>

          <button
            type="button"
            className={`dino-pill-btn ${dinoState.isTutorial ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleStartTutorial();
            }}
          >
            Tutorial
          </button>

          <button
            type="button"
            className={`dino-pill-btn ${showTimingHint ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowTimingHint((v) => !v);
              setActiveHint(getDinoHint(stateRef.current));
            }}
          >
            💡 Hint
          </button>

          <button
            type="button"
            className="dino-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              setHelpOpen(true);
            }}
          >
            ? Help
          </button>

          <button
            type="button"
            className="dino-pill-btn"
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

      {dinoState.isTutorial && dinoState.status === 'running' && !activeHint && (
        <div className="dino-toast" role="status" data-testid="tutorial-toast">
          <span className="dino-toast-badge">
            {tutorialProgress.completed ? 'Done' : `Step ${tutorialProgress.stepIndex + 1}/3`}
          </span>
          <span>
            <strong>{tutorialProgress.step?.title ?? 'Tutorial Complete!'}</strong>{' '}
            {tutorialProgress.step?.instruction ?? 'Great jumping! Keep running for a new High Score!'}
          </span>
        </div>
      )}

      {activeHint && (
        <div className="dino-toast" role="status" data-testid="hint-toast">
          <span className="dino-toast-badge">Tip</span>
          <span>
            <strong>{activeHint.title}:</strong> {activeHint.message}
          </span>
          <button
            type="button"
            className="dino-close-btn"
            onClick={() => setActiveHint(null)}
            aria-label="Dismiss tip"
          >
            ✕
          </button>
        </div>
      )}

      <main className="dino-stage-wrap">
        <div className="dino-card">
          <div className="dino-status-strip">
            <span className="dino-badge-404">ERR_INTERNET_DISCONNECTED · 404</span>
            <div className="dino-score-readout" data-testid="score-readout">
              <span>HI {String(dinoState.highScore).padStart(5, '0')}</span>
              <strong>{String(Math.floor(dinoState.score)).padStart(5, '0')}</strong>
            </div>
          </div>

          <div
            className="dino-canvas-wrap"
            onPointerDown={(e) => {
              e.preventDefault();
              handleJump();
            }}
          >
            <canvas
              ref={canvasRef}
              width={LOGICAL_WIDTH}
              height={LOGICAL_HEIGHT}
              className="dino-canvas"
              aria-label="Dino Run Canvas"
            />

            {dinoState.status === 'idle' && (
              <div className="dino-overlay" data-testid="idle-overlay">
                <p>No Internet? Press <strong>Space</strong> or Tap to Jump!</p>
                <button
                  type="button"
                  className="dino-primary-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJump();
                  }}
                >
                  Start Running
                </button>
              </div>
            )}

            {dinoState.status === 'paused' && (
              <div className="dino-overlay" data-testid="pause-overlay">
                <p>PAUSED</p>
                <button
                  type="button"
                  className="dino-primary-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDinoState((p) => ({ ...p, status: 'running' }));
                  }}
                >
                  Resume
                </button>
              </div>
            )}

            {dinoState.status === 'gameover' && (
              <div className="dino-overlay" data-testid="gameover-overlay">
                <strong>GAME OVER</strong>
                {dinoState.theme === 'math404' && <span>{dinoState.crashQuip}</span>}
                <button
                  type="button"
                  className="dino-primary-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const restarted = startDinoRun(stateRef.current, {
                      isTutorial: stateRef.current.isTutorial,
                    });
                    stateRef.current = restarted;
                    setDinoState(restarted);
                  }}
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          <div className="dino-controls-bar">
            <button
              type="button"
              className="dino-action-btn"
              onPointerDown={(e) => {
                e.preventDefault();
                handleJump();
              }}
            >
              ⬆ Jump (Space)
            </button>
            <button
              type="button"
              className="dino-action-btn secondary"
              onPointerDown={(e) => {
                e.preventDefault();
                handleDuck(true);
              }}
              onPointerUp={() => handleDuck(false)}
              onPointerCancel={() => handleDuck(false)}
              onPointerLeave={() => handleDuck(false)}
            >
              ⬇ Duck / Fast-Fall (Down)
            </button>
          </div>
        </div>
      </main>

      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};
