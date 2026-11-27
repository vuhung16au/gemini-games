import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sfx } from './audio/sfx';
import { GameOverOverlay } from './components/GameOverOverlay';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StageClearOverlay } from './components/StageClearOverlay';
import { TitleOverlay } from './components/TitleOverlay';
import { TopHUD } from './components/TopHUD';
import { TouchControls } from './components/TouchControls';
import { VictoryOverlay } from './components/VictoryOverlay';
import { VIEW_HEIGHT, VIEW_WIDTH, WORLD_1_LEVELS } from './game/constants';
import { createMarioState, createTutorialMarioState, stepMario } from './game/engine';
import { getMarioHint } from './game/hints';
import { loadMarioSave, saveMarioData } from './game/storage';
import { getTutorialProgress } from './game/tutorial';
import type { LevelId, MarioHint, MarioState, PlayerInput } from './game/types';
import { renderMarioCanvas } from './renderer/canvasRenderer';

export const App: React.FC = () => {
  const initialSave = useMemo(() => loadMarioSave(), []);
  const [selectedLevel, setSelectedLevel] = useState<LevelId>('1-1');
  const [muted, setMuted] = useState(initialSave.muted);
  const [highestLevel, setHighestLevel] = useState<LevelId>(initialSave.highestLevel);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeHint, setActiveHint] = useState<MarioHint | null>(null);

  const [marioState, setMarioState] = useState<MarioState>(() => ({
    ...createMarioState('1-1', { highScore: initialSave.highScore }),
    phase: 'title',
  }));

  const stateRef = useRef(marioState);
  stateRef.current = marioState;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const jumpQueuedRef = useRef(false);
  const fireQueuedRef = useRef(false);
  const touchRef = useRef({ left: false, right: false, jump: false, fire: false });

  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    saveMarioData({
      highScore: marioState.highScore,
      highestLevel,
      muted,
    });
  }, [marioState.highScore, highestLevel, muted]);

  const startLevel = useCallback((levelId: LevelId) => {
    sfx.unlock();
    setActiveHint(null);
    const next = createMarioState(levelId, { highScore: stateRef.current.highScore });
    setMarioState(next);
  }, []);

  const startTutorial = useCallback(() => {
    sfx.unlock();
    setActiveHint(null);
    const next = createTutorialMarioState(stateRef.current.highScore);
    setMarioState(next);
  }, []);

  const handleNextStage = useCallback(() => {
    const cur = stateRef.current;
    if (cur.isTutorial) {
      startLevel('1-1');
      return;
    }
    const idx = WORLD_1_LEVELS.indexOf(cur.levelId);
    const nextId = WORLD_1_LEVELS[Math.min(WORLD_1_LEVELS.length - 1, idx + 1)] ?? '1-1';
    setHighestLevel(nextId);
    const next = createMarioState(nextId, {
      highScore: cur.highScore,
      carryPlayer: cur.players[0],
    });
    setMarioState(next);
  }, [startLevel]);

  // Keyboard bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === 'Space' || e.code.startsWith('Arrow')) {
        e.preventDefault();
      }
      keysRef.current.add(e.code);

      if (e.repeat) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyZ') {
        jumpQueuedRef.current = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX' || e.code === 'KeyJ') {
        fireQueuedRef.current = true;
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (helpOpen) {
          setHelpOpen(false);
          return;
        }
        setMarioState((prev) => {
          if (prev.phase === 'playing') return { ...prev, phase: 'paused' };
          if (prev.phase === 'paused') return { ...prev, phase: 'playing' };
          return prev;
        });
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    const onBlur = () => {
      keysRef.current.clear();
    };

    const onVisibility = () => {
      if (document.hidden) {
        keysRef.current.clear();
        setMarioState((prev) =>
          prev.phase === 'playing' ? { ...prev, phase: 'paused' } : prev,
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [helpOpen]);

  // RAF Loop
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const cur = stateRef.current;
      if (cur.phase === 'playing') {
        const keys = keysRef.current;
        const t = touchRef.current;
        const input: PlayerInput = {
          left: t.left || keys.has('ArrowLeft') || keys.has('KeyA'),
          right: t.right || keys.has('ArrowRight') || keys.has('KeyD'),
          crouch: keys.has('ArrowDown') || keys.has('KeyS'),
          jumpPressed: jumpQueuedRef.current,
          jumpHeld:
            t.jump ||
            keys.has('Space') ||
            keys.has('ArrowUp') ||
            keys.has('KeyW') ||
            keys.has('KeyZ'),
          run:
            t.fire ||
            keys.has('ShiftLeft') ||
            keys.has('ShiftRight') ||
            keys.has('KeyX') ||
            keys.has('KeyJ'),
          firePressed: fireQueuedRef.current,
        };
        jumpQueuedRef.current = false;
        fireQueuedRef.current = false;

        const next = stepMario(cur, input, dt);
        if (next.soundQueue.length > 0) {
          sfx.playBatch(next.soundQueue);
        }
        stateRef.current = next;
        setMarioState(next);
      } else {
        jumpQueuedRef.current = false;
        fireQueuedRef.current = false;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        renderMarioCanvas(ctx, stateRef.current);
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const tutorialProgress = useMemo(() => getTutorialProgress(marioState), [marioState]);

  return (
    <div className="smb-shell">
      <TopHUD
        state={marioState}
        muted={muted}
        onTogglePause={() =>
          setMarioState((p) =>
            p.phase === 'playing'
              ? { ...p, phase: 'paused' }
              : p.phase === 'paused'
                ? { ...p, phase: 'playing' }
                : p,
          )
        }
        onStartTutorial={startTutorial}
        onRequestHint={() => setActiveHint(getMarioHint(stateRef.current))}
        onOpenHelp={() => setHelpOpen(true)}
        onToggleMute={() => setMuted((m) => !m)}
      />

      {marioState.isTutorial && marioState.phase === 'playing' && (
        <div className="smb-toast" role="status" data-testid="tutorial-toast">
          <span className="smb-toast-badge">
            {tutorialProgress.completed ? 'Done' : `Step ${tutorialProgress.stepIndex + 1}/4`}
          </span>
          <span>
            <strong>{tutorialProgress.step?.title ?? 'Tutorial Complete!'}</strong>{' '}
            {tutorialProgress.step?.instruction ?? ''}
          </span>
        </div>
      )}

      {!marioState.isTutorial && activeHint && (
        <div className="smb-toast" role="status" data-testid="hint-toast">
          <span className="smb-toast-badge">Tip</span>
          <span>
            <strong>{activeHint.title}:</strong> {activeHint.message}
          </span>
          <button
            type="button"
            className="smb-close-btn"
            onClick={() => setActiveHint(null)}
            aria-label="Dismiss tip"
          >
            ✕
          </button>
        </div>
      )}

      <main className="smb-stage-wrap">
        <div className="smb-screen-frame">
          <canvas
            ref={canvasRef}
            width={VIEW_WIDTH}
            height={VIEW_HEIGHT}
            className="smb-canvas"
            aria-label="Super Mario Bros Arena"
          />

          {marioState.phase === 'title' && (
            <TitleOverlay
              selectedLevel={selectedLevel}
              highScore={marioState.highScore}
              onSelectLevel={setSelectedLevel}
              onStartGame={startLevel}
              onStartTutorial={startTutorial}
            />
          )}

          {marioState.phase === 'paused' && (
            <div className="smb-overlay compact" data-testid="pause-overlay">
              <h2 className="smb-hero-title">PAUSED</h2>
              <div className="smb-mode-row">
                <button
                  type="button"
                  className="smb-primary-btn"
                  onClick={() => setMarioState((p) => ({ ...p, phase: 'playing' }))}
                >
                  Resume
                </button>
                <button
                  type="button"
                  className="smb-outline-btn"
                  onClick={() => setMarioState((p) => ({ ...p, phase: 'title' }))}
                >
                  Level Select
                </button>
              </div>
            </div>
          )}

          {marioState.phase === 'stage_clear' && (
            <StageClearOverlay state={marioState} onNextStage={handleNextStage} />
          )}

          {marioState.phase === 'victory' && (
            <VictoryOverlay
              state={marioState}
              onPlayAgain={() => startLevel('1-1')}
              onBackToTitle={() => setMarioState((p) => ({ ...p, phase: 'title' }))}
            />
          )}

          {marioState.phase === 'game_over' && (
            <GameOverOverlay
              state={marioState}
              onRetry={() => startLevel(marioState.levelId === 'tutorial' ? '1-1' : marioState.levelId)}
              onBackToTitle={() => setMarioState((p) => ({ ...p, phase: 'title' }))}
            />
          )}
        </div>

        {marioState.phase === 'playing' && (
          <TouchControls
            onMoveLeft={(d) => {
              touchRef.current.left = d;
            }}
            onMoveRight={(d) => {
              touchRef.current.right = d;
            }}
            onJump={(d) => {
              if (d && !touchRef.current.jump) jumpQueuedRef.current = true;
              touchRef.current.jump = d;
            }}
            onFire={(d) => {
              if (d && !touchRef.current.fire) fireQueuedRef.current = true;
              touchRef.current.fire = d;
            }}
          />
        )}
      </main>

      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};
