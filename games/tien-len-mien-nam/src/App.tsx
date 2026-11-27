import { useCallback, useEffect, useRef, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { chooseAiPlay } from './game/ai';
import { soundManager } from './game/audio';
import { AI_THINK_DELAY_MS } from './game/constants';
import {
  clearSelection,
  createNewGame,
  cycleSortMode,
  passTurn,
  playCards,
  revealPassAndPlayHand,
  toggleCardSelection,
} from './game/engine';
import { getSouthernHint } from './game/hints';
import {
  loadPersistedData,
  savePersistedData,
  type PersistedData,
} from './game/storage';
import { createTutorialGame, handleTutorialPlay } from './game/tutorial';
import type { GameMode, GameState, PlayerCount } from './game/types';

export default function App() {
  const [persisted, setPersisted] = useState<PersistedData>(() => {
    const data = loadPersistedData();
    soundManager.setMuted(data.muted);
    return data;
  });

  const [state, setState] = useState<GameState>(() =>
    createNewGame({
      playerCount: persisted.playerCount,
      mode: persisted.mode,
    }),
  );

  const [helpOpen, setHelpOpen] = useState(false);
  const recordedRoundKeyRef = useRef<string | null>(null);

  // Sync persistence helper
  const updatePersisted = useCallback(
    (updater: (prev: PersistedData) => PersistedData) => {
      setPersisted((prev) => {
        const next = updater(prev);
        savePersistedData(next);
        return next;
      });
    },
    [],
  );

  // Handle round over sound & localStorage stats once per round
  useEffect(() => {
    if (state.status !== 'ROUND_OVER' || !state.roundResult) {
      recordedRoundKeyRef.current = null;
      return;
    }

    if (state.tutorial.active) {
      soundManager.playWin();
      return;
    }

    const roundKey = `${state.roundNumber}-${state.roundResult.winnerId}-${state.roundResult.pointsEarned}`;
    if (recordedRoundKeyRef.current === roundKey) return;
    recordedRoundKeyRef.current = roundKey;

    soundManager.playWin();

    const winnerId = state.roundResult.winnerId;
    const winnerScore = state.players[winnerId]?.score ?? state.roundResult.pointsEarned;
    const humanWon = winnerId === 0;

    updatePersisted((prev) => ({
      ...prev,
      wins: prev.wins + (humanWon ? 1 : 0),
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + (humanWon ? state.roundResult!.pointsEarned : 0),
      bestScore: Math.max(prev.bestScore, winnerScore),
    }));
  }, [state, updatePersisted]);

  // AI turn automation
  useEffect(() => {
    if (state.status !== 'PLAYING' || state.tutorial.active) return;
    const currentPlayer = state.players[state.currentTurn];
    if (!currentPlayer?.isAi) return;

    const timer = window.setTimeout(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      setState((prev) => {
        if (prev.status !== 'PLAYING' || prev.tutorial.active) return prev;
        const aiPlayer = prev.players[prev.currentTurn];
        if (!aiPlayer?.isAi) return prev;

        const choice = chooseAiPlay(prev, prev.currentTurn);
        if (!choice) {
          soundManager.playPass();
          return passTurn(prev);
        }

        const next = playCards(
          prev,
          choice.cards.map((c) => c.id),
        );
        if (next.cutEventCount > prev.cutEventCount) {
          soundManager.playBomb();
        } else {
          soundManager.playCard();
        }
        return next;
      });
    }, AI_THINK_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [state.status, state.currentTurn, state.players, state.tutorial.active]);

  // Resume AI timer if tab becomes visible while it's AI's turn
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setState((prev) => ({ ...prev }));
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const handleToggleCard = useCallback((cardId: string) => {
    soundManager.playSelect();
    setState((prev) => toggleCardSelection(prev, cardId));
  }, []);

  const handlePlaySelected = useCallback(() => {
    setState((prev) => {
      if (prev.selectedCardIds.length === 0) return prev;
      const next = prev.tutorial.active
        ? handleTutorialPlay(prev, prev.selectedCardIds)
        : playCards(prev, prev.selectedCardIds);

      if (next === prev || next.bannerMessage === prev.bannerMessage) {
        // Invalid play check
        if (next.currentTurn === prev.currentTurn && next.status === 'PLAYING') {
          soundManager.playError();
          return next;
        }
      }

      if (next.cutEventCount > prev.cutEventCount) {
        soundManager.playBomb();
      } else {
        soundManager.playCard();
      }
      return next;
    });
  }, []);

  const handlePassTurn = useCallback(() => {
    setState((prev) => {
      if (prev.tutorial.active) return prev;
      const next = passTurn(prev);
      if (next !== prev && next.currentTurn !== prev.currentTurn) {
        soundManager.playPass();
      } else {
        soundManager.playError();
      }
      return next;
    });
  }, []);

  const handleSortHand = useCallback(() => {
    soundManager.playSelect();
    setState((prev) => cycleSortMode(prev));
  }, []);

  const handleClearSelection = useCallback(() => {
    soundManager.playSelect();
    setState((prev) => clearSelection(prev));
  }, []);

  const handleHint = useCallback(() => {
    soundManager.playSelect();
    setState((prev) => {
      const hint = getSouthernHint(prev);
      if (!hint) return prev;
      return {
        ...prev,
        selectedCardIds: hint.cardIds,
        hintedCardIds: hint.cardIds,
        bannerMessage: hint.message,
      };
    });
  }, []);

  const handleRevealHand = useCallback(() => {
    soundManager.playSelect();
    setState((prev) => revealPassAndPlayHand(prev));
  }, []);

  const handleNewGame = useCallback(() => {
    soundManager.playSelect();
    setState((prev) =>
      createNewGame({
        playerCount: prev.tutorial.active ? persisted.playerCount : prev.playerCount,
        mode: prev.tutorial.active ? persisted.mode : prev.mode,
        sortMode: prev.sortMode,
      }),
    );
  }, [persisted.mode, persisted.playerCount]);

  const handleNextRound = useCallback(() => {
    soundManager.playSelect();
    setState((prev) =>
      createNewGame({
        playerCount: prev.playerCount,
        mode: prev.mode,
        roundNumber: prev.roundNumber + 1,
        previousPlayers: prev.players,
        previousWinnerId: prev.roundResult?.winnerId ?? 0,
        sortMode: prev.sortMode,
      }),
    );
  }, []);

  const handleChangePlayerCount = useCallback(
    (count: PlayerCount) => {
      soundManager.playSelect();
      updatePersisted((prev) => ({ ...prev, playerCount: count }));
      setState((prev) =>
        createNewGame({
          playerCount: count,
          mode: prev.tutorial.active ? persisted.mode : prev.mode,
          sortMode: prev.sortMode,
        }),
      );
    },
    [persisted.mode, updatePersisted],
  );

  const handleChangeMode = useCallback(
    (mode: GameMode) => {
      soundManager.playSelect();
      updatePersisted((prev) => ({ ...prev, mode }));
      setState((prev) =>
        createNewGame({
          playerCount: prev.tutorial.active ? persisted.playerCount : prev.playerCount,
          mode,
          sortMode: prev.sortMode,
        }),
      );
    },
    [persisted.playerCount, updatePersisted],
  );

  const handleStartTutorial = useCallback(() => {
    soundManager.playSelect();
    setState(createTutorialGame());
  }, []);

  const handleToggleMute = useCallback(() => {
    updatePersisted((prev) => {
      const nextMuted = !prev.muted;
      soundManager.setMuted(nextMuted);
      return { ...prev, muted: nextMuted };
    });
  }, [updatePersisted]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

      if (
        e.key === ' ' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        if (helpOpen) {
          setHelpOpen(false);
        } else {
          handleClearSelection();
        }
        return;
      }

      if (helpOpen || state.privacyCurtain || state.status !== 'PLAYING') return;

      if (e.key === 'Enter') {
        handlePlaySelected();
      } else if (e.key === 'h' || e.key === 'H') {
        handleHint();
      } else if (e.key === 's' || e.key === 'S') {
        handleSortHand();
      } else if (e.key === 'p' || e.key === 'P') {
        handlePassTurn();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    helpOpen,
    state.privacyCurtain,
    state.status,
    handleClearSelection,
    handlePlaySelected,
    handleHint,
    handleSortHand,
    handlePassTurn,
  ]);

  return (
    <div className="tl-app">
      <Header
        playerCount={state.playerCount}
        mode={state.mode}
        roundNumber={state.roundNumber}
        wins={persisted.wins}
        bestScore={persisted.bestScore}
        isTutorial={state.tutorial.active}
        muted={persisted.muted}
        onChangePlayerCount={handleChangePlayerCount}
        onChangeMode={handleChangeMode}
        onStartTutorial={handleStartTutorial}
        onOpenHelp={() => setHelpOpen(true)}
        onToggleMute={handleToggleMute}
        onNewGame={handleNewGame}
      />

      <GameBoard
        state={state}
        onToggleCard={handleToggleCard}
        onPlaySelected={handlePlaySelected}
        onPassTurn={handlePassTurn}
        onSortHand={handleSortHand}
        onClearSelection={handleClearSelection}
        onHint={handleHint}
        onRevealHand={handleRevealHand}
        onNextRound={handleNextRound}
        onStartFullGame={handleNewGame}
      />

      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
