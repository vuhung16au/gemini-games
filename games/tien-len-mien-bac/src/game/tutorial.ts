import { card } from './deck';
import { classifyNorthernCombo } from './rules';
import type { Card, Combo, GameState } from './types';

export interface TutorialStepPrompt {
  stepNumber: number;
  vi: string;
  en: string;
  targetCardIds: string[];
}

export const TUTORIAL_STEPS: TutorialStepPrompt[] = [
  {
    stepNumber: 1,
    vi: 'Bước 1/3: Mở đầu bằng quân 3♠ — Chọn 3♠ và nhấn Đánh / Play.',
    en: 'Step 1 of 3: Open with 3♠ — Select 3♠ and click Đánh / Play.',
    targetCardIds: ['spades-3'],
  },
  {
    stepNumber: 2,
    vi: 'Bước 2/3: Luật Bắc cùng chất — Máy đánh 7♦, hãy chọn 9♦ (cùng chất ♦) để chặt!',
    en: 'Step 2 of 3: Northern same-suit rule — Opponent played 7♦; select 9♦ (♦ suit) to beat it!',
    targetCardIds: ['diamonds-9'],
  },
  {
    stepNumber: 3,
    vi: 'Bước 3/3: Chặt Heo! — Máy đánh 2♥, hãy chọn cả Tứ quý 6 (6♠ 6♣ 6♦ 6♥) để chặt!',
    en: 'Step 3 of 3: Chặt Heo! — Opponent played 2♥; select all four 6s (Tứ quý 6) to cut it!',
    targetCardIds: ['spades-6', 'clubs-6', 'diamonds-6', 'hearts-6'],
  },
];

export function createTutorialState(): GameState {
  const humanHand: Card[] = [
    card('spades', 3),
    card('spades', 6),
    card('clubs', 6),
    card('diamonds', 6),
    card('hearts', 6),
    card('diamonds', 9),
    card('spades', 10),
  ];
  const aiHand: Card[] = [
    card('diamonds', 7),
    card('hearts', 15),
    card('clubs', 12),
    card('spades', 14),
  ];

  return {
    playerCount: 2,
    mode: 'ai',
    players: [
      {
        id: 0,
        nameVi: 'Bạn',
        nameEn: 'You',
        isHuman: true,
        hand: humanHand,
        passed: false,
        chatHeoPoints: 0,
      },
      {
        id: 1,
        nameVi: 'Máy 1',
        nameEn: 'AI 1',
        isHuman: false,
        hand: aiHand,
        passed: false,
        chatHeoPoints: 0,
      },
    ],
    currentPlayerIndex: 0,
    lastPlayerIndex: null,
    tableCombo: null,
    tableOwnerName: null,
    isFirstTurnOfMatch: true,
    mustIncludeCardId: 'spades-3',
    handoffRequired: false,
    status: 'playing',
    winnerIndex: null,
    roundScores: [],
    eventBanner: {
      vi: TUTORIAL_STEPS[0].vi,
      en: TUTORIAL_STEPS[0].en,
      tone: 'info',
    },
    isTutorial: true,
    tutorialStep: 0,
    sortMode: 'rank',
  };
}

/**
 * Advances the guided 3-step Tutorial when the human plays the expected cards.
 */
export function applyTutorialStepPlay(
  state: GameState,
  playedIds: string[],
): { valid: boolean; state: GameState; messageVi?: string; messageEn?: string } {
  const stepIdx = state.tutorialStep;
  if (stepIdx >= TUTORIAL_STEPS.length) {
    return { valid: false, state };
  }

  const expected = new Set(TUTORIAL_STEPS[stepIdx].targetCardIds);
  const actual = new Set(playedIds);
  const matches =
    expected.size === actual.size && [...expected].every((id) => actual.has(id));

  if (!matches) {
    return {
      valid: false,
      state,
      messageVi: `Hãy làm theo hướng dẫn: ${TUTORIAL_STEPS[stepIdx].vi}`,
      messageEn: `Follow the step: ${TUTORIAL_STEPS[stepIdx].en}`,
    };
  }

  const human = state.players[0];
  const ai = state.players[1];
  const nextHumanHand = human.hand.filter((c) => !actual.has(c.id));

  if (stepIdx === 0) {
    // AI responds with 7♦ for Step 2
    const aiCard = card('diamonds', 7);
    const aiCombo: Combo = classifyNorthernCombo([aiCard])!;
    const nextAiHand = ai.hand.filter((c) => c.id !== aiCard.id);
    return {
      valid: true,
      state: {
        ...state,
        players: [
          { ...human, hand: nextHumanHand },
          { ...ai, hand: nextAiHand },
        ],
        currentPlayerIndex: 0,
        lastPlayerIndex: 1,
        tableCombo: aiCombo,
        tableOwnerName: `${ai.nameVi} / ${ai.nameEn}`,
        isFirstTurnOfMatch: false,
        mustIncludeCardId: null,
        tutorialStep: 1,
        eventBanner: {
          vi: TUTORIAL_STEPS[1].vi,
          en: TUTORIAL_STEPS[1].en,
          tone: 'info',
        },
      },
    };
  }

  if (stepIdx === 1) {
    // AI plays 2♥ for Step 3
    const aiCard = card('hearts', 15);
    const aiCombo: Combo = classifyNorthernCombo([aiCard])!;
    const nextAiHand = ai.hand.filter((c) => c.id !== aiCard.id);
    return {
      valid: true,
      state: {
        ...state,
        players: [
          { ...human, hand: nextHumanHand },
          { ...ai, hand: nextAiHand },
        ],
        currentPlayerIndex: 0,
        lastPlayerIndex: 1,
        tableCombo: aiCombo,
        tableOwnerName: `${ai.nameVi} / ${ai.nameEn}`,
        tutorialStep: 2,
        eventBanner: {
          vi: TUTORIAL_STEPS[2].vi,
          en: TUTORIAL_STEPS[2].en,
          tone: 'special',
        },
      },
    };
  }

  // Step 2 completed -> Tutorial complete!
  const tuQuyCombo = classifyNorthernCombo(
    human.hand.filter((c) => actual.has(c.id)),
  )!;
  return {
    valid: true,
    state: {
      ...state,
      players: [
        { ...human, hand: nextHumanHand, chatHeoPoints: human.chatHeoPoints + 10 },
        { ...ai, chatHeoPoints: ai.chatHeoPoints - 10 },
      ],
      currentPlayerIndex: 0,
      lastPlayerIndex: 0,
      tableCombo: tuQuyCombo,
      tableOwnerName: `${human.nameVi} / ${human.nameEn}`,
      tutorialStep: 3,
      eventBanner: {
        vi: 'Hoàn thành hướng dẫn! Bạn đã nắm vững luật Tiến Lên Miền Bắc.',
        en: 'Tutorial complete! You mastered Northern Tiến Lên rules.',
        tone: 'special',
      },
    },
  };
}
