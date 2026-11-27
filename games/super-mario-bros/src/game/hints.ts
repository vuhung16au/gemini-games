import type { MarioHint, MarioState } from './types';

export function getMarioHint(state: MarioState): MarioHint {
  if (state.levelId === '1-4') {
    return {
      title: "Bowser's Castle Strategy",
      message:
        'Time your jump past rotating Fire Bars, then either leap over Bowser to grab the Axe or hit him with 5 Fireballs!',
    };
  }

  if (state.levelId === '1-3') {
    return {
      title: 'Hold Run for Wide Gaps',
      message:
        'Hold Shift (or X) to sprint before jumping across treetop bridges and moving platforms.',
    };
  }

  if (state.levelId === '1-2') {
    return {
      title: 'Underground Secrets',
      message:
        'Ride the vertical elevator platforms carefully—or smash bricks as Super Mario to reach high coin rows!',
    };
  }

  const p = state.players[0];
  if (p.form === 'small') {
    return {
      title: 'Grab a Super Mushroom',
      message:
        'Bump ? blocks from below to uncover a Super Mushroom—it doubles your height and lets you break bricks!',
    };
  }

  return {
    title: 'Combo Stomps & Koopa Shells',
    message:
      'Stomp a Koopa Troopa and kick its shell to bowl down enemies ahead for escalating bonus points!',
  };
}
