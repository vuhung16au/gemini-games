import { SUIT_ORDER, SUIT_SYMBOL, compareCards, formatCardLabel, sortCardsByRank } from './deck';
import type {
  Card,
  Combo,
  ComboType,
  GameState,
  Rank,
  Suit,
  SuitColor,
  ValidationResult,
} from './types';

export function getSuitColor(suit: Suit): SuitColor {
  return suit === 'spades' || suit === 'clubs' ? 'black' : 'red';
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'diamonds' || suit === 'hearts';
}

export function getComboLabel(combo: Combo): { vi: string; en: string } {
  switch (combo.type) {
    case 'SINGLE':
      return {
        vi: `Lẻ ${formatCardLabel(combo.cards[0])}`,
        en: `Single ${formatCardLabel(combo.cards[0])}`,
      };
    case 'PAIR': {
      const colorVi = combo.color === 'red' ? 'đỏ' : 'đen';
      const colorEn = combo.color === 'red' ? 'Red' : 'Black';
      const r = formatCardLabel(combo.cards[0]).slice(0, -1);
      return {
        vi: `Đôi ${r} (${colorVi})`,
        en: `${colorEn} Pair of ${r}s`,
      };
    }
    case 'TRIPLE': {
      const r = formatCardLabel(combo.cards[0]).slice(0, -1);
      const suits = combo.cards.map((c) => SUIT_SYMBOL[c.suit]).join('');
      return {
        vi: `Sám cô ${r} (${suits})`,
        en: `Triple ${r} (${suits})`,
      };
    }
    case 'STRAIGHT': {
      const first = formatCardLabel(combo.cards[0]);
      const last = formatCardLabel(combo.cards[combo.cards.length - 1]);
      return {
        vi: `Sảnh ${combo.length} lá (${first}–${last})`,
        en: `${combo.length}-Card Straight (${first}–${last})`,
      };
    }
    case 'TU_QUY': {
      const r = formatCardLabel(combo.cards[0]).slice(0, -1);
      return {
        vi: `Tứ quý ${r}`,
        en: `Four of a Kind (${r})`,
      };
    }
  }
}

/**
 * Classifies cards according to strict Tiến Lên Miền Bắc (Northern) rules:
 * - SINGLE: any 1 card
 * - PAIR: 2 cards of same rank AND same color (♠♣ or ♦♥)
 * - TRIPLE: 3 cards of same rank
 * - STRAIGHT: >= 3 consecutive ranks (no 2 allowed) AND all cards of the exact same suit
 * - TU_QUY: 4 cards of same rank
 */
export function classifyNorthernCombo(cards: Card[]): Combo | null {
  if (cards.length === 0) return null;
  const sorted = sortCardsByRank(cards);
  const len = sorted.length;

  if (len === 1) {
    const c = sorted[0];
    return {
      type: 'SINGLE',
      cards: sorted,
      highRank: c.rank,
      highSuit: c.suit,
      length: 1,
      suitKey: c.suit,
    };
  }

  if (len === 2) {
    const [a, b] = sorted;
    if (a.rank !== b.rank) return null;
    const colorA = getSuitColor(a.suit);
    const colorB = getSuitColor(b.suit);
    if (colorA !== colorB) return null;
    return {
      type: 'PAIR',
      cards: sorted,
      highRank: b.rank,
      highSuit: b.suit,
      length: 2,
      suitKey: colorA,
      color: colorA,
    };
  }

  const allSameRank = sorted.every((c) => c.rank === sorted[0].rank);

  if (len === 3 && allSameRank) {
    const suitKey = sorted
      .map((c) => c.suit)
      .sort((x, y) => SUIT_ORDER[x] - SUIT_ORDER[y])
      .join('-');
    return {
      type: 'TRIPLE',
      cards: sorted,
      highRank: sorted[2].rank,
      highSuit: sorted[2].suit,
      length: 3,
      suitKey,
    };
  }

  if (len === 4 && allSameRank) {
    return {
      type: 'TU_QUY',
      cards: sorted,
      highRank: sorted[3].rank,
      highSuit: sorted[3].suit,
      length: 4,
      suitKey: 'all',
    };
  }

  // Straight check: length >= 3, no 2 (max rank <= 14), consecutive, ALL SAME SUIT
  if (len >= 3) {
    if (sorted[len - 1].rank > 14) return null;
    const targetSuit = sorted[0].suit;
    for (let i = 0; i < len; i++) {
      if (sorted[i].suit !== targetSuit) return null;
      if (i > 0 && sorted[i].rank !== sorted[i - 1].rank + 1) return null;
    }
    return {
      type: 'STRAIGHT',
      cards: sorted,
      highRank: sorted[len - 1].rank,
      highSuit: targetSuit,
      length: len,
      suitKey: targetSuit,
    };
  }

  return null;
}

/**
 * Checks whether `play` strictly beats `target` under Northern Tiến Lên rules:
 * - Tứ quý cuts any single 2 or a smaller Tứ quý.
 * - Single beats single of the SAME SUIT, EXCEPT 2 beats any non-2 single regardless of suit,
 *   and a higher-suit 2 beats a lower-suit 2.
 * - Pair beats pair of the SAME COLOR (♠♣ vs ♠♣, ♦♥ vs ♦♥) and higher rank.
 * - Triple beats triple matching the EXACT 3 suits and higher rank.
 * - Straight beats straight of the SAME length and SAME suit and higher highRank.
 */
export function canBeatNorthern(play: Combo, target: Combo): boolean {
  if (play.type === 'TU_QUY') {
    if (target.type === 'SINGLE' && target.highRank === 15) {
      return true;
    }
    if (target.type === 'TU_QUY') {
      return play.highRank > target.highRank;
    }
    return false;
  }

  if (play.type !== target.type || play.length !== target.length) {
    return false;
  }

  switch (play.type) {
    case 'SINGLE': {
      if (play.highRank === 15) {
        if (target.highRank < 15) return true;
        return SUIT_ORDER[play.highSuit] > SUIT_ORDER[target.highSuit];
      }
      if (target.highRank === 15) return false;
      return play.suitKey === target.suitKey && play.highRank > target.highRank;
    }
    case 'PAIR':
      return play.color === target.color && play.highRank > target.highRank;
    case 'TRIPLE':
      return play.suitKey === target.suitKey && play.highRank > target.highRank;
    case 'STRAIGHT':
      return (
        play.length === target.length &&
        play.suitKey === target.suitKey &&
        play.highRank > target.highRank
      );
  }
}

function getMismatchReason(play: Combo, target: Combo): { vi: string; en: string } {
  if (play.type !== target.type && !(play.type === 'TU_QUY' && target.type === 'SINGLE' && target.highRank === 15)) {
    return {
      vi: 'Phải đánh đúng loại bộ bài trên bàn',
      en: 'Must match the combo type on the table',
    };
  }
  if (play.type === 'SINGLE' && target.type === 'SINGLE') {
    if (play.highRank !== 15 && target.highRank !== 15 && play.suitKey !== target.suitKey) {
      return {
        vi: `Luật Bắc: Lẻ phải cùng chất (${SUIT_SYMBOL[target.highSuit]})`,
        en: `Northern rule: Single must match suit (${SUIT_SYMBOL[target.highSuit]})`,
      };
    }
    return {
      vi: 'Lá bài chọn phải lớn hơn lá trên bàn',
      en: 'Selected card must outrank the table card',
    };
  }
  if (play.type === 'PAIR' && target.type === 'PAIR') {
    if (play.color !== target.color) {
      return {
        vi: 'Luật Bắc: Đôi phải cùng màu (♠♣ hoặc ♦♥)',
        en: 'Northern rule: Pair must match color (♠♣ or ♦♥)',
      };
    }
    return {
      vi: 'Đôi chọn phải lớn hơn đôi trên bàn',
      en: 'Selected pair must outrank the table pair',
    };
  }
  if (play.type === 'TRIPLE' && target.type === 'TRIPLE') {
    if (play.suitKey !== target.suitKey) {
      return {
        vi: 'Luật Bắc: Sám cô phải trùng đúng 3 chất',
        en: 'Northern rule: Triple must match exact 3 suits',
      };
    }
    return {
      vi: 'Sám cô phải lớn hơn sám cô trên bàn',
      en: 'Selected triple must outrank the table triple',
    };
  }
  if (play.type === 'STRAIGHT' && target.type === 'STRAIGHT') {
    if (play.length !== target.length) {
      return {
        vi: `Sảnh phải đúng ${target.length} lá`,
        en: `Straight must be ${target.length} cards long`,
      };
    }
    if (play.suitKey !== target.suitKey) {
      return {
        vi: `Luật Bắc: Sảnh phải cùng chất (${SUIT_SYMBOL[target.highSuit]})`,
        en: `Northern rule: Straight must match suit (${SUIT_SYMBOL[target.highSuit]})`,
      };
    }
    return {
      vi: 'Sảnh chọn phải lớn hơn sảnh trên bàn',
      en: 'Selected straight must outrank the table straight',
    };
  }
  return {
    vi: 'Bộ bài chọn chưa chặt được bài trên bàn',
    en: 'Selected combo cannot beat the table combo',
  };
}

export function validatePlay(state: GameState, selectedCardIds: string[]): ValidationResult {
  if (state.status !== 'playing') {
    return {
      valid: false,
      reasonVi: 'Ván đấu đã kết thúc',
      reasonEn: 'Round already finished',
    };
  }

  if (selectedCardIds.length === 0) {
    return {
      valid: false,
      reasonVi: 'Hãy chọn ít nhất 1 lá bài',
      reasonEn: 'Select at least 1 card',
    };
  }

  const player = state.players[state.currentPlayerIndex];
  const idSet = new Set(selectedCardIds);
  const selectedCards = player.hand.filter((c) => idSet.has(c.id));
  if (selectedCards.length !== idSet.size) {
    return {
      valid: false,
      reasonVi: 'Lá bài chọn không hợp lệ',
      reasonEn: 'Invalid card selection',
    };
  }

  const combo = classifyNorthernCombo(selectedCards);
  if (!combo) {
    return {
      valid: false,
      reasonVi: 'Bộ bài không hợp lệ (Đôi phải cùng màu, Sảnh phải đồng chất & không có 2)',
      reasonEn: 'Invalid Northern combo (Pairs must match color, Straights must match suit & exclude 2)',
    };
  }

  if (state.isFirstTurnOfMatch && state.mustIncludeCardId) {
    if (!idSet.has(state.mustIncludeCardId)) {
      return {
        valid: false,
        reasonVi: 'Lượt mở đầu phải đánh kèm quân 3♠',
        reasonEn: 'Opening play must include 3♠',
      };
    }
  }

  if (state.tableCombo && !canBeatNorthern(combo, state.tableCombo)) {
    const reason = getMismatchReason(combo, state.tableCombo);
    return {
      valid: false,
      reasonVi: reason.vi,
      reasonEn: reason.en,
    };
  }

  const remaining = player.hand.filter((c) => !idSet.has(c.id));
  if (remaining.length === 0 && selectedCards.every((c) => c.rank === 15)) {
    return {
      valid: false,
      isThoi2Block: true,
      reasonVi: 'Thối 2! Không được đánh quân 2 làm bài cuối (hãy Bỏ lượt)',
      reasonEn: 'Thối 2! Cannot finish with a 2 as your last play (Pass instead)',
    };
  }

  const warnsThoi2 = remaining.length > 0 && remaining.every((c) => c.rank === 15);

  return {
    valid: true,
    combo,
    warnsThoi2,
  };
}

/**
 * Enumerates all legal playable combos from `hand` matching current table state and Northern rules.
 */
export function findValidPlays(
  hand: Card[],
  tableCombo: Combo | null,
  mustIncludeCardId: string | null = null,
): Combo[] {
  const sorted = sortCardsByRank(hand);
  const candidates: Combo[] = [];

  const pushIfValid = (cards: Card[]) => {
    const combo = classifyNorthernCombo(cards);
    if (!combo) return;
    if (mustIncludeCardId && !cards.some((c) => c.id === mustIncludeCardId)) return;
    if (tableCombo && !canBeatNorthern(combo, tableCombo)) return;

    // Enforce Thối 2 block: never allow finishing with only 2s
    const usedIds = new Set(cards.map((c) => c.id));
    const remaining = sorted.filter((c) => !usedIds.has(c.id));
    if (remaining.length === 0 && cards.every((c) => c.rank === 15)) return;

    candidates.push(combo);
  };

  // Group by rank
  const byRank = new Map<Rank, Card[]>();
  for (const c of sorted) {
    const arr = byRank.get(c.rank) ?? [];
    arr.push(c);
    byRank.set(c.rank, arr);
  }

  // Singles
  if (!tableCombo || tableCombo.type === 'SINGLE') {
    for (const c of sorted) {
      pushIfValid([c]);
    }
  }

  // Pairs (same color only)
  if (!tableCombo || tableCombo.type === 'PAIR') {
    for (const [, list] of byRank) {
      const blacks = list.filter((c) => getSuitColor(c.suit) === 'black');
      const reds = list.filter((c) => getSuitColor(c.suit) === 'red');
      if (blacks.length === 2) pushIfValid(blacks);
      if (reds.length === 2) pushIfValid(reds);
    }
  }

  // Triples (choose 3 of 3 or 4)
  if (!tableCombo || tableCombo.type === 'TRIPLE') {
    for (const [, list] of byRank) {
      if (list.length === 3) {
        pushIfValid(list);
      } else if (list.length === 4) {
        for (let skip = 0; skip < 4; skip++) {
          pushIfValid(list.filter((_, idx) => idx !== skip));
        }
      }
    }
  }

  // Tứ quý (can lead freely, beat Tứ quý, or cut single 2)
  if (
    !tableCombo ||
    tableCombo.type === 'TU_QUY' ||
    (tableCombo.type === 'SINGLE' && tableCombo.highRank === 15)
  ) {
    for (const [, list] of byRank) {
      if (list.length === 4) {
        pushIfValid(list);
      }
    }
  }

  // Straights (same suit, length >= 3, no 2)
  if (!tableCombo || tableCombo.type === 'STRAIGHT') {
    const bySuit = new Map<Suit, Card[]>();
    for (const c of sorted) {
      if (c.rank > 14) continue;
      const arr = bySuit.get(c.suit) ?? [];
      arr.push(c);
      bySuit.set(c.suit, arr);
    }
    for (const [, suitCards] of bySuit) {
      const n = suitCards.length;
      for (let start = 0; start < n; start++) {
        const seq: Card[] = [suitCards[start]];
        for (let next = start + 1; next < n; next++) {
          if (suitCards[next].rank === seq[seq.length - 1].rank + 1) {
            seq.push(suitCards[next]);
            if (seq.length >= 3) {
              if (!tableCombo || seq.length === tableCombo.length) {
                pushIfValid([...seq]);
              }
            }
          } else {
            break;
          }
        }
      }
    }
  }

  return candidates.sort((a, b) => {
    // Sort by type strength, then rank, then suit
    const typeOrder: Record<ComboType, number> = {
      SINGLE: 0,
      PAIR: 1,
      TRIPLE: 2,
      STRAIGHT: 3,
      TU_QUY: 4,
    };
    if (a.highRank !== b.highRank) return a.highRank - b.highRank;
    if (typeOrder[a.type] !== typeOrder[b.type]) return typeOrder[a.type] - typeOrder[b.type];
    return compareCards(a.cards[a.cards.length - 1], b.cards[b.cards.length - 1]);
  });
}

export function countTuQuyInHand(hand: Card[]): number {
  const counts = new Map<Rank, number>();
  for (const c of hand) {
    counts.set(c.rank, (counts.get(c.rank) ?? 0) + 1);
  }
  let total = 0;
  for (const [, count] of counts) {
    if (count === 4) total += 1;
  }
  return total;
}
