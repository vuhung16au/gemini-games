import {
  COMBO_LABELS,
  RANKS,
  RANK_LABELS,
  SUITS,
  SUIT_ORDER,
  SUIT_SYMBOL,
} from './constants';
import type { Card, Combo, ComboType, Rank, Suit, ToiTrangReason } from './types';

export function cardValue(card: Card): number {
  return card.rank * 4 + SUIT_ORDER[card.suit];
}

export function compareCards(a: Card, b: Card): number {
  return cardValue(a) - cardValue(b);
}

export function sortCardsByRank(cards: readonly Card[]): Card[] {
  return [...cards].sort(compareCards);
}

export function formatCardLabel(card: Card): string {
  return `${RANK_LABELS[card.rank]}${SUIT_SYMBOL[card.suit]}`;
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push({
        id: `${suit}-${rank}`,
        rank,
        suit,
      });
    }
  }
  return deck;
}

export function shuffleDeck(cards: readonly Card[], rng = Math.random): Card[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function areConsecutiveRanks(sorted: readonly Card[]): boolean {
  if (sorted.length < 3) return false;
  if (sorted[sorted.length - 1].rank === 15) return false; // 2 cannot be in a straight
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].rank !== sorted[i - 1].rank + 1) return false;
  }
  return true;
}

function isConsecutivePairs(sorted: readonly Card[], pairCount: number): boolean {
  if (sorted.length !== pairCount * 2) return false;
  if (sorted[sorted.length - 1].rank === 15) return false; // 2 cannot be in đôi thông
  for (let p = 0; p < pairCount; p++) {
    const a = sorted[p * 2];
    const b = sorted[p * 2 + 1];
    if (a.rank !== b.rank) return false;
    if (p > 0 && a.rank !== sorted[(p - 1) * 2].rank + 1) return false;
  }
  return true;
}

export function detectCombo(inputCards: readonly Card[]): Combo | null {
  if (inputCards.length === 0) return null;

  const uniqueIds = new Set(inputCards.map((c) => c.id));
  if (uniqueIds.size !== inputCards.length) return null;

  const cards = sortCardsByRank(inputCards);
  const len = cards.length;
  const highCard = cards[len - 1];

  if (len === 1) {
    return { type: 'SINGLE', cards, highCard, length: 1 };
  }

  if (len === 2) {
    if (cards[0].rank === cards[1].rank) {
      return { type: 'PAIR', cards, highCard, length: 2 };
    }
    return null;
  }

  if (len === 3) {
    if (cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank) {
      return { type: 'TRIPLE', cards, highCard, length: 3 };
    }
    if (areConsecutiveRanks(cards)) {
      return { type: 'STRAIGHT', cards, highCard, length: 3 };
    }
    return null;
  }

  if (len === 4) {
    if (cards.every((c) => c.rank === cards[0].rank)) {
      return { type: 'FOUR_OF_A_KIND', cards, highCard, length: 4 };
    }
    if (areConsecutiveRanks(cards)) {
      return { type: 'STRAIGHT', cards, highCard, length: 4 };
    }
    return null;
  }

  if (len === 6 && isConsecutivePairs(cards, 3)) {
    return { type: 'THREE_PAIRS', cards, highCard, length: 6 };
  }

  if (len === 8 && isConsecutivePairs(cards, 4)) {
    return { type: 'FOUR_PAIRS', cards, highCard, length: 8 };
  }

  if (len >= 5 && areConsecutiveRanks(cards)) {
    return { type: 'STRAIGHT', cards, highCard, length: len };
  }

  return null;
}

export function isBombCombo(type: ComboType): boolean {
  return (
    type === 'THREE_PAIRS' ||
    type === 'FOUR_OF_A_KIND' ||
    type === 'FOUR_PAIRS'
  );
}

/**
 * Checks whether `candidate` legally beats `lead` under Southern Tiến Lên rules.
 * If `lead` is null, any valid combo is allowed.
 */
export function canBeat(lead: Combo | null, candidate: Combo): boolean {
  if (!lead) return true;

  // Same-type matching
  if (candidate.type === lead.type) {
    if (candidate.type === 'STRAIGHT' && candidate.length !== lead.length) {
      return false;
    }
    return compareCards(candidate.highCard, lead.highCard) > 0;
  }

  // Chặt Heo (Bomb / Cut) hierarchy
  const leadIsSingleTwo = lead.type === 'SINGLE' && lead.highCard.rank === 15;
  const leadIsPairTwos = lead.type === 'PAIR' && lead.highCard.rank === 15;

  if (candidate.type === 'THREE_PAIRS') {
    return leadIsSingleTwo;
  }

  if (candidate.type === 'FOUR_OF_A_KIND') {
    return (
      leadIsSingleTwo ||
      leadIsPairTwos ||
      lead.type === 'THREE_PAIRS'
    );
  }

  if (candidate.type === 'FOUR_PAIRS') {
    return (
      leadIsSingleTwo ||
      leadIsPairTwos ||
      lead.type === 'THREE_PAIRS' ||
      lead.type === 'FOUR_OF_A_KIND'
    );
  }

  return false;
}

export function isCutPlay(lead: Combo | null, candidate: Combo): boolean {
  if (!lead) return false;
  return isBombCombo(candidate.type) && canBeat(lead, candidate);
}

export function formatComboLabel(combo: Combo): string {
  const base = COMBO_LABELS[combo.type];
  if (combo.type === 'STRAIGHT') {
    return `${base.vi} ${combo.length} lá (${formatCardLabel(combo.cards[0])}–${formatCardLabel(combo.highCard)}) / ${combo.length}-Card ${base.en}`;
  }
  return `${base.vi} ${formatCardLabel(combo.highCard)} / ${base.en}`;
}

export function checkToiTrang(hand: readonly Card[]): ToiTrangReason | null {
  if (hand.length < 12) return null;

  const rankCounts = new Map<Rank, number>();
  for (const card of hand) {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1);
  }

  // 1. Tứ quý 2 (Four 2s)
  if ((rankCounts.get(15) ?? 0) === 4) {
    return 'FOUR_TWOS';
  }

  // 2. Sảnh Rồng (Dragon Straight: 3 through A)
  let hasAllDragonRanks = true;
  for (let r = 3; r <= 14; r++) {
    if ((rankCounts.get(r as Rank) ?? 0) === 0) {
      hasAllDragonRanks = false;
      break;
    }
  }
  if (hasAllDragonRanks) {
    return 'DRAGON_STRAIGHT';
  }

  // 3. 6 Đôi (Six Pairs)
  let pairCount = 0;
  for (const count of rankCounts.values()) {
    pairCount += Math.floor(count / 2);
  }
  if (pairCount >= 6) {
    return 'SIX_PAIRS';
  }

  return null;
}

/**
 * Generates all valid combos in `hand` (deduplicated structurally so AI/Hints
 * don't enumerate redundant suit variants of the same straight when unnecessary,
 * while always picking valid cards from `hand`).
 */
export function generateAllCombos(hand: readonly Card[]): Combo[] {
  const sorted = sortCardsByRank(hand);
  const byRank = new Map<Rank, Card[]>();
  for (const card of sorted) {
    const bucket = byRank.get(card.rank) ?? [];
    bucket.push(card);
    byRank.set(card.rank, bucket);
  }

  const combos: Combo[] = [];

  // 1. Singles
  for (const card of sorted) {
    combos.push({
      type: 'SINGLE',
      cards: [card],
      highCard: card,
      length: 1,
    });
  }

  // 2. Pairs, Triples, Quads
  for (const bucket of byRank.values()) {
    if (bucket.length >= 2) {
      // Include lowest pair and highest pair if 3 or 4 cards exist (for suit tie-breaking & saving high cards)
      combos.push({
        type: 'PAIR',
        cards: [bucket[0], bucket[1]],
        highCard: bucket[1],
        length: 2,
      });
      if (bucket.length >= 3) {
        combos.push({
          type: 'PAIR',
          cards: [bucket[bucket.length - 2], bucket[bucket.length - 1]],
          highCard: bucket[bucket.length - 1],
          length: 2,
        });
      }
    }
    if (bucket.length >= 3) {
      combos.push({
        type: 'TRIPLE',
        cards: [bucket[0], bucket[1], bucket[2]],
        highCard: bucket[2],
        length: 3,
      });
    }
    if (bucket.length === 4) {
      combos.push({
        type: 'FOUR_OF_A_KIND',
        cards: [...bucket],
        highCard: bucket[3],
        length: 4,
      });
    }
  }

  // 3. Straights (length 3..12, ranks 3..14)
  for (let start = 3; start <= 12; start++) {
    for (let end = start + 2; end <= 14; end++) {
      let possible = true;
      for (let r = start; r <= end; r++) {
        if (!byRank.has(r as Rank)) {
          possible = false;
          break;
        }
      }
      if (!possible) break;

      // Lowest-suit version (conserves stronger suits / matches lowest card)
      const lowStraight: Card[] = [];
      for (let r = start; r <= end; r++) {
        lowStraight.push(byRank.get(r as Rank)![0]);
      }
      combos.push({
        type: 'STRAIGHT',
        cards: lowStraight,
        highCard: lowStraight[lowStraight.length - 1],
        length: lowStraight.length,
      });

      // Highest-suit top card version (can win suit tie-breaks on highCard!)
      const topBucket = byRank.get(end as Rank)!;
      if (topBucket.length > 1) {
        const highTopStraight = [...lowStraight];
        highTopStraight[highTopStraight.length - 1] = topBucket[topBucket.length - 1];
        combos.push({
          type: 'STRAIGHT',
          cards: highTopStraight,
          highCard: highTopStraight[highTopStraight.length - 1],
          length: highTopStraight.length,
        });
      }
    }
  }

  // 4. 3 Đôi thông & 4 Đôi thông (ranks 3..14)
  for (const pairCount of [3, 4] as const) {
    const comboType: ComboType = pairCount === 3 ? 'THREE_PAIRS' : 'FOUR_PAIRS';
    for (let start = 3; start <= 15 - pairCount; start++) {
      const end = start + pairCount - 1;
      let ok = true;
      for (let r = start; r <= end; r++) {
        if ((byRank.get(r as Rank)?.length ?? 0) < 2) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      const cards: Card[] = [];
      for (let r = start; r <= end; r++) {
        const b = byRank.get(r as Rank)!;
        cards.push(b[0], b[1]);
      }
      combos.push({
        type: comboType,
        cards,
        highCard: cards[cards.length - 1],
        length: cards.length,
      });

      const topBucket = byRank.get(end as Rank)!;
      if (topBucket.length > 2) {
        const altCards = [...cards];
        altCards[altCards.length - 2] = topBucket[topBucket.length - 2];
        altCards[altCards.length - 1] = topBucket[topBucket.length - 1];
        combos.push({
          type: comboType,
          cards: altCards,
          highCard: altCards[altCards.length - 1],
          length: altCards.length,
        });
      }
    }
  }

  return deduplicateCombos(combos);
}

function deduplicateCombos(combos: Combo[]): Combo[] {
  const seen = new Set<string>();
  const out: Combo[] = [];
  for (const combo of combos) {
    const key = `${combo.type}:${combo.cards.map((c) => c.id).join(',')}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(combo);
    }
  }
  return out;
}

export function findLegalPlays(
  hand: readonly Card[],
  currentCombo: Combo | null,
  mustIncludeCardId: string | null = null,
): Combo[] {
  const all = generateAllCombos(hand);
  return all.filter((combo) => {
    if (
      mustIncludeCardId &&
      !combo.cards.some((c) => c.id === mustIncludeCardId)
    ) {
      return false;
    }
    return canBeat(currentCombo, combo);
  });
}
