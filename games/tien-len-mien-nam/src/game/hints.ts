import { chooseAiPlay } from './ai';
import { formatComboLabel, isBombCombo } from './combos';
import type { ComboType, GameState } from './types';

export interface HintResult {
  cardIds: string[];
  comboType: ComboType | 'PASS';
  message: string;
}

/**
 * Suggests an optimal Southern Tiến Lên move for the currently active player.
 */
export function getSouthernHint(state: GameState): HintResult | null {
  if (state.status !== 'PLAYING') return null;

  if (state.tutorial.active && state.tutorial.step <= 3) {
    return {
      cardIds: [...state.tutorial.hintCardIds],
      comboType:
        state.tutorial.step === 1
          ? 'SINGLE'
          : state.tutorial.step === 2
            ? 'THREE_PAIRS'
            : 'STRAIGHT',
      message: state.tutorial.message,
    };
  }

  const activePlayer = state.players[state.currentTurn];
  if (!activePlayer || activePlayer.hand.length === 0) return null;

  const recommended = chooseAiPlay(state, state.currentTurn);

  if (!recommended) {
    return {
      cardIds: [],
      comboType: 'PASS',
      message: 'Gợi ý: Bỏ lượt (giữ bài mạnh hoặc chưa chặn được) / Hint: Pass turn',
    };
  }

  const label = formatComboLabel(recommended);
  const isCut = state.currentCombo !== null && isBombCombo(recommended.type);

  return {
    cardIds: recommended.cards.map((c) => c.id),
    comboType: recommended.type,
    message: isCut
      ? `Gợi ý Chặt Heo: Đánh ${label}! / Hint: Cut with ${label}!`
      : `Gợi ý: Đánh ${label} / Hint: Play ${label}`,
  };
}
