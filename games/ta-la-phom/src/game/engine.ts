import { cardPoints, formatCardShort } from './constants';
import { createDeck, shuffleDeck } from './deck';
import {
  canDeclareU,
  canLayOffCard,
  isValidPhom,
  solveOptimalMelds,
  sortHandSmart,
} from './phom';
import type {
  Card,
  GameMode,
  PhomMeld,
  PlayerCount,
  PlayerResult,
  PlayerState,
  TaLaState,
  WinReason,
} from './types';

export interface NewGameConfig {
  playerCount: PlayerCount;
  mode: GameMode;
  dealerIndex?: number;
  rng?: () => number;
}

function makePlayerName(index: number, mode: GameMode): { nameVi: string; nameEn: string; isAi: boolean } {
  if (mode === 'vs-ai') {
    if (index === 0) {
      return { nameVi: 'Bạn', nameEn: 'You', isAi: false };
    }
    return { nameVi: `Máy ${index}`, nameEn: `AI ${index}`, isAi: true };
  }
  return {
    nameVi: `Người chơi ${index + 1}`,
    nameEn: `Player ${index + 1}`,
    isAi: false,
  };
}

export function createNewGame(config: NewGameConfig): TaLaState {
  const { playerCount, mode } = config;
  const dealerIndex = ((config.dealerIndex ?? 0) % playerCount + playerCount) % playerCount;
  const deck = shuffleDeck(createDeck(), config.rng);

  const players: PlayerState[] = [];
  let cursor = 0;

  for (let i = 0; i < playerCount; i++) {
    const dealCount = i === dealerIndex ? 10 : 9;
    const rawHand = deck.slice(cursor, cursor + dealCount);
    cursor += dealCount;
    const meta = makePlayerName(i, mode);
    players.push({
      index: i,
      nameVi: meta.nameVi,
      nameEn: meta.nameEn,
      isAi: meta.isAi,
      hand: sortHandSmart(rawHand),
      discards: [],
      eatenCardIds: [],
      melds: [],
      hasMelded: false,
    });
  }

  const nocPile = deck.slice(cursor);
  const dealer = players[dealerIndex];

  return {
    playerCount,
    mode,
    dealerIndex,
    currentPlayerIndex: dealerIndex,
    round: 1,
    turnsCompletedInRound: 0,
    phase: 'discard',
    players,
    nocPile,
    lastDiscard: null,
    lastActionText: `Ván mới! ${dealer.nameVi} (${dealer.nameEn}) đi đầu / New hand!`,
    results: null,
    winnerIndex: null,
    winReason: null,
    tutorialMode: false,
    tutorialStep: 1,
  };
}

export function getPreviousPlayerIndex(state: TaLaState): number {
  return (state.currentPlayerIndex - 1 + state.playerCount) % state.playerCount;
}

/**
 * Checks whether `playerIndex` can legally eat the immediately preceding player's last discard.
 */
export function canEatLastDiscard(
  state: TaLaState,
  playerIndex: number = state.currentPlayerIndex,
): boolean {
  if (state.phase !== 'draw_or_eat') return false;
  if (playerIndex !== state.currentPlayerIndex) return false;
  if (!state.lastDiscard) return false;
  if (state.lastDiscard.playerIndex !== getPreviousPlayerIndex(state)) return false;

  const player = state.players[playerIndex];
  const candidate = state.lastDiscard.card;
  if (player.hand.some((c) => c.id === candidate.id)) return false;

  const nextHand = [...player.hand, candidate];
  const nextRequired = [...player.eatenCardIds, candidate.id];
  const solved = solveOptimalMelds(nextHand, nextRequired, { maxEatenPerMeld: 1 });
  return solved.isPossible;
}

/**
 * Returns IDs of cards in `playerIndex`'s hand that can legally be discarded
 * without discarding an eaten card or breaking required Phỏms for eaten cards.
 */
export function getLegalDiscardIds(
  state: TaLaState,
  playerIndex: number = state.currentPlayerIndex,
): string[] {
  const player = state.players[playerIndex];
  const eatenSet = new Set(player.eatenCardIds);

  // If the player has already laid down melds in Round 4, eaten cards are already in player.melds
  if (player.hasMelded) {
    return player.hand.filter((c) => !eatenSet.has(c.id)).map((c) => c.id);
  }

  return player.hand
    .filter((candidate) => {
      if (eatenSet.has(candidate.id)) return false;
      if (player.eatenCardIds.length === 0) return true;
      const remaining = player.hand.filter((c) => c.id !== candidate.id);
      return solveOptimalMelds(remaining, player.eatenCardIds, { maxEatenPerMeld: 1 }).isPossible;
    })
    .map((c) => c.id);
}

export function drawFromNoc(state: TaLaState): TaLaState {
  if (state.phase !== 'draw_or_eat') return state;
  const player = state.players[state.currentPlayerIndex];

  if (state.nocPile.length === 0) {
    const nextPhase = state.round === 4 ? 'meld' : 'discard';
    return {
      ...state,
      phase: nextPhase,
      lastActionText: `${player.nameVi} (${player.nameEn}) — Nọc đã hết / Deck empty`,
    };
  }

  const drawn = state.nocPile[0];
  const remainingNoc = state.nocPile.slice(1);

  const nextPlayers = state.players.map((p, idx) =>
    idx === state.currentPlayerIndex
      ? { ...p, hand: sortHandSmart([...p.hand, drawn], p.eatenCardIds) }
      : p,
  );

  const nextPhase = state.round === 4 ? 'meld' : 'discard';

  return {
    ...state,
    players: nextPlayers,
    nocPile: remainingNoc,
    phase: nextPhase,
    lastActionText: `${player.nameVi} (${player.nameEn}) đã bốc 1 lá từ Nọc / drew from Nọc.`,
  };
}

export function eatLastDiscard(state: TaLaState): TaLaState {
  if (!canEatLastDiscard(state, state.currentPlayerIndex)) return state;
  const last = state.lastDiscard!;
  const prevIdx = last.playerIndex;
  const currIdx = state.currentPlayerIndex;
  const player = state.players[currIdx];

  const nextPlayers = state.players.map((p, idx) => {
    if (idx === prevIdx) {
      return {
        ...p,
        discards: p.discards.filter((c) => c.id !== last.card.id),
      };
    }
    if (idx === currIdx) {
      const nextEaten = [...p.eatenCardIds, last.card.id];
      const nextHand = sortHandSmart([...p.hand, last.card], nextEaten);
      return {
        ...p,
        hand: nextHand,
        eatenCardIds: nextEaten,
      };
    }
    return p;
  });

  const nextPhase = state.round === 4 ? 'meld' : 'discard';

  return {
    ...state,
    players: nextPlayers,
    lastDiscard: null,
    phase: nextPhase,
    lastActionText: `${player.nameVi} (${player.nameEn}) đã ăn ${formatCardShort(last.card)}! / ate ${formatCardShort(last.card)}!`,
  };
}

function toPhomMelds(melds: Card[][], ownerIndex: number, startIdx: number): PhomMeld[] {
  return melds.map((cards, offset) => {
    const type = isValidPhom(cards) ?? 'set';
    const sorted = [...cards].sort((a, b) => a.rank - b.rank);
    return {
      id: `meld-${ownerIndex}-${startIdx + offset}-${sorted.map((c) => c.id).join('_')}`,
      type,
      cards: sorted,
      ownerIndex,
    };
  });
}

export function meldOptimalPhoms(state: TaLaState): TaLaState {
  if (state.phase !== 'meld') return state;
  const currIdx = state.currentPlayerIndex;
  const player = state.players[currIdx];
  if (player.hasMelded) return state;

  const solved = solveOptimalMelds(player.hand, player.eatenCardIds, { maxEatenPerMeld: 1 });
  if (!solved.isPossible) return state;

  const newMelds = toPhomMelds(solved.melds, currIdx, player.melds.length);
  const nextPlayers = state.players.map((p, idx) =>
    idx === currIdx
      ? {
          ...p,
          hand: solved.deadwood,
          melds: [...p.melds, ...newMelds],
          hasMelded: true,
        }
      : p,
  );

  // Instant Ù if 0 deadwood cards remain after melding
  if (solved.deadwood.length === 0 && newMelds.length > 0) {
    return finishWithU(
      {
        ...state,
        players: nextPlayers,
      },
      currIdx,
    );
  }

  const meldDesc =
    newMelds.length > 0
      ? `${player.nameVi} (${player.nameEn}) hạ ${newMelds.length} Phỏm / melded ${newMelds.length} Phỏm.`
      : `${player.nameVi} (${player.nameEn}) không có Phỏm (Móm) / has no Phỏm.`;

  return {
    ...state,
    players: nextPlayers,
    lastActionText: meldDesc,
  };
}

export function layOffSingleCard(
  state: TaLaState,
  cardId: string,
  targetPlayerIndex: number,
  targetMeldId: string,
): TaLaState {
  if (state.phase !== 'meld') return state;
  const currIdx = state.currentPlayerIndex;
  const player = state.players[currIdx];

  // Must have at least 1 Phỏm of own to lay off (cannot lay off if Móm)
  if (!player.hasMelded || player.melds.length === 0) return state;

  const card = player.hand.find((c) => c.id === cardId);
  if (!card) return state;

  const targetPlayer = state.players[targetPlayerIndex];
  if (!targetPlayer) return state;
  const targetMeld = targetPlayer.melds.find((m) => m.id === targetMeldId);
  if (!targetMeld) return state;
  if (!canLayOffCard(card, targetMeld)) return state;

  const nextPlayers = state.players.map((p, idx) => {
    let updated = p;
    if (idx === currIdx) {
      updated = {
        ...updated,
        hand: updated.hand.filter((c) => c.id !== cardId),
      };
    }
    if (idx === targetPlayerIndex) {
      updated = {
        ...updated,
        melds: updated.melds.map((m) =>
          m.id === targetMeldId
            ? { ...m, cards: [...m.cards, card].sort((a, b) => a.rank - b.rank) }
            : m,
        ),
      };
    }
    return updated;
  });

  const nextCurr = nextPlayers[currIdx];
  if (nextCurr.hand.length === 0) {
    return finishWithU(
      {
        ...state,
        players: nextPlayers,
      },
      currIdx,
    );
  }

  return {
    ...state,
    players: nextPlayers,
    lastActionText: `${player.nameVi} (${player.nameEn}) gửi ${formatCardShort(card)} / laid off ${formatCardShort(card)}.`,
  };
}

export function proceedToDiscard(state: TaLaState): TaLaState {
  if (state.phase !== 'meld') return state;
  let working = state;
  const player = working.players[working.currentPlayerIndex];
  if (!player.hasMelded) {
    working = meldOptimalPhoms(working);
    if (working.phase === 'game_over') return working;
  }
  return {
    ...working,
    phase: 'discard',
  };
}

export function declareU(state: TaLaState): TaLaState {
  if (state.phase === 'game_over' || state.phase === 'draw_or_eat') return state;
  const currIdx = state.currentPlayerIndex;
  const player = state.players[currIdx];
  if (!canDeclareU(player.hand, player.eatenCardIds)) return state;

  const solved = solveOptimalMelds(player.hand, player.eatenCardIds, { maxEatenPerMeld: 1 });
  const newMelds = toPhomMelds(solved.melds, currIdx, player.melds.length);
  const extraDiscards = solved.deadwood;

  const nextPlayers = state.players.map((p, idx) =>
    idx === currIdx
      ? {
          ...p,
          hand: [],
          discards: [...p.discards, ...extraDiscards],
          melds: [...p.melds, ...newMelds],
          hasMelded: true,
        }
      : p,
  );

  return finishWithU(
    {
      ...state,
      players: nextPlayers,
    },
    currIdx,
  );
}

export function discardCard(state: TaLaState, cardId: string): TaLaState {
  if (state.phase !== 'discard') return state;
  const currIdx = state.currentPlayerIndex;
  const player = state.players[currIdx];
  const card = player.hand.find((c) => c.id === cardId);
  if (!card) return state;

  const legalIds = new Set(getLegalDiscardIds(state, currIdx));
  if (!legalIds.has(cardId)) return state;

  const remainingHand = player.hand.filter((c) => c.id !== cardId);
  const nextPlayers = state.players.map((p, idx) =>
    idx === currIdx
      ? {
          ...p,
          hand: remainingHand,
          discards: [...p.discards, card],
        }
      : p,
  );

  const nextLastDiscard = { card, playerIndex: currIdx };

  // If Round 4 and discarding the final card leaves 0 cards in hand with >=1 Phỏm -> Ù!
  if (state.round === 4 && player.hasMelded && player.melds.length > 0 && remainingHand.length === 0) {
    return finishWithU(
      {
        ...state,
        players: nextPlayers,
        lastDiscard: nextLastDiscard,
      },
      currIdx,
    );
  }

  const nextTurnsCompleted = state.turnsCompletedInRound + 1;

  // Check if Round 4 is finished for all players
  if (state.round === 4 && nextTurnsCompleted >= state.playerCount) {
    return finishByPoints({
      ...state,
      players: nextPlayers,
      lastDiscard: nextLastDiscard,
      turnsCompletedInRound: nextTurnsCompleted,
    });
  }

  const nextRound =
    nextTurnsCompleted >= state.playerCount && state.round < 4
      ? ((state.round + 1) as 1 | 2 | 3 | 4)
      : state.round;
  const resetTurns = nextTurnsCompleted >= state.playerCount ? 0 : nextTurnsCompleted;
  const nextPlayerIdx = (currIdx + 1) % state.playerCount;

  return {
    ...state,
    players: nextPlayers,
    lastDiscard: nextLastDiscard,
    round: nextRound,
    turnsCompletedInRound: resetTurns,
    currentPlayerIndex: nextPlayerIdx,
    phase: 'draw_or_eat',
    lastActionText: `${player.nameVi} (${player.nameEn}) đánh ${formatCardShort(card)} / discarded ${formatCardShort(card)}.`,
  };
}

export function sortActivePlayerHand(state: TaLaState): TaLaState {
  const currIdx = state.currentPlayerIndex;
  const nextPlayers = state.players.map((p, idx) =>
    idx === currIdx
      ? { ...p, hand: sortHandSmart(p.hand, p.eatenCardIds) }
      : p,
  );
  return {
    ...state,
    players: nextPlayers,
  };
}

function resolvePlayerSummary(player: PlayerState): {
  melds: PhomMeld[];
  deadwood: Card[];
  deadwoodPoints: number;
  isMom: boolean;
} {
  if (player.hasMelded) {
    const deadwoodPoints = player.hand.reduce((sum, c) => sum + cardPoints(c), 0);
    return {
      melds: player.melds,
      deadwood: player.hand,
      deadwoodPoints,
      isMom: player.melds.length === 0,
    };
  }
  const solved = solveOptimalMelds(player.hand, player.eatenCardIds, { maxEatenPerMeld: 1 });
  const melds = toPhomMelds(solved.melds, player.index, player.melds.length);
  return {
    melds,
    deadwood: solved.deadwood,
    deadwoodPoints: solved.deadwoodPoints,
    isMom: melds.length === 0,
  };
}

function finishWithU(state: TaLaState, winnerIndex: number): TaLaState {
  const winner = state.players[winnerIndex];
  const entries = state.players.map((p) => {
    if (p.index === winnerIndex) {
      return {
        player: p,
        melds: p.melds,
        deadwood: [] as Card[],
        deadwoodPoints: 0,
        isMom: false,
        isU: true,
      };
    }
    const summary = resolvePlayerSummary(p);
    return {
      player: p,
      ...summary,
      isU: false,
    };
  });

  const sorted = [...entries].sort((a, b) => {
    if (a.isU !== b.isU) return a.isU ? -1 : 1;
    if (a.isMom !== b.isMom) return a.isMom ? 1 : -1;
    return a.deadwoodPoints - b.deadwoodPoints;
  });

  const results: PlayerResult[] = sorted.map((item, idx) => ({
    playerIndex: item.player.index,
    nameVi: item.player.nameVi,
    nameEn: item.player.nameEn,
    isAi: item.player.isAi,
    rank: idx + 1,
    melds: item.melds,
    deadwood: item.deadwood,
    deadwoodPoints: item.deadwoodPoints,
    isMom: item.isMom,
    isU: item.isU,
    matchPointsDelta: item.isU ? 200 + 25 * (state.playerCount - 1) : -30,
  }));

  return buildFinalState(state, results, winnerIndex, 'U', `${winner.nameVi} (${winner.nameEn}) Ù! / Wins with Ù!`);
}

function finishByPoints(state: TaLaState): TaLaState {
  const entries = state.players.map((p) => ({
    player: p,
    ...resolvePlayerSummary(p),
    isU: false,
    turnOrder: (p.index - state.dealerIndex + state.playerCount) % state.playerCount,
  }));

  const sorted = [...entries].sort((a, b) => {
    if (a.isMom !== b.isMom) return a.isMom ? 1 : -1;
    if (a.deadwoodPoints !== b.deadwoodPoints) return a.deadwoodPoints - b.deadwoodPoints;
    return a.turnOrder - b.turnOrder;
  });

  const winner = sorted[0];
  const avgOppDeadwood =
    sorted.slice(1).reduce((s, e) => s + e.deadwoodPoints, 0) / Math.max(1, sorted.length - 1);

  const results: PlayerResult[] = sorted.map((item, idx) => {
    let delta = 0;
    if (idx === 0) {
      delta = Math.max(100, Math.round(100 + Math.max(0, avgOppDeadwood - item.deadwoodPoints) * 2));
    } else if (item.isMom) {
      delta = -50;
    } else {
      delta = -15 * idx;
    }

    return {
      playerIndex: item.player.index,
      nameVi: item.player.nameVi,
      nameEn: item.player.nameEn,
      isAi: item.player.isAi,
      rank: idx + 1,
      melds: item.melds,
      deadwood: item.deadwood,
      deadwoodPoints: item.deadwoodPoints,
      isMom: item.isMom,
      isU: false,
      matchPointsDelta: delta,
    };
  });

  return buildFinalState(
    state,
    results,
    winner.player.index,
    'points',
    `${winner.player.nameVi} (${winner.player.nameEn}) về Nhất (${winner.deadwoodPoints} điểm)! / Wins Round 4!`,
  );
}

function buildFinalState(
  state: TaLaState,
  results: PlayerResult[],
  winnerIndex: number,
  winReason: WinReason,
  text: string,
): TaLaState {
  const byIndex = new Map(results.map((r) => [r.playerIndex, r]));
  const revealedPlayers = state.players.map((p) => {
    const res = byIndex.get(p.index)!;
    return {
      ...p,
      melds: res.melds,
      hand: res.deadwood,
      hasMelded: true,
    };
  });

  return {
    ...state,
    players: revealedPlayers,
    phase: 'game_over',
    results,
    winnerIndex,
    winReason,
    lastActionText: text,
  };
}
