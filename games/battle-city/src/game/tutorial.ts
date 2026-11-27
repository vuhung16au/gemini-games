import { getTotalKills } from './engine';
import type { BattleState, TutorialStep } from './types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'brick',
    title: 'Step 1 of 4: Carve Brick Walls',
    instruction: 'Use WASD or Arrow keys to aim and press Space/Enter to blast through a Brick wall.',
    check: (state) => state.bricksBroken >= 1,
  },
  {
    id: 'kill',
    title: 'Step 2 of 4: Destroy an Enemy Tank',
    instruction: 'Shoot the flashing red enemy tank to score points and drop a Star power-up.',
    check: (state) => getTotalKills(state.players[0]) >= 1,
  },
  {
    id: 'powerup',
    title: 'Step 3 of 4: Collect a Power-Up',
    instruction: 'Drive over the Star (★) power-up to upgrade your cannon speed (+500 pts).',
    check: (state) => state.powerUpsCollected >= 1,
  },
  {
    id: 'clear',
    title: 'Step 4 of 4: Clear the Wave',
    instruction: 'Destroy the remaining practice tanks while keeping the Eagle HQ safe!',
    check: (state) => state.phase === 'stage_clear',
  },
];

export function getTutorialProgress(state: BattleState): {
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
