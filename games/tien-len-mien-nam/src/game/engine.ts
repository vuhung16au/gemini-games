import { CARDS_PER_PLAYER, SUIT_ORDER } from './constants';
import {
  canBeat,
  cardValue,
  checkToiTrang,
  compareCards,
  createDeck,
  detectCombo,
  formatCardLabel,
  formatComboLabel,
  generateAllCombos,
  isBombCombo,
  isCutPlay,
  shuffleDeck,
  sortCardsByRank,
} from './combos';
import type {
  Card,
  Combo,
  GameMode,
  GameState,
  Player,
  PlayerCount,
  PlayerPenaltySummary,
  RoundResult,
  SortMode,
  ToiTrangReason,
} from './types';

function makePlayerName(index: number, mode: GameMode): { vi: string; en: string; isAi: boolean } {
  if (mode === 'vs-ai') {
    if (index === 0) {
      return { vi: 'Bạn', en: 'You', isAi: false };
    }
    return { vi: `Máy ${index}`, en: `AI ${index}`, isAi: true };
  }
  return { vi: `Người chơi ${index + 1}`, en: `Player ${index + 1}`, isAi: false };
}

export function sortHand(hand: readonly Card[], sortMode: SortMode): Card[] {
  if (sortMode === 'rank') {
    return sortCardsByRank(hand);
  }
  if (sortMode === 'suit') {
    return [...hand].sort((a, b) => {
      const s = SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
      return s !== 0 ? s : a.rank - b.rank;
    });
  }
  // 'combo': group pairs/triples/quads together, singles and straights sorted cleanly
  const counts = new Map<number, number>();
  for (const c of hand) {
    counts.set(c.rank, (counts.get(c.rank) ?? 0) + 1);
  }
  return [...hand].sort((a, b) => {
    const groupDiff = (counts.get(b.rank) ?? 1) - (counts.get(a.rank) ?? 1);
    if (groupDiff !== 0) return groupDiff;
    return compareCards(a, b);
  });
}

function findLowestCardOwner(players: readonly Player[]): {
  playerIndex: number;
  card: Card;
} {
  let bestPlayer = 0;
  let bestCard = players[0].hand[0];

  for (let i = 0; i < players.length; i++) {
    for (const card of players[i].hand) {
      if (cardValue(card) < cardValue(bestCard)) {
        bestCard = card;
        bestPlayer = i;
      }
    }
  }
  return { playerIndex: bestPlayer, card: bestCard };
}

function formatToiTrangText(reason: ToiTrangReason): string {
  switch (reason) {
    case 'DRAGON_STRAIGHT':
      return 'Sảnh Rồng (3→A) / Dragon Straight';
    case 'SIX_PAIRS':
      return '6 Đôi / Six Pairs';
    case 'FOUR_TWOS':
      return 'Tứ quý 2 / Four 2s';
  }
}

export function computeHandPenalties(hand: readonly Card[]): {
  heoPenalty: number;
  bombPenalty: number;
} {
  let heoPenalty = 0;
  for (const card of hand) {
    if (card.rank === 15) {
      heoPenalty += card.suit === 'hearts' || card.suit === 'diamonds' ? 6 : 3;
    }
  }

  let bombPenalty = 0;
  const combos = generateAllCombos(hand);
  if (combos.some((c) => c.type === 'FOUR_PAIRS')) {
    bombPenalty = 10;
  } else if (combos.some((c) => c.type === 'FOUR_OF_A_KIND')) {
    bombPenalty = 8;
  } else if (combos.some((c) => c.type === 'THREE_PAIRS')) {
    bombPenalty = 6;
  }

  return { heoPenalty, bombPenalty };
}

function buildRoundResult(
  players: readonly Player[],
  winnerId: number,
  reason: 'OUT_OF_CARDS' | 'TOI_TRANG',
  toiTrangReason?: ToiTrangReason,
): RoundResult {
  const penalties: PlayerPenaltySummary[] = [];
  let totalPot = 0;

  for (const player of players) {
    if (player.id === winnerId) continue;

    if (reason === 'TOI_TRANG') {
      const delta = -18;
      totalPot += 18;
      penalties.push({
        playerId: player.id,
        nameVi: player.nameVi,
        nameEn: player.nameEn,
        remainingCards: player.hand.length,
        heoPenalty: 0,
        bombPenalty: 0,
        congPenalty: false,
        totalDelta: delta,
      });
      continue;
    }

    const remainingCards = player.hand.length;
    const congPenalty = player.cardsPlayedCount === 0;
    const { heoPenalty, bombPenalty } = computeHandPenalties(player.hand);
    const baseLoss = remainingCards * (congPenalty ? 2 : 1);
    const loss = baseLoss + heoPenalty + bombPenalty;
    totalPot += loss;

    penalties.push({
      playerId: player.id,
      nameVi: player.nameVi,
      nameEn: player.nameEn,
      remainingCards,
      heoPenalty,
      bombPenalty,
      congPenalty,
      totalDelta: -loss,
    });
  }

  const winner = players[winnerId];
  return {
    winnerId,
    reason,
    toiTrangReason,
    winningCards: reason === 'TOI_TRANG' ? [...winner.hand] : undefined,
    pointsEarned: Math.max(totalPot, 10),
    penalties,
  };
}

export interface CreateGameOptions {
  playerCount?: PlayerCount;
  mode?: GameMode;
  roundNumber?: number;
  previousPlayers?: Player[];
  previousWinnerId?: number | null;
  sortMode?: SortMode;
  rng?: () => number;
  customHands?: Card[][];
}

export function createNewGame(options: CreateGameOptions = {}): GameState {
  const playerCount: PlayerCount = options.playerCount ?? 4;
  const mode: GameMode = options.mode ?? 'vs-ai';
  const roundNumber = options.roundNumber ?? 1;
  const sortMode: SortMode = options.sortMode ?? 'rank';
  const rng = options.rng ?? Math.random;

  const deck = shuffleDeck(createDeck(), rng);
  const players: Player[] = [];

  for (let i = 0; i < playerCount; i++) {
    const info = makePlayerName(i, mode);
    const rawHand = options.customHands
      ? [...options.customHands[i]]
      : deck.slice(i * CARDS_PER_PLAYER, (i + 1) * CARDS_PER_PLAYER);

    const prev = options.previousPlayers?.[i];
    players.push({
      id: i,
      nameVi: info.vi,
      nameEn: info.en,
      isAi: info.isAi,
      hand: sortHand(rawHand, sortMode),
      passedThisTrick: false,
      cardsPlayedCount: 0,
      score: prev?.score ?? 0,
      wins: prev?.wins ?? 0,
    });
  }

  // Determine starting player and whether lowest card (3♠) is required
  let startingPlayer: number;
  let mustIncludeCardId: string | null = null;
  let initialBanner: string;

  if (roundNumber === 1 || options.previousWinnerId == null) {
    const lowest = findLowestCardOwner(players);
    startingPlayer = lowest.playerIndex;
    mustIncludeCardId = lowest.card.id;
    initialBanner = `Ván mở màn: ${players[startingPlayer].nameVi} (${players[startingPlayer].nameEn}) đi trước với ${formatCardLabel(lowest.card)}!`;
  } else {
    startingPlayer = options.previousWinnerId % playerCount;
    initialBanner = `${players[startingPlayer].nameVi} / ${players[startingPlayer].nameEn} thắng ván trước nên đi trước!`;
  }

  // Check Tới Trắng starting from startingPlayer clockwise
  for (let offset = 0; offset < playerCount; offset++) {
    const idx = (startingPlayer + offset) % playerCount;
    const reason = checkToiTrang(players[idx].hand);
    if (reason) {
      const roundResult = buildRoundResult(players, idx, 'TOI_TRANG', reason);
      const updatedPlayers = players.map((p) => {
        if (p.id === idx) {
          return {
            ...p,
            score: p.score + roundResult.pointsEarned,
            wins: p.wins + 1,
          };
        }
        const pen = roundResult.penalties.find((x) => x.playerId === p.id);
        return {
          ...p,
          score: p.score + (pen?.totalDelta ?? 0),
        };
      });

      return {
        playerCount,
        mode,
        roundNumber,
        players: updatedPlayers,
        currentTurn: idx,
        trickLeader: idx,
        currentCombo: null,
        lastPlay: null,
        tableHistory: [],
        mustIncludeCardId: null,
        selectedCardIds: [],
        sortMode,
        privacyCurtain: false,
        status: 'ROUND_OVER',
        roundResult,
        bannerMessage: `Tới Trắng! ${players[idx].nameVi} thắng ngay: ${formatToiTrangText(reason)}`,
        hintedCardIds: [],
        cutEventCount: 0,
        tutorial: { active: false, step: 1, hintCardIds: [], message: '' },
      };
    }
  }

  return {
    playerCount,
    mode,
    roundNumber,
    players,
    currentTurn: startingPlayer,
    trickLeader: startingPlayer,
    currentCombo: null,
    lastPlay: null,
    tableHistory: [],
    mustIncludeCardId,
    selectedCardIds: [],
    sortMode,
    privacyCurtain: mode === 'pass-and-play',
    status: 'PLAYING',
    roundResult: null,
    bannerMessage: initialBanner,
    hintedCardIds: [],
    cutEventCount: 0,
    tutorial: { active: false, step: 1, hintCardIds: [], message: '' },
  };
}

export function toggleCardSelection(state: GameState, cardId: string): GameState {
  if (state.status !== 'PLAYING' || state.privacyCurtain) return state;
  const activePlayer = state.players[state.currentTurn];
  if (activePlayer.isAi) return state;
  if (!activePlayer.hand.some((c) => c.id === cardId)) return state;

  const exists = state.selectedCardIds.includes(cardId);
  const selectedCardIds = exists
    ? state.selectedCardIds.filter((id) => id !== cardId)
    : [...state.selectedCardIds, cardId];

  return {
    ...state,
    selectedCardIds,
  };
}

export function clearSelection(state: GameState): GameState {
  if (state.selectedCardIds.length === 0) return state;
  return { ...state, selectedCardIds: [] };
}

export function cycleSortMode(state: GameState): GameState {
  const order: SortMode[] = ['rank', 'combo', 'suit'];
  const nextMode = order[(order.indexOf(state.sortMode) + 1) % order.length];
  const players = state.players.map((p) => ({
    ...p,
    hand: sortHand(p.hand, nextMode),
  }));

  const modeNames: Record<SortMode, string> = {
    rank: 'Xếp theo số / Sorted by Rank',
    combo: 'Xếp theo bộ / Sorted by Group',
    suit: 'Xếp theo chất / Sorted by Suit',
  };

  return {
    ...state,
    sortMode: nextMode,
    players,
    bannerMessage: modeNames[nextMode],
  };
}

export function revealPassAndPlayHand(state: GameState): GameState {
  if (!state.privacyCurtain) return state;
  return { ...state, privacyCurtain: false };
}

export function validatePlay(
  state: GameState,
  playerIndex: number,
  cardIds: readonly string[],
): { ok: true; combo: Combo } | { ok: false; reason: string } {
  if (state.status !== 'PLAYING') {
    return { ok: false, reason: 'Ván đã kết thúc / Round is over' };
  }
  if (playerIndex !== state.currentTurn) {
    return { ok: false, reason: 'Chưa tới lượt / Not your turn' };
  }

  const player = state.players[playerIndex];
  const cards = cardIds
    .map((id) => player.hand.find((c) => c.id === id))
    .filter((c): c is Card => Boolean(c));

  if (cards.length !== cardIds.length || cards.length === 0) {
    return { ok: false, reason: 'Hãy chọn bài hợp lệ / Select valid cards' };
  }

  const combo = detectCombo(cards);
  if (!combo) {
    return {
      ok: false,
      reason: 'Bộ bài không hợp lệ / Invalid combination',
    };
  }

  if (
    state.mustIncludeCardId &&
    !combo.cards.some((c) => c.id === state.mustIncludeCardId)
  ) {
    const req = player.hand.find((c) => c.id === state.mustIncludeCardId);
    const label = req ? formatCardLabel(req) : '3♠';
    return {
      ok: false,
      reason: `Nước đi đầu phải có ${label} / Opening play must include ${label}`,
    };
  }

  if (!canBeat(state.currentCombo, combo)) {
    return {
      ok: false,
      reason: 'Bài chưa đủ lớn để chặn / Selection cannot beat current play',
    };
  }

  return { ok: true, combo };
}

function findNextActivePlayer(
  players: readonly Player[],
  fromIndex: number,
): number {
  const n = players.length;
  for (let step = 1; step <= n; step++) {
    const idx = (fromIndex + step) % n;
    if (!players[idx].passedThisTrick && players[idx].hand.length > 0) {
      return idx;
    }
  }
  return fromIndex;
}

export function playCards(
  state: GameState,
  cardIds: readonly string[],
): GameState {
  const playerIndex = state.currentTurn;
  const check = validatePlay(state, playerIndex, cardIds);
  if (!check.ok) {
    return {
      ...state,
      bannerMessage: check.reason,
    };
  }

  const { combo } = check;
  const cutPlay = isCutPlay(state.currentCombo, combo);
  const playedSet = new Set(cardIds);

  const playersAfterPlay = state.players.map((p, idx) => {
    if (idx !== playerIndex) return p;
    return {
      ...p,
      hand: p.hand.filter((c) => !playedSet.has(c.id)),
      cardsPlayedCount: p.cardsPlayedCount + cardIds.length,
    };
  });

  const activePlayer = playersAfterPlay[playerIndex];
  const newPlay = { playerId: playerIndex, combo, isCut: cutPlay };

  // Bonus immediate Chặt Heo points during play
  let cutBonusMsg = '';
  if (cutPlay) {
    const bonus = isBombCombo(combo.type) ? 5 : 0;
    if (bonus > 0 && state.lastPlay) {
      const victimId = state.lastPlay.playerId;
      playersAfterPlay[playerIndex] = {
        ...playersAfterPlay[playerIndex],
        score: playersAfterPlay[playerIndex].score + bonus,
      };
      playersAfterPlay[victimId] = {
        ...playersAfterPlay[victimId],
        score: playersAfterPlay[victimId].score - bonus,
      };
      cutBonusMsg = ` 🔥 Chặt Heo (+${bonus})!`;
    }
  }

  // Did player finish their hand?
  if (activePlayer.hand.length === 0) {
    const roundResult = buildRoundResult(
      playersAfterPlay,
      playerIndex,
      'OUT_OF_CARDS',
    );
    const finalizedPlayers = playersAfterPlay.map((p) => {
      if (p.id === playerIndex) {
        return {
          ...p,
          score: p.score + roundResult.pointsEarned,
          wins: p.wins + 1,
        };
      }
      const pen = roundResult.penalties.find((x) => x.playerId === p.id);
      return {
        ...p,
        score: p.score + (pen?.totalDelta ?? 0),
      };
    });

    return {
      ...state,
      players: finalizedPlayers,
      currentCombo: combo,
      lastPlay: newPlay,
      tableHistory: [...state.tableHistory, newPlay],
      mustIncludeCardId: null,
      selectedCardIds: [],
      hintedCardIds: [],
      privacyCurtain: false,
      status: 'ROUND_OVER',
      roundResult,
      cutEventCount: state.cutEventCount + (cutPlay ? 1 : 0),
      bannerMessage: `${activePlayer.nameVi} / ${activePlayer.nameEn} về nhất (+${roundResult.pointsEarned} điểm)!${cutBonusMsg}`,
    };
  }

  // Advance turn to next active non-passed player
  const nextTurn = findNextActivePlayer(playersAfterPlay, playerIndex);
  const needCurtain =
    state.mode === 'pass-and-play' && nextTurn !== playerIndex;

  return {
    ...state,
    players: playersAfterPlay,
    currentTurn: nextTurn,
    trickLeader: playerIndex,
    currentCombo: combo,
    lastPlay: newPlay,
    tableHistory: [...state.tableHistory, newPlay],
    mustIncludeCardId: null,
    selectedCardIds: [],
    hintedCardIds: [],
    privacyCurtain: needCurtain,
    cutEventCount: state.cutEventCount + (cutPlay ? 1 : 0),
    bannerMessage: `${activePlayer.nameVi}: ${formatComboLabel(combo)}${cutBonusMsg}`,
  };
}

export function canPass(state: GameState): boolean {
  if (state.status !== 'PLAYING') return false;
  // Cannot pass when leading an empty table / free trick
  return state.currentCombo !== null;
}

export function passTurn(state: GameState): GameState {
  if (!canPass(state)) {
    return {
      ...state,
      bannerMessage: 'Bạn đang cầm cái, không thể bỏ lượt / Cannot pass on a free lead',
    };
  }

  const passingIndex = state.currentTurn;
  const passingPlayer = state.players[passingIndex];

  const updatedPlayers = state.players.map((p, idx) =>
    idx === passingIndex ? { ...p, passedThisTrick: true } : p,
  );

  // Count players who haven't passed and still have cards
  const remainingInTrick = updatedPlayers.filter(
    (p) => !p.passedThisTrick && p.hand.length > 0,
  );

  // If only the trick leader remains (1 active player left), trick clears!
  if (remainingInTrick.length <= 1) {
    const newLeader =
      remainingInTrick.length === 1
        ? remainingInTrick[0].id
        : state.trickLeader ?? 0;

    const resetPlayers = updatedPlayers.map((p) => ({
      ...p,
      passedThisTrick: false,
    }));

    const needCurtain =
      state.mode === 'pass-and-play' && newLeader !== passingIndex;

    return {
      ...state,
      players: resetPlayers,
      currentTurn: newLeader,
      trickLeader: newLeader,
      currentCombo: null,
      lastPlay: null,
      tableHistory: [],
      selectedCardIds: [],
      hintedCardIds: [],
      privacyCurtain: needCurtain,
      bannerMessage: `${passingPlayer.nameVi} bỏ lượt · ${resetPlayers[newLeader].nameVi} / ${resetPlayers[newLeader].nameEn} cầm cái mới!`,
    };
  }

  const nextTurn = findNextActivePlayer(updatedPlayers, passingIndex);
  const needCurtain =
    state.mode === 'pass-and-play' && nextTurn !== passingIndex;

  return {
    ...state,
    players: updatedPlayers,
    currentTurn: nextTurn,
    selectedCardIds: [],
    hintedCardIds: [],
    privacyCurtain: needCurtain,
    bannerMessage: `${passingPlayer.nameVi} bỏ lượt / Passed · Lượt ${updatedPlayers[nextTurn].nameVi}`,
  };
}
