import { getComboLabel, findValidPlays } from './rules';
import type { Combo, GameState, HintResult } from './types';

function scoreHintCombo(combo: Combo, handSize: number, tableCombo: Combo | null, tuQuyRanks: Set<number>): number {
  let penalty = 0;

  // Prefer not to leave only 2s if avoidable
  if (combo.cards.length < handSize && combo.cards.every((c) => c.rank < 15)) {
    // checked outside
  }

  // Avoid breaking a Tứ quý unless playing the Tứ quý itself
  if (combo.type !== 'TU_QUY' && combo.cards.some((c) => tuQuyRanks.has(c.rank))) {
    penalty += 1000;
  }

  // On free lead, prefer shedding multi-card combos (straights/pairs/triples) with low rank
  if (!tableCombo) {
    const typeBonus =
      combo.type === 'STRAIGHT'
        ? -40 - combo.length * 5
        : combo.type === 'TRIPLE'
          ? -30
          : combo.type === 'PAIR'
            ? -20
            : 0;
    const twoPenalty = combo.highRank === 15 ? 200 : 0;
    return combo.highRank * 10 + typeBonus + twoPenalty + penalty;
  }

  // When following: pick lowest beating combo, save 2s if non-2 works
  const twoPenalty = combo.highRank === 15 ? 120 : 0;
  return combo.highRank * 10 + twoPenalty + penalty;
}

/**
 * Returns the lowest valid beating combo (or best opening lead) under strict Northern rules,
 * or null when the player should Pass.
 */
export function getNorthernHint(state: GameState): HintResult | null {
  if (state.status !== 'playing') return null;

  const player = state.players[state.currentPlayerIndex];
  const mustCard = state.isFirstTurnOfMatch ? state.mustIncludeCardId : null;
  const plays = findValidPlays(player.hand, state.tableCombo, mustCard);

  if (plays.length === 0) return null;

  // Filter out plays that would leave ONLY 2s in hand if safer alternatives exist
  const safePlays = plays.filter((combo) => {
    const used = new Set(combo.cards.map((c) => c.id));
    const rem = player.hand.filter((c) => !used.has(c.id));
    return rem.length === 0 || rem.some((c) => c.rank < 15);
  });

  const pool = safePlays.length > 0 ? safePlays : plays;

  // Detect Tứ quý ranks in hand so we don't break them needlessly
  const rankCounts = new Map<number, number>();
  for (const c of player.hand) {
    rankCounts.set(c.rank, (rankCounts.get(c.rank) ?? 0) + 1);
  }
  const tuQuyRanks = new Set<number>();
  for (const [r, cnt] of rankCounts) {
    if (cnt === 4) tuQuyRanks.add(r);
  }

  const ranked = [...pool].sort(
    (a, b) =>
      scoreHintCombo(a, player.hand.length, state.tableCombo, tuQuyRanks) -
      scoreHintCombo(b, player.hand.length, state.tableCombo, tuQuyRanks),
  );

  const chosen = ranked[0];
  const label = getComboLabel(chosen);

  if (
    chosen.type === 'TU_QUY' &&
    state.tableCombo?.type === 'SINGLE' &&
    state.tableCombo.highRank === 15
  ) {
    return {
      cards: chosen.cards,
      combo: chosen,
      reasonVi: `Gợi ý: Chặt Heo bằng ${label.vi}!`,
      reasonEn: `Hint: Cut the 2 with ${label.en}!`,
    };
  }

  return {
    cards: chosen.cards,
    combo: chosen,
    reasonVi: `Gợi ý: Đánh ${label.vi}`,
    reasonEn: `Hint: Play ${label.en}`,
  };
}
