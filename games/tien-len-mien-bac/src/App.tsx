import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GameOverlay } from './components/GameOverlay';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { TableBoard } from './components/TableBoard';
import { chooseAiAction } from './game/ai';
import { SoundEngine } from './game/audio';
import {
  createGameState,
  passTurn,
  playCards,
  revealHandoff,
  toggleSortMode,
} from './game/engine';
import { getNorthernHint } from './game/hints';
import { loadSaveData, saveSaveData } from './game/storage';
import { createTutorialState } from './game/tutorial';
import type { GameMode, GameState, PlayerCount, SaveData } from './game/types';

export const App: React.FC = () => {
  const initialSave = useRef<SaveData>(loadSaveData());
  const soundRef = useRef<SoundEngine>(
    new SoundEngine(initialSave.current.muted),
  );
  const scoredRoundRef = useRef<boolean>(false);

  const [saveData, setSaveData] = useState<SaveData>(initialSave.current);
  const [gameState, setGameState] = useState<GameState>(() =>
    createGameState(
      initialSave.current.playerCount,
      initialSave.current.mode,
      'rank',
    ),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hintCardIds, setHintCardIds] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const persistSave = useCallback((updater: (prev: SaveData) => SaveData) => {
    setSaveData((prev) => {
      const next = updater(prev);
      saveSaveData(next);
      return next;
    });
  }, []);

  const startNewGame = useCallback(
    (playerCount: PlayerCount, mode: GameMode) => {
      scoredRoundRef.current = false;
      setSelectedIds([]);
      setHintCardIds([]);
      setGameState((prev) => createGameState(playerCount, mode, prev.sortMode));
    },
    [],
  );

  // Record round outcome once when a non-tutorial match finishes
  useEffect(() => {
    if (
      gameState.status === 'finished' &&
      !gameState.isTutorial &&
      !scoredRoundRef.current &&
      gameState.winnerIndex !== null
    ) {
      scoredRoundRef.current = true;
      soundRef.current.playWin();
      const humanEntry = gameState.roundScores[0];
      const delta = humanEntry ? humanEntry.delta : 0;
      const humanWon =
        gameState.mode === 'ai'
          ? gameState.winnerIndex === 0
          : gameState.winnerIndex !== null;

      persistSave((prev) => ({
        ...prev,
        wins: humanWon ? prev.wins + 1 : prev.wins,
        gamesPlayed: prev.gamesPlayed + 1,
        totalScore: Math.max(0, prev.totalScore + delta),
        bestScore: Math.max(prev.bestScore, delta),
      }));
    }
  }, [gameState, persistSave]);

  // Track visibilitychange so AI pauses cleanly when tab is hidden
  useEffect(() => {
    const onVis = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // AI Turn Loop
  useEffect(() => {
    if (
      gameState.status !== 'playing' ||
      gameState.isTutorial ||
      showHelp ||
      !isTabVisible
    ) {
      return;
    }
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isHuman) return;

    const timer = window.setTimeout(() => {
      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;
        const actor = prev.players[prev.currentPlayerIndex];
        if (!actor || actor.isHuman) return prev;

        const decision = chooseAiAction(prev);
        if (decision.action === 'play') {
          const outcome = playCards(prev, decision.cardIds);
          if (outcome.played) {
            if (outcome.chatHeo) soundRef.current.playChatHeo();
            else soundRef.current.playCardPlay();
            return outcome.state;
          }
        }
        const passRes = passTurn(prev);
        if (passRes.passed) {
          soundRef.current.playPass();
        }
        return passRes.state;
      });
    }, 520);

    return () => window.clearTimeout(timer);
  }, [gameState, showHelp, isTabVisible]);

  const handleSelectPlayerCount = useCallback(
    (count: PlayerCount) => {
      soundRef.current.unlock();
      persistSave((prev) => ({ ...prev, playerCount: count }));
      startNewGame(count, saveData.mode);
    },
    [persistSave, saveData.mode, startNewGame],
  );

  const handleSelectMode = useCallback(
    (mode: GameMode) => {
      soundRef.current.unlock();
      persistSave((prev) => ({ ...prev, mode }));
      startNewGame(saveData.playerCount, mode);
    },
    [persistSave, saveData.playerCount, startNewGame],
  );

  const handleNewGame = useCallback(() => {
    soundRef.current.unlock();
    startNewGame(saveData.playerCount, saveData.mode);
  }, [saveData.mode, saveData.playerCount, startNewGame]);

  const handleStartTutorial = useCallback(() => {
    soundRef.current.unlock();
    scoredRoundRef.current = false;
    setSelectedIds([]);
    setHintCardIds([]);
    setGameState(createTutorialState());
  }, []);

  const handleToggleCard = useCallback((cardId: string) => {
    soundRef.current.playSelect();
    setHintCardIds([]);
    setSelectedIds((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId],
    );
  }, []);

  const handlePlay = useCallback(() => {
    soundRef.current.unlock();
    if (selectedIds.length === 0) return;

    const outcome = playCards(gameState, selectedIds);
    if (!outcome.played) {
      soundRef.current.playError();
      setGameState(outcome.state);
      return;
    }

    if (outcome.chatHeo) {
      soundRef.current.playChatHeo();
    } else {
      soundRef.current.playCardPlay();
    }
    setSelectedIds([]);
    setHintCardIds([]);
    setGameState(outcome.state);
  }, [gameState, selectedIds]);

  const handlePass = useCallback(() => {
    soundRef.current.unlock();
    const res = passTurn(gameState);
    if (!res.passed) {
      soundRef.current.playError();
      setGameState(res.state);
      return;
    }
    soundRef.current.playPass();
    setSelectedIds([]);
    setHintCardIds([]);
    setGameState(res.state);
  }, [gameState]);

  const handleSort = useCallback(() => {
    soundRef.current.playSelect();
    setGameState((prev) => toggleSortMode(prev));
  }, []);

  const handleHint = useCallback(() => {
    soundRef.current.unlock();
    if (gameState.status !== 'playing' || gameState.handoffRequired) return;

    if (gameState.isTutorial) {
      const stepTargets =
        gameState.tutorialStep === 0
          ? ['spades-3']
          : gameState.tutorialStep === 1
            ? ['diamonds-9']
            : gameState.tutorialStep === 2
              ? ['spades-6', 'clubs-6', 'diamonds-6', 'hearts-6']
              : [];
      if (stepTargets.length > 0) {
        setHintCardIds(stepTargets);
        setSelectedIds(stepTargets);
      }
      return;
    }

    const active = gameState.players[gameState.currentPlayerIndex];
    if (!active.isHuman) return;

    const hint = getNorthernHint(gameState);
    if (!hint) {
      setHintCardIds([]);
      setSelectedIds([]);
      setGameState((prev) => ({
        ...prev,
        eventBanner: {
          vi: 'Gợi ý: Không có bộ bài chặt được — hãy nhấn Bỏ lượt / Pass',
          en: 'Hint: No valid beating combo — click Pass',
          tone: 'warning',
        },
      }));
      return;
    }

    const ids = hint.cards.map((c) => c.id);
    setHintCardIds(ids);
    setSelectedIds(ids);
    setGameState((prev) => ({
      ...prev,
      eventBanner: {
        vi: hint.reasonVi,
        en: hint.reasonEn,
        tone: 'info',
      },
    }));
  }, [gameState]);

  const handleToggleMute = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      persistSave((prev) => {
        const nextMuted = !prev.muted;
        soundRef.current.setMuted(nextMuted);
        if (!nextMuted) soundRef.current.unlock();
        return { ...prev, muted: nextMuted };
      });
    },
    [persistSave],
  );

  const handleRevealHandoff = useCallback(() => {
    soundRef.current.playSelect();
    setSelectedIds([]);
    setHintCardIds([]);
    setGameState((prev) => revealHandoff(prev));
  }, []);

  // Safe keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === ' ' || e.key.startsWith('Arrow')) {
        e.preventDefault();
      }
      if (e.repeat) return;

      if (e.key === 'Escape') {
        if (showHelp) setShowHelp(false);
        else setSelectedIds([]);
        return;
      }

      if (showHelp) return;

      if (e.key === 'Enter' && selectedIds.length > 0) {
        e.preventDefault();
        handlePlay();
      } else if (e.key === 'p' || e.key === 'P') {
        handlePass();
      } else if (e.key === 'h' || e.key === 'H') {
        handleHint();
      } else if (e.key === 's' || e.key === 'S') {
        handleSort();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showHelp, selectedIds, handlePlay, handlePass, handleHint, handleSort]);

  const winner =
    gameState.winnerIndex !== null
      ? gameState.players[gameState.winnerIndex]
      : null;

  return (
    <div className="tl-app game-surface">
      <Header
        playerCount={gameState.isTutorial ? saveData.playerCount : gameState.playerCount}
        mode={gameState.isTutorial ? saveData.mode : gameState.mode}
        saveData={saveData}
        isTutorial={gameState.isTutorial}
        onSelectPlayerCount={handleSelectPlayerCount}
        onSelectMode={handleSelectMode}
        onNewGame={handleNewGame}
        onStartTutorial={handleStartTutorial}
        onHint={handleHint}
        onOpenHelp={() => setShowHelp(true)}
        onToggleMute={handleToggleMute}
      />

      <div className="tl-stage">
        <TableBoard
          state={gameState}
          selectedIds={selectedIds}
          hintCardIds={hintCardIds}
          onToggleCard={handleToggleCard}
          onPlay={handlePlay}
          onPass={handlePass}
          onClearSelection={() => setSelectedIds([])}
          onSort={handleSort}
          onRevealHandoff={handleRevealHandoff}
          onFinishTutorial={handleNewGame}
        />

        {gameState.status === 'finished' && winner && (
          <GameOverlay
            winnerNameVi={winner.nameVi}
            winnerNameEn={winner.nameEn}
            roundScores={gameState.roundScores}
            onPlayAgain={handleNewGame}
          />
        )}
      </div>

      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default App;
