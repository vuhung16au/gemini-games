import { describe, expect, it } from 'vitest';
import { DINO_X, GROUND_Y, RESTART_COOLDOWN_MS } from '../constants';
import {
  createDinoState,
  setDucking,
  startDinoRun,
  stepDino,
  triggerJump,
} from '../engine';
import { getDinoHint } from '../hints';
import { loadDinoSave, saveDinoData } from '../storage';
import { getTutorialProgress } from '../tutorial';

describe('Dino Run Engine', () => {
  it('starts on first jump, accelerates, and toggles Classic Day/Night every 700 pts', () => {
    let state = createDinoState({ theme: 'classic' });
    expect(state.status).toBe('idle');

    state = triggerJump(state, 1000);
    expect(state.status).toBe('running');
    expect(state.dinoVy).toBeLessThan(0);

    // Simulate until grounded
    for (let i = 0; i < 40; i++) {
      state = stepDino(state, 0.03, 1000 + i * 30, () => 0.5);
    }
    expect(state.isGrounded).toBe(true);
    expect(state.score).toBeGreaterThan(0);

    // Verify night mode activates at score >= 700
    state.score = 705;
    state = stepDino(state, 0.016, 3000, () => 0.5);
    expect(state.isNight).toBe(true);
  });

  it('supports ducking / fast-fall and detects obstacle collisions with restart cooldown', () => {
    let state = startDinoRun(createDinoState({ theme: 'math404' }));
    state = setDucking(state, true);
    expect(state.isDucking).toBe(true);
    expect(state.hasDuckedOrFastFell).toBe(true);
    state = setDucking(state, false);

    // Place obstacle directly overlapping Dino
    state.obstacles.push({
      uid: 99,
      kind: 'sigma',
      label: '∑',
      x: DINO_X + 6,
      y: GROUND_Y - 30,
      width: 26,
      height: 30,
      passed: false,
    });

    state = stepDino(state, 0.016, 2000, () => 0.5);
    expect(state.status).toBe('gameover');

    // Cooldown prevents accidental immediate restart
    const tooEarly = triggerJump(state, 2000 + RESTART_COOLDOWN_MS - 50);
    expect(tooEarly.status).toBe('gameover');

    const restarted = triggerJump(state, 2000 + RESTART_COOLDOWN_MS + 50);
    expect(restarted.status).toBe('running');
  });

  it('tracks tutorial steps, hints, and safe localStorage persistence', () => {
    const tut = createDinoState({ isTutorial: true });
    expect(getTutorialProgress(tut).stepIndex).toBe(0);
    expect(getDinoHint(tut).title.length).toBeGreaterThan(0);

    tut.hasJumped = true;
    tut.obstaclesCleared = 1;
    expect(getTutorialProgress(tut).stepIndex).toBe(1);

    tut.hasDuckedOrFastFell = true;
    expect(getTutorialProgress(tut).stepIndex).toBe(2);

    tut.obstaclesCleared = 3;
    expect(getTutorialProgress(tut).completed).toBe(true);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveDinoData({ highScore: 1420, theme: 'math404', muted: true }, mockStorage);
    expect(loadDinoSave(mockStorage)).toEqual({
      highScore: 1420,
      theme: 'math404',
      muted: true,
    });

    store.set('dino_run_v1', '{bad');
    expect(loadDinoSave(mockStorage)).toEqual({
      highScore: 0,
      theme: 'classic',
      muted: false,
    });
  });
});
