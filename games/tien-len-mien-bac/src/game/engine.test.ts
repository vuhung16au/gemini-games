import { describe, expect, it } from 'vitest';
import { chooseAiAction } from './ai';
import { card } from './deck';
import {
  createGameState,
  passTurn,
  playCards,
  revealHandoff,
} from './engine';
import { getNorthernHint } from './hints';
import { classifyNorthernCombo } from './rules';
import { STORAGE_KEY, loadSaveData, saveSaveData } from './storage';
import { applyTutorialStepPlay, createTutorialState } from './tutorial';

describe('Tiến Lên Miền Bắc Engine, Hints, AI, Tutorial & Storage', () => {
  it('deals 13 cards per player for 2P, 3P, and 4P', () => {
    for (const count of [2, 3, 4] as const) {
      const state = createGameState(count, 'ai', 'rank', () => 0.42);
      expect(state.players).toHaveLength(count);
      for (const p of state.players) {
        expect(p.hand).toHaveLength(13);
      }
      if (count === 4) {
        expect(state.mustIncludeCardId).toBe('spades-3');
        expect(state.players[state.currentPlayerIndex].hand.some((c) => c.id === 'spades-3')).toBe(
          true,
        );
      }
    }
  });

  it('enforces Privacy Handoff Curtain in Pass & Play (hotseat) mode', () => {
    const state = createGameState(2, 'hotseat', 'rank', () => 0.1);
    expect(state.handoffRequired).toBe(true);
    const revealed = revealHandoff(state);
    expect(revealed.handoffRequired).toBe(false);

    // First player plays lowest card
    const firstCard = revealed.mustIncludeCardId
      ? revealed.mustIncludeCardId
      : revealed.players[revealed.currentPlayerIndex].hand[0].id;
    const outcome = playCards(revealed, [firstCard]);
    expect(outcome.played).toBe(true);
    expect(outcome.state.handoffRequired).toBe(true);
  });

  it('resets trick when all opponents pass and awards Chặt Heo bonus', () => {
    let state = createGameState(2, 'hotseat', 'rank', () => 0.5);
    state = {
      ...state,
      handoffRequired: false,
      isFirstTurnOfMatch: false,
      mustIncludeCardId: null,
      currentPlayerIndex: 0,
      players: [
        {
          id: 0,
          nameVi: 'P1',
          nameEn: 'P1',
          isHuman: true,
          hand: [card('hearts', 15), card('clubs', 5)],
          passed: false,
          chatHeoPoints: 0,
        },
        {
          id: 1,
          nameVi: 'P2',
          nameEn: 'P2',
          isHuman: true,
          hand: [
            card('spades', 6),
            card('clubs', 6),
            card('diamonds', 6),
            card('hearts', 6),
            card('diamonds', 10),
          ],
          passed: false,
          chatHeoPoints: 0,
        },
      ],
    };

    const p1Play = playCards(state, ['hearts-15']);
    expect(p1Play.played).toBe(true);

    const p2Cut = playCards(p1Play.state, [
      'spades-6',
      'clubs-6',
      'diamonds-6',
      'hearts-6',
    ]);
    expect(p2Cut.played).toBe(true);
    expect(p2Cut.chatHeo).toBe(true);
    expect(p2Cut.state.players[1].chatHeoPoints).toBe(10);
    expect(p2Cut.state.players[0].chatHeoPoints).toBe(-10);

    // P1 passes -> trick resets to P2 with tableCombo = null
    const p1Pass = passTurn(p2Cut.state);
    expect(p1Pass.passed).toBe(true);
    expect(p1Pass.state.tableCombo).toBeNull();
    expect(p1Pass.state.currentPlayerIndex).toBe(1);
  });

  it('computes lowest valid beating combo in getNorthernHint and smart AI play', () => {
    const state = createGameState(2, 'ai', 'rank', () => 0.25);
    const custom = {
      ...state,
      isFirstTurnOfMatch: false,
      mustIncludeCardId: null,
      currentPlayerIndex: 0,
      tableCombo: classifyNorthernCombo([card('spades', 5)]),
      players: [
        {
          ...state.players[0],
          hand: [
            card('spades', 4),
            card('spades', 8),
            card('spades', 11),
            card('hearts', 15),
          ],
        },
        {
          ...state.players[1],
          hand: [card('clubs', 9), card('clubs', 10)],
        },
      ],
    };

    const hint = getNorthernHint(custom);
    expect(hint?.cards.map((c) => c.id)).toEqual(['spades-8']);

    const aiState = { ...custom, currentPlayerIndex: 1 };
    const aiDecision = chooseAiAction(aiState);
    expect(aiDecision.action).toBe('pass');
  });

  it('runs the 3-step Tutorial deterministically', () => {
    const tut = createTutorialState();
    expect(tut.tutorialStep).toBe(0);

    const step1 = applyTutorialStepPlay(tut, ['spades-3']);
    expect(step1.valid).toBe(true);
    expect(step1.state.tutorialStep).toBe(1);

    // Wrong suit should fail Step 2
    const wrongStep2 = applyTutorialStepPlay(step1.state, ['spades-10']);
    expect(wrongStep2.valid).toBe(false);

    const step2 = applyTutorialStepPlay(step1.state, ['diamonds-9']);
    expect(step2.valid).toBe(true);
    expect(step2.state.tutorialStep).toBe(2);

    const step3 = applyTutorialStepPlay(step2.state, [
      'spades-6',
      'clubs-6',
      'diamonds-6',
      'hearts-6',
    ]);
    expect(step3.valid).toBe(true);
    expect(step3.state.tutorialStep).toBe(3);
  });

  it('safely loads and saves under tien_len_mien_bac_v1', () => {
    const store = new Map<string, string>();
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
      },
    };

    saveSaveData({
      wins: 3,
      gamesPlayed: 5,
      bestScore: 42,
      totalScore: 88,
      muted: true,
      playerCount: 3,
      mode: 'hotseat',
    });

    expect(store.has(STORAGE_KEY)).toBe(true);
    const loaded = loadSaveData();
    expect(loaded).toEqual({
      wins: 3,
      gamesPlayed: 5,
      bestScore: 42,
      totalScore: 88,
      muted: true,
      playerCount: 3,
      mode: 'hotseat',
    });

    // Handles corrupt JSON gracefully
    store.set(STORAGE_KEY, '{corrupt');
    expect(loadSaveData().wins).toBe(0);
  });

  it('handles passing tricks, round reset when all pass, and invalid play rejections', () => {
    const state = createGameState(3, 'ai', 'suit', () => 0.25);
    expect(classifyNorthernCombo([card('spades', 5), card('clubs', 5)])?.type).toBe('PAIR');

    // Invalid empty play fails
    const bad = playCards(state, []);
    expect(bad.played).toBe(false);

    // Play a valid lead and pass around to reset trick
    const lead = getNorthernHint(state);
    if (lead && lead.cards.length > 0) {
      const afterLead = playCards(
        state,
        lead.cards.map((c) => c.id),
      );
      expect(afterLead.played).toBe(true);
      let curr = afterLead.state;
      for (let i = 0; i < 2 && curr.status === 'PLAYING'; i++) {
        const passed = passTurn(curr);
        if (passed.passed) curr = passed.state;
      }
      expect(curr.players).toHaveLength(3);
    }

    expect(
      classifyNorthernCombo([
        card('spades', 4),
        card('spades', 5),
        card('spades', 6),
      ])?.type,
    ).toBe('STRAIGHT');
    expect(
      classifyNorthernCombo([
        card('spades', 8),
        card('clubs', 8),
        card('diamonds', 8),
      ])?.type,
    ).toBe('TRIPLE');
    expect(
      classifyNorthernCombo([card('spades', 4), card('hearts', 5)]),
    ).toBeNull();

    // AI response when beating a pair
    const pairBeatState = {
      ...state,
      handoffRequired: false,
      isFirstTurnOfMatch: false,
      mustIncludeCardId: null,
      tableCombo: classifyNorthernCombo([card('spades', 4), card('clubs', 4)]),
      currentPlayerIndex: 1,
      players: state.players.map((p, idx) =>
        idx === 1
          ? { ...p, hand: [card('spades', 9), card('clubs', 9), card('hearts', 12)] }
          : p,
      ),
    };
    expect(chooseAiAction(pairBeatState).action).toBe('play');
  });
});
