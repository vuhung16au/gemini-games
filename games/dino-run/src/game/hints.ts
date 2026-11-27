import { DINO_X } from './constants';
import type { DinoHint, DinoState } from './types';

export function getDinoHint(state: DinoState): DinoHint {
  const nextObs = state.obstacles.find((o) => o.x + o.width > DINO_X);
  if (nextObs) {
    const isHigh = nextObs.kind === 'pterodactyl' || nextObs.kind === 'flyingSign';
    if (isHigh && nextObs.y < 145) {
      return {
        title: 'Duck Under Flying Hazards',
        message: 'Hold Down Arrow or S to duck underneath mid-air pterodactyls and flying signs!',
      };
    }
    return {
      title: 'Time Your Jump',
      message:
        'Press Space or Up Arrow right before the obstacle reaches you—tap Down mid-air to fast-fall!',
    };
  }

  return {
    title: 'Pro Runner Tip',
    message:
      'Switch between Classic Desert (with Day/Night cycles every 700 pts) and 404 Math Proof Runner anytime!',
  };
}
