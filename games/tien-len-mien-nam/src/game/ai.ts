import {
  cardValue,
  detectCombo,
  findLegalPlays,
  generateAllCombos,
  isBombCombo,
} from './combos';
import type { Card, Combo, GameState } from './types';

function getBombCardIds(hand: readonly Card[]): Set<string> {
  const bombIds = new Set<string>();
  const all = generateAllCombos(hand);
  for (const combo of all) {
    if (isBombCombo(combo.type)) {
      for (const c of combo.cards) {
        bombIds.add(c.id);
      }
    }
  }
  return bombIds;
}

function getMultiCardGroupIds(hand: readonly Card[]): Set<string> {
  const rankCounts = new Map<number, number>();
  for (const c of hand) {
    rankCounts.set(c.rank, (rankCounts.get(c.rank) ?? 0) + 1);
  }
  const grouped = new Set<string>();
  for (const c of hand) {
    if ((rankCounts.get(c.rank) ?? 0) >= 2) {
      grouped.add(c.id);
    }
  }
  return grouped;
}

function scoreLeadCombo(
  combo: Combo,
  hand: readonly Card[],
  bombIds: Set<string>,
  groupedIds: Set<string>,
): number {
  let score = 0;

  // Immediate win!
  if (combo.length === hand.length) {
    return 10000;
  }

  // Prefer shedding multi-card combos (straights, triples, pairs)
  if (combo.type === 'STRAIGHT') {
    score += 40 + combo.length * 8;
  } else if (combo.type === 'TRIPLE') {
    score += 36;
  } else if (combo.type === 'PAIR') {
    score += 24;
  } else if (combo.type === 'SINGLE') {
    score += 10;
  }

  // Strongly avoid breaking bombs on a free lead
  if (!isBombCombo(combo.type)) {
    const breaksBomb = combo.cards.some((c) => bombIds.has(c.id));
    if (breaksBomb) score -= 90;
  } else {
    // Save bombs for Chặt Heo unless almost out
    score -= hand.length > 8 ? 120 : 40;
  }

  // Avoid breaking pairs/triples into singles unnecessarily
  if (combo.type === 'SINGLE' && groupedIds.has(combo.cards[0].id)) {
    score -= 22;
  }

  // Prefer leading low ranks first, keep 2s for later
  if (combo.highCard.rank === 15) {
    score -= hand.length > 4 ? 65 : 5;
  }

  score -= cardValue(combo.highCard) * 0.6;
  return score;
}

function scoreResponseCombo(
  combo: Combo,
  lead: Combo,
  hand: readonly Card[],
  bombIds: Set<string>,
  groupedIds: Set<string>,
  minOpponentCards: number,
): number {
  let score = 0;

  if (combo.length === hand.length) {
    return 10000;
  }

  // Cutting a 2 or bomb with our bomb is high priority!
  if (isBombCombo(combo.type) && !isBombCombo(lead.type)) {
    return 500 - cardValue(combo.highCard);
  }

  // Avoid breaking a bomb for a regular play
  if (!isBombCombo(combo.type) && combo.cards.some((c) => bombIds.has(c.id))) {
    score -= 120;
  }

  // Avoid splitting a pair/triple for a low single unless opponent is low
  if (combo.type === 'SINGLE' && groupedIds.has(combo.cards[0].id)) {
    score -= minOpponentCards <= 4 ? 5 : 28;
  }

  // Conserve 2s on low leads unless urgent
  if (
    combo.highCard.rank === 15 &&
    lead.highCard.rank < 12 &&
    minOpponentCards > 5 &&
    hand.length > 5
  ) {
    score -= 55;
  }

  // Prefer the lowest card value that still beats the lead
  score -= cardValue(combo.highCard);
  return score;
}

/**
 * Selects the best legal combo for the current player (or null to Pass).
 */
export function chooseAiPlay(state: GameState, playerIndex = state.currentTurn): Combo | null {
  const player = state.players[playerIndex];
  if (!player || player.hand.length === 0) return null;

  // Quick check: if entire hand is a valid beating play, play it immediately
  const fullHandCombo = detectCombo(player.hand);
  if (
    fullHandCombo &&
    (!state.mustIncludeCardId ||
      fullHandCombo.cards.some((c) => c.id === state.mustIncludeCardId))
  ) {
    if (!state.currentCombo || findLegalPlays(player.hand, state.currentCombo, state.mustIncludeCardId).some((c) => c.length === player.hand.length)) {
      return fullHandCombo;
    }
  }

  const legal = findLegalPlays(
    player.hand,
    state.currentCombo,
    state.mustIncludeCardId,
  );
  if (legal.length === 0) return null;

  const bombIds = getBombCardIds(player.hand);
  const groupedIds = getMultiCardGroupIds(player.hand);

  if (!state.currentCombo) {
    let best = legal[0];
    let bestScore = -Infinity;
    for (const combo of legal) {
      const s = scoreLeadCombo(combo, player.hand, bombIds, groupedIds);
      if (s > bestScore) {
        bestScore = s;
        best = combo;
      }
    }
    return best;
  }

  const minOpponentCards = Math.min(
    ...state.players
      .filter((p) => p.id !== player.id)
      .map((p) => p.hand.length),
  );

  let best: Combo | null = null;
  let bestScore = -Infinity;
  for (const combo of legal) {
    const s = scoreResponseCombo(
      combo,
      state.currentCombo,
      player.hand,
      bombIds,
      groupedIds,
      minOpponentCards,
    );
    if (s > bestScore) {
      bestScore = s;
      best = combo;
    }
  }

  // Strategic pass if the only option is terrible (e.g. breaking a bomb for a 4♠)
  if (best && bestScore < -80 && minOpponentCards > 4 && player.hand.length > 4) {
    return null;
  }

  return best;
}
