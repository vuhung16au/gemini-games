import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sfx } from './audio/sfx';
import { BattleSidebar } from './components/BattleSidebar';
import { GameOverOverlay } from './components/GameOverOverlay';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StageClearOverlay } from './components/StageClearOverlay';
import { TitleOverlay } from './components/TitleOverlay';
import { TouchControls } from './components/TouchControls';
import { CANVAS_SIZE } from './game/constants';
import { createBattleState, createTutorialBattleState, stepBattle } from './game/engine';
import { getBattleHint } from './game/hints';
import { loadBattleSave, saveBattleData } from './game/storage';
import { getTutorialProgress } from './game/tutorial';
import type { BattleHint, BattleInput, BattleState, Direction, GameMode } from './game/types';
import { renderBattleCanvas } from './renderer/canvasRenderer';

function readInputFromKeys(
  keys: Set<string>,
  mode: GameMode,
  touchDir: Direction | null,
  touchFire: boolean,
): BattleInput {
  if (mode === '1p') {
    let dir: Direction | null = touchDir;
    if (!dir) {
      if (keys.has('KeyW') || keys.has('ArrowUp')) dir = 'up';
      else if (keys.has('KeyS') || keys.has('ArrowDown')) dir = 'down';
      else if (keys.has('KeyA') || keys.has('ArrowLeft')) dir = 'left';
      else if (keys.has('KeyD') || keys.has('ArrowRight')) dir = 'right';
    }
    const fire =
      touchFire || keys.has('Space') || keys.has('Enter') || keys.has('KeyF');
    return { p1: { dir, fire }, p2: { dir: null, fire: false } };
  }

  // 2-Player Local Co-op
  let p1Dir: Direction | null = null;
  if (keys.has('KeyW')) p1Dir = 'up';
  else if (keys.has('KeyS')) p1Dir = 'down';
  else if (keys.has('KeyA')) p1Dir = 'left';
  else if (keys.has('KeyD')) p1Dir = 'right';

  let p2Dir: Direction | null = null;
  if (keys.has('ArrowUp')) p2Dir = 'up';
  else if (keys.has('ArrowDown')) p2Dir = 'down';
  else if (keys.has('ArrowLeft')) p2Dir = 'left';
  else if (keys.has('ArrowRight')) p2Dir = 'right';

  return {
    p1: { dir: p1Dir, fire: keys.has('Space') || keys.has('KeyF') },
    p2: { dir: p2Dir, fire: keys.has('Enter') || keys.has('Slash') },
  };
}

export const App: React.FC = () => {
  const initialSave = useMemo(() => loadBattleSave(), []);
  const [selectedStage, setSelectedStage] = useState(1);
  const [muted, setMuted] = useState(initialSave.muted);
  const [highestStage, setHighestStage] = useState(initialSave.highestStage);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeHint, setActiveHint] = useState<BattleHint | null>(null);

  const [battleState, setBattleState] = useState<BattleState>(() => ({
    ...createBattleState('1p', 1, { highScore: initialSave.highScore }),
    phase: 'title',
    soundQueue: [],
  }));

  const stateRef = useRef(battleState);
  stateRef.current = battleState;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const touchDirRef = useRef<Direction | null>(null);
  const touchFireRef = useRef<boolean>(false);

  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    saveBattleData({
      highScore: battleState.highScore,
      highestStage,
      muted,
    });
  }, [battleState.highScore, highestStage, muted]);

  const startGame = useCallback(
    (mode: GameMode, stage: number) => {
      sfx.unlock();
      setActiveHint(null);
      const next = createBattleState(mode, stage, { highScore: stateRef.current.highScore });
      sfx.playBatch(next.soundQueue);
      setBattleState({ ...next, soundQueue: [] });
    },
    [],
  );

  const startTutorial = useCallback(() => {
    sfx.unlock();
    setActiveHint(null);
    const next = createTutorialBattleState(stateRef.current.highScore);
    sfx.playBatch(next.soundQueue);
    setBattleState({ ...next, soundQueue: [] });
  }, []);

  const handleNextStage = useCallback(() => {
    const cur = stateRef.current;
    if (cur.isTutorial) {
      startGame('1p', 1);
      return;
    }
    const nextStage = cur.stage + 1;
    setHighestStage((prev) => Math.max(prev, Math.min(10, nextStage)));
    const next = createBattleState(cur.mode, nextStage, {
      highScore: cur.highScore,
      carryPlayers: cur.players,
    });
    sfx.playBatch(next.soundQueue);
    setBattleState({ ...next, soundQueue: [] });
  }, [startGame]);

  // Keyboard bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === 'Space' || e.code.startsWith('Arrow')) {
        e.preventDefault();
      }
      keysRef.current.add(e.code);

      if (e.repeat) return;

      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (helpOpen) {
          setHelpOpen(false);
          return;
        }
        setBattleState((prev) => {
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
        setBattleState((prev) =>
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

  // Fixed-rate RAF simulation + Canvas draw
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const cur = stateRef.current;
      if (cur.phase === 'playing') {
        const input = readInputFromKeys(
          keysRef.current,
          cur.mode,
          touchDirRef.current,
          touchFireRef.current,
        );
        const next = stepBattle(cur, input, dt);
        if (next.soundQueue.length > 0) {
          sfx.playBatch(next.soundQueue);
        }
        stateRef.current = next;
        setBattleState(next);
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        renderBattleCanvas(ctx, stateRef.current);
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const tutorialProgress = useMemo(() => getTutorialProgress(battleState), [battleState]);

  return (
    <div className="bc-shell">
      <header className="bc-topbar">
        <div className="bc-brand">
          <img src="./icons/icon-192.png" alt="Battle City emblem" className="bc-emblem" />
          <div>
            <h1 className="bc-title">Battle City (1985)</h1>
            <span className="bc-subtitle">
              {battleState.mode === '2p' ? '2-Player Co-op' : '1-Player'} · Famicom Classic
            </span>
          </div>
        </div>

        <div className="bc-top-actions">
          {battleState.phase !== 'title' && (
            <button
              type="button"
              className="bc-pill-btn"
              onClick={(e) => {
                e.stopPropagation();
                setBattleState((prev) =>
                  prev.phase === 'playing'
                    ? { ...prev, phase: 'paused' }
                    : prev.phase === 'paused'
                      ? { ...prev, phase: 'playing' }
                      : prev,
                );
              }}
            >
              {battleState.phase === 'paused' ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}

          <button
            type="button"
            className="bc-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              startTutorial();
            }}
          >
            Tutorial
          </button>

          <button
            type="button"
            className="bc-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveHint(getBattleHint(stateRef.current));
            }}
          >
            💡 Hint
          </button>

          <button
            type="button"
            className="bc-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              setHelpOpen(true);
            }}
          >
            ? Help
          </button>

          <button
            type="button"
            className="bc-pill-btn"
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

      {battleState.isTutorial && battleState.phase === 'playing' && (
        <div className="bc-toast" role="status" data-testid="tutorial-toast">
          <span className="bc-toast-badge">
            {tutorialProgress.completed ? 'Done' : `Step ${tutorialProgress.stepIndex + 1}/4`}
          </span>
          <span>
            <strong>{tutorialProgress.step?.title ?? 'Tutorial Complete!'}</strong>{' '}
            {tutorialProgress.step?.instruction ?? ''}
          </span>
        </div>
      )}

      {!battleState.isTutorial && activeHint && (
        <div className="bc-toast" role="status" data-testid="hint-toast">
          <span className="bc-toast-badge">Tip</span>
          <span>
            <strong>{activeHint.title}:</strong> {activeHint.message}
          </span>
          <button
            type="button"
            className="bc-close-btn"
            onClick={() => setActiveHint(null)}
            aria-label="Dismiss tip"
          >
            ✕
          </button>
        </div>
      )}

      <main className="bc-arena-wrap">
        <div className="bc-cabinet">
          <div className="bc-canvas-box">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="bc-canvas"
              aria-label="Battle City Arena"
            />

            {battleState.phase === 'title' && (
              <TitleOverlay
                selectedStage={selectedStage}
                highScore={battleState.highScore}
                onSelectStage={setSelectedStage}
                onStartGame={startGame}
                onStartTutorial={startTutorial}
              />
            )}

            {battleState.phase === 'paused' && (
              <div className="bc-overlay-card compact" data-testid="pause-overlay">
                <h2 className="bc-hero-heading">PAUSED</h2>
                <div className="bc-mode-buttons">
                  <button
                    type="button"
                    className="bc-primary-btn"
                    onClick={() => setBattleState((p) => ({ ...p, phase: 'playing' }))}
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    className="bc-outline-btn"
                    onClick={() => setBattleState((p) => ({ ...p, phase: 'title' }))}
                  >
                    Mode Select
                  </button>
                </div>
              </div>
            )}

            {battleState.phase === 'stage_clear' && (
              <StageClearOverlay state={battleState} onNextStage={handleNextStage} />
            )}

            {battleState.phase === 'game_over' && (
              <GameOverOverlay
                state={battleState}
                onRetry={() => startGame(battleState.mode, battleState.stage)}
                onBackToTitle={() => setBattleState((p) => ({ ...p, phase: 'title' }))}
              />
            )}
          </div>

          <BattleSidebar state={battleState} />
        </div>

        {battleState.mode === '1p' && battleState.phase === 'playing' && (
          <TouchControls
            onDirChange={(dir) => {
              touchDirRef.current = dir;
            }}
            onFireChange={(firing) => {
              touchFireRef.current = firing;
            }}
          />
        )}
      </main>

      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};
