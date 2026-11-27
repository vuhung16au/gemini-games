import {
  INITIAL_HAND_SIZE,
  MAX_TABLE_SLOTS,
  RANKS,
  SUITS,
  SUIT_INFO,
} from './constants';
import type {
  Card,
  GameMode,
  Player,
  PlayerCount,
  Rank,
  Suit,
  TableSlot,
  TanDoState,
} from './types';

const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,
  clubs: 1,
  diamonds: 2,
  hearts: 3,
};

export function getRankLabel(rank: Rank): string {
  switch (rank) {
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    case 14:
      return 'A';
    default:
      return String(rank);
  }
}

export function isRedSuit(suit: Suit): boolean {
  return SUIT_INFO[suit].isRed;
}

export function formatCardShort(card: Card): string {
  return `${getRankLabel(card.rank)}${SUIT_INFO[card.suit].symbol}`;
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
      });
    }
  }
  return deck;
}

export function shuffleCards(
  cards: readonly Card[],
  rng: () => number = Math.random,
): Card[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sortHand(cards: readonly Card[], trumpSuit: Suit): Card[] {
  return [...cards].sort((a, b) => {
    const aTrump = a.suit === trumpSuit ? 1 : 0;
    const bTrump = b.suit === trumpSuit ? 1 : 0;
    if (aTrump !== bTrump) return aTrump - bTrump;
    if (a.rank !== b.rank) return a.rank - b.rank;
    return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
  });
}

export function canBeat(defense: Card, attack: Card, trumpSuit: Suit): boolean {
  if (defense.suit === attack.suit) {
    return defense.rank > attack.rank;
  }
  if (defense.suit === trumpSuit && attack.suit !== trumpSuit) {
    return true;
  }
  return false;
}

export function getTableRanks(table: readonly TableSlot[]): Set<Rank> {
  const ranks = new Set<Rank>();
  for (const slot of table) {
    ranks.add(slot.attack.rank);
    if (slot.defense) {
      ranks.add(slot.defense.rank);
    }
  }
  return ranks;
}

export function getUndefendedIndices(table: readonly TableSlot[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < table.length; i++) {
    if (!table[i].defense) {
      indices.push(i);
    }
  }
  return indices;
}

export function getMaxAddableCards(state: TanDoState): number {
  const defender = state.players[state.defenderIndex];
  const undefendedCount = getUndefendedIndices(state.table).length;
  const slotCap = MAX_TABLE_SLOTS - state.table.length;
  const handCap = defender.hand.length - undefendedCount;
  return Math.max(0, Math.min(slotCap, handCap));
}

function buildPlayers(
  playerCount: PlayerCount,
  mode: GameMode,
  hands: Card[][],
  trumpSuit: Suit,
): Player[] {
  return Array.from({ length: playerCount }, (_, index) => {
    const isAI = mode === 'ai' && index > 0;
    return {
      index,
      nameVi: isAI ? `Máy ${index + 1}` : index === 0 ? 'Bạn (P1)' : `Người chơi ${index + 1}`,
      nameEn: isAI ? `AI ${index + 1}` : index === 0 ? 'Player 1' : `Player ${index + 1}`,
      isAI,
      hand: sortHand(hands[index], trumpSuit),
    };
  });
}

function findInitialAttacker(players: readonly Player[], trumpSuit: Suit): number {
  let bestPlayer = 0;
  let lowestTrumpRank = Infinity;

  for (const player of players) {
    for (const card of player.hand) {
      if (card.suit === trumpSuit && card.rank < lowestTrumpRank) {
        lowestTrumpRank = card.rank;
        bestPlayer = player.index;
      }
    }
  }

  return bestPlayer;
}

export function createNewGame(
  playerCount: PlayerCount,
  mode: GameMode,
  rng: () => number = Math.random,
): TanDoState {
  const shuffled = shuffleCards(createDeck(), rng);
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);

  for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
    for (let p = 0; p < playerCount; p++) {
      const card = shuffled.shift();
      if (card) hands[p].push(card);
    }
  }

  const noc = shuffled;
  const trumpCard = noc[noc.length - 1];
  const trumpSuit = trumpCard.suit;
  const players = buildPlayers(playerCount, mode, hands, trumpSuit);
  const attackerIndex = findInitialAttacker(players, trumpSuit);
  const defenderIndex = (attackerIndex + 1) % playerCount;

  const attacker = players[attackerIndex];

  return {
    playerCount,
    mode,
    status: 'PLAYING',
    phase: 'ATTACK_OPEN',
    players,
    noc,
    trumpCard,
    trumpSuit,
    trumpCardInNoc: noc.length > 0,
    table: [],
    attackerIndex,
    defenderIndex,
    activePlayerIndex: attackerIndex,
    passedPlayers: [],
    handoffPending: mode === 'pass-and-play',
    roundNumber: 1,
    discardCount: 0,
    winnerIndex: null,
    lastEventVi: `Ván mới bắt đầu! Chất Trưởng là ${SUIT_INFO[trumpSuit].nameVi} (${SUIT_INFO[trumpSuit].symbol}). ${attacker.nameVi} đi tấn trước.`,
    lastEventEn: `New match! Trump suit is ${SUIT_INFO[trumpSuit].nameEn} (${SUIT_INFO[trumpSuit].symbol}). ${attacker.nameEn} attacks first.`,
    isTutorial: false,
    tutorialStep: 0,
  };
}

export function revealHand(state: TanDoState): TanDoState {
  if (!state.handoffPending) return state;
  return {
    ...state,
    handoffPending: false,
  };
}

export function canAttackWithSelection(
  state: TanDoState,
  playerIndex: number,
  cardIds: readonly string[],
): boolean {
  if (state.status !== 'PLAYING') return false;
  if (state.phase !== 'ATTACK_OPEN') return false;
  if (state.activePlayerIndex !== playerIndex) return false;
  if (cardIds.length === 0) return false;

  const maxCards = getMaxAddableCards(state);
  if (cardIds.length > maxCards) return false;

  const player = state.players[playerIndex];
  const uniqueIds = new Set(cardIds);
  if (uniqueIds.size !== cardIds.length) return false;

  const cards = cardIds
    .map((id) => player.hand.find((c) => c.id === id))
    .filter((c): c is Card => Boolean(c));
  if (cards.length !== cardIds.length) return false;

  const targetRank = cards[0].rank;
  return cards.every((c) => c.rank === targetRank);
}

export function canThrowInWithSelection(
  state: TanDoState,
  playerIndex: number,
  cardIds: readonly string[],
): boolean {
  if (state.status !== 'PLAYING') return false;
  if (state.phase !== 'THROW_IN') return false;
  if (state.activePlayerIndex !== playerIndex) return false;
  if (playerIndex === state.defenderIndex) return false;
  if (cardIds.length === 0) return false;

  const maxCards = getMaxAddableCards(state);
  if (cardIds.length > maxCards) return false;

  const player = state.players[playerIndex];
  const uniqueIds = new Set(cardIds);
  if (uniqueIds.size !== cardIds.length) return false;

  const tableRanks = getTableRanks(state.table);
  for (const id of cardIds) {
    const card = player.hand.find((c) => c.id === id);
    if (!card || !tableRanks.has(card.rank)) {
      return false;
    }
  }

  return true;
}

export function getPlayableCardIds(
  state: TanDoState,
  playerIndex: number,
): Set<string> {
  const playable = new Set<string>();
  if (state.status !== 'PLAYING') return playable;
  if (state.activePlayerIndex !== playerIndex) return playable;

  const player = state.players[playerIndex];
  if (state.phase === 'ATTACK_OPEN') {
    if (getMaxAddableCards(state) > 0) {
      for (const c of player.hand) playable.add(c.id);
    }
    return playable;
  }

  if (state.phase === 'THROW_IN') {
    if (getMaxAddableCards(state) <= 0) return playable;
    const tableRanks = getTableRanks(state.table);
    for (const c of player.hand) {
      if (tableRanks.has(c.rank)) {
        playable.add(c.id);
      }
    }
    return playable;
  }

  if (state.phase === 'DEFEND_OR_PASS') {
    const undefended = getUndefendedIndices(state.table);
    for (const c of player.hand) {
      for (const idx of undefended) {
        if (canBeat(c, state.table[idx].attack, state.trumpSuit)) {
          playable.add(c.id);
          break;
        }
      }
    }
    return playable;
  }

  return playable;
}

function findNextThrowInPlayer(
  state: TanDoState,
  startFromIndex: number,
  passedSet: ReadonlySet<number>,
): number | null {
  for (let offset = 0; offset < state.playerCount; offset++) {
    const idx = (startFromIndex + offset) % state.playerCount;
    if (idx === state.defenderIndex) continue;
    if (passedSet.has(idx)) continue;
    if (state.players[idx].hand.length === 0) continue;
    return idx;
  }
  return null;
}

function getRefillOrder(state: TanDoState): number[] {
  const order: number[] = [];
  order.push(state.attackerIndex);
  for (let offset = 1; offset < state.playerCount; offset++) {
    const idx = (state.attackerIndex + offset) % state.playerCount;
    if (idx !== state.defenderIndex) {
      order.push(idx);
    }
  }
  order.push(state.defenderIndex);
  return order;
}

function resolveBout(
  state: TanDoState,
  outcome: 'CLEARED' | 'TAKEN',
  prevActivePlayer: number,
  eventVi: string,
  eventEn: string,
): TanDoState {
  const tableCardsCount = state.table.reduce(
    (sum, slot) => sum + 1 + (slot.defense ? 1 : 0),
    0,
  );
  const nextNoc = [...state.noc];
  const nextPlayers = state.players.map((p) => ({
    ...p,
    hand: [...p.hand],
  }));

  for (const playerIdx of getRefillOrder(state)) {
    const p = nextPlayers[playerIdx];
    while (p.hand.length < INITIAL_HAND_SIZE && nextNoc.length > 0) {
      const drawn = nextNoc.shift();
      if (drawn) p.hand.push(drawn);
    }
    p.hand = sortHand(p.hand, state.trumpSuit);
  }

  const nextTrumpCardInNoc = nextNoc.length > 0;

  if (nextNoc.length === 0) {
    for (const playerIdx of getRefillOrder(state)) {
      if (nextPlayers[playerIdx].hand.length === 0) {
        const winner = nextPlayers[playerIdx];
        return {
          ...state,
          players: nextPlayers,
          noc: nextNoc,
          trumpCardInNoc: false,
          table: [],
          passedPlayers: [],
          status: 'WON',
          winnerIndex: winner.index,
          handoffPending: false,
          discardCount:
            state.discardCount + (outcome === 'CLEARED' ? tableCardsCount : 0),
          lastEventVi: `${winner.nameVi} đã hết bài sau khi hết Nọc và giành chiến thắng!`,
          lastEventEn: `${winner.nameEn} emptied their hand after Nọc ran out and wins!`,
        };
      }
    }
  }

  const nextAttacker =
    outcome === 'CLEARED'
      ? state.defenderIndex
      : (state.defenderIndex + 1) % state.playerCount;
  const nextDefender = (nextAttacker + 1) % state.playerCount;

  const shouldHandoff =
    state.mode === 'pass-and-play' &&
    nextAttacker !== prevActivePlayer &&
    !nextPlayers[nextAttacker].isAI;

  return {
    ...state,
    players: nextPlayers,
    noc: nextNoc,
    trumpCardInNoc: nextTrumpCardInNoc,
    table: [],
    passedPlayers: [],
    phase: 'ATTACK_OPEN',
    attackerIndex: nextAttacker,
    defenderIndex: nextDefender,
    activePlayerIndex: nextAttacker,
    handoffPending: shouldHandoff,
    roundNumber: state.roundNumber + 1,
    discardCount:
      state.discardCount + (outcome === 'CLEARED' ? tableCardsCount : 0),
    lastEventVi: eventVi,
    lastEventEn: eventEn,
  };
}

export function applyAttack(
  state: TanDoState,
  playerIndex: number,
  cardIds: readonly string[],
): TanDoState {
  if (!canAttackWithSelection(state, playerIndex, cardIds)) return state;

  const prevActive = state.activePlayerIndex;
  const idSet = new Set(cardIds);
  const attacker = state.players[playerIndex];
  const playedCards = attacker.hand.filter((c) => idSet.has(c.id));
  const remainingHand = attacker.hand.filter((c) => !idSet.has(c.id));

  const nextPlayers = state.players.map((p, idx) =>
    idx === playerIndex ? { ...p, hand: remainingHand } : p,
  );

  const newSlots: TableSlot[] = playedCards.map((card) => ({
    attack: card,
    defense: null,
    attackedBy: playerIndex,
  }));

  const cardText = playedCards.map(formatCardShort).join(' ');
  const nextActive = state.defenderIndex;

  return {
    ...state,
    players: nextPlayers,
    table: [...state.table, ...newSlots],
    phase: 'DEFEND_OR_PASS',
    activePlayerIndex: nextActive,
    passedPlayers: [],
    handoffPending:
      state.mode === 'pass-and-play' &&
      nextActive !== prevActive &&
      !nextPlayers[nextActive].isAI,
    lastEventVi: `${attacker.nameVi} tấn ${cardText}.`,
    lastEventEn: `${attacker.nameEn} attacked with ${cardText}.`,
  };
}

export function applyDefend(
  state: TanDoState,
  playerIndex: number,
  cardId: string,
  slotIndex: number,
): TanDoState {
  if (state.status !== 'PLAYING') return state;
  if (state.phase !== 'DEFEND_OR_PASS') return state;
  if (state.activePlayerIndex !== playerIndex) return state;

  const slot = state.table[slotIndex];
  if (!slot || slot.defense !== null) return state;

  const defender = state.players[playerIndex];
  const card = defender.hand.find((c) => c.id === cardId);
  if (!card || !canBeat(card, slot.attack, state.trumpSuit)) return state;

  const nextPlayers = state.players.map((p, idx) =>
    idx === playerIndex
      ? { ...p, hand: p.hand.filter((c) => c.id !== cardId) }
      : p,
  );

  const nextTable = state.table.map((s, idx) =>
    idx === slotIndex ? { ...s, defense: card } : s,
  );

  const eventVi = `${defender.nameVi} đỡ ${formatCardShort(slot.attack)} bằng ${formatCardShort(card)}.`;
  const eventEn = `${defender.nameEn} defended ${formatCardShort(slot.attack)} with ${formatCardShort(card)}.`;

  const intermediateState: TanDoState = {
    ...state,
    players: nextPlayers,
    table: nextTable,
    lastEventVi: eventVi,
    lastEventEn: eventEn,
  };

  const remainingUndefended = getUndefendedIndices(nextTable).length;
  if (remainingUndefended > 0) {
    return intermediateState;
  }

  // All attack cards on table are now defended.
  // Check if anyone emptied their hand when Nọc is empty, or if no more throw-ins are possible.
  const emptyAfterNoc =
    intermediateState.noc.length === 0 &&
    nextPlayers.some((p) => p.hand.length === 0);
  const maxAddable = getMaxAddableCards(intermediateState);
  const nextThrower = findNextThrowInPlayer(
    intermediateState,
    intermediateState.attackerIndex,
    new Set(),
  );

  if (emptyAfterNoc || maxAddable <= 0 || nextThrower === null) {
    return resolveBout(
      intermediateState,
      'CLEARED',
      playerIndex,
      `${defender.nameVi} đỡ thành công toàn bộ! Lượt chuyển sang ${nextPlayers[state.defenderIndex].nameVi}.`,
      `${defender.nameEn} defended all cards! Turn passes to ${nextPlayers[state.defenderIndex].nameEn}.`,
    );
  }

  return {
    ...intermediateState,
    phase: 'THROW_IN',
    activePlayerIndex: nextThrower,
    passedPlayers: [],
    handoffPending:
      state.mode === 'pass-and-play' &&
      nextThrower !== playerIndex &&
      !nextPlayers[nextThrower].isAI,
  };
}

export function applyThrowIn(
  state: TanDoState,
  playerIndex: number,
  cardIds: readonly string[],
): TanDoState {
  if (!canThrowInWithSelection(state, playerIndex, cardIds)) return state;

  const prevActive = state.activePlayerIndex;
  const idSet = new Set(cardIds);
  const thrower = state.players[playerIndex];
  const playedCards = thrower.hand.filter((c) => idSet.has(c.id));
  const remainingHand = thrower.hand.filter((c) => !idSet.has(c.id));

  const nextPlayers = state.players.map((p, idx) =>
    idx === playerIndex ? { ...p, hand: remainingHand } : p,
  );

  const newSlots: TableSlot[] = playedCards.map((card) => ({
    attack: card,
    defense: null,
    attackedBy: playerIndex,
  }));

  const cardText = playedCards.map(formatCardShort).join(' ');
  const nextActive = state.defenderIndex;

  return {
    ...state,
    players: nextPlayers,
    table: [...state.table, ...newSlots],
    phase: 'DEFEND_OR_PASS',
    activePlayerIndex: nextActive,
    passedPlayers: [],
    handoffPending:
      state.mode === 'pass-and-play' &&
      nextActive !== prevActive &&
      !nextPlayers[nextActive].isAI,
    lastEventVi: `${thrower.nameVi} tấn thêm ${cardText}.`,
    lastEventEn: `${thrower.nameEn} threw in ${cardText}.`,
  };
}

export function applyPassThrowIn(
  state: TanDoState,
  playerIndex: number,
): TanDoState {
  if (state.status !== 'PLAYING') return state;
  if (state.phase !== 'THROW_IN') return state;
  if (state.activePlayerIndex !== playerIndex) return state;

  const nextPassed = state.passedPlayers.includes(playerIndex)
    ? state.passedPlayers
    : [...state.passedPlayers, playerIndex];
  const passedSet = new Set(nextPassed);

  const nextThrower = findNextThrowInPlayer(
    state,
    (playerIndex + 1) % state.playerCount,
    passedSet,
  );

  if (nextThrower !== null) {
    const passer = state.players[playerIndex];
    return {
      ...state,
      passedPlayers: nextPassed,
      activePlayerIndex: nextThrower,
      handoffPending:
        state.mode === 'pass-and-play' &&
        nextThrower !== playerIndex &&
        !state.players[nextThrower].isAI,
      lastEventVi: `${passer.nameVi} thôi tấn.`,
      lastEventEn: `${passer.nameEn} passed.`,
    };
  }

  const defender = state.players[state.defenderIndex];
  return resolveBout(
    state,
    'CLEARED',
    playerIndex,
    `${defender.nameVi} đỡ sạch bàn! ${defender.nameVi} lên tấn.`,
    `${defender.nameEn} cleared the table and attacks next!`,
  );
}

export function applyTakeCards(
  state: TanDoState,
  playerIndex: number,
): TanDoState {
  if (state.status !== 'PLAYING') return state;
  if (state.phase !== 'DEFEND_OR_PASS') return state;
  if (state.activePlayerIndex !== playerIndex) return state;

  const defender = state.players[playerIndex];
  const takenCards: Card[] = [];
  for (const slot of state.table) {
    takenCards.push(slot.attack);
    if (slot.defense) {
      takenCards.push(slot.defense);
    }
  }

  const nextPlayers = state.players.map((p, idx) =>
    idx === playerIndex
      ? { ...p, hand: sortHand([...p.hand, ...takenCards], state.trumpSuit) }
      : p,
  );

  const nextAttacker = (state.defenderIndex + 1) % state.playerCount;
  const nextState: TanDoState = {
    ...state,
    players: nextPlayers,
  };

  return resolveBout(
    nextState,
    'TAKEN',
    playerIndex,
    `${defender.nameVi} ôm ${takenCards.length} lá bài và bị mất lượt! ${nextPlayers[nextAttacker].nameVi} tấn tiếp.`,
    `${defender.nameEn} took ${takenCards.length} cards and skips turn! ${nextPlayers[nextAttacker].nameEn} attacks next.`,
  );
}

export function calculateWinScore(state: TanDoState): number {
  if (state.winnerIndex === null) return 0;
  const opponentCards = state.players.reduce(
    (sum, p) => (p.index === state.winnerIndex ? sum : sum + p.hand.length),
    0,
  );
  return 100 + opponentCards * 15;
}
