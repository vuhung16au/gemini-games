import type { MarioState, TutorialStep } from './types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'block',
    title: 'Step 1 of 4: Bump a ? Block',
    instruction: 'Move right with D/Right and jump (W/Up/Space) underneath the glowing ? block.',
    check: (state) => state.blocksHit >= 1,
  },
  {
    id: 'mushroom',
    title: 'Step 2 of 4: Power Up!',
    instruction: 'Collect the Super Mushroom to grow into Super Mario.',
    check: (state) => state.mushroomsCollected >= 1,
  },
  {
    id: 'stomp',
    title: 'Step 3 of 4: Stomp a Goomba',
    instruction: 'Leap onto the Goomba from above to defeat it and bounce!',
    check: (state) => state.enemiesStomped >= 1,
  },
  {
    id: 'flagpole',
    title: 'Step 4 of 4: Reach the Flagpole',
    instruction: 'Run right and jump onto the Flagpole to clear the practice course!',
    check: (state) => state.phase === 'stage_clear',
  },
];

export function getTutorialProgress(state: MarioState): {
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
