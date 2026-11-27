import { compareCards, createDeck, shuffleDeck, sortHand } from './deck';
import { countTuQuyInHand, getComboLabel, validatePlay } from './rules';
import { applyTutorialStepPlay } from './tutorial';
import type {
  Card,
  GameMode,
  GameState,
  Player,
  PlayerCount,
  RoundScoreEntry,
  SortMode,
  ValidationResult,
} from './types';

export const CARDS_PER_PLAYER = 13;

function buildPlayers(
  playerCount: PlayerCount,
  mode: GameMode,
  hands: Card[][],
  sortMode: SortMode,
): Player[] {
  const players: Player[] = [];
  for (let i = 0; i < playerCount; i++) {
    const isHuman = mode === 'hotseat' ? true : i === 0;
    const nameVi =
      mode === 'hotseat'
        ? `Người chơi ${i + 1}`
        : i === 0
          ? 'Bạn'
          : `Máy ${i}`;
    const nameEn =
      mode === 'hotseat'
        ? `Player ${i + 1}`
        : i === 0
          ? 'You'
          : `AI ${i}`;
    players.push({
      id: i,
      nameVi,
      nameEn,
      isHuman,
      hand: sortHand(hands[i], sortMode),
      passed: false,
      chatHeoPoints: 0,
    });
  }
  return players;
}

export function createGameState(
  playerCount: PlayerCount = 4,
  mode: GameMode = 'ai',
  sortMode: SortMode = 'rank',
  rng: () => number = Math.random,
): GameState {
  const deck = shuffleDeck(createDeck(), rng);
  const hands: Card[][] = [];
  for (let i = 0; i < playerCount; i++) {
    hands.push(deck.slice(i * CARDS_PER_PLAYER, (i + 1) * CARDS_PER_PLAYER));
  }

  const players = buildPlayers(playerCount, mode, hands, sortMode);

  // Find 3♠ if in play
  const threeSpadesIdx = players.findIndex((p) =>
    p.hand.some((c) => c.id === 'spades-3'),
  );

  let startingIndex = 0;
  let mustIncludeCardId: string | null = null;
  let isFirstTurnOfMatch = false;
  let eventBanner: GameState['eventBanner'] = null;

  if (threeSpadesIdx !== -1) {
    startingIndex = threeSpadesIdx;
    mustIncludeCardId = 'spades-3';
    isFirstTurnOfMatch = true;
    eventBanner = {
      vi: `${players[startingIndex].nameVi} cầm 3♠ đi trước!`,
      en: `${players[startingIndex].nameEn} holds 3♠ and opens!`,
      tone: 'info',
    };
  } else {
    // Possible in 2P/3P: player with the lowest card leads freely
    let bestPlayer = 0;
    let lowestCard: Card | null = null;
    for (let i = 0; i < players.length; i++) {
      for (const c of players[i].hand) {
        if (!lowestCard || compareCards(c, lowestCard) < 0) {
          lowestCard = c;
          bestPlayer = i;
        }
      }
    }
    startingIndex = bestPlayer;
    eventBanner = {
      vi: `3♠ không có trên bàn — ${players[startingIndex].nameVi} đánh tự do trước!`,
      en: `3♠ not dealt — ${players[startingIndex].nameEn} leads freely!`,
      tone: 'info',
    };
  }

  return {
    playerCount,
    mode,
    players,
    currentPlayerIndex: startingIndex,
    lastPlayerIndex: null,
    tableCombo: null,
    tableOwnerName: null,
    isFirstTurnOfMatch,
    mustIncludeCardId,
    handoffRequired: mode === 'hotseat' && players[startingIndex].isHuman,
    status: 'playing',
    winnerIndex: null,
    roundScores: [],
    eventBanner,
    isTutorial: false,
    tutorialStep: 0,
    sortMode,
  };
}

function computeRoundScores(
  players: Player[],
  winnerIndex: number,
  thoi2LoserIndex: number | null = null,
): RoundScoreEntry[] {
  let winnerGain = 10; // Base win bonus
  const entries: RoundScoreEntry[] = players.map((p, idx) => {
    if (idx === winnerIndex) {
      return {
        playerId: p.id,
        nameVi: p.nameVi,
        nameEn: p.nameEn,
        cardsLeft: p.hand.length,
        thoi2Count: 0,
        thoiTuQuyCount: 0,
        chatHeoPoints: p.chatHeoPoints,
        delta: 0,
        isWinner: true,
      };
    }

    const thoi2Count = p.hand.filter((c) => c.rank === 15).length;
    const thoiTuQuyCount = countTuQuyInHand(p.hand);
    const cardPenalty = p.hand.length;
    const thoiPenalty = thoi2Count * 10 + thoiTuQuyCount * 10;
    const totalPenalty = cardPenalty + thoiPenalty;

    winnerGain += totalPenalty;

    return {
      playerId: p.id,
      nameVi: p.nameVi,
      nameEn: p.nameEn,
      cardsLeft: p.hand.length,
      thoi2Count,
      thoiTuQuyCount,
      chatHeoPoints: p.chatHeoPoints,
      delta: -totalPenalty + p.chatHeoPoints,
      isWinner: false,
      thoi2Loss: idx === thoi2LoserIndex,
    };
  });

  entries[winnerIndex].delta = winnerGain + players[winnerIndex].chatHeoPoints;
  return entries;
}

export interface PlayOutcome {
  played: boolean;
  state: GameState;
  validation?: ValidationResult;
  chatHeo?: boolean;
  won?: boolean;
}

function nextActivePlayerIndex(players: Player[], fromIdx: number): number {
  const n = players.length;
  for (let offset = 1; offset <= n; offset++) {
    const idx = (fromIdx + offset) % n;
    if (!players[idx].passed) return idx;
  }
  return fromIdx;
}

export function playCards(state: GameState, cardIds: string[]): PlayOutcome {
  if (state.status !== 'playing') {
    return { played: false, state };
  }

  if (state.isTutorial) {
    const tut = applyTutorialStepPlay(state, cardIds);
    if (!tut.valid) {
      return {
        played: false,
        state: {
          ...state,
          eventBanner: tut.messageVi
            ? { vi: tut.messageVi, en: tut.messageEn ?? tut.messageVi, tone: 'warning' }
            : state.eventBanner,
        },
      };
    }
    return {
      played: true,
      state: tut.state,
      chatHeo: tut.state.tutorialStep === 3,
    };
  }

  const validation = validatePlay(state, cardIds);
  if (!validation.valid || !validation.combo) {
    return {
      played: false,
      validation,
      state: {
        ...state,
        eventBanner: {
          vi: validation.reasonVi ?? 'Nước đi không hợp lệ',
          en: validation.reasonEn ?? 'Invalid move',
          tone: 'warning',
        },
      },
    };
  }

  const combo = validation.combo;
  const actorIdx = state.currentPlayerIndex;
  const actor = state.players[actorIdx];
  const playedSet = new Set(cardIds);

  let chatHeo = false;
  let chatChong = false;
  const players = state.players.map((p) => ({ ...p, hand: [...p.hand] }));
  players[actorIdx].hand = players[actorIdx].hand.filter((c) => !playedSet.has(c.id));

  if (combo.type === 'TU_QUY' && state.tableCombo && state.lastPlayerIndex !== null) {
    if (state.tableCombo.type === 'SINGLE' && state.tableCombo.highRank === 15) {
      chatHeo = true;
      players[actorIdx].chatHeoPoints += 10;
      players[state.lastPlayerIndex].chatHeoPoints -= 10;
    } else if (state.tableCombo.type === 'TU_QUY') {
      chatChong = true;
      players[actorIdx].chatHeoPoints += 15;
      players[state.lastPlayerIndex].chatHeoPoints -= 15;
    }
  }

  // Check immediate win (player emptied hand)
  if (players[actorIdx].hand.length === 0) {
    const roundScores = computeRoundScores(players, actorIdx);
    return {
      played: true,
      chatHeo: chatHeo || chatChong,
      won: true,
      state: {
        ...state,
        players,
        lastPlayerIndex: actorIdx,
        tableCombo: combo,
        tableOwnerName: `${actor.nameVi} / ${actor.nameEn}`,
        isFirstTurnOfMatch: false,
        mustIncludeCardId: null,
        handoffRequired: false,
        status: 'finished',
        winnerIndex: actorIdx,
        roundScores,
        eventBanner: {
          vi: `${actor.nameVi} Về Nhất!`,
          en: `${actor.nameEn} Wins the Round!`,
          tone: 'special',
        },
      },
    };
  }

  const nextIdx = nextActivePlayerIndex(players, actorIdx);
  const comboLabel = getComboLabel(combo);

  let banner: GameState['eventBanner'];
  if (chatHeo) {
    banner = {
      vi: `CHẶT HEO! ${actor.nameVi} dùng ${comboLabel.vi} chặt quân 2 (+10đ)!`,
      en: `CHẶT HEO! ${actor.nameEn} cut the 2 with ${comboLabel.en} (+10 pts)!`,
      tone: 'special',
    };
  } else if (chatChong) {
    banner = {
      vi: `CHẶT CHỒNG! ${actor.nameVi} dùng ${comboLabel.vi} (+15đ)!`,
      en: `OVER-CUT! ${actor.nameEn} played ${comboLabel.en} (+15 pts)!`,
      tone: 'special',
    };
  } else if (validation.warnsThoi2) {
    banner = {
      vi: `⚠️ Cảnh báo Thối 2: ${actor.nameVi} chỉ còn quân 2 trên tay!`,
      en: `⚠️ Thối 2 Warning: ${actor.nameEn} only has 2s remaining!`,
      tone: 'warning',
    };
  } else {
    banner = {
      vi: `${actor.nameVi} đánh ${comboLabel.vi}`,
      en: `${actor.nameEn} played ${comboLabel.en}`,
      tone: 'info',
    };
  }

  return {
    played: true,
    chatHeo: chatHeo || chatChong,
    state: {
      ...state,
      players,
      currentPlayerIndex: nextIdx,
      lastPlayerIndex: actorIdx,
      tableCombo: combo,
      tableOwnerName: `${actor.nameVi} / ${actor.nameEn}`,
      isFirstTurnOfMatch: false,
      mustIncludeCardId: null,
      handoffRequired:
        state.mode === 'hotseat' && players[nextIdx].isHuman && nextIdx !== actorIdx,
      eventBanner: banner,
    },
  };
}

export function passTurn(state: GameState): { passed: boolean; state: GameState } {
  if (state.status !== 'playing' || state.isTutorial) {
    return { passed: false, state };
  }
  if (!state.tableCombo || state.lastPlayerIndex === null) {
    return {
      passed: false,
      state: {
        ...state,
        eventBanner: {
          vi: 'Đang mở vòng mới — không thể Bỏ lượt',
          en: 'Free lead — cannot Pass on a new trick',
          tone: 'warning',
        },
      },
    };
  }

  const actorIdx = state.currentPlayerIndex;
  const actor = state.players[actorIdx];
  const players = state.players.map((p, idx) =>
    idx === actorIdx ? { ...p, passed: true } : { ...p },
  );

  const activePlayers = players.filter((p) => !p.passed);
  if (activePlayers.length <= 1) {
    // Trick won by lastPlayerIndex -> reset trick
    const trickWinnerIdx = state.lastPlayerIndex;
    const resetPlayers = players.map((p) => ({ ...p, passed: false }));
    const trickWinner = resetPlayers[trickWinnerIdx];

    // Deadlock guard: if trickWinner only has 2s left on a free lead, resolve Thối 2 loss cleanly
    if (trickWinner.hand.every((c) => c.rank === 15)) {
      let bestOtherIdx = (trickWinnerIdx + 1) % resetPlayers.length;
      for (let i = 0; i < resetPlayers.length; i++) {
        if (i === trickWinnerIdx) continue;
        const candidate = resetPlayers[i];
        const currentBest = resetPlayers[bestOtherIdx];
        const candidateOnlyTwos = candidate.hand.every((c) => c.rank === 15);
        const bestOnlyTwos = currentBest.hand.every((c) => c.rank === 15);
        if (!candidateOnlyTwos && bestOnlyTwos) {
          bestOtherIdx = i;
        } else if (
          candidateOnlyTwos === bestOnlyTwos &&
          candidate.hand.length < currentBest.hand.length
        ) {
          bestOtherIdx = i;
        }
      }
      const roundScores = computeRoundScores(resetPlayers, bestOtherIdx, trickWinnerIdx);
      return {
        passed: true,
        state: {
          ...state,
          players: resetPlayers,
          currentPlayerIndex: trickWinnerIdx,
          tableCombo: null,
          tableOwnerName: null,
          handoffRequired: false,
          status: 'finished',
          winnerIndex: bestOtherIdx,
          roundScores,
          eventBanner: {
            vi: `${trickWinner.nameVi} bị Thối 2! ${resetPlayers[bestOtherIdx].nameVi} thắng ván!`,
            en: `${trickWinner.nameEn} suffered Thối 2! ${resetPlayers[bestOtherIdx].nameEn} wins!`,
            tone: 'warning',
          },
        },
      };
    }

    return {
      passed: true,
      state: {
        ...state,
        players: resetPlayers,
        currentPlayerIndex: trickWinnerIdx,
        tableCombo: null,
        tableOwnerName: null,
        handoffRequired:
          state.mode === 'hotseat' &&
          trickWinner.isHuman &&
          trickWinnerIdx !== actorIdx,
        eventBanner: {
          vi: `Hết vòng! ${trickWinner.nameVi} được đi vòng mới tự do.`,
          en: `Trick cleared! ${trickWinner.nameEn} leads a new trick.`,
          tone: 'info',
        },
      },
    };
  }

  const nextIdx = nextActivePlayerIndex(players, actorIdx);
  return {
    passed: true,
    state: {
      ...state,
      players,
      currentPlayerIndex: nextIdx,
      handoffRequired:
        state.mode === 'hotseat' && players[nextIdx].isHuman && nextIdx !== actorIdx,
      eventBanner: {
        vi: `${actor.nameVi} bỏ lượt.`,
        en: `${actor.nameEn} passed.`,
        tone: 'info',
      },
    },
  };
}

export function revealHandoff(state: GameState): GameState {
  if (!state.handoffRequired) return state;
  return {
    ...state,
    handoffRequired: false,
  };
}

export function toggleSortMode(state: GameState): GameState {
  const nextSort: SortMode = state.sortMode === 'rank' ? 'combo' : 'rank';
  const players = state.players.map((p, idx) =>
    idx === state.currentPlayerIndex || (state.mode === 'ai' && p.isHuman)
      ? { ...p, hand: sortHand(p.hand, nextSort) }
      : p,
  );
  return {
    ...state,
    sortMode: nextSort,
    players,
    eventBanner: {
      vi: nextSort === 'combo' ? 'Đã xếp bài theo Bộ (Sảnh / Đôi / Tứ quý)' : 'Đã xếp bài theo Thứ tự (3 → 2)',
      en: nextSort === 'combo' ? 'Sorted by Combos (Straights / Pairs / Quads)' : 'Sorted by Rank (3 → 2)',
      tone: 'info',
    },
  };
}
