import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { PrivacyCurtain } from './components/PrivacyCurtain';
import { ResultOverlay } from './components/ResultOverlay';
import { TableBoard } from './components/TableBoard';
import { runAiStep } from './game/ai';
import { SoundEngine } from './game/audio';
import {
  createNewGame,
  declareU,
  discardCard,
  drawFromNoc,
  eatLastDiscard,
  layOffSingleCard,
  meldOptimalPhoms,
  proceedToDiscard,
  sortActivePlayerHand,
} from './game/engine';
import { getPhomHint } from './game/hints';
import { loadStoredStats, saveStoredStats } from './game/storage';
import { createTutorialGame, syncTutorialAfterAction } from './game/tutorial';
import type {
  GameMode,
  LayOffOption,
  PhomHint,
  PlayerCount,
  StoredTaLaStats,
  TaLaState,
} from './game/types';

export default function App() {
  const [stats, setStats] = useState<StoredTaLaStats>(() => loadStoredStats());
  const soundRef = useRef<SoundEngine | null>(null);
  if (!soundRef.current) {
    soundRef.current = new SoundEngine(stats.muted);
  }

  const [gameState, setGameState] = useState<TaLaState>(() =>
    createNewGame({
      playerCount: stats.playerCount,
      mode: stats.mode,
    }),
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hint, setHint] = useState<PhomHint | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [revealedPlayerIndex, setRevealedPlayerIndex] = useState<number>(() =>
    stats.mode === 'pass-and-play' ? -1 : 0,
  );
  const [isHiddenTab, setIsHiddenTab] = useState(false);

  const recordedEndRef = useRef(false);
  const dealerCounterRef = useRef(0);

  const isCurtainOpen = useMemo(
    () =>
      gameState.mode === 'pass-and-play' &&
      gameState.phase !== 'game_over' &&
      !gameState.tutorialMode &&
      gameState.currentPlayerIndex !== revealedPlayerIndex,
    [gameState.mode, gameState.phase, gameState.tutorialMode, gameState.currentPlayerIndex, revealedPlayerIndex],
  );

  // Sync audio mute state
  useEffect(() => {
    soundRef.current?.setMuted(stats.muted);
  }, [stats.muted]);

  // Handle tab visibility changes cleanly
  useEffect(() => {
    const onVisibility = () => {
      setIsHiddenTab(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Persist stats when a hand finishes
  useEffect(() => {
    if (gameState.phase !== 'game_over' || gameState.tutorialMode || !gameState.results) {
      return;
    }
    if (recordedEndRef.current) return;
    recordedEndRef.current = true;

    soundRef.current?.playWin();

    setStats((prev) => {
      const targetResult =
        gameState.mode === 'vs-ai'
          ? gameState.results!.find((r) => r.playerIndex === 0) ?? gameState.results![0]
          : gameState.results![0];

      const earned = Math.max(0, targetResult.matchPointsDelta);
      const next: StoredTaLaStats = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (targetResult.rank === 1 ? 1 : 0),
        uWins: prev.uWins + (targetResult.isU ? 1 : 0),
        totalScore: prev.totalScore + earned,
        bestScore: Math.max(prev.bestScore, earned),
      };
      saveStoredStats(next);
      return next;
    });
  }, [gameState.phase, gameState.tutorialMode, gameState.results, gameState.mode]);

  // Drive AI turns automatically when not paused/hidden
  useEffect(() => {
    if (isHiddenTab || helpOpen || gameState.tutorialMode) return;
    if (gameState.phase === 'game_over') return;
    const active = gameState.players[gameState.currentPlayerIndex];
    if (!active?.isAi) return;

    const timer = window.setTimeout(() => {
      setGameState((prev) => {
        const current = prev.players[prev.currentPlayerIndex];
        if (!current?.isAi || prev.phase === 'game_over') return prev;
        const prevPhase = prev.phase;
        const next = runAiStep(prev);
        if (next !== prev) {
          if (prevPhase === 'draw_or_eat') {
            if (next.players[prev.currentPlayerIndex].eatenCardIds.length > current.eatenCardIds.length) {
              soundRef.current?.playEat();
            } else {
              soundRef.current?.playDraw();
            }
          } else if (prevPhase === 'meld') {
            soundRef.current?.playMeld();
          } else if (prevPhase === 'discard') {
            soundRef.current?.playDiscard();
          }
        }
        return next;
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [gameState, isHiddenTab, helpOpen]);

  const startNewGame = useCallback(
    (nextCount: PlayerCount = stats.playerCount, nextMode: GameMode = stats.mode) => {
      recordedEndRef.current = false;
      dealerCounterRef.current = (dealerCounterRef.current + 1) % nextCount;
      const fresh = createNewGame({
        playerCount: nextCount,
        mode: nextMode,
        dealerIndex: 0,
      });
      setGameState(fresh);
      setSelectedCardId(null);
      setHint(null);
      setRevealedPlayerIndex(nextMode === 'pass-and-play' ? -1 : 0);
    },
    [stats.playerCount, stats.mode],
  );

  const handleSelectPlayerCount = useCallback(
    (count: PlayerCount) => {
      soundRef.current?.unlock();
      setStats((prev) => {
        const next = { ...prev, playerCount: count };
        saveStoredStats(next);
        return next;
      });
      startNewGame(count, stats.mode);
    },
    [startNewGame, stats.mode],
  );

  const handleSelectMode = useCallback(
    (mode: GameMode) => {
      soundRef.current?.unlock();
      setStats((prev) => {
        const next = { ...prev, mode };
        saveStoredStats(next);
        return next;
      });
      startNewGame(stats.playerCount, mode);
    },
    [startNewGame, stats.playerCount],
  );

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setStats((prev) => {
      const next = { ...prev, muted: !prev.muted };
      saveStoredStats(next);
      return next;
    });
  }, []);

  const handleStartTutorial = useCallback(() => {
    soundRef.current?.unlock();
    recordedEndRef.current = false;
    setGameState(createTutorialGame());
    setSelectedCardId(null);
    setHint(null);
    setRevealedPlayerIndex(0);
  }, []);

  const handleHint = useCallback(() => {
    soundRef.current?.unlock();
    if (isCurtainOpen) return;
    const active = gameState.players[gameState.currentPlayerIndex];
    if (active.isAi) return;
    const computed = getPhomHint(gameState);
    setHint(computed);
    if (computed?.cardId && (gameState.phase === 'discard' || gameState.phase === 'meld')) {
      setSelectedCardId(computed.cardId);
    }
  }, [gameState, isCurtainOpen]);

  const applyPlayerAction = useCallback(
    (updater: (prev: TaLaState) => TaLaState, sfx?: () => void) => {
      soundRef.current?.unlock();
      setHint(null);
      setGameState((prev) => {
        const rawNext = updater(prev);
        if (rawNext === prev) return prev;
        sfx?.();
        return syncTutorialAfterAction(prev, rawNext);
      });
    },
    [],
  );

  const handleDraw = useCallback(() => {
    applyPlayerAction(drawFromNoc, () => soundRef.current?.playDraw());
    setSelectedCardId(null);
  }, [applyPlayerAction]);

  const handleEat = useCallback(() => {
    applyPlayerAction(eatLastDiscard, () => soundRef.current?.playEat());
    setSelectedCardId(null);
  }, [applyPlayerAction]);

  const handleMeld = useCallback(() => {
    applyPlayerAction(meldOptimalPhoms, () => soundRef.current?.playMeld());
    setSelectedCardId(null);
  }, [applyPlayerAction]);

  const handleLayOff = useCallback(
    (option: LayOffOption) => {
      applyPlayerAction(
        (prev) =>
          layOffSingleCard(
            prev,
            option.card.id,
            option.targetPlayerIndex,
            option.targetMeldId,
          ),
        () => soundRef.current?.playMeld(),
      );
      setSelectedCardId(null);
    },
    [applyPlayerAction],
  );

  const handleProceedToDiscard = useCallback(() => {
    applyPlayerAction(proceedToDiscard);
  }, [applyPlayerAction]);

  const handleDiscard = useCallback(
    (cardId: string) => {
      applyPlayerAction(
        (prev) => discardCard(prev, cardId),
        () => soundRef.current?.playDiscard(),
      );
      setSelectedCardId(null);
    },
    [applyPlayerAction],
  );

  const handleDeclareU = useCallback(() => {
    applyPlayerAction(declareU, () => soundRef.current?.playWin());
    setSelectedCardId(null);
  }, [applyPlayerAction]);

  const handleSortHand = useCallback(() => {
    soundRef.current?.unlock();
    setGameState((prev) => sortActivePlayerHand(prev));
  }, []);

  // Keyboard navigation & accessibility safety
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Escape' && helpOpen) {
        setHelpOpen(false);
        return;
      }

      if (e.key === ' ' || e.key.startsWith('Arrow')) {
        e.preventDefault();
      }

      if (helpOpen) return;

      if (isCurtainOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          setRevealedPlayerIndex(gameState.currentPlayerIndex);
        }
        return;
      }

      const active = gameState.players[gameState.currentPlayerIndex];
      if (!active || active.isAi || gameState.phase === 'game_over') return;

      if (e.key === 'h' || e.key === 'H') {
        handleHint();
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        handleSortHand();
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const hand = active.hand;
        if (hand.length === 0) return;
        const idx = selectedCardId ? hand.findIndex((c) => c.id === selectedCardId) : -1;
        const nextIdx =
          e.key === 'ArrowRight'
            ? (idx + 1) % hand.length
            : (idx - 1 + hand.length) % hand.length;
        setSelectedCardId(hand[nextIdx].id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    helpOpen,
    isCurtainOpen,
    gameState.currentPlayerIndex,
    gameState.players,
    gameState.phase,
    selectedCardId,
    handleHint,
    handleSortHand,
  ]);

  return (
    <div className="tala-app game-surface">
      <Header
        playerCount={gameState.playerCount}
        mode={gameState.mode}
        round={gameState.round}
        bestScore={stats.bestScore}
        muted={stats.muted}
        tutorialMode={gameState.tutorialMode}
        onSelectPlayerCount={handleSelectPlayerCount}
        onSelectMode={handleSelectMode}
        onHint={handleHint}
        onStartTutorial={handleStartTutorial}
        onOpenHelp={() => setHelpOpen(true)}
        onToggleMute={handleToggleMute}
        onNewGame={() => startNewGame(stats.playerCount, stats.mode)}
      />

      <main className="tala-main">
        <TableBoard
          state={gameState}
          selectedCardId={selectedCardId}
          hint={hint}
          isCurtainOpen={isCurtainOpen}
          onSelectCard={(id) =>
            setSelectedCardId((prev) => (prev === id ? null : id))
          }
          onDraw={handleDraw}
          onEat={handleEat}
          onMeld={handleMeld}
          onLayOff={handleLayOff}
          onProceedToDiscard={handleProceedToDiscard}
          onDiscard={handleDiscard}
          onDeclareU={handleDeclareU}
          onSortHand={handleSortHand}
          onExitTutorialToGame={() => startNewGame(stats.playerCount, stats.mode)}
        />

        {isCurtainOpen && (
          <PrivacyCurtain
            playerNumber={gameState.currentPlayerIndex + 1}
            round={gameState.round}
            onReveal={() => {
              soundRef.current?.unlock();
              setRevealedPlayerIndex(gameState.currentPlayerIndex);
              setSelectedCardId(null);
              setHint(null);
            }}
          />
        )}

        {gameState.phase === 'game_over' && gameState.results && (
          <ResultOverlay
            results={gameState.results}
            winReason={gameState.winReason}
            onNewGame={() => startNewGame(stats.playerCount, stats.mode)}
          />
        )}

        {helpOpen && <HowToPlayModal onClose={() => setHelpOpen(false)} />}
      </main>
    </div>
  );
}
