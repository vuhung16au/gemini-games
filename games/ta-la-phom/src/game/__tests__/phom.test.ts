import { describe, expect, it } from 'vitest';
import {
  canDeclareU,
  canLayOffCard,
  findLayOffOptions,
  isValidPhom,
  solveOptimalMelds,
} from '../phom';
import type { Card, PhomMeld, Rank, Suit } from '../types';

function c(suit: Suit, rank: Rank): Card {
  return { id: `${suit}-${rank}`, suit, rank };
}

describe('Phỏm solver and rules', () => {
  it('validates 3-card and 4-card sets and same-suit consecutive runs', () => {
    expect(isValidPhom([c('spades', 7), c('hearts', 7), c('diamonds', 7)])).toBe('set');
    expect(
      isValidPhom([c('spades', 7), c('hearts', 7), c('diamonds', 7), c('clubs', 7)]),
    ).toBe('set');
    expect(isValidPhom([c('hearts', 1), c('hearts', 2), c('hearts', 3)])).toBe('run');
    expect(isValidPhom([c('clubs', 10), c('clubs', 11), c('clubs', 12), c('clubs', 13)])).toBe(
      'run',
    );

    // Invalid melds: Q-K-A wrap, duplicate cards, mixed suits, 2 cards
    expect(isValidPhom([c('hearts', 12), c('hearts', 13), c('hearts', 1)])).toBeNull();
    expect(isValidPhom([c('spades', 7), c('hearts', 7), c('hearts', 7)])).toBeNull();
    expect(isValidPhom([c('spades', 4), c('hearts', 5), c('spades', 6)])).toBeNull();
    expect(isValidPhom([c('spades', 4), c('spades', 5)])).toBeNull();
  });

  it('solves optimal overlapping melds to minimize deadwood points', () => {
    // 7♠ can go into 6♠-7♠-8♠ while 7♥-7♦-7♣ forms a 3-card set -> 0 deadwood instead of leaving 6♠+8♠!
    const hand = [
      c('spades', 6),
      c('spades', 7),
      c('spades', 8),
      c('hearts', 7),
      c('diamonds', 7),
      c('clubs', 7),
      c('clubs', 13), // K♣ = 13 deadwood
    ];

    const solved = solveOptimalMelds(hand);
    expect(solved.isPossible).toBe(true);
    expect(solved.melds).toHaveLength(2);
    expect(solved.deadwoodPoints).toBe(13);
    expect(solved.deadwood.map((x) => x.id)).toEqual(['clubs-13']);
  });

  it('enforces required eaten card coverage with max 1 eaten card per meld', () => {
    const hand = [
      c('hearts', 5),
      c('diamonds', 5),
      c('spades', 5),
      c('clubs', 5),
    ];

    // 1 eaten card covered -> valid
    expect(solveOptimalMelds(hand, ['spades-5'], { maxEatenPerMeld: 1 }).isPossible).toBe(true);

    // 2 eaten cards in the same 4-card set -> invalid (max 1 eaten per Phỏm)
    expect(
      solveOptimalMelds(hand, ['spades-5', 'clubs-5'], { maxEatenPerMeld: 1 }).isPossible,
    ).toBe(false);
  });

  it('validates Gửi bài (lay off) onto sets and runs', () => {
    const setMeld: PhomMeld = {
      id: 'm1',
      type: 'set',
      cards: [c('spades', 8), c('hearts', 8), c('diamonds', 8)],
      ownerIndex: 1,
    };
    const runMeld: PhomMeld = {
      id: 'm2',
      type: 'run',
      cards: [c('clubs', 4), c('clubs', 5), c('clubs', 6)],
      ownerIndex: 2,
    };

    expect(canLayOffCard(c('clubs', 8), setMeld)).toBe(true);
    expect(canLayOffCard(c('clubs', 3), runMeld)).toBe(true);
    expect(canLayOffCard(c('clubs', 7), runMeld)).toBe(true);
    expect(canLayOffCard(c('hearts', 7), runMeld)).toBe(false);

    const options = findLayOffOptions(
      [c('clubs', 8), c('clubs', 7), c('hearts', 2)],
      [
        { index: 1, melds: [setMeld] },
        { index: 2, melds: [runMeld] },
      ],
    );
    expect(options).toHaveLength(2);
  });

  it('detects Ù (9 cards in Phỏms + 1 discard) and Ù Tròn (10 cards in Phỏms)', () => {
    const uHand = [
      c('spades', 2),
      c('spades', 3),
      c('spades', 4),
      c('hearts', 6),
      c('diamonds', 6),
      c('clubs', 6),
      c('diamonds', 9),
      c('diamonds', 10),
      c('diamonds', 11),
      c('clubs', 13),
    ];
    expect(canDeclareU(uHand)).toBe(true);

    const uTronHand = [
      c('spades', 2),
      c('spades', 3),
      c('spades', 4),
      c('spades', 5),
      c('hearts', 6),
      c('diamonds', 6),
      c('clubs', 6),
      c('diamonds', 9),
      c('diamonds', 10),
      c('diamonds', 11),
    ];
    expect(canDeclareU(uTronHand)).toBe(true);

    const nonUHand = [...uHand.slice(0, 8), c('clubs', 2), c('clubs', 13)];
    expect(canDeclareU(nonUHand)).toBe(false);
  });
});
