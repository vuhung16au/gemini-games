import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GameOverlay } from './components/GameOverlay';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { TanDoBoard } from './components/TanDoBoard';
import { chooseAIMove } from './game/ai';
import { SoundEngine } from './game/audio';
import {
  applyAttack,
  applyDefend,
  applyPassThrowIn,
  applyTakeCards,
  applyThrowIn,
  calculateWinScore,
  canBeat,
  createNewGame,
  getUndefendedIndices,
  revealHand,
  sortHand,
} from './game/engine';
import { getTanDoHint } from './game/hints';
import { loadSaveData, saveSaveData } from './game/storage';
import { applyTutorialPlayerAction, createTutorialGame } from './game/tutorial';
import type { GameMode, PlayerCount, SaveData, TanDoHint, TanDoState } from './game/types';

export const App: React.FC = () => {
  const [saveData, setSaveData] = useState<SaveData>(() => loadSaveData());
  const [gameState, setGameState] = useState<TanDoState>(() =>
    createNewGame(saveData.playerCount, saveData.mode),
  );
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [hint, setHint] = useState<TanDoHint | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const soundRef = useRef<SoundEngine | null>(null);
  if (!soundRef.current) {
    soundRef.current = new SoundEngine(saveData.muted);
  }
  const scoredWinRef = useRef(false);

  useEffect(() => {
    saveSaveData(saveData);
  }, [saveData]);

  // Record win & score once per finished match
  useEffect(() => {
    if (
      gameState.status === 'WON' &&
      !gameState.isTutorial &&
      !scoredWinRef.current &&
      gameState.winnerIndex !== null
    ) {
      scoredWinRef.current = true;
      soundRef.current?.playWin();
      const winner = gameState.players[gameState.winnerIndex];
      const earned = calculateWinScore(gameState);
      setSaveData((prev) => ({
        ...prev,
        wins: !winner.isAI ? prev.wins + 1 : prev.wins,
        score: !winner.isAI ? prev.score + earned : prev.score,
        gamesPlayed: prev.gamesPlayed + 1,
      }));
    }
  }, [gameState]);

  // AI turn automation (paused when tab is hidden or help modal is open)
  useEffect(() => {
    if (
      gameState.status !== 'PLAYING' ||
      gameState.isTutorial ||
      showHelp
    ) {
      return;
    }

    const active = gameState.players[gameState.activePlayerIndex];
    if (!active || !active.isAI) return;

    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      setGameState((prev) => {
        const next = chooseAIMove(prev);
        if (next !== prev) {
          if (next.status === 'WON') {
            soundRef.current?.playWin();
          } else if (next.roundNumber > prev.roundNumber) {
            if (next.players[prev.defenderIndex].hand.length > prev.players[prev.defenderIndex].hand.length) {
              soundRef.current?.playTakeCards();
            } else {
              soundRef.current?.playBoutClear();
            }
          } else if (next.phase === 'DEFEND_OR_PASS' && prev.phase !== 'DEFEND_OR_PASS') {
            soundRef.current?.playCardAttack();
          } else {
            soundRef.current?.playDefend();
          }
        }
        return next;
      });
    }, 360);

    return () => window.clearTimeout(timer);
  }, [gameState, showHelp]);

  const startNewGame = useCallback(
    (count: PlayerCount = saveData.playerCount, mode: GameMode = saveData.mode) => {
      scoredWinRef.current = false;
      setSelectedCardIds([]);
      setSelectedSlotIndex(null);
      setHint(null);
      setGameState(createNewGame(count, mode));
    },
    [saveData.playerCount, saveData.mode],
  );

  const handleChangePlayerCount = useCallback(
    (count: PlayerCount) => {
      setSaveData((prev) => ({ ...prev, playerCount: count }));
      startNewGame(count, saveData.mode);
    },
    [saveData.mode, startNewGame],
  );

  const handleChangeMode = useCallback(
    (mode: GameMode) => {
      setSaveData((prev) => ({ ...prev, mode }));
      startNewGame(saveData.playerCount, mode);
    },
    [saveData.playerCount, startNewGame],
  );

  const handleStartTutorial = useCallback(() => {
    scoredWinRef.current = false;
    setSelectedCardIds([]);
    setSelectedSlotIndex(null);
    setHint(null);
    setGameState(createTutorialGame());
  }, []);

  const handleToggleMute = useCallback(() => {
    setSaveData((prev) => {
      const nextMuted = !prev.muted;
      soundRef.current?.setMuted(nextMuted);
      return { ...prev, muted: nextMuted };
    });
  }, []);

  const handleToggleCard = useCallback(
    (cardId: string) => {
      soundRef.current?.unlock();
      setHint(null);
      setSelectedCardIds((prev) => {
        if (prev.includes(cardId)) {
          return prev.filter((id) => id !== cardId);
        }
        // In DEFEND_OR_PASS, only 1 defense card is selected at a time
        if (gameState.phase === 'DEFEND_OR_PASS') {
          return [cardId];
        }
        // In ATTACK_OPEN, keep same-rank multi-select or switch to newly clicked rank
        if (gameState.phase === 'ATTACK_OPEN' && prev.length > 0) {
          const activeHand =
            gameState.players[gameState.activePlayerIndex]?.hand ?? [];
          const clicked = activeHand.find((c) => c.id === cardId);
          const first = activeHand.find((c) => c.id === prev[0]);
          if (clicked && first && clicked.rank !== first.rank) {
            return [cardId];
          }
        }
        return [...prev, cardId];
      });
    },
    [gameState],
  );

  const handleAttack = useCallback(() => {
    if (selectedCardIds.length === 0) return;

    if (gameState.isTutorial) {
      const next = applyTutorialPlayerAction(gameState, {
        type: 'ATTACK',
        cardIds: selectedCardIds,
      });
      if (!next) {
        setHint(getTanDoHint(gameState));
        return;
      }
      soundRef.current?.playCardAttack();
      setSelectedCardIds([]);
      setSelectedSlotIndex(null);
      setHint(null);
      setGameState(next);
      return;
    }

    const next = applyAttack(
      gameState,
      gameState.activePlayerIndex,
      selectedCardIds,
    );
    if (next !== gameState) {
      soundRef.current?.playCardAttack();
      setSelectedCardIds([]);
      setSelectedSlotIndex(null);
      setHint(null);
      setGameState(next);
    }
  }, [gameState, selectedCardIds]);

  const handleThrowIn = useCallback(() => {
    if (selectedCardIds.length === 0) return;

    if (gameState.isTutorial) {
      const next = applyTutorialPlayerAction(gameState, {
        type: 'THROW_IN',
        cardIds: selectedCardIds,
      });
      if (!next) {
        setHint(getTanDoHint(gameState));
        return;
      }
      soundRef.current?.playCardAttack();
      setSelectedCardIds([]);
      setSelectedSlotIndex(null);
      setHint(null);
      setGameState(next);
      return;
    }

    const next = applyThrowIn(
      gameState,
      gameState.activePlayerIndex,
      selectedCardIds,
    );
    if (next !== gameState) {
      soundRef.current?.playCardAttack();
      setSelectedCardIds([]);
      setSelectedSlotIndex(null);
      setHint(null);
      setGameState(next);
    }
  }, [gameState, selectedCardIds]);

  const handlePass = useCallback(() => {
    if (gameState.isTutorial) return;
    const next = applyPassThrowIn(gameState, gameState.activePlayerIndex);
    if (next !== gameState) {
      if (next.roundNumber > gameState.roundNumber) {
        soundRef.current?.playBoutClear();
      } else {
        soundRef.current?.playDefend();
      }
      setSelectedCardIds([]);
      setSelectedSlotIndex(null);
      setHint(null);
      setGameState(next);
    }
  }, [gameState]);

  const handleDefend = useCallback(
    (explicitSlotIndex?: number) => {
      if (selectedCardIds.length !== 1) return;
      const cardId = selectedCardIds[0];
      const player = gameState.players[gameState.activePlayerIndex];
      const card = player?.hand.find((c) => c.id === cardId);
      if (!card) return;

      const undefended = getUndefendedIndices(gameState.table);
      let slotIdx = explicitSlotIndex ?? selectedSlotIndex;
      if (
        slotIdx === null ||
        !gameState.table[slotIdx] ||
        gameState.table[slotIdx].defense !== null ||
        !canBeat(card, gameState.table[slotIdx].attack, gameState.trumpSuit)
      ) {
        slotIdx =
          undefended.find((idx) =>
            canBeat(card, gameState.table[idx].attack, gameState.trumpSuit),
          ) ?? null;
      }
      if (slotIdx === null) return;

      if (gameState.isTutorial) {
        const next = applyTutorialPlayerAction(gameState, {
          type: 'DEFEND',
          cardId,
          slotIndex: slotIdx,
        });
        if (!next) {
          setHint(getTanDoHint(gameState));
          return;
        }
        soundRef.current?.playDefend();
        setSelectedCardIds([]);
        setSelectedSlotIndex(null);
        setHint(null);
        setGameState(next);
        return;
      }

      const next = applyDefend(
        gameState,
        gameState.activePlayerIndex,
        cardId,
        slotIdx,
      );
      if (next !== gameState) {
        if (next.roundNumber > gameState.roundNumber) {
          soundRef.current?.playBoutClear();
        } else {
          soundRef.current?.playDefend();
        }
        setSelectedCardIds([]);
        setSelectedSlotIndex(null);
        setHint(null);
        setGameState(next);
      }
    },
    [gameState, selectedCardIds, selectedSlotIndex],
  );

  const handleTake = useCallback(() => {
    if (gameState.isTutorial) return;
    const next = applyTakeCards(gameState, gameState.activePlayerIndex);
    if (next !== gameState) {
      soundRef.current?.playTakeCards();
      setSelectedCardIds([]);
      setSelectedSlotIndex(null);
      setHint(null);
      setGameState(next);
    }
  }, [gameState]);

  const handleHint = useCallback(() => {
    const suggested = getTanDoHint(gameState);
    setHint(suggested);
    if (suggested && suggested.cardIds.length > 0) {
      setSelectedCardIds(suggested.cardIds);
      if (suggested.targetSlotIndex !== undefined) {
        setSelectedSlotIndex(suggested.targetSlotIndex);
      }
    }
  }, [gameState]);

  const handleSortHand = useCallback(() => {
    setGameState((prev) => {
      const targetIdx =
        prev.mode === 'pass-and-play' ? prev.activePlayerIndex : 0;
      const nextPlayers = prev.players.map((p, idx) =>
        idx === targetIdx
          ? { ...p, hand: sortHand(p.hand, prev.trumpSuit) }
          : p,
      );
      return { ...prev, players: nextPlayers };
    });
  }, []);

  const handleRevealHand = useCallback(() => {
    soundRef.current?.unlock();
    setSelectedCardIds([]);
    setSelectedSlotIndex(null);
    setHint(null);
    setGameState((prev) => revealHand(prev));
  }, []);

  // Safe keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        e.preventDefault();
      }

      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
        return;
      }

      if (!showHelp && (e.key === 'h' || e.key === 'H')) {
        handleHint();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showHelp, handleHint]);

  return (
    <div className="tan-shell game-surface">
      <Header
        playerCount={saveData.playerCount}
        mode={saveData.mode}
        trumpSuit={gameState.trumpSuit}
        nocCount={gameState.noc.length}
        wins={saveData.wins}
        score={saveData.score}
        isTutorial={gameState.isTutorial}
        muted={saveData.muted}
        onChangePlayerCount={handleChangePlayerCount}
        onChangeMode={handleChangeMode}
        onStartTutorial={handleStartTutorial}
        onOpenHelp={() => setShowHelp(true)}
        onToggleMute={handleToggleMute}
        onNewGame={() => startNewGame()}
      />

      <div className="board-wrapper">
        <TanDoBoard
          state={gameState}
          selectedCardIds={selectedCardIds}
          selectedSlotIndex={selectedSlotIndex}
          hint={hint}
          onToggleCard={handleToggleCard}
          onSelectSlot={setSelectedSlotIndex}
          onAttack={handleAttack}
          onThrowIn={handleThrowIn}
          onPass={handlePass}
          onDefend={handleDefend}
          onTake={handleTake}
          onHint={handleHint}
          onSortHand={handleSortHand}
          onRevealHand={handleRevealHand}
          onStartFullGame={() => startNewGame()}
        />

        <GameOverlay
          state={gameState}
          totalWins={saveData.wins}
          onPlayAgain={() => startNewGame()}
        />
      </div>

      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default App;
