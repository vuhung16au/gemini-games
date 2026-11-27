import { findBestDefenseAssignment } from './ai';
import { SUIT_INFO } from './constants';
import {
  formatCardShort,
  getMaxAddableCards,
  getTableRanks,
  getUndefendedIndices,
} from './engine';
import type { Card, Suit, TanDoHint, TanDoState } from './types';

function cardPower(card: Card, trumpSuit: Suit): number {
  return (card.suit === trumpSuit ? 100 : 0) + card.rank;
}

export function getTanDoHint(state: TanDoState): TanDoHint | null {
  if (state.status !== 'PLAYING') return null;

  const idx = state.activePlayerIndex;
  const player = state.players[idx];
  if (!player) return null;

  if (state.isTutorial) {
    if (state.tutorialStep === 1 && state.phase === 'ATTACK_OPEN') {
      const fiveSpades = player.hand.find((c) => c.id === 'spades-5');
      if (fiveSpades) {
        return {
          action: 'ATTACK',
          cardIds: [fiveSpades.id],
          messageVi: 'Gợi ý: Chọn 5♠ rồi nhấn "Tấn / Attack" để mở vòng.',
          messageEn: 'Hint: Select 5♠ and click "Tấn / Attack" to open.',
        };
      }
    }
    if (state.tutorialStep === 2 && state.phase === 'THROW_IN') {
      const eightDiamonds = player.hand.find((c) => c.id === 'diamonds-8');
      if (eightDiamonds) {
        return {
          action: 'THROW_IN',
          cardIds: [eightDiamonds.id],
          messageVi: 'Gợi ý: Chọn 8♦ (cùng số 8 trên bàn) và nhấn "Tấn thêm".',
          messageEn: 'Hint: Select 8♦ (matches rank 8 on table) and throw in.',
        };
      }
    }
    if (state.tutorialStep === 3 && state.phase === 'DEFEND_OR_PASS') {
      const twoHearts = player.hand.find((c) => c.id === 'hearts-2');
      if (twoHearts) {
        return {
          action: 'DEFEND',
          cardIds: [twoHearts.id],
          targetSlotIndex: 0,
          messageVi: 'Gợi ý: Chọn lá Trưởng 2♥ để đỡ K♣!',
          messageEn: 'Hint: Select Trump 2♥ to beat K♣!',
        };
      }
    }
  }

  if (state.phase === 'ATTACK_OPEN') {
    const maxCards = getMaxAddableCards(state);
    if (player.hand.length === 0 || maxCards <= 0) return null;

    const sorted = [...player.hand].sort(
      (a, b) => cardPower(a, state.trumpSuit) - cardPower(b, state.trumpSuit),
    );
    const nonTrumps = sorted.filter((c) => c.suit !== state.trumpSuit);
    const pool = nonTrumps.length > 0 ? nonTrumps : sorted;
    const lead = pool[0];

    const sameRank = pool.filter((c) => c.rank === lead.rank);
    if (
      lead.suit !== state.trumpSuit &&
      lead.rank <= 8 &&
      sameRank.length >= 2 &&
      maxCards >= 2
    ) {
      const pair = sameRank.slice(0, 2);
      const label = pair.map(formatCardShort).join(' + ');
      return {
        action: 'ATTACK',
        cardIds: pair.map((c) => c.id),
        messageVi: `Gợi ý: Tấn đôi ${label} để giữ bài lớn và ép đối thủ đỡ.`,
        messageEn: `Hint: Attack with pair ${label} to pressure the defender.`,
      };
    }

    const short = formatCardShort(lead);
    return {
      action: 'ATTACK',
      cardIds: [lead.id],
      messageVi: `Gợi ý: Chọn ${short} rồi nhấn "Tấn / Attack" (ưu tiên đánh lá nhỏ trước).`,
      messageEn: `Hint: Attack with ${short} (lead low non-trump cards first).`,
    };
  }

  if (state.phase === 'DEFEND_OR_PASS') {
    const undefended = getUndefendedIndices(state.table).map((slotIndex) => ({
      slotIndex,
      attack: state.table[slotIndex].attack,
    }));
    const assignment = findBestDefenseAssignment(
      player.hand,
      undefended,
      state.trumpSuit,
    );

    if (!assignment || assignment.length === 0) {
      return {
        action: 'TAKE',
        cardIds: [],
        messageVi:
          'Gợi ý: Không đủ bài đỡ hết bàn — hãy nhấn "Ôm bài / Take" để giữ bài Trưởng cho vòng sau.',
        messageEn:
          'Hint: Cannot beat all attack cards — click "Ôm bài / Take".',
      };
    }

    const first = assignment[0];
    const defShort = formatCardShort(first.card);
    const atkShort = formatCardShort(state.table[first.slotIndex].attack);
    const trumpNote =
      first.card.suit === state.trumpSuit &&
      state.table[first.slotIndex].attack.suit !== state.trumpSuit
        ? ` (Chất Trưởng ${SUIT_INFO[state.trumpSuit].symbol})`
        : '';

    return {
      action: 'DEFEND',
      cardIds: [first.card.id],
      targetSlotIndex: first.slotIndex,
      messageVi: `Gợi ý: Dùng ${defShort}${trumpNote} để đỡ ${atkShort}.`,
      messageEn: `Hint: Defend ${atkShort} using ${defShort}.`,
    };
  }

  if (state.phase === 'THROW_IN') {
    const maxAddable = getMaxAddableCards(state);
    if (maxAddable <= 0) {
      return {
        action: 'PASS',
        cardIds: [],
        messageVi: 'Gợi ý: Đã đủ giới hạn bài trên bàn — nhấn "Thôi / Done".',
        messageEn: 'Hint: Table limit reached — click "Thôi / Done".',
      };
    }

    const tableRanks = getTableRanks(state.table);
    const matching = player.hand
      .filter((c) => tableRanks.has(c.rank))
      .sort(
        (a, b) => cardPower(a, state.trumpSuit) - cardPower(b, state.trumpSuit),
      );

    if (matching.length === 0) {
      return {
        action: 'PASS',
        cardIds: [],
        messageVi:
          'Gợi ý: Không còn lá cùng số trên bàn — nhấn "Thôi / Done" để kết thúc lượt.',
        messageEn: 'Hint: No matching ranks left — click "Thôi / Done".',
      };
    }

    const candidate = matching[0];
    if (candidate.suit === state.trumpSuit && state.noc.length > 0) {
      return {
        action: 'PASS',
        cardIds: [],
        messageVi:
          'Gợi ý: Nên giữ lá Trưởng lại để phòng thủ — nhấn "Thôi / Done".',
        messageEn: 'Hint: Save your Trump card for defense — click "Thôi / Done".',
      };
    }

    const short = formatCardShort(candidate);
    return {
      action: 'THROW_IN',
      cardIds: [candidate.id],
      messageVi: `Gợi ý: Tấn thêm ${short} (trùng số trên bàn) để ép đối thủ.`,
      messageEn: `Hint: Throw in ${short} (matches a rank on the table).`,
    };
  }

  return null;
}
