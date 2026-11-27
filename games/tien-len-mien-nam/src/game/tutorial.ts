import { passTurn, playCards } from './engine';
import type { Card, GameState } from './types';

const c = (suit: Card['suit'], rank: Card['rank']): Card => ({
  id: `${suit}-${rank}`,
  rank,
  suit,
});

const STEP_1_IDS = ['diamonds-14'];
const STEP_2_IDS = [
  'spades-8',
  'hearts-8',
  'clubs-9',
  'diamonds-9',
  'spades-10',
  'hearts-10',
];
const STEP_3_IDS = ['spades-11', 'diamonds-12', 'clubs-13'];

const STEP_1_MSG =
  'Bước 1/3: Chọn lá A♦ rồi nhấn Đánh / Step 1 of 3: Select A♦ and click Play.';
const STEP_2_MSG =
  'Bước 2/3: Đối thủ đánh Heo 2♠! Chọn 3 Đôi thông (8-8-9-9-10-10) để Chặt Heo / Step 2 of 3: Opponent played 2♠! Select 3 Consec. Pairs (8-9-10) to Cut!';
const STEP_3_MSG =
  'Bước 3/3: Đánh Sảnh J♠-Q♦-K♣ để về nhất! / Step 3 of 3: Play Straight J♠-Q♦-K♣ to win!';
const STEP_DONE_MSG =
  'Hoàn tất hướng dẫn! / Tutorial complete! Nhấn "Chơi ván mới / Start Full Game" để bắt đầu.';

export function createTutorialGame(): GameState {
  const playerHand: Card[] = [
    c('spades', 8),
    c('hearts', 8),
    c('clubs', 9),
    c('diamonds', 9),
    c('spades', 10),
    c('hearts', 10),
    c('spades', 11),
    c('diamonds', 12),
    c('clubs', 13),
    c('diamonds', 14),
  ];

  const aiHand: Card[] = [
    c('clubs', 6),
    c('diamonds', 7),
    c('hearts', 12),
    c('clubs', 13),
    c('spades', 15), // 2♠
  ];

  return {
    playerCount: 2,
    mode: 'vs-ai',
    roundNumber: 1,
    players: [
      {
        id: 0,
        nameVi: 'Bạn',
        nameEn: 'You',
        isAi: false,
        hand: playerHand,
        passedThisTrick: false,
        cardsPlayedCount: 0,
        score: 0,
        wins: 0,
      },
      {
        id: 1,
        nameVi: 'Máy Hướng Dẫn',
        nameEn: 'Tutor AI',
        isAi: true,
        hand: aiHand,
        passedThisTrick: false,
        cardsPlayedCount: 0,
        score: 0,
        wins: 0,
      },
    ],
    currentTurn: 0,
    trickLeader: 0,
    currentCombo: null,
    lastPlay: null,
    tableHistory: [],
    mustIncludeCardId: null,
    selectedCardIds: [],
    sortMode: 'rank',
    privacyCurtain: false,
    status: 'PLAYING',
    roundResult: null,
    bannerMessage: STEP_1_MSG,
    hintedCardIds: [...STEP_1_IDS],
    cutEventCount: 0,
    tutorial: {
      active: true,
      step: 1,
      hintCardIds: [...STEP_1_IDS],
      message: STEP_1_MSG,
    },
  };
}

function sameCardSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((id) => setA.has(id));
}

export function handleTutorialPlay(
  state: GameState,
  cardIds: readonly string[],
): GameState {
  if (!state.tutorial.active) {
    return playCards(state, cardIds);
  }

  const { step, hintCardIds } = state.tutorial;
  if (!sameCardSet(cardIds, hintCardIds)) {
    return {
      ...state,
      bannerMessage: state.tutorial.message,
      hintedCardIds: [...hintCardIds],
    };
  }

  if (step === 1) {
    // Player plays A♦, then Tutor AI legally beats with 2♠
    const afterPlayer = playCards(state, cardIds);
    const afterAi = playCards(afterPlayer, ['spades-15']);
    return {
      ...afterAi,
      bannerMessage: STEP_2_MSG,
      hintedCardIds: [...STEP_2_IDS],
      tutorial: {
        active: true,
        step: 2,
        hintCardIds: [...STEP_2_IDS],
        message: STEP_2_MSG,
      },
    };
  }

  if (step === 2) {
    // Player cuts 2♠ with 3 Consec Pairs; AI passes so trick clears cleanly
    const afterPlayer = playCards(state, cardIds);
    const afterAiPass = passTurn(afterPlayer);
    return {
      ...afterAiPass,
      bannerMessage: STEP_3_MSG,
      hintedCardIds: [...STEP_3_IDS],
      tutorial: {
        active: true,
        step: 3,
        hintCardIds: [...STEP_3_IDS],
        message: STEP_3_MSG,
      },
    };
  }

  if (step === 3) {
    const afterWin = playCards(state, cardIds);
    return {
      ...afterWin,
      bannerMessage: STEP_DONE_MSG,
      hintedCardIds: [],
      tutorial: {
        active: true,
        step: 4,
        hintCardIds: [],
        message: STEP_DONE_MSG,
      },
    };
  }

  return state;
}
