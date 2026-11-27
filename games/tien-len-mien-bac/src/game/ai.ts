import { getNorthernHint } from './hints';
import { findValidPlays } from './rules';
import type { Combo, GameState } from './types';

export type AiDecision =
  | { action: 'play'; cardIds: string[] }
  | { action: 'pass' };

/**
 * Smart Northern AI decision:
 * - Plays immediately if a move wins the round.
 * - Cuts a single 2 with Tứ quý whenever possible.
 * - Saves a 2 if beating a very low single (< J) while all opponents still hold > 4 cards.
 * - Otherwise picks the lowest clean valid combo via getNorthernHint.
 */
export function chooseAiAction(state: GameState): AiDecision {
  if (state.status !== 'playing') return { action: 'pass' };

  const player = state.players[state.currentPlayerIndex];
  const mustCard = state.isFirstTurnOfMatch ? state.mustIncludeCardId : null;
  const plays = findValidPlays(player.hand, state.tableCombo, mustCard);

  if (plays.length === 0) {
    return { action: 'pass' };
  }

  // Immediate win check
  const winningPlay = plays.find((p) => p.cards.length === player.hand.length);
  if (winningPlay) {
    return { action: 'play', cardIds: winningPlay.cards.map((c) => c.id) };
  }

  // Chặt Heo opportunity!
  if (state.tableCombo?.type === 'SINGLE' && state.tableCombo.highRank === 15) {
    const tuQuy = plays.find((p) => p.type === 'TU_QUY');
    if (tuQuy) {
      return { action: 'play', cardIds: tuQuy.cards.map((c) => c.id) };
    }
  }

  const hint = getNorthernHint(state);
  if (!hint) return { action: 'pass' };

  const chosen: Combo = hint.combo;
  const minOpponentCards = Math.min(
    ...state.players
      .filter((_, idx) => idx !== state.currentPlayerIndex)
      .map((p) => p.hand.length),
  );

  // Strategic hold: if following a small single (< Jack) with a 2 while opponents have > 4 cards,
  // pass to conserve the 2 unless it's the AI's last non-losing turn.
  if (
    state.tableCombo &&
    state.tableCombo.type === 'SINGLE' &&
    state.tableCombo.highRank < 11 &&
    chosen.type === 'SINGLE' &&
    chosen.highRank === 15 &&
    minOpponentCards > 4 &&
    player.hand.length > 3
  ) {
    return { action: 'pass' };
  }

  return {
    action: 'play',
    cardIds: chosen.cards.map((c) => c.id),
  };
}
