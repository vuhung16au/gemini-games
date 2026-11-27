import { describe, expect, it } from 'vitest';
import { card, createDeck, sortCardsByCombo } from './deck';
import {
  canBeatNorthern,
  classifyNorthernCombo,
  findValidPlays,
  validatePlay,
} from './rules';
import type { GameState } from './types';

function makeMinimalState(overrides: Partial<GameState>): GameState {
  return {
    playerCount: 2,
    mode: 'ai',
    players: [
      {
        id: 0,
        nameVi: 'Bạn',
        nameEn: 'You',
        isHuman: true,
        hand: [],
        passed: false,
        chatHeoPoints: 0,
      },
      {
        id: 1,
        nameVi: 'Máy 1',
        nameEn: 'AI 1',
        isHuman: false,
        hand: [card('clubs', 9)],
        passed: false,
        chatHeoPoints: 0,
      },
    ],
    currentPlayerIndex: 0,
    lastPlayerIndex: null,
    tableCombo: null,
    tableOwnerName: null,
    isFirstTurnOfMatch: false,
    mustIncludeCardId: null,
    handoffRequired: false,
    status: 'playing',
    winnerIndex: null,
    roundScores: [],
    eventBanner: null,
    isTutorial: false,
    tutorialStep: 0,
    sortMode: 'rank',
    ...overrides,
  };
}

describe('Northern Tiến Lên Deck & Combo Classification', () => {
  it('creates 52 unique cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    expect(new Set(deck.map((c) => c.id)).size).toBe(52);
  });

  it('requires pairs to match color (♠♣ or ♦♥)', () => {
    expect(classifyNorthernCombo([card('spades', 5), card('clubs', 5)])?.type).toBe(
      'PAIR',
    );
    expect(classifyNorthernCombo([card('diamonds', 8), card('hearts', 8)])?.type).toBe(
      'PAIR',
    );
    // Mixed color pair is invalid in Northern Tiến Lên
    expect(classifyNorthernCombo([card('spades', 5), card('hearts', 5)])).toBeNull();
    expect(classifyNorthernCombo([card('clubs', 9), card('diamonds', 9)])).toBeNull();
  });

  it('requires straights to be >= 3 cards, same suit, and exclude 2', () => {
    const validStraight = classifyNorthernCombo([
      card('hearts', 4),
      card('hearts', 5),
      card('hearts', 6),
      card('hearts', 7),
    ]);
    expect(validStraight?.type).toBe('STRAIGHT');
    expect(validStraight?.length).toBe(4);

    // Mixed suit straight invalid
    expect(
      classifyNorthernCombo([
        card('hearts', 4),
        card('diamonds', 5),
        card('hearts', 6),
      ]),
    ).toBeNull();

    // Contains 2 invalid
    expect(
      classifyNorthernCombo([
        card('spades', 13),
        card('spades', 14),
        card('spades', 15),
      ]),
    ).toBeNull();
  });

  it('classifies Triples and Tứ quý', () => {
    expect(
      classifyNorthernCombo([
        card('spades', 7),
        card('clubs', 7),
        card('diamonds', 7),
      ])?.type,
    ).toBe('TRIPLE');

    expect(
      classifyNorthernCombo([
        card('spades', 6),
        card('clubs', 6),
        card('diamonds', 6),
        card('hearts', 6),
      ])?.type,
    ).toBe('TU_QUY');
  });

  it('sorts combos cleanly by structure', () => {
    const hand = [
      card('hearts', 9),
      card('spades', 4),
      card('spades', 5),
      card('spades', 6),
      card('diamonds', 9),
    ];
    const sorted = sortCardsByCombo(hand);
    expect(sorted).toHaveLength(5);
  });
});

describe('Strict Northern Beating Rules & Chặt Heo / Thối 2', () => {
  it('enforces same-suit single matching except 2 (Heo)', () => {
    const d7 = classifyNorthernCombo([card('diamonds', 7)])!;
    const d9 = classifyNorthernCombo([card('diamonds', 9)])!;
    const s10 = classifyNorthernCombo([card('spades', 10)])!;
    const s2 = classifyNorthernCombo([card('spades', 15)])!;
    const h2 = classifyNorthernCombo([card('hearts', 15)])!;
    const aHearts = classifyNorthernCombo([card('hearts', 14)])!;

    expect(canBeatNorthern(d9, d7)).toBe(true);
    expect(canBeatNorthern(s10, d7)).toBe(false); // different suit
    expect(canBeatNorthern(s2, aHearts)).toBe(true); // 2 beats any non-2 regardless of suit
    expect(canBeatNorthern(h2, s2)).toBe(true); // higher suit 2 beats lower suit 2
    expect(canBeatNorthern(s2, h2)).toBe(false);
  });

  it('enforces same-color pair beating', () => {
    const black4 = classifyNorthernCombo([card('spades', 4), card('clubs', 4)])!;
    const black5 = classifyNorthernCombo([card('spades', 5), card('clubs', 5)])!;
    const red8 = classifyNorthernCombo([card('diamonds', 8), card('hearts', 8)])!;

    expect(canBeatNorthern(black5, black4)).toBe(true);
    expect(canBeatNorthern(red8, black4)).toBe(false);
  });

  it('enforces exact 3-suit matching for Triples', () => {
    const t4 = classifyNorthernCombo([
      card('spades', 4),
      card('clubs', 4),
      card('diamonds', 4),
    ])!;
    const t6Match = classifyNorthernCombo([
      card('spades', 6),
      card('clubs', 6),
      card('diamonds', 6),
    ])!;
    const t6Mismatch = classifyNorthernCombo([
      card('spades', 6),
      card('clubs', 6),
      card('hearts', 6),
    ])!;

    expect(canBeatNorthern(t6Match, t4)).toBe(true);
    expect(canBeatNorthern(t6Mismatch, t4)).toBe(false);
  });

  it('enforces same-length and same-suit matching for Straights', () => {
    const s3 = classifyNorthernCombo([
      card('clubs', 3),
      card('clubs', 4),
      card('clubs', 5),
    ])!;
    const s6Clubs = classifyNorthernCombo([
      card('clubs', 6),
      card('clubs', 7),
      card('clubs', 8),
    ])!;
    const s6Spades = classifyNorthernCombo([
      card('spades', 6),
      card('spades', 7),
      card('spades', 8),
    ])!;
    const s4Clubs = classifyNorthernCombo([
      card('clubs', 6),
      card('clubs', 7),
      card('clubs', 8),
      card('clubs', 9),
    ])!;

    expect(canBeatNorthern(s6Clubs, s3)).toBe(true);
    expect(canBeatNorthern(s6Spades, s3)).toBe(false);
    expect(canBeatNorthern(s4Clubs, s3)).toBe(false);
  });

  it('allows Tứ quý to cut single 2 (Chặt Heo) and smaller Tứ quý', () => {
    const h2 = classifyNorthernCombo([card('hearts', 15)])!;
    const tq6 = classifyNorthernCombo([
      card('spades', 6),
      card('clubs', 6),
      card('diamonds', 6),
      card('hearts', 6),
    ])!;
    const tq9 = classifyNorthernCombo([
      card('spades', 9),
      card('clubs', 9),
      card('diamonds', 9),
      card('hearts', 9),
    ])!;
    const pair4 = classifyNorthernCombo([card('spades', 4), card('clubs', 4)])!;

    expect(canBeatNorthern(tq6, h2)).toBe(true);
    expect(canBeatNorthern(tq9, tq6)).toBe(true);
    expect(canBeatNorthern(tq6, tq9)).toBe(false);
    expect(canBeatNorthern(tq6, pair4)).toBe(false);
  });

  it('blocks finishing with 2 as last card (Thối 2) and warns when leaving only 2s', () => {
    const stateLastTwo = makeMinimalState({
      players: [
        {
          id: 0,
          nameVi: 'Bạn',
          nameEn: 'You',
          isHuman: true,
          hand: [card('hearts', 15)],
          passed: false,
          chatHeoPoints: 0,
        },
        {
          id: 1,
          nameVi: 'Máy 1',
          nameEn: 'AI 1',
          isHuman: false,
          hand: [card('clubs', 9)],
          passed: false,
          chatHeoPoints: 0,
        },
      ],
    });
    const resBlock = validatePlay(stateLastTwo, ['hearts-15']);
    expect(resBlock.valid).toBe(false);
    expect(resBlock.isThoi2Block).toBe(true);

    const stateWarn = makeMinimalState({
      players: [
        {
          id: 0,
          nameVi: 'Bạn',
          nameEn: 'You',
          isHuman: true,
          hand: [card('spades', 7), card('hearts', 15)],
          passed: false,
          chatHeoPoints: 0,
        },
        {
          id: 1,
          nameVi: 'Máy 1',
          nameEn: 'AI 1',
          isHuman: false,
          hand: [card('clubs', 9)],
          passed: false,
          chatHeoPoints: 0,
        },
      ],
    });
    const resWarn = validatePlay(stateWarn, ['spades-7']);
    expect(resWarn.valid).toBe(true);
    expect(resWarn.warnsThoi2).toBe(true);
  });

  it('enumerates only legal Northern plays in findValidPlays', () => {
    const hand = [
      card('spades', 3),
      card('spades', 10),
      card('diamonds', 9),
      card('hearts', 15),
    ];
    const table7d = classifyNorthernCombo([card('diamonds', 7)])!;
    const plays = findValidPlays(hand, table7d, null);
    const ids = plays.map((p) => p.cards[0].id);
    expect(ids).toEqual(['diamonds-9', 'hearts-15']);
  });
});
