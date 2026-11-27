import { describe, expect, it } from 'vitest';
import { runAiFullTurn } from '../ai';
import { createNewGame, discardCard, drawFromNoc, meldOptimalPhoms, proceedToDiscard } from '../engine';
import { getPhomHint } from '../hints';
import { createTutorialGame, syncTutorialAfterAction } from '../tutorial';

describe('AI, Hints, and 3-step Tutorial', () => {
  it('completes a full 4-player AI game cleanly to game_over', () => {
    let seed = 42;
    const seededRng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    let state = createNewGame({ playerCount: 4, mode: 'vs-ai', rng: seededRng });
    let safety = 0;

    while (state.phase !== 'game_over' && safety < 100) {
      const active = state.players[state.currentPlayerIndex];
      if (active.isAi) {
        state = runAiFullTurn(state);
      } else {
        // Human uses hint-guided play
        if (state.phase === 'draw_or_eat') {
          state = drawFromNoc(state);
        } else if (state.phase === 'meld') {
          state = meldOptimalPhoms(state);
          if (state.phase !== 'game_over') {
            state = proceedToDiscard(state);
          }
        } else if (state.phase === 'discard') {
          const hint = getPhomHint(state);
          if (hint?.target === 'declare_u') {
            state = meldOptimalPhoms(state);
          } else {
            const cardId = hint?.cardId ?? active.hand[0].id;
            state = discardCard(state, cardId);
          }
        }
      }
      safety++;
    }

    expect(state.phase).toBe('game_over');
    expect(state.results).toHaveLength(4);
    expect(state.winnerIndex).not.toBeNull();
  });

  it('provides contextual bilingual hints across phases', () => {
    const state = createTutorialGame();
    const step1Hint = getPhomHint(state);
    expect(step1Hint?.target).toBe('eat');
    expect(step1Hint?.message).toContain('7♠');
  });

  it('progresses through the 3-step tutorial (Draw/Eat -> Discard -> Form Phỏm)', () => {
    const state = createTutorialGame();
    expect(state.tutorialStep).toBe(1);

    // Step 1: Draw from Nọc (or Eat)
    const afterStep1 = syncTutorialAfterAction(state, drawFromNoc(state));
    expect(afterStep1.tutorialStep).toBe(2);
    expect(afterStep1.phase).toBe('discard');

    // Step 2: Discard K♦
    const afterStep2 = syncTutorialAfterAction(
      afterStep1,
      discardCard(afterStep1, 'diamonds-13'),
    );
    expect(afterStep2.tutorialStep).toBe(3);
    expect(afterStep2.phase).toBe('meld');
    expect(afterStep2.round).toBe(4);

    // Step 3: Form Phỏm (Meld)
    const afterStep3 = syncTutorialAfterAction(afterStep2, meldOptimalPhoms(afterStep2));
    expect(afterStep3.tutorialStep).toBe(4);
    expect(afterStep3.players[0].melds.length).toBeGreaterThanOrEqual(2);
  });
});
