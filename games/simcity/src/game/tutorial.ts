import type { CityState, TutorialStep } from './types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'power',
    title: 'Step 1 of 5: Generate Power',
    instruction: 'Select Power Plant (⚡, key 6) and place it next to the entry road.',
    check: (state) => state.tiles.some((t) => t.kind === 'power'),
  },
  {
    id: 'water',
    title: 'Step 2 of 5: Supply Water',
    instruction: 'Select Water Tower (💧, key 7) and place it beside the road.',
    check: (state) => state.tiles.some((t) => t.kind === 'water'),
  },
  {
    id: 'roads',
    title: 'Step 3 of 5: Extend Streets',
    instruction: 'Select Road (🛣️, key 2) and build at least 4 new road tiles.',
    check: (state) => state.tiles.filter((t) => t.kind === 'road').length >= 7,
  },
  {
    id: 'zones',
    title: 'Step 4 of 5: Zone Neighborhoods',
    instruction: 'Zone at least 2 Residential (🏠, key 3) and 1 Commercial (🏢, key 4) tiles next to your roads.',
    check: (state) =>
      state.tiles.filter((t) => t.kind === 'residential').length >= 2 &&
      state.tiles.filter((t) => t.kind === 'commercial').length >= 1,
  },
  {
    id: 'park',
    title: 'Step 5 of 5: Add a Park',
    instruction: 'Place a Park (🌳, key 8) to raise land value and watch buildings grow!',
    check: (state) => state.tiles.some((t) => t.kind === 'park'),
  },
];

export function getTutorialProgress(state: CityState): {
  currentStepIndex: number;
  completed: boolean;
  step: TutorialStep | null;
} {
  for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
    if (!TUTORIAL_STEPS[i].check(state)) {
      return {
        currentStepIndex: i,
        completed: false,
        step: TUTORIAL_STEPS[i],
      };
    }
  }
  return {
    currentStepIndex: TUTORIAL_STEPS.length,
    completed: true,
    step: null,
  };
}
