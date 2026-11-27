import type { Card, GameState, Rank, Suit } from './types';

export const TUTORIAL_STEPS = [
  'Step 1 of 3: Click or drag the Ace of Hearts (A♥) to an empty Foundation slot at the top right.',
  'Step 2 of 3: Move the Red 6♥ onto the Black 7♠ to uncover the hidden card underneath.',
  'Step 3 of 3: Move the King of Spades (K♠) into the empty column to complete the tutorial!',
] as const;

function makeCard(suit: Suit, rank: Rank, faceUp: boolean): Card {
  return {
    id: `${suit}-${rank}`,
    suit,
    rank,
    faceUp,
  };
}

/** Deterministic guided mini-deal teaching Foundations, alternating stacks, and Kings. */
export function createTutorialState(): GameState {
  return {
    stock: [makeCard('diamonds', 4, false), makeCard('spades', 3, false)],
    waste: [],
    foundations: [[], [], [], []],
    tableau: [
      [makeCard('hearts', 1, true)],
      [makeCard('clubs', 2, false), makeCard('hearts', 6, true)],
      [makeCard('spades', 7, true)],
      [makeCard('spades', 13, true)],
      [],
      [makeCard('diamonds', 9, true)],
      [makeCard('clubs', 10, true)],
    ],
    drawMode: 1,
    score: 0,
    moves: 0,
    elapsedSeconds: 0,
    status: 'PLAYING',
    isTutorial: true,
    tutorialStep: 0,
    tutorialCompleted: false,
    history: [],
  };
}

/** Advance tutorial step based on current board milestones. */
export function evaluateTutorialProgress(state: GameState): GameState {
  if (!state.isTutorial || state.tutorialCompleted) {
    return state;
  }

  let step = state.tutorialStep;

  // Step 0 -> 1: Ace of Hearts placed on any Foundation
  if (step === 0) {
    const acePlaced = state.foundations.some((pile) =>
      pile.some((c) => c.id === 'hearts-1'),
    );
    if (acePlaced) step = 1;
  }

  // Step 1 -> 2: Red 6♥ placed onto Black 7♠
  if (step === 1) {
    const sixOnSeven = state.tableau.some((col) =>
      col.some(
        (c, idx) =>
          c.id === 'hearts-6' && idx > 0 && col[idx - 1].id === 'spades-7',
      ),
    );
    if (sixOnSeven) step = 2;
  }

  // Step 2 -> Completed: King of Spades moved into an empty column (col !== 3)
  if (step === 2) {
    const kingMoved = state.tableau.some(
      (col, colIdx) => colIdx !== 3 && col.length > 0 && col[0].id === 'spades-13',
    );
    if (kingMoved) {
      return {
        ...state,
        tutorialStep: 2,
        tutorialCompleted: true,
      };
    }
  }

  return step === state.tutorialStep ? state : { ...state, tutorialStep: step };
}
