import {
  applyAttack,
  applyDefend,
  applyPassThrowIn,
  applyTakeCards,
  applyThrowIn,
  canBeat,
  getMaxAddableCards,
  getTableRanks,
  getUndefendedIndices,
} from './engine';
import type { Card, Suit, TanDoState } from './types';

function cardPower(card: Card, trumpSuit: Suit): number {
  return (card.suit === trumpSuit ? 100 : 0) + card.rank;
}

/**
 * Finds the cheapest valid assignment of cards in `hand` to beat all
 * `undefendedAttacks`, preferring same-suit low cards before spending trumps.
 */
export function findBestDefenseAssignment(
  hand: readonly Card[],
  undefendedSlots: { slotIndex: number; attack: Card }[],
  trumpSuit: Suit,
): { slotIndex: number; card: Card }[] | null {
  if (undefendedSlots.length === 0) return [];
  if (hand.length < undefendedSlots.length) return null;

  const sortedHand = [...hand].sort(
    (a, b) => cardPower(a, trumpSuit) - cardPower(b, trumpSuit),
  );
  // Defend harder attacks (trumps or high ranks) first to avoid trapping.
  const orderedSlots = [...undefendedSlots].sort(
    (a, b) =>
      cardPower(b.attack, trumpSuit) - cardPower(a.attack, trumpSuit),
  );

  const usedIds = new Set<string>();
  const assignments: { slotIndex: number; card: Card }[] = [];

  function backtrack(pos: number): boolean {
    if (pos >= orderedSlots.length) return true;
    const { slotIndex, attack } = orderedSlots[pos];

    for (const candidate of sortedHand) {
      if (usedIds.has(candidate.id)) continue;
      if (!canBeat(candidate, attack, trumpSuit)) continue;

      usedIds.add(candidate.id);
      assignments.push({ slotIndex, card: candidate });
      if (backtrack(pos + 1)) return true;
      assignments.pop();
      usedIds.delete(candidate.id);
    }
    return false;
  }

  return backtrack(0) ? assignments : null;
}

export function chooseAIMove(state: TanDoState): TanDoState {
  if (state.status !== 'PLAYING') return state;

  const idx = state.activePlayerIndex;
  const player = state.players[idx];
  if (!player || !player.isAI) return state;

  if (state.phase === 'ATTACK_OPEN') {
    const maxCards = getMaxAddableCards(state);
    if (maxCards <= 0 || player.hand.length === 0) return state;

    const sorted = [...player.hand].sort(
      (a, b) => cardPower(a, state.trumpSuit) - cardPower(b, state.trumpSuit),
    );
    const nonTrumps = sorted.filter((c) => c.suit !== state.trumpSuit);
    const pool = nonTrumps.length > 0 ? nonTrumps : sorted;
    const lead = pool[0];

    // Attack with a pair if we hold multiple low cards (rank <= 8) of the same non-trump rank
    if (lead.suit !== state.trumpSuit && lead.rank <= 8 && maxCards >= 2) {
      const sameRank = pool.filter((c) => c.rank === lead.rank);
      if (sameRank.length >= 2) {
        return applyAttack(
          state,
          idx,
          sameRank.slice(0, Math.min(2, maxCards)).map((c) => c.id),
        );
      }
    }

    return applyAttack(state, idx, [lead.id]);
  }

  if (state.phase === 'DEFEND_OR_PASS') {
    const undefendedIndices = getUndefendedIndices(state.table);
    const undefendedSlots = undefendedIndices.map((slotIndex) => ({
      slotIndex,
      attack: state.table[slotIndex].attack,
    }));

    const assignment = findBestDefenseAssignment(
      player.hand,
      undefendedSlots,
      state.trumpSuit,
    );

    if (!assignment || assignment.length === 0) {
      return applyTakeCards(state, idx);
    }

    // Strategic restraint: early in the game when Nọc still has > 10 cards,
    // avoid burning 2+ high trumps (Q/K/A) just to defend low cards.
    const highTrumpsSpent = assignment.filter(
      (a) => a.card.suit === state.trumpSuit && a.card.rank >= 12,
    ).length;
    if (
      state.noc.length > 10 &&
      highTrumpsSpent >= 2 &&
      state.table.length >= 3
    ) {
      return applyTakeCards(state, idx);
    }

    // Play one defense card per tick for readable pacing.
    const first = assignment[0];
    return applyDefend(state, idx, first.card.id, first.slotIndex);
  }

  if (state.phase === 'THROW_IN') {
    const maxAddable = getMaxAddableCards(state);
    if (maxAddable <= 0) {
      return applyPassThrowIn(state, idx);
    }

    const tableRanks = getTableRanks(state.table);
    const matching = player.hand
      .filter((c) => tableRanks.has(c.rank))
      .sort(
        (a, b) => cardPower(a, state.trumpSuit) - cardPower(b, state.trumpSuit),
      );

    if (matching.length === 0) {
      return applyPassThrowIn(state, idx);
    }

    const defender = state.players[state.defenderIndex];
    const candidate = matching[0];

    // Hold back trumps during throw-in unless Nọc is empty or defender is low on cards.
    if (
      candidate.suit === state.trumpSuit &&
      state.noc.length > 0 &&
      defender.hand.length > 2
    ) {
      return applyPassThrowIn(state, idx);
    }

    // Also hold back high non-trumps (K/A) when Nọc is nearly empty and we want to keep winners.
    if (
      state.noc.length === 0 &&
      candidate.rank >= 13 &&
      player.hand.length > 2
    ) {
      return applyPassThrowIn(state, idx);
    }

    return applyThrowIn(state, idx, [candidate.id]);
  }

  return state;
}
