import { createDeck } from './deck';
import { sortHandSmart } from './phom';
import type { Card, TaLaState } from './types';

function pickCard(id: string): Card {
  const [suit, rankStr] = id.split('-') as [Card['suit'], string];
  return { id, suit, rank: Number(rankStr) as Card['rank'] };
}

export function getTutorialBannerText(step: 1 | 2 | 3 | 4): string {
  switch (step) {
    case 1:
      return 'Bước 1 / Step 1 of 3 — Ăn hoặc Bốc / Draw or Eat: Nhấn "Ăn 7♠ / Eat" để tạo Phỏm Sáp 7 (hoặc nhấn Bốc Nọc). / Click "Ăn 7♠ / Eat" to complete a set of 7s (or Draw from Nọc).';
    case 2:
      return 'Bước 2 / Step 2 of 3 — Đánh bài / Discard: Chọn lá rác điểm cao (K♦) rồi nhấn "Đánh / Play". / Select high deadwood (K♦) and click "Đánh / Play".';
    case 3:
      return 'Bước 3 / Step 3 of 3 — Hạ Phỏm / Form Phỏm: Vòng 4! Nhấn "Hạ Phỏm / Meld" để hạ các Phỏm xuống bàn. / Round 4! Click "Hạ Phỏm / Meld" to lay down your melds.';
    case 4:
      return 'Hoàn tất hướng dẫn! / Tutorial complete! Bạn đã nắm vững luật chơi Tá Lả (Phỏm).';
  }
}

export function createTutorialGame(): TaLaState {
  const playerHand = sortHandSmart([
    pickCard('hearts-7'),
    pickCard('diamonds-7'),
    pickCard('clubs-4'),
    pickCard('clubs-5'),
    pickCard('clubs-6'),
    pickCard('spades-9'),
    pickCard('spades-10'),
    pickCard('spades-11'),
    pickCard('diamonds-13'),
  ]);

  const aiHand = [
    pickCard('hearts-2'),
    pickCard('hearts-3'),
    pickCard('hearts-4'),
    pickCard('clubs-8'),
    pickCard('clubs-9'),
    pickCard('diamonds-10'),
    pickCard('spades-12'),
    pickCard('hearts-12'),
    pickCard('clubs-13'),
  ];

  const used = new Set([
    ...playerHand.map((c) => c.id),
    ...aiHand.map((c) => c.id),
    'spades-7',
    'clubs-2',
    'diamonds-3',
  ]);
  const nocPile = createDeck().filter((c) => !used.has(c.id));

  return {
    playerCount: 2,
    mode: 'vs-ai',
    dealerIndex: 0,
    currentPlayerIndex: 0,
    round: 3,
    turnsCompletedInRound: 0,
    phase: 'draw_or_eat',
    players: [
      {
        index: 0,
        nameVi: 'Bạn',
        nameEn: 'You',
        isAi: false,
        hand: playerHand,
        discards: [pickCard('spades-2'), pickCard('hearts-5')],
        eatenCardIds: [],
        melds: [],
        hasMelded: false,
      },
      {
        index: 1,
        nameVi: 'Máy 1',
        nameEn: 'AI 1',
        isAi: true,
        hand: aiHand,
        discards: [pickCard('diamonds-4'), pickCard('spades-7')],
        eatenCardIds: [],
        melds: [],
        hasMelded: false,
      },
    ],
    nocPile,
    lastDiscard: {
      card: pickCard('spades-7'),
      playerIndex: 1,
    },
    lastActionText: 'Chế độ Hướng dẫn / Tutorial Mode',
    results: null,
    winnerIndex: null,
    winReason: null,
    tutorialMode: true,
    tutorialStep: 1,
  };
}

/**
 * Transitions tutorial step smoothly after a player action.
 */
export function syncTutorialAfterAction(
  prevState: TaLaState,
  nextState: TaLaState,
): TaLaState {
  if (!prevState.tutorialMode) return nextState;

  // Step 1 -> Step 2 after Eat or Draw
  if (prevState.tutorialStep === 1 && prevState.phase === 'draw_or_eat' && nextState.phase === 'discard') {
    return {
      ...nextState,
      tutorialMode: true,
      tutorialStep: 2,
    };
  }

  // Step 2 -> Step 3 after Discard: advance cleanly to Round 4 Meld phase for Player 0
  if (prevState.tutorialStep === 2 && prevState.phase === 'discard' && nextState.currentPlayerIndex !== 0) {
    const p0 = nextState.players[0];
    const p1 = nextState.players[1];
    const bonusCard = pickCard('clubs-2');
    const p0HandWithBonus = p0.hand.some((c) => c.id === bonusCard.id)
      ? p0.hand
      : sortHandSmart([...p0.hand, bonusCard], p0.eatenCardIds);

    return {
      ...nextState,
      round: 4,
      turnsCompletedInRound: 0,
      currentPlayerIndex: 0,
      phase: 'meld',
      players: [
        { ...p0, hand: p0HandWithBonus, hasMelded: false },
        { ...p1, discards: [...p1.discards, pickCard('diamonds-3')] },
      ],
      lastDiscard: { card: pickCard('diamonds-3'), playerIndex: 1 },
      lastActionText: 'Vòng 4 — Hãy hạ Phỏm xuống bàn! / Round 4 — Meld your Phỏms!',
      tutorialMode: true,
      tutorialStep: 3,
    };
  }

  // Step 3 -> Step 4 after Meld
  if (prevState.tutorialStep === 3 && nextState.players[0].hasMelded) {
    return {
      ...nextState,
      tutorialMode: true,
      tutorialStep: 4,
      lastActionText: 'Hoàn tất hướng dẫn! / Tutorial complete!',
    };
  }

  return nextState;
}
