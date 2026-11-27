import type { MinesweeperState, TutorialStep } from './types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'open',
    title: 'Step 1 of 3: Open a Safe Pocket',
    instruction: 'Click any tile to make your first move — the first click is always mine-free!',
    check: (state) => state.revealedSafeCount >= 1,
  },
  {
    id: 'flag',
    title: 'Step 2 of 3: Flag a Suspected Mine',
    instruction: 'Right-click (or toggle Flag Mode) on a hidden tile next to a number to plant a flag.',
    check: (state) => state.flagsCount >= 1,
  },
  {
    id: 'win',
    title: 'Step 3 of 3: Clear Safe Tiles',
    instruction: 'Reveal more safe tiles (or click a satisfied number to Chord) and sweep the board!',
    check: (state) => state.status === 'won' || state.revealedSafeCount >= 12,
  },
];

export function getTutorialProgress(state: MinesweeperState): {
  stepIndex: number;
  completed: boolean;
  step: TutorialStep | null;
} {
  for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
    if (!TUTORIAL_STEPS[i].check(state)) {
      return {
        stepIndex: i,
        completed: false,
        step: TUTORIAL_STEPS[i],
      };
    }
  }
  return {
    stepIndex: TUTORIAL_STEPS.length,
    completed: true,
    step: null,
  };
}
