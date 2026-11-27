import { chooseAiDiscardCardId, shouldAiEat } from './ai';
import { formatCardShort } from './constants';
import { canEatLastDiscard } from './engine';
import { canDeclareU, findLayOffOptions, solveOptimalMelds } from './phom';
import type { PhomHint, TaLaState } from './types';

/**
 * Computes a bilingual (VN + EN) tactical hint for the currently active human player.
 */
export function getPhomHint(state: TaLaState): PhomHint | null {
  if (state.phase === 'game_over') return null;

  const currIdx = state.currentPlayerIndex;
  const player = state.players[currIdx];

  if (state.phase === 'draw_or_eat') {
    if (canEatLastDiscard(state, currIdx) && shouldAiEat(state)) {
      const card = state.lastDiscard!.card;
      const label = formatCardShort(card);
      return {
        target: 'eat',
        cardId: card.id,
        message: `Gợi ý: Nên Ăn ${label} để ghép Phỏm! / Hint: Eat ${label} to form a Phỏm!`,
      };
    }
    return {
      target: 'draw',
      message: 'Gợi ý: Bốc 1 lá từ Nọc / Hint: Draw 1 card from Nọc.',
    };
  }

  if (canDeclareU(player.hand, player.eatenCardIds)) {
    return {
      target: 'declare_u',
      message: 'Gợi ý: Bạn đã đủ Phỏm để Ù! Nhấn "Ù!" ngay / Hint: You can declare Ù now!',
    };
  }

  if (state.phase === 'meld') {
    if (!player.hasMelded) {
      const solved = solveOptimalMelds(player.hand, player.eatenCardIds, { maxEatenPerMeld: 1 });
      if (solved.melds.length > 0) {
        return {
          target: 'meld',
          message: `Gợi ý: Hạ ${solved.melds.length} Phỏm (còn ${solved.deadwoodPoints} điểm rác) / Hint: Meld ${solved.melds.length} Phỏm(s).`,
        };
      }
      return {
        target: 'proceed_discard',
        message: 'Gợi ý: Chưa có Phỏm, nhấn Đánh bài / Hint: No Phỏm yet, proceed to discard.',
      };
    }

    if (player.melds.length > 0) {
      const layoffs = findLayOffOptions(player.hand, state.players);
      if (layoffs.length > 0) {
        const best = [...layoffs].sort((a, b) => b.card.rank - a.card.rank)[0];
        const label = formatCardShort(best.card);
        return {
          target: 'layoff',
          cardId: best.card.id,
          layOffOption: best,
          message: `Gợi ý: Gửi ${label} vào Phỏm đối thủ để giảm điểm! / Hint: Lay off ${label}!`,
        };
      }
    }

    return {
      target: 'proceed_discard',
      message: 'Gợi ý: Nhấn Đánh bài để bỏ lá cuối / Hint: Proceed to discard your final card.',
    };
  }

  // discard phase
  const bestId = chooseAiDiscardCardId(state);
  const card = player.hand.find((c) => c.id === bestId);
  const label = card ? formatCardShort(card) : '';
  return {
    target: 'discard',
    cardId: bestId,
    message: `Gợi ý: Nên đánh ${label} (lá rác ít liên kết) / Hint: Discard ${label}.`,
  };
}
