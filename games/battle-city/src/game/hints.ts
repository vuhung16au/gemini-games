import { CANVAS_SIZE } from './constants';
import type { BattleHint, BattleState } from './types';

export function getBattleHint(state: BattleState): BattleHint {
  if (state.powerUps.length > 0) {
    const item = state.powerUps[0];
    return {
      title: 'Grab the Power-Up!',
      message: `A ${item.kind.toUpperCase()} power-up is on the field (+500 pts). Grab it before it fades!`,
    };
  }

  const eagleThreat = state.enemies.some((e) => e.y > CANVAS_SIZE * 0.65);
  if (eagleThreat) {
    return {
      title: 'Defend the Eagle HQ!',
      message:
        'An enemy tank is close to your Eagle base at the bottom-center. Intercept it before it fires at the fortress!',
    };
  }

  const hasArmor = state.enemies.some((e) => e.kind === 'armor');
  if (hasArmor) {
    return {
      title: 'Watch Out for Armored Tanks',
      message:
        'Armored tanks take 4 hits to destroy. Collect Stars (★) for rapid fire and faster shells.',
    };
  }

  if (state.players[0].stars >= 3 || state.players[1].stars >= 3) {
    return {
      title: '3-Star Armor Piercer Active',
      message:
        'Your 3-Star tank can shatter silver Steel walls—carve flanking paths, but avoid shooting your own Eagle!',
    };
  }

  if (state.mode === '2p') {
    return {
      title: '2-Player Co-op Tip',
      message:
        'Split up to guard the left and right flanks of the Eagle. Friendly shells stun your partner for 2.5s!',
    };
  }

  return {
    title: 'Target Flashing Red Tanks',
    message:
      'Flashing red enemy tanks drop valuable power-ups when hit. Keep your Eagle fortress bricks intact!',
  };
}
