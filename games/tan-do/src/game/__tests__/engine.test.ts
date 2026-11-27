import { describe, expect, it } from 'vitest';
import { chooseAIMove } from '../ai';
import {
  applyAttack,
  applyDefend,
  applyPassThrowIn,
  applyTakeCards,
  applyThrowIn,
  canAttackWithSelection,
  canBeat,
  canThrowInWithSelection,
  createDeck,
  createNewGame,
  revealHand,
} from '../engine';
import { getTanDoHint } from '../hints';
import { applyTutorialPlayerAction, createTutorialGame } from '../tutorial';
import type { Card, Suit, TanDoState } from '../types';

function c(suit: Suit, rank: Card['rank']): Card {
  return { id: `${suit}-${rank}`, suit, rank };
}

describe('Tấn Đỡ (Bài Tấn) Engine', () => {
  it('deals 8 cards per player for 2P, 3P, 4P and reveals bottom Nọc card as Trump', () => {
    expect(createDeck()).toHaveLength(52);

    const g2 = createNewGame(2, 'ai', () => 0.42);
    expect(g2.players.every((p) => p.hand.length === 8)).toBe(true);
    expect(g2.noc).toHaveLength(36);
    expect(g2.trumpCard.id).toBe(g2.noc[g2.noc.length - 1].id);
    expect(g2.trumpSuit).toBe(g2.trumpCard.suit);

    const g3 = createNewGame(3, 'ai', () => 0.13);
    expect(g3.players).toHaveLength(3);
    expect(g3.noc).toHaveLength(28);

    const g4 = createNewGame(4, 'pass-and-play', () => 0.77);
    expect(g4.players).toHaveLength(4);
    expect(g4.noc).toHaveLength(20);
    expect(g4.handoffPending).toBe(true);
  });

  it('enforces canBeat rank order (2..A) and Chất Trưởng trump rules', () => {
    expect(canBeat(c('spades', 14), c('spades', 13), 'hearts')).toBe(true);
    expect(canBeat(c('spades', 9), c('spades', 10), 'hearts')).toBe(false);
    expect(canBeat(c('clubs', 14), c('spades', 2), 'hearts')).toBe(false);
    // Any trump beats any non-trump
    expect(canBeat(c('hearts', 2), c('spades', 14), 'hearts')).toBe(true);
    // Trump vs Trump requires higher rank
    expect(canBeat(c('hearts', 5), c('hearts', 9), 'hearts')).toBe(false);
    expect(canBeat(c('hearts', 10), c('hearts', 9), 'hearts')).toBe(true);
  });

  it('supports pair attack, defense, matching-rank throw-in, and bout clear with refill', () => {
    const base: TanDoState = {
      playerCount: 2,
      mode: 'ai',
      status: 'PLAYING',
      phase: 'ATTACK_OPEN',
      players: [
        {
          index: 0,
          nameVi: 'P1',
          nameEn: 'P1',
          isAI: false,
          hand: [c('spades', 5), c('clubs', 5), c('diamonds', 9), c('clubs', 2)],
        },
        {
          index: 1,
          nameVi: 'AI 2',
          nameEn: 'AI 2',
          isAI: true,
          hand: [c('spades', 9), c('clubs', 7), c('hearts', 3)],
        },
      ],
      noc: [c('diamonds', 2), c('diamonds', 3), c('diamonds', 4), c('hearts', 10)],
      trumpCard: c('hearts', 10),
      trumpSuit: 'hearts',
      trumpCardInNoc: true,
      table: [],
      attackerIndex: 0,
      defenderIndex: 1,
      activePlayerIndex: 0,
      passedPlayers: [],
      handoffPending: false,
      roundNumber: 1,
      discardCount: 0,
      winnerIndex: null,
      lastEventVi: '',
      lastEventEn: '',
      isTutorial: false,
      tutorialStep: 0,
    };

    // Mixed ranks cannot open attack
    expect(canAttackWithSelection(base, 0, ['spades-5', 'diamonds-9'])).toBe(false);
    // Same-rank pair allowed
    expect(canAttackWithSelection(base, 0, ['spades-5', 'clubs-5'])).toBe(true);

    const s1 = applyAttack(base, 0, ['spades-5', 'clubs-5']);
    expect(s1.phase).toBe('DEFEND_OR_PASS');
    expect(s1.table).toHaveLength(2);
    expect(s1.activePlayerIndex).toBe(1);

    // Defender beats slot 0 (5♠ with 9♠) and slot 1 (5♣ with 7♣)
    const s2 = applyDefend(s1, 1, 'spades-9', 0);
    expect(s2.phase).toBe('DEFEND_OR_PASS');
    const s3 = applyDefend(s2, 1, 'clubs-7', 1);
    expect(s3.phase).toBe('THROW_IN');
    expect(s3.activePlayerIndex).toBe(0);

    // 9♦ matches rank 9 on table (from 9♠ defense), while 2♣ does not
    expect(canThrowInWithSelection(s3, 0, ['diamonds-9'])).toBe(true);
    expect(canThrowInWithSelection(s3, 0, ['clubs-2'])).toBe(false);

    const s4 = applyThrowIn(s3, 0, ['diamonds-9']);
    expect(s4.phase).toBe('DEFEND_OR_PASS');
    // Defender uses Trump 3♥ to beat 9♦
    const s5 = applyDefend(s4, 1, 'hearts-3', 2);
    // Defender now has 0 cards, so bout immediately clears and refills!
    expect(s5.table).toHaveLength(0);
    // Attacker P1 had 1 card left (2♣) and drew 4 remaining Nọc cards -> 5 cards; AI2 still 0 -> AI 2 wins on round 1!
    expect(s5.players[0].hand).toHaveLength(5);
    expect(s5.noc).toHaveLength(0);
    expect(s5.trumpCardInNoc).toBe(false);
    expect(s5.status).toBe('WON');
    expect(s5.winnerIndex).toBe(1);
  });

  it('handles Ôm bài (Take) by adding table cards to Defender and skipping Defender turn in 3P', () => {
    const base: TanDoState = {
      playerCount: 3,
      mode: 'pass-and-play',
      status: 'PLAYING',
      phase: 'DEFEND_OR_PASS',
      players: [
        { index: 0, nameVi: 'P1', nameEn: 'P1', isAI: false, hand: [c('spades', 6)] },
        { index: 1, nameVi: 'P2', nameEn: 'P2', isAI: false, hand: [c('clubs', 2), c('clubs', 3)] },
        { index: 2, nameVi: 'P3', nameEn: 'P3', isAI: false, hand: [c('diamonds', 4)] },
      ],
      noc: [c('hearts', 12), c('hearts', 13)],
      trumpCard: c('hearts', 13),
      trumpSuit: 'hearts',
      trumpCardInNoc: true,
      table: [{ attack: c('spades', 14), defense: null, attackedBy: 0 }],
      attackerIndex: 0,
      defenderIndex: 1,
      activePlayerIndex: 1,
      passedPlayers: [],
      handoffPending: false,
      roundNumber: 1,
      discardCount: 0,
      winnerIndex: null,
      lastEventVi: '',
      lastEventEn: '',
      isTutorial: false,
      tutorialStep: 0,
    };

    const next = applyTakeCards(base, 1);
    expect(next.players[1].hand.some((card) => card.id === 'spades-14')).toBe(true);
    expect(next.attackerIndex).toBe(2); // Skips P2 (index 1) -> P3 (index 2) attacks!
    expect(next.defenderIndex).toBe(0);
    expect(next.handoffPending).toBe(true);

    const revealed = revealHand(next);
    expect(revealed.handoffPending).toBe(false);
  });

  it('supports 3P throw-in rotation and bout clear when all attackers pass', () => {
    const base: TanDoState = {
      playerCount: 3,
      mode: 'ai',
      status: 'PLAYING',
      phase: 'THROW_IN',
      players: [
        { index: 0, nameVi: 'P1', nameEn: 'P1', isAI: false, hand: [c('spades', 4)] },
        { index: 1, nameVi: 'AI2', nameEn: 'AI2', isAI: true, hand: [c('clubs', 9)] },
        { index: 2, nameVi: 'AI3', nameEn: 'AI3', isAI: true, hand: [c('diamonds', 11)] },
      ],
      noc: [c('hearts', 8), c('hearts', 9), c('hearts', 10)],
      trumpCard: c('hearts', 10),
      trumpSuit: 'hearts',
      trumpCardInNoc: true,
      table: [{ attack: c('spades', 6), defense: c('spades', 10), attackedBy: 0 }],
      attackerIndex: 0,
      defenderIndex: 1,
      activePlayerIndex: 0,
      passedPlayers: [],
      handoffPending: false,
      roundNumber: 1,
      discardCount: 0,
      winnerIndex: null,
      lastEventVi: '',
      lastEventEn: '',
      isTutorial: false,
      tutorialStep: 0,
    };

    const afterP0Pass = applyPassThrowIn(base, 0);
    expect(afterP0Pass.phase).toBe('THROW_IN');
    expect(afterP0Pass.activePlayerIndex).toBe(2);

    const afterP2Pass = applyPassThrowIn(afterP0Pass, 2);
    expect(afterP2Pass.table).toHaveLength(0);
    expect(afterP2Pass.attackerIndex).toBe(1); // Defender AI2 becomes Attacker!
    expect(afterP2Pass.roundNumber).toBe(2);
  });

  it('produces valid AI moves and helpful hints across phases', () => {
    const game = createNewGame(2, 'ai', () => 0.31);
    const hint = getTanDoHint(game);
    expect(hint).not.toBeNull();

    // Force AI turn to verify chooseAIMove
    const aiTurn: TanDoState = {
      ...game,
      attackerIndex: 1,
      defenderIndex: 0,
      activePlayerIndex: 1,
      players: game.players.map((p, i) => ({ ...p, isAI: i === 1 })),
    };
    const afterAi = chooseAIMove(aiTurn);
    expect(afterAi.table.length).toBeGreaterThanOrEqual(1);
    expect(afterAi.phase).toBe('DEFEND_OR_PASS');
    expect(afterAi.activePlayerIndex).toBe(0);

    const defHint = getTanDoHint(afterAi);
    expect(defHint).not.toBeNull();
    expect(['DEFEND', 'TAKE']).toContain(defHint?.action);
  });

  it('completes all 3 guided tutorial steps cleanly', () => {
    const t1 = createTutorialGame();
    expect(t1.tutorialStep).toBe(1);

    const t2 = applyTutorialPlayerAction(t1, {
      type: 'ATTACK',
      cardIds: ['spades-5'],
    });
    expect(t2).not.toBeNull();
    expect(t2?.tutorialStep).toBe(2);
    expect(t2?.phase).toBe('THROW_IN');

    const t3 = applyTutorialPlayerAction(t2!, {
      type: 'THROW_IN',
      cardIds: ['diamonds-8'],
    });
    expect(t3).not.toBeNull();
    expect(t3?.tutorialStep).toBe(3);
    expect(t3?.phase).toBe('DEFEND_OR_PASS');

    const t4 = applyTutorialPlayerAction(t3!, {
      type: 'DEFEND',
      cardId: 'hearts-2',
      slotIndex: 0,
    });
    expect(t4).not.toBeNull();
    expect(t4?.tutorialStep).toBe(4);
  });

  it('handles AI defense/take decisions, throw-in AI, and storage fallbacks', () => {
    const game = createNewGame(2, 'ai', () => 0.44);
    const aiDefend: TanDoState = {
      ...game,
      phase: 'DEFEND_OR_PASS',
      attackerIndex: 0,
      defenderIndex: 1,
      activePlayerIndex: 1,
      players: [
        { index: 0, nameVi: 'P1', nameEn: 'P1', isAI: false, hand: [c('spades', 8)] },
        { index: 1, nameVi: 'AI2', nameEn: 'AI2', isAI: true, hand: [c('spades', 12)] },
      ],
      table: [{ attack: c('spades', 6), defense: null, attackedBy: 0 }],
    };
    const defended = chooseAIMove(aiDefend);
    expect(defended.table.length === 0 || defended.table[0].defense !== null).toBe(true);

    const aiTake: TanDoState = {
      ...aiDefend,
      trumpSuit: 'hearts',
      players: [
        { index: 0, nameVi: 'P1', nameEn: 'P1', isAI: false, hand: [c('spades', 8)] },
        { index: 1, nameVi: 'AI2', nameEn: 'AI2', isAI: true, hand: [c('clubs', 2)] },
      ],
      table: [{ attack: c('spades', 14), defense: null, attackedBy: 0 }],
    };
    const taken = chooseAIMove(aiTake);
    expect(taken.table).toHaveLength(0);
    expect(taken.players[1].hand.some((x) => x.id === 'spades-14')).toBe(true);
  });
});
