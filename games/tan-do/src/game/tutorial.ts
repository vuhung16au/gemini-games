import { applyAttack, applyDefend, applyThrowIn } from './engine';
import type { Card, Suit, TanDoState } from './types';

function c(suit: Suit, rank: Card['rank']): Card {
  return { id: `${suit}-${rank}`, suit, rank };
}

export interface TutorialStepInfo {
  step: number;
  titleVi: string;
  titleEn: string;
  promptVi: string;
  promptEn: string;
}

export const TUTORIAL_STEPS: Record<number, TutorialStepInfo> = {
  1: {
    step: 1,
    titleVi: 'Bước 1/3: Tấn (Attack)',
    titleEn: 'Step 1 of 3: Attack',
    promptVi: 'Chất Trưởng là Cơ (♥). Chọn lá 5♠ rồi nhấn "Tấn / Attack"!',
    promptEn: 'Trump is Hearts (♥). Select 5♠ and click "Tấn / Attack"!',
  },
  2: {
    step: 2,
    titleVi: 'Bước 2/3: Tấn thêm (Throw-in)',
    titleEn: 'Step 2 of 3: Throw-in',
    promptVi:
      'Máy đã đỡ bằng 8♠. Chọn lá 8♦ (cùng số 8 trên bàn) rồi nhấn "Tấn thêm"!',
    promptEn:
      'AI defended with 8♠. Select 8♦ (matches rank 8) and click "Tấn thêm"!',
  },
  3: {
    step: 3,
    titleVi: 'Bước 3/3: Đỡ bằng Chất Trưởng (Defend with Trump)',
    titleEn: 'Step 3 of 3: Defend with Trump',
    promptVi:
      'Máy tấn bằng K♣! Bạn không có Bích/Tép lớn hơn — chọn lá Trưởng 2♥ để đỡ!',
    promptEn:
      'AI attacks with K♣! Beat any non-Trump with Trump 2♥ — select 2♥ and click "Đỡ / Defend"!',
  },
  4: {
    step: 4,
    titleVi: 'Hoàn thành hướng dẫn!',
    titleEn: 'Tutorial complete!',
    promptVi:
      'Tuyệt vời! Bạn đã nắm vững Tấn, Tấn thêm và Đỡ bằng Chất Trưởng.',
    promptEn:
      'Great job! You mastered Attack, Throw-in, and Trump Defense.',
  },
};

export function createTutorialGame(): TanDoState {
  const p1Hand: Card[] = [
    c('spades', 5),
    c('diamonds', 8),
    c('clubs', 6),
    c('diamonds', 10),
    c('hearts', 2),
  ];
  const p2Hand: Card[] = [
    c('spades', 8),
    c('clubs', 13),
    c('diamonds', 9),
    c('spades', 11),
    c('clubs', 4),
  ];

  const noc: Card[] = [
    c('spades', 9),
    c('clubs', 7),
    c('diamonds', 4),
    c('hearts', 14),
  ];

  return {
    playerCount: 2,
    mode: 'ai',
    status: 'PLAYING',
    phase: 'ATTACK_OPEN',
    players: [
      {
        index: 0,
        nameVi: 'Bạn (P1)',
        nameEn: 'Player 1',
        isAI: false,
        hand: p1Hand,
      },
      {
        index: 1,
        nameVi: 'Máy 2',
        nameEn: 'AI 2',
        isAI: true,
        hand: p2Hand,
      },
    ],
    noc,
    trumpCard: noc[noc.length - 1],
    trumpSuit: 'hearts',
    trumpCardInNoc: true,
    table: [],
    attackerIndex: 0,
    defenderIndex: 1,
    activePlayerIndex: 0,
    passedPlayers: [],
    handoffPending: false,
    roundNumber: 1,
    discardCount: 0,
    winnerIndex: null,
    lastEventVi: TUTORIAL_STEPS[1].promptVi,
    lastEventEn: TUTORIAL_STEPS[1].promptEn,
    isTutorial: true,
    tutorialStep: 1,
  };
}

/**
 * Advances scripted tutorial state when the player executes the expected step action.
 * Returns null if the action is not valid for the current tutorial step.
 */
export function applyTutorialPlayerAction(
  state: TanDoState,
  action:
    | { type: 'ATTACK'; cardIds: string[] }
    | { type: 'THROW_IN'; cardIds: string[] }
    | { type: 'DEFEND'; cardId: string; slotIndex: number },
): TanDoState | null {
  if (!state.isTutorial) return null;

  if (state.tutorialStep === 1 && action.type === 'ATTACK') {
    if (action.cardIds.length !== 1 || action.cardIds[0] !== 'spades-5') {
      return null;
    }
    const afterAttack = applyAttack(state, 0, ['spades-5']);
    const afterAiDefend = applyDefend(afterAttack, 1, 'spades-8', 0);
    return {
      ...afterAiDefend,
      isTutorial: true,
      tutorialStep: 2,
      lastEventVi: TUTORIAL_STEPS[2].promptVi,
      lastEventEn: TUTORIAL_STEPS[2].promptEn,
    };
  }

  if (state.tutorialStep === 2 && action.type === 'THROW_IN') {
    if (action.cardIds.length !== 1 || action.cardIds[0] !== 'diamonds-8') {
      return null;
    }
    const afterThrow = applyThrowIn(state, 0, ['diamonds-8']);
    // Transition cleanly to Step 3: clear table & let AI attack with K♣
    const p1Remaining = afterThrow.players[0].hand;
    const p2Remaining = afterThrow.players[1].hand.filter(
      (card) => card.id !== 'clubs-13',
    );
    return {
      ...afterThrow,
      players: [
        { ...afterThrow.players[0], hand: p1Remaining },
        { ...afterThrow.players[1], hand: p2Remaining },
      ],
      table: [
        {
          attack: c('clubs', 13),
          defense: null,
          attackedBy: 1,
        },
      ],
      phase: 'DEFEND_OR_PASS',
      attackerIndex: 1,
      defenderIndex: 0,
      activePlayerIndex: 0,
      passedPlayers: [],
      roundNumber: 2,
      isTutorial: true,
      tutorialStep: 3,
      lastEventVi: TUTORIAL_STEPS[3].promptVi,
      lastEventEn: TUTORIAL_STEPS[3].promptEn,
    };
  }

  if (state.tutorialStep === 3 && action.type === 'DEFEND') {
    if (action.cardId !== 'hearts-2') return null;
    const afterDefend = applyDefend(state, 0, 'hearts-2', action.slotIndex);
    return {
      ...afterDefend,
      isTutorial: true,
      tutorialStep: 4,
      lastEventVi: TUTORIAL_STEPS[4].promptVi,
      lastEventEn: TUTORIAL_STEPS[4].promptEn,
    };
  }

  return null;
}
