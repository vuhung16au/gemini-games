import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { GameOverlay } from './components/GameOverlay';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SolitaireBoard } from './components/SolitaireBoard';
import { SoundEngine } from './game/audio';
import {
  autoMoveToFoundation,
  canAutoComplete,
  createGameState,
  drawFromStock,
  moveCards,
  stepAutoComplete,
  tickSecond,
  togglePause,
  undoMove,
} from './game/engine';
import { findBestHint } from './game/hints';
import { loadSaveData, saveSaveData } from './game/storage';
import { TUTORIAL_STEPS, createTutorialState } from './game/tutorial';
import type {
  CardLocation,
  DrawMode,
  DropTarget,
  GameState,
  MoveHint,
  SaveData,
} from './game/types';

export const App: React.FC = () => {
  const initialSave = useRef<SaveData>(loadSaveData());
  const soundRef = useRef<SoundEngine>(
    new SoundEngine(initialSave.current.muted),
  );
  const dragSourceRef = useRef<CardLocation | null>(null);

  const [saveData, setSaveData] = useState<SaveData>(initialSave.current);
  const [gameState, setGameState] = useState<GameState>(() =>
    createGameState(initialSave.current.drawMode),
  );
  const [selected, setSelected] = useState<CardLocation | null>(null);
  const [hint, setHint] = useState<MoveHint | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [autoCompleting, setAutoCompleting] = useState(false);

  const showAutoComplete = useMemo(
    () => !autoCompleting && canAutoComplete(gameState),
    [autoCompleting, gameState],
  );

  const persistSave = useCallback((nextSave: SaveData) => {
    setSaveData(nextSave);
    saveSaveData(nextSave);
  }, []);

  const recordWinIfNeeded = useCallback((nextState: GameState) => {
    soundRef.current.playWin();
    if (nextState.isTutorial) return;
    setSaveData((prev) => {
      const nextBestTime =
        prev.bestTimeSeconds === null
          ? nextState.elapsedSeconds
          : Math.min(prev.bestTimeSeconds, nextState.elapsedSeconds);
      const updated: SaveData = {
        ...prev,
        gamesWon: prev.gamesWon + 1,
        bestScore: Math.max(prev.bestScore, nextState.score),
        bestTimeSeconds: nextBestTime,
      };
      saveSaveData(updated);
      return updated;
    });
  }, []);

  const applyMoveOutcome = useCallback(
    (from: CardLocation, to: DropTarget) => {
      setGameState((prev) => {
        const res = moveCards(prev, from, to);
        if (!res.moved) return prev;
        if (res.wonNow) {
          recordWinIfNeeded(res.state);
        } else if (res.toFoundation) {
          soundRef.current.playFoundation();
        } else {
          soundRef.current.playCardMove();
        }
        return res.state;
      });
      setSelected(null);
      setHint(null);
    },
    [recordWinIfNeeded],
  );

  const handleDrawStock = useCallback(() => {
    if (autoCompleting) return;
    soundRef.current.unlock();
    setSelected(null);
    setHint(null);
    setGameState((prev) => {
      const next = drawFromStock(prev);
      if (next !== prev) soundRef.current.playCardMove();
      return next;
    });
  }, [autoCompleting]);

  const handleCardDoubleClick = useCallback(
    (loc: CardLocation) => {
      if (autoCompleting) return;
      soundRef.current.unlock();
      setGameState((prev) => {
        const res = autoMoveToFoundation(prev, loc);
        if (!res.moved) return prev;
        if (res.wonNow) {
          recordWinIfNeeded(res.state);
        } else {
          soundRef.current.playFoundation();
        }
        return res.state;
      });
      setSelected(null);
      setHint(null);
    },
    [autoCompleting, recordWinIfNeeded],
  );

  const handleCardClick = useCallback(
    (loc: CardLocation) => {
      if (autoCompleting || gameState.status !== 'PLAYING') return;
      soundRef.current.unlock();
      setHint(null);

      if (!selected) {
        setSelected(loc);
        return;
      }

      // Clicking the already-selected card quick-sends to foundation if legal
      if (
        selected.zone === loc.zone &&
        selected.pileIndex === loc.pileIndex &&
        selected.cardIndex === loc.cardIndex
      ) {
        handleCardDoubleClick(loc);
        return;
      }

      if (loc.zone === 'tableau') {
        const res = moveCards(gameState, selected, {
          zone: 'tableau',
          pileIndex: loc.pileIndex,
        });
        if (res.moved) {
          soundRef.current.playCardMove();
          setGameState(res.state);
          setSelected(null);
          return;
        }
      }

      setSelected(loc);
    },
    [autoCompleting, gameState, handleCardDoubleClick, selected],
  );

  const handleTargetClick = useCallback(
    (target: DropTarget) => {
      if (autoCompleting || !selected || gameState.status !== 'PLAYING') return;
      soundRef.current.unlock();
      applyMoveOutcome(selected, target);
    },
    [applyMoveOutcome, autoCompleting, gameState.status, selected],
  );

  const handleDragStart = useCallback(
    (loc: CardLocation, e: React.DragEvent) => {
      dragSourceRef.current = loc;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(loc));
      setSelected(loc);
    },
    [],
  );

  const handleDropTarget = useCallback(
    (target: DropTarget, e: React.DragEvent) => {
      e.preventDefault();
      let loc = dragSourceRef.current;
      if (!loc) {
        try {
          loc = JSON.parse(e.dataTransfer.getData('text/plain')) as CardLocation;
        } catch {
          loc = null;
        }
      }
      dragSourceRef.current = null;
      if (!loc) return;
      applyMoveOutcome(loc, target);
    },
    [applyMoveOutcome],
  );

  const handleUndo = useCallback(() => {
    if (autoCompleting) return;
    soundRef.current.unlock();
    setSelected(null);
    setHint(null);
    setGameState((prev) => undoMove(prev));
  }, [autoCompleting]);

  const handleHint = useCallback(() => {
    if (autoCompleting || gameState.status !== 'PLAYING') return;
    soundRef.current.unlock();
    const nextHint = findBestHint(gameState);
    setHint(nextHint);
    if (nextHint?.type === 'move') {
      setSelected(nextHint.from);
    }
  }, [autoCompleting, gameState]);

  const handleNewGame = useCallback(
    (mode: DrawMode = saveData.drawMode) => {
      soundRef.current.unlock();
      setAutoCompleting(false);
      setSelected(null);
      setHint(null);
      setGameState(createGameState(mode));
    },
    [saveData.drawMode],
  );

  const handleChangeDrawMode = useCallback(
    (mode: DrawMode) => {
      persistSave({ ...saveData, drawMode: mode });
      handleNewGame(mode);
    },
    [handleNewGame, persistSave, saveData],
  );

  const handleStartTutorial = useCallback(() => {
    soundRef.current.unlock();
    setAutoCompleting(false);
    setSelected(null);
    setHint(null);
    setGameState(createTutorialState());
  }, []);

  const handleTogglePause = useCallback(() => {
    setGameState((prev) => togglePause(prev));
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = !saveData.muted;
    soundRef.current.setMuted(nextMuted);
    if (!nextMuted) soundRef.current.unlock();
    persistSave({ ...saveData, muted: nextMuted });
  }, [persistSave, saveData]);

  // 1-second timer (paused while hidden or Help modal open)
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!document.hidden && !showHelp) {
        setGameState((prev) => tickSecond(prev));
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [showHelp]);

  // Auto-complete animation loop
  useEffect(() => {
    if (!autoCompleting) return;
    const timer = window.setTimeout(() => {
      setGameState((prev) => {
        const res = stepAutoComplete(prev);
        if (!res.moved) {
          setAutoCompleting(false);
          return prev;
        }
        if (res.wonNow) {
          setAutoCompleting(false);
          recordWinIfNeeded(res.state);
        } else {
          soundRef.current.playFoundation();
        }
        return res.state;
      });
    }, 110);
    return () => window.clearTimeout(timer);
  }, [autoCompleting, gameState, recordWinIfNeeded]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.code === 'Escape') {
        setSelected(null);
        setHint(null);
        setShowHelp(false);
      } else if (e.code === 'KeyD') {
        handleDrawStock();
      } else if (e.code === 'KeyH') {
        handleHint();
      } else if (e.code === 'KeyZ') {
        handleUndo();
      } else if (e.code === 'KeyP') {
        handleTogglePause();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDrawStock, handleHint, handleTogglePause, handleUndo]);

  return (
    <main className="solitaire-page">
      <div className="solitaire-shell">
        <Header
          drawMode={gameState.drawMode}
          score={gameState.score}
          moves={gameState.moves}
          elapsedSeconds={gameState.elapsedSeconds}
          status={gameState.status}
          canUndo={gameState.history.length > 0 && gameState.status === 'PLAYING'}
          showAutoComplete={showAutoComplete}
          isTutorial={gameState.isTutorial}
          muted={saveData.muted}
          onChangeDrawMode={handleChangeDrawMode}
          onUndo={handleUndo}
          onHint={handleHint}
          onAutoComplete={() => setAutoCompleting(true)}
          onStartTutorial={handleStartTutorial}
          onOpenHelp={() => setShowHelp(true)}
          onTogglePause={handleTogglePause}
          onToggleMute={handleToggleMute}
          onNewGame={() => handleNewGame()}
        />

        {(gameState.isTutorial || hint) && (
          <div className="guidance-banner" role="status" data-testid="guidance-banner">
            {gameState.isTutorial ? (
              gameState.tutorialCompleted ? (
                <div className="tutorial-done">
                  <span>
                    Tutorial complete! Ready for a full Klondike deal?
                  </span>
                  <button
                    type="button"
                    className="game-btn game-btn-primary banner-btn"
                    onClick={() => handleNewGame()}
                  >
                    Start Full Game
                  </button>
                </div>
              ) : (
                <span>{TUTORIAL_STEPS[gameState.tutorialStep]}</span>
              )
            ) : (
              <span>Hint: {hint?.reason}</span>
            )}
          </div>
        )}

        <div className="board-wrap">
          <SolitaireBoard
            state={gameState}
            selected={selected}
            hint={hint}
            onDrawStock={handleDrawStock}
            onCardClick={handleCardClick}
            onCardDoubleClick={handleCardDoubleClick}
            onTargetClick={handleTargetClick}
            onDragStart={handleDragStart}
            onDropTarget={handleDropTarget}
          />

          <GameOverlay
            status={gameState.status}
            score={gameState.score}
            moves={gameState.moves}
            elapsedSeconds={gameState.elapsedSeconds}
            onResume={handleTogglePause}
            onNewGame={() => handleNewGame()}
          />
        </div>
      </div>

      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </main>
  );
};

export default App;
