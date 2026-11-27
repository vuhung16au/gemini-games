import type { DinoState, TutorialStep } from './types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'jump',
    title: 'Step 1 of 3: Jump Over Obstacles',
    instruction: 'Press Space, Up Arrow, or W (or tap the canvas) to leap over a cactus.',
    check: (state) => state.hasJumped && state.obstaclesCleared >= 1,
  },
  {
    id: 'duck',
    title: 'Step 2 of 3: Duck or Fast-Fall',
    instruction: 'Hold Down Arrow or S to duck under flying obstacles or drop quickly mid-air.',
    check: (state) => state.hasDuckedOrFastFell,
  },
  {
    id: 'streak',
    title: 'Step 3 of 3: Clear 3 Obstacles',
    instruction: 'Keep your streak going and clear at least 3 obstacles without crashing!',
    check: (state) => state.obstaclesCleared >= 3,
  },
];

export function getTutorialProgress(state: DinoState): {
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
