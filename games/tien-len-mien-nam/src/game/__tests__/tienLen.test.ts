import { describe, expect, it } from 'vitest';
import { chooseAiPlay } from '../ai';
import {
  canBeat,
  checkToiTrang,
  compareCards,
  createDeck,
  detectCombo,
  findLegalPlays,
} from '../combos';
import { STORAGE_KEY } from '../constants';
import {
  createNewGame,
  cycleSortMode,
  passTurn,
  playCards,
  revealPassAndPlayHand,
  toggleCardSelection,
} from '../engine';
import { getSouthernHint } from '../hints';
import { loadPersistedData, savePersistedData } from '../storage';
import { createTutorialGame, handleTutorialPlay } from '../tutorial';
import type { Card } from '../types';

const card = (suit: Card['suit'], rank: Card['rank']): Card => ({
  id: `${suit}-${rank}`,
  rank,
  suit,
});

describe('Tiến Lên Miền Nam Engine', () => {
  it('creates a valid 52-card deck and orders 3 < ... < A < 2 with ♠ < ♣ < ♦ < ♥', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    expect(new Set(deck.map((c) => c.id)).size).toBe(52);

    expect(compareCards(card('spades', 3), card('clubs', 3))).toBeLessThan(0);
    expect(compareCards(card('clubs', 3), card('diamonds', 3))).toBeLessThan(0);
    expect(compareCards(card('diamonds', 3), card('hearts', 3))).toBeLessThan(0);
    expect(compareCards(card('hearts', 14), card('spades', 15))).toBeLessThan(0);
  });

  it('detects Southern mixed-suit straights and rejects straights containing 2', () => {
    const validStraight = detectCombo([
      card('spades', 4),
      card('hearts', 5),
      card('diamonds', 6),
      card('clubs', 7),
    ]);
    expect(validStraight?.type).toBe('STRAIGHT');
    expect(validStraight?.length).toBe(4);
    expect(validStraight?.highCard.id).toBe('clubs-7');

    const invalidWithTwo = detectCombo([
      card('spades', 13),
      card('hearts', 14),
      card('clubs', 15),
    ]);
    expect(invalidWithTwo).toBeNull();
  });

  it('compares same-type combos using suit tie-breaker on highest card', () => {
    const lowPair = detectCombo([card('spades', 9), card('diamonds', 9)])!;
    const highPair = detectCombo([card('clubs', 9), card('hearts', 9)])!;
    expect(canBeat(lowPair, highPair)).toBe(true);
    expect(canBeat(highPair, lowPair)).toBe(false);

    const lowStraight = detectCombo([
      card('hearts', 5),
      card('clubs', 6),
      card('spades', 7),
    ])!;
    const highStraight = detectCombo([
      card('spades', 5),
      card('diamonds', 6),
      card('hearts', 7),
    ])!;
    expect(canBeat(lowStraight, highStraight)).toBe(true);

    const diffLength = detectCombo([
      card('spades', 6),
      card('clubs', 7),
      card('diamonds', 8),
      card('hearts', 9),
    ])!;
    expect(canBeat(lowStraight, diffLength)).toBe(false);
  });

  it('enforces authentic Chặt Heo hierarchy (3 Đôi thông, Tứ quý, 4 Đôi thông)', () => {
    const singleTwo = detectCombo([card('hearts', 15)])!;
    const pairTwos = detectCombo([card('spades', 15), card('hearts', 15)])!;

    const threePairsLow = detectCombo([
      card('spades', 3),
      card('clubs', 3),
      card('spades', 4),
      card('clubs', 4),
      card('spades', 5),
      card('clubs', 5),
    ])!;
    const threePairsHigh = detectCombo([
      card('spades', 6),
      card('clubs', 6),
      card('spades', 7),
      card('clubs', 7),
      card('spades', 8),
      card('clubs', 8),
    ])!;
    const quad = detectCombo([
      card('spades', 4),
      card('clubs', 4),
      card('diamonds', 4),
      card('hearts', 4),
    ])!;
    const fourPairs = detectCombo([
      card('spades', 9),
      card('clubs', 9),
      card('spades', 10),
      card('clubs', 10),
      card('spades', 11),
      card('clubs', 11),
      card('spades', 12),
      card('clubs', 12),
    ])!;

    expect(threePairsLow.type).toBe('THREE_PAIRS');
    expect(quad.type).toBe('FOUR_OF_A_KIND');
    expect(fourPairs.type).toBe('FOUR_PAIRS');

    // 3 Đôi thông cuts single 2 or smaller 3 Đôi thông, not pair of 2s
    expect(canBeat(singleTwo, threePairsLow)).toBe(true);
    expect(canBeat(threePairsLow, threePairsHigh)).toBe(true);
    expect(canBeat(pairTwos, threePairsHigh)).toBe(false);

    // Tứ quý cuts single 2, pair of 2s, 3 Đôi thông, smaller Tứ quý
    expect(canBeat(singleTwo, quad)).toBe(true);
    expect(canBeat(pairTwos, quad)).toBe(true);
    expect(canBeat(threePairsHigh, quad)).toBe(true);
    expect(canBeat(fourPairs, quad)).toBe(false);

    // 4 Đôi thông cuts all of the above
    expect(canBeat(singleTwo, fourPairs)).toBe(true);
    expect(canBeat(pairTwos, fourPairs)).toBe(true);
    expect(canBeat(threePairsHigh, fourPairs)).toBe(true);
    expect(canBeat(quad, fourPairs)).toBe(true);
  });

  it('detects Tới Trắng instant wins (Sảnh Rồng, 6 Đôi, Tứ quý 2)', () => {
    const dragonHand: Card[] = [
      card('spades', 3),
      card('clubs', 4),
      card('diamonds', 5),
      card('hearts', 6),
      card('spades', 7),
      card('clubs', 8),
      card('diamonds', 9),
      card('hearts', 10),
      card('spades', 11),
      card('clubs', 12),
      card('diamonds', 13),
      card('hearts', 14),
      card('spades', 15),
    ];
    expect(checkToiTrang(dragonHand)).toBe('DRAGON_STRAIGHT');

    const sixPairsHand: Card[] = [
      card('spades', 3),
      card('clubs', 3),
      card('spades', 5),
      card('clubs', 5),
      card('spades', 7),
      card('clubs', 7),
      card('spades', 9),
      card('clubs', 9),
      card('spades', 11),
      card('clubs', 11),
      card('spades', 13),
      card('clubs', 13),
      card('hearts', 14),
    ];
    expect(checkToiTrang(sixPairsHand)).toBe('SIX_PAIRS');

    const fourTwosHand: Card[] = [
      card('spades', 15),
      card('clubs', 15),
      card('diamonds', 15),
      card('hearts', 15),
      card('spades', 3),
      card('clubs', 5),
      card('diamonds', 7),
      card('hearts', 9),
      card('spades', 10),
      card('clubs', 11),
      card('diamonds', 12),
      card('hearts', 13),
      card('spades', 14),
    ];
    expect(checkToiTrang(fourTwosHand)).toBe('FOUR_TWOS');
  });

  it('deals 13 cards each for 2P/3P/4P and starts Round 1 with lowest card holder', () => {
    for (const count of [2, 3, 4] as const) {
      const state = createNewGame({
        playerCount: count,
        mode: 'vs-ai',
        rng: () => 0.42,
      });
      expect(state.players).toHaveLength(count);
      for (const p of state.players) {
        expect(p.hand).toHaveLength(13);
      }
      if (state.status === 'PLAYING') {
        expect(state.mustIncludeCardId).not.toBeNull();
        const starter = state.players[state.currentTurn];
        expect(
          starter.hand.some((c) => c.id === state.mustIncludeCardId),
        ).toBe(true);
      }
    }
  });

  it('enforces opening card requirement, Pass & Play privacy curtain, and trick clear', () => {
    const p0Hand = [
      card('spades', 3),
      card('clubs', 5),
      card('hearts', 15),
    ];
    const p1Hand = [
      card('diamonds', 4),
      card('clubs', 9),
      card('spades', 14),
    ];

    let state = createNewGame({
      playerCount: 2,
      mode: 'pass-and-play',
      customHands: [p0Hand, p1Hand],
    });

    expect(state.privacyCurtain).toBe(true);
    expect(state.currentTurn).toBe(0);
    expect(state.mustIncludeCardId).toBe('spades-3');

    state = revealPassAndPlayHand(state);
    expect(state.privacyCurtain).toBe(false);

    // Playing without 3♠ on opening turn is rejected
    const badPlay = playCards(state, ['clubs-5']);
    expect(badPlay.currentTurn).toBe(0);
    expect(badPlay.players[0].hand).toHaveLength(3);

    // Playing 3♠ succeeds and triggers privacy curtain for Player 2
    state = playCards(state, ['spades-3']);
    expect(state.currentTurn).toBe(1);
    expect(state.privacyCurtain).toBe(true);
    expect(state.mustIncludeCardId).toBeNull();

    state = revealPassAndPlayHand(state);
    // Player 2 passes -> trick clears -> back to Player 1 with curtain
    state = passTurn(state);
    expect(state.currentTurn).toBe(0);
    expect(state.currentCombo).toBeNull();
    expect(state.privacyCurtain).toBe(true);
  });

  it('computes smart AI plays, hints, sorting, and completes 3-step tutorial', () => {
    let tut = createTutorialGame();
    expect(tut.tutorial.step).toBe(1);

    const hint1 = getSouthernHint(tut);
    expect(hint1?.cardIds).toEqual(['diamonds-14']);

    tut = handleTutorialPlay(tut, hint1!.cardIds);
    expect(tut.tutorial.step).toBe(2);
    expect(tut.currentCombo?.highCard.id).toBe('spades-15');

    const hint2 = getSouthernHint(tut);
    expect(hint2?.comboType).toBe('THREE_PAIRS');
    tut = handleTutorialPlay(tut, hint2!.cardIds);
    expect(tut.tutorial.step).toBe(3);

    const hint3 = getSouthernHint(tut);
    expect(hint3?.comboType).toBe('STRAIGHT');
    expect(hint3?.cardIds).toEqual(['spades-11', 'diamonds-12', 'clubs-13']);
    tut = handleTutorialPlay(tut, hint3!.cardIds);
    expect(tut.status).toBe('ROUND_OVER');
    expect(tut.tutorial.step).toBe(4);

    // Test AI & sorting on custom game
    const game = createNewGame({
      playerCount: 2,
      mode: 'vs-ai',
      customHands: [
        [card('spades', 3), card('hearts', 10), card('clubs', 10)],
        [card('diamonds', 6), card('clubs', 7), card('hearts', 8)],
      ],
    });
    const legal = findLegalPlays(
      game.players[0].hand,
      null,
      game.mustIncludeCardId,
    );
    expect(legal.length).toBeGreaterThan(0);

    const aiPick = chooseAiPlay(game, 0);
    expect(aiPick).not.toBeNull();
    expect(aiPick!.cards.some((c) => c.id === 'spades-3')).toBe(true);

    const sorted = cycleSortMode(toggleCardSelection(game, 'spades-3'));
    expect(sorted.sortMode).toBe('combo');
  });

  it('safely loads and saves persisted data under tien_len_mien_nam_v1', () => {
    const store = new Map<string, string>();
    (globalThis as unknown as { window: Record<string, unknown> }).window = {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
      },
    };

    savePersistedData({
      wins: 3,
      bestScore: 42,
      totalScore: 70,
      gamesPlayed: 5,
      muted: true,
      playerCount: 3,
      mode: 'pass-and-play',
    });

    expect(store.has(STORAGE_KEY)).toBe(true);
    const loaded = loadPersistedData();
    expect(loaded).toEqual({
      wins: 3,
      bestScore: 42,
      totalScore: 70,
      gamesPlayed: 5,
      muted: true,
      playerCount: 3,
      mode: 'pass-and-play',
    });

    delete (globalThis as unknown as { window?: unknown }).window;
  });
});
