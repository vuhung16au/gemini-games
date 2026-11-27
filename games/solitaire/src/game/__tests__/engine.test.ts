import { describe, expect, it } from 'vitest';
import {
  autoMoveToFoundation,
  canAutoComplete,
  canMoveToFoundation,
  canMoveToTableau,
  createDeck,
  createGameState,
  drawFromStock,
  moveCards,
  stepAutoComplete,
  undoMove,
} from '../engine';
import { findBestHint } from '../hints';
import { loadSaveData, saveSaveData } from '../storage';
import { createTutorialState } from '../tutorial';
import type { Card, GameState } from '../types';

function card(suit: Card['suit'], rank: Card['rank'], faceUp = true): Card {
  return { id: `${suit}-${rank}`, suit, rank, faceUp };
}

describe('Solitaire Klondike engine', () => {
  it('deals 28 tableau cards (1..7 per column) and 24 stock cards', () => {
    expect(createDeck()).toHaveLength(52);

    const state = createGameState(1, () => 0.42);
    expect(state.stock).toHaveLength(24);
    expect(state.waste).toHaveLength(0);
    expect(state.tableau).toHaveLength(7);

    state.tableau.forEach((col, idx) => {
      expect(col).toHaveLength(idx + 1);
      col.forEach((c, cIdx) => {
        expect(c.faceUp).toBe(cIdx === idx);
      });
    });
  });

  it('validates foundation and tableau stacking rules', () => {
    expect(canMoveToFoundation(card('hearts', 1), [])).toBe(true);
    expect(canMoveToFoundation(card('hearts', 2), [])).toBe(false);
    expect(canMoveToFoundation(card('hearts', 2), [card('hearts', 1)])).toBe(true);
    expect(canMoveToFoundation(card('spades', 2), [card('hearts', 1)])).toBe(false);

    expect(canMoveToTableau(card('spades', 13), [])).toBe(true);
    expect(canMoveToTableau(card('spades', 12), [])).toBe(false);
    expect(canMoveToTableau(card('hearts', 6), [card('spades', 7)])).toBe(true);
    expect(canMoveToTableau(card('diamonds', 6), [card('hearts', 7)])).toBe(false);
  });

  it('draws 1 or 3 cards from stock and recycles waste cleanly', () => {
    let state = createGameState(3, () => 0.1);
    state = drawFromStock(state);
    expect(state.stock).toHaveLength(21);
    expect(state.waste).toHaveLength(3);
    expect(state.waste.every((c) => c.faceUp)).toBe(true);

    // Exhaust stock
    for (let i = 0; i < 7; i++) {
      state = drawFromStock(state);
    }
    expect(state.stock).toHaveLength(0);
    expect(state.waste).toHaveLength(24);

    // Next draw recycles waste back to stock face-down
    state = drawFromStock(state);
    expect(state.stock).toHaveLength(24);
    expect(state.waste).toHaveLength(0);
    expect(state.stock.every((c) => !c.faceUp)).toBe(true);
  });

  it('moves stacks, auto-flips uncovered cards, scores, and supports undo', () => {
    const state: GameState = {
      stock: [],
      waste: [],
      foundations: [[], [], [], []],
      tableau: [
        [card('clubs', 2, false), card('hearts', 6, true)],
        [card('spades', 7, true)],
        [],
        [],
        [],
        [],
        [],
      ],
      drawMode: 1,
      score: 0,
      moves: 0,
      elapsedSeconds: 0,
      status: 'PLAYING',
      isTutorial: false,
      tutorialStep: 0,
      tutorialCompleted: false,
      history: [],
    };

    const res = moveCards(
      state,
      { zone: 'tableau', pileIndex: 0, cardIndex: 1 },
      { zone: 'tableau', pileIndex: 1 },
    );
    expect(res.moved).toBe(true);
    expect(res.state.tableau[0][0].faceUp).toBe(true);
    expect(res.state.score).toBe(5);
    expect(res.state.tableau[1]).toHaveLength(2);

    const undone = undoMove(res.state);
    expect(undone.tableau[0][0].faceUp).toBe(false);
    expect(undone.score).toBe(0);
  });

  it('supports hints, auto-complete, and win detection', () => {
    const state: GameState = {
      stock: [],
      waste: [],
      foundations: [
        Array.from({ length: 12 }, (_, i) => card('spades', (i + 1) as Card['rank'])),
        Array.from({ length: 13 }, (_, i) => card('hearts', (i + 1) as Card['rank'])),
        Array.from({ length: 13 }, (_, i) => card('clubs', (i + 1) as Card['rank'])),
        Array.from({ length: 13 }, (_, i) => card('diamonds', (i + 1) as Card['rank'])),
      ],
      tableau: [[card('spades', 13)], [], [], [], [], [], []],
      drawMode: 1,
      score: 100,
      moves: 10,
      elapsedSeconds: 30,
      status: 'PLAYING',
      isTutorial: false,
      tutorialStep: 0,
      tutorialCompleted: false,
      history: [],
    };

    expect(canAutoComplete(state)).toBe(true);
    const hint = findBestHint(state);
    expect(hint?.type).toBe('move');

    const res = stepAutoComplete(state);
    expect(res.wonNow).toBe(true);
    expect(res.state.status).toBe('WON');
  });

  it('guides the 3-step tutorial to completion and persists save data safely', () => {
    let tut = createTutorialState();
    expect(tut.tutorialStep).toBe(0);

    // Step 1: A♥ -> foundation 0
    tut = autoMoveToFoundation(tut, {
      zone: 'tableau',
      pileIndex: 0,
      cardIndex: 0,
    }).state;
    expect(tut.tutorialStep).toBe(1);

    // Step 2: 6♥ -> 7♠ (col 2)
    tut = moveCards(
      tut,
      { zone: 'tableau', pileIndex: 1, cardIndex: 1 },
      { zone: 'tableau', pileIndex: 2 },
    ).state;
    expect(tut.tutorialStep).toBe(2);

    // Step 3: K♠ -> empty col 4
    tut = moveCards(
      tut,
      { zone: 'tableau', pileIndex: 3, cardIndex: 0 },
      { zone: 'tableau', pileIndex: 4 },
    ).state;
    expect(tut.tutorialCompleted).toBe(true);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveSaveData(
      {
        gamesWon: 2,
        bestScore: 540,
        bestTimeSeconds: 185,
        drawMode: 3,
        muted: true,
      },
      mockStorage,
    );
    expect(loadSaveData(mockStorage)).toEqual({
      gamesWon: 2,
      bestScore: 540,
      bestTimeSeconds: 185,
      drawMode: 3,
      muted: true,
    });

    const brokenStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    } as unknown as Storage;
    expect(loadSaveData(brokenStorage)).toEqual({
      gamesWon: 0,
      bestScore: 0,
      bestTimeSeconds: null,
      drawMode: 1,
      muted: false,
    });
  });
});
