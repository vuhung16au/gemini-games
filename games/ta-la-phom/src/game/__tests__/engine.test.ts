import { describe, expect, it } from 'vitest';
import {
  canEatLastDiscard,
  createNewGame,
  declareU,
  discardCard,
  drawFromNoc,
  eatLastDiscard,
  getLegalDiscardIds,
  layOffSingleCard,
  meldOptimalPhoms,
  proceedToDiscard,
} from '../engine';
import type { Card, Rank, Suit, TaLaState } from '../types';

function c(suit: Suit, rank: Rank): Card {
  return { id: `${suit}-${rank}`, suit, rank };
}

describe('Tá Lả engine', () => {
  it('deals 10 cards to dealer, 9 to others, and remaining cards to Nọc for 2P/3P/4P', () => {
    for (const count of [2, 3, 4] as const) {
      const state = createNewGame({ playerCount: count, mode: 'vs-ai' });
      expect(state.players).toHaveLength(count);
      expect(state.players[0].hand).toHaveLength(10);
      for (let i = 1; i < count; i++) {
        expect(state.players[i].hand).toHaveLength(9);
      }
      expect(state.nocPile).toHaveLength(52 - (10 + 9 * (count - 1)));
      expect(state.phase).toBe('discard');
      expect(state.round).toBe(1);
    }
  });

  it('creates Pass & Play games with all human players', () => {
    const state = createNewGame({ playerCount: 3, mode: 'pass-and-play' });
    expect(state.players.every((p) => !p.isAi)).toBe(true);
    expect(state.players.map((p) => p.nameEn)).toEqual(['Player 1', 'Player 2', 'Player 3']);
  });

  it('strictly validates Ăn / Eat and prevents discarding eaten cards', () => {
    const base = createNewGame({ playerCount: 2, mode: 'pass-and-play' });
    const custom: TaLaState = {
      ...base,
      currentPlayerIndex: 1,
      phase: 'draw_or_eat',
      lastDiscard: { card: c('spades', 7), playerIndex: 0 },
      players: [
        {
          ...base.players[0],
          discards: [c('spades', 7)],
        },
        {
          ...base.players[1],
          hand: [
            c('hearts', 7),
            c('diamonds', 7),
            c('clubs', 2),
            c('clubs', 4),
            c('clubs', 9),
            c('spades', 3),
            c('spades', 11),
            c('hearts', 12),
            c('diamonds', 13),
          ],
        },
      ],
    };

    expect(canEatLastDiscard(custom, 1)).toBe(true);
    const afterEat = eatLastDiscard(custom);
    expect(afterEat.players[1].eatenCardIds).toContain('spades-7');
    expect(afterEat.players[0].discards).toHaveLength(0);
    expect(afterEat.phase).toBe('discard');

    const legal = getLegalDiscardIds(afterEat, 1);
    expect(legal).not.toContain('spades-7');
    expect(legal).not.toContain('hearts-7');
    expect(legal).not.toContain('diamonds-7');
    expect(legal).toContain('diamonds-13');

    // Invalid eat if card does not form a Phỏm
    const invalidEatState: TaLaState = {
      ...custom,
      lastDiscard: { card: c('hearts', 10), playerIndex: 0 },
    };
    expect(canEatLastDiscard(invalidEatState, 1)).toBe(false);
  });

  it('supports Round 4 Hạ Phỏm, Gửi bài, and Móm / Cháy scoring', () => {
    const base = createNewGame({ playerCount: 2, mode: 'pass-and-play' });
    const round4State: TaLaState = {
      ...base,
      round: 4,
      turnsCompletedInRound: 0,
      currentPlayerIndex: 0,
      phase: 'meld',
      players: [
        {
          ...base.players[0],
          hand: [
            c('hearts', 4),
            c('hearts', 5),
            c('hearts', 6),
            c('clubs', 9), // Can lay off onto Player 1's 9s set!
            c('hearts', 2),
            c('spades', 12),
          ],
          hasMelded: false,
        },
        {
          ...base.players[1],
          hand: [c('diamonds', 10), c('clubs', 13)], // No Phỏm -> Móm!
          melds: [
            {
              id: 'p1-m0',
              type: 'set',
              cards: [c('spades', 9), c('hearts', 9), c('diamonds', 9)],
              ownerIndex: 1,
            },
          ],
          hasMelded: true,
        },
      ],
    };

    const afterMeld = meldOptimalPhoms(round4State);
    expect(afterMeld.players[0].melds).toHaveLength(1);
    expect(afterMeld.players[0].hasMelded).toBe(true);

    const afterLayoff = layOffSingleCard(afterMeld, 'clubs-9', 1, 'p1-m0');
    expect(afterLayoff.players[0].hand.map((x) => x.id)).toEqual(['hearts-2', 'spades-12']);
    expect(afterLayoff.players[1].melds[0].cards).toHaveLength(4);

    const readyDiscard = proceedToDiscard(afterLayoff);
    expect(readyDiscard.phase).toBe('discard');

    // Advance to player 1's final turn in Round 4
    const p1Turn = discardCard(readyDiscard, 'spades-12');
    expect(p1Turn.currentPlayerIndex).toBe(1);
    expect(p1Turn.round).toBe(4);
    expect(p1Turn.phase).toBe('draw_or_eat');

    // Make player 1 Móm with no melds
    const momState: TaLaState = {
      ...p1Turn,
      players: [
        p1Turn.players[0],
        {
          ...p1Turn.players[1],
          melds: [],
          hasMelded: false,
          hand: [c('clubs', 2), c('diamonds', 5), c('hearts', 8), c('spades', 13)],
        },
      ],
      nocPile: [c('diamonds', 2)],
    };

    const p1Drew = drawFromNoc(momState);
    const p1Melded = meldOptimalPhoms(p1Drew);
    expect(p1Melded.players[1].melds).toHaveLength(0);
    const p1ToDiscard = proceedToDiscard(p1Melded);
    const finished = discardCard(p1ToDiscard, 'spades-13');

    expect(finished.phase).toBe('game_over');
    expect(finished.winnerIndex).toBe(0);
    expect(finished.results?.find((r) => r.playerIndex === 1)?.isMom).toBe(true);
  });

  it('detects instant Ù and ends the hand immediately', () => {
    const base = createNewGame({ playerCount: 2, mode: 'vs-ai' });
    const uState: TaLaState = {
      ...base,
      phase: 'discard',
      currentPlayerIndex: 0,
      players: [
        {
          ...base.players[0],
          hand: [
            c('spades', 2),
            c('spades', 3),
            c('spades', 4),
            c('hearts', 6),
            c('diamonds', 6),
            c('clubs', 6),
            c('clubs', 10),
            c('clubs', 11),
            c('clubs', 12),
            c('diamonds', 4),
          ],
        },
        base.players[1],
      ],
    };

    const done = declareU(uState);
    expect(done.phase).toBe('game_over');
    expect(done.winReason).toBe('U');
    expect(done.winnerIndex).toBe(0);
    expect(done.results?.[0].isU).toBe(true);
  });
});
