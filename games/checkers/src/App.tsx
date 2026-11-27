import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckersBoard } from './components/CheckersBoard';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { WinOverlay } from './components/WinOverlay';
import { chooseBestMove } from './game/ai';
import { SoundEngine } from './game/audio';
import type { AIDifficulty, GameMode } from './game/constants';
import {
  countPieces,
  createInitialState,
  executeMove,
  getLegalMovesForPlayer,
  undoMove,
} from './game/rules';
import { loadSaveData, saveSaveData } from './game/storage';
import {
  CHECKERS_TUTORIAL_STEPS,
  createCheckersTutorialState,
  getCheckersTutorialProgress,
} from './game/tutorial';
import type { Coord, GameState, Move, SaveData } from './game/types';

export const App: React.FC = () => {
  const initialSave = useRef<SaveData>(loadSaveData());
  const soundRef = useRef<SoundEngine>(
    new SoundEngine(initialSave.current.muted),
  );

  const [saveData, setSaveData] = useState<SaveData>(initialSave.current);
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(
      initialSave.current.mode,
      initialSave.current.difficulty,
    ),
  );
  const [showHelp, setShowHelp] = useState(false);
  const [isTutorial, setIsTutorial] = useState(false);

  const isAITurn =
    gameState.status === 'PLAYING' &&
    gameState.mode === 'vs-ai' &&
    gameState.currentPlayer === 'black';

  const legalMoves = useMemo(
    () =>
      gameState.status === 'PLAYING'
        ? getLegalMovesForPlayer(
            gameState.board,
            gameState.currentPlayer,
            gameState.forcedJumpFrom,
          )
        : [],
    [
      gameState.board,
      gameState.currentPlayer,
      gameState.forcedJumpFrom,
      gameState.status,
    ],
  );

  const pieceCounts = useMemo(
    () => countPieces(gameState.board),
    [gameState.board],
  );

  const persistSave = useCallback((nextSave: SaveData) => {
    setSaveData(nextSave);
    saveSaveData(nextSave);
  }, []);

  const performMove = useCallback(
    (move: Move) => {
      setGameState((prev) => {
        const outcome = executeMove(prev, move);

        if (outcome.gameEnded) {
          soundRef.current.playWin();
          if (prev.mode === 'vs-ai' && !isTutorial) {
            setSaveData((s) => {
              const next: SaveData = {
                ...s,
                wins: outcome.state.winner === 'red' ? s.wins + 1 : s.wins,
                losses:
                  outcome.state.winner === 'black' ? s.losses + 1 : s.losses,
              };
              saveSaveData(next);
              return next;
            });
          }
        } else if (outcome.crowned) {
          soundRef.current.playKing();
        } else if (outcome.captured) {
          soundRef.current.playCapture();
        } else {
          soundRef.current.playMove();
        }

        // Keep guided tutorial focused on Red's 3 practice moves
        if (isTutorial && !outcome.gameEnded) {
          return {
            ...outcome.state,
            currentPlayer: 'red',
            selected: outcome.state.selected ?? move.to,
          };
        }

        return outcome.state;
      });
    },
    [isTutorial],
  );

  const handleSquareClick = useCallback(
    (coord: Coord) => {
      if (gameState.status !== 'PLAYING' || isAITurn) return;
      soundRef.current.unlock();

      // If clicking a legal move destination for the selected piece, execute it
      if (gameState.selected) {
        const chosen = legalMoves.find(
          (m) =>
            m.from.row === gameState.selected!.row &&
            m.from.col === gameState.selected!.col &&
            m.to.row === coord.row &&
            m.to.col === coord.col,
        );
        if (chosen) {
          performMove(chosen);
          return;
        }
      }

      // If locked into a forced multi-jump, keep that piece selected
      if (gameState.forcedJumpFrom) {
        return;
      }

      // Otherwise select a piece that has at least one legal move
      const hasMoveFromHere = legalMoves.some(
        (m) => m.from.row === coord.row && m.from.col === coord.col,
      );
      if (hasMoveFromHere) {
        setGameState((prev) => ({
          ...prev,
          selected: coord,
          hintMove: null,
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          selected: null,
        }));
      }
    },
    [
      gameState.forcedJumpFrom,
      gameState.selected,
      gameState.status,
      isAITurn,
      legalMoves,
      performMove,
    ],
  );

  // Schedule AI move when it's Black's turn in vs-ai mode
  useEffect(() => {
    if (!isAITurn) return;

    const timer = window.setTimeout(() => {
      const aiMove = chooseBestMove(
        gameState.board,
        'black',
        gameState.difficulty,
        gameState.forcedJumpFrom,
      );
      if (aiMove) {
        performMove(aiMove);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [
    gameState.board,
    gameState.difficulty,
    gameState.forcedJumpFrom,
    isAITurn,
    performMove,
  ]);

  const handleNewGame = useCallback(() => {
    soundRef.current.unlock();
    setIsTutorial(false);
    setGameState((prev) => createInitialState(prev.mode, prev.difficulty));
  }, []);

  const handleStartTutorial = useCallback(() => {
    soundRef.current.unlock();
    setIsTutorial(true);
    setGameState(createCheckersTutorialState());
  }, []);

  const handleChangeMode = useCallback(
    (mode: GameMode) => {
      soundRef.current.unlock();
      setIsTutorial(false);
      persistSave({ ...saveData, mode });
      setGameState((prev) => createInitialState(mode, prev.difficulty));
    },
    [persistSave, saveData],
  );

  const handleChangeDifficulty = useCallback(
    (difficulty: AIDifficulty) => {
      soundRef.current.unlock();
      setIsTutorial(false);
      persistSave({ ...saveData, difficulty });
      setGameState((prev) => createInitialState(prev.mode, difficulty));
    },
    [persistSave, saveData],
  );

  const handleUndo = useCallback(() => {
    if (isAITurn) return;
    soundRef.current.unlock();
    setGameState((prev) => undoMove(prev));
  }, [isAITurn]);

  const handleHint = useCallback(() => {
    if (gameState.status !== 'PLAYING' || isAITurn) return;
    soundRef.current.unlock();
    const best = chooseBestMove(
      gameState.board,
      gameState.currentPlayer,
      'medium',
      gameState.forcedJumpFrom,
    );
    if (best) {
      setGameState((prev) => ({
        ...prev,
        selected: best.from,
        hintMove: best,
      }));
    }
  }, [
    gameState.board,
    gameState.currentPlayer,
    gameState.forcedJumpFrom,
    gameState.status,
    isAITurn,
  ]);

  const handleToggleMute = useCallback(() => {
    const nextMuted = !saveData.muted;
    soundRef.current.setMuted(nextMuted);
    if (!nextMuted) soundRef.current.unlock();
    persistSave({ ...saveData, muted: nextMuted });
  }, [persistSave, saveData]);

  // Keyboard shortcuts: Z Undo, H Hint
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.code === 'KeyZ') {
        handleUndo();
      } else if (e.code === 'KeyH') {
        handleHint();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleHint, handleUndo]);

  const tutorialProgress = isTutorial
    ? getCheckersTutorialProgress(gameState)
    : null;

  return (
    <main className="checkers-page">
      <div className="checkers-shell">
        <Header
          mode={gameState.mode}
          difficulty={gameState.difficulty}
          currentPlayer={gameState.currentPlayer}
          redCount={pieceCounts.red}
          blackCount={pieceCounts.black}
          wins={saveData.wins}
          losses={saveData.losses}
          canUndo={gameState.history.length > 0}
          muted={saveData.muted}
          isAIThinking={isAITurn}
          mustContinueJump={gameState.forcedJumpFrom !== null}
          isTutorial={isTutorial}
          onChangeMode={handleChangeMode}
          onChangeDifficulty={handleChangeDifficulty}
          onUndo={handleUndo}
          onHint={handleHint}
          onStartTutorial={handleStartTutorial}
          onOpenHelp={() => setShowHelp(true)}
          onNewGame={handleNewGame}
          onToggleMute={handleToggleMute}
        />

        {isTutorial && tutorialProgress && (
          <div className="guidance-banner" role="status" data-testid="guidance-banner">
            {tutorialProgress.completed ? (
              <div className="tutorial-done">
                <span>Tutorial complete! Ready for a full match?</span>
                <button
                  type="button"
                  className="game-btn game-btn-primary banner-btn"
                  onClick={handleNewGame}
                >
                  Start Full Match
                </button>
              </div>
            ) : (
              <span>{CHECKERS_TUTORIAL_STEPS[tutorialProgress.step]}</span>
            )}
          </div>
        )}

        <div className="board-stage">
          <CheckersBoard
            board={gameState.board}
            selected={gameState.selected}
            legalMoves={legalMoves}
            hintMove={gameState.hintMove}
            forcedJumpFrom={gameState.forcedJumpFrom}
            disabled={isAITurn || gameState.status !== 'PLAYING'}
            onSquareClick={handleSquareClick}
          />
          <WinOverlay
            winner={gameState.winner}
            mode={gameState.mode}
            moveCount={gameState.moveCount}
            onNewGame={handleNewGame}
          />
        </div>

        <footer className="checkers-footer">
          Captures are mandatory • Click a highlighted piece to move •{' '}
          <strong>Z</strong> Undo • <strong>H</strong> Hint
        </footer>
      </div>

      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </main>
  );
};

export default App;
