import type { Card, Rank, SortMode, Suit } from './types';

export const SUITS: Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];

export const RANKS: Rank[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,
  clubs: 1,
  diamonds: 2,
  hearts: 3,
};

export const SUIT_SYMBOL: Record<Suit, string> = {
  spades: '♠',
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥',
};

export function makeCardId(suit: Suit, rank: Rank): string {
  return `${suit}-${rank}`;
}

export function card(suit: Suit, rank: Rank): Card {
  return {
    id: makeCardId(suit, rank),
    suit,
    rank,
  };
}

export function formatRank(rank: Rank): string {
  switch (rank) {
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    case 14:
      return 'A';
    case 15:
      return '2';
    default:
      return String(rank);
  }
}

export function formatCardLabel(c: Card): string {
  return `${formatRank(c.rank)}${SUIT_SYMBOL[c.suit]}`;
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push(card(suit, rank));
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[], rng: () => number = Math.random): Card[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function compareCards(a: Card, b: Card): number {
  if (a.rank !== b.rank) return a.rank - b.rank;
  return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
}

export function sortCardsByRank(cards: Card[]): Card[] {
  return [...cards].sort(compareCards);
}

/**
 * Groups multi-card structures (Tứ quý, Triples, Straights of same suit, Pairs of same color)
 * followed by remaining singles so players can scan their Northern combos easily.
 */
export function sortCardsByCombo(cards: Card[]): Card[] {
  const remaining = sortCardsByRank(cards);
  const grouped: Card[] = [];
  const used = new Set<string>();

  const take = (picked: Card[]) => {
    for (const c of picked) {
      used.add(c.id);
      grouped.push(c);
    }
  };

  // 1. Tứ quý
  const byRank = new Map<Rank, Card[]>();
  for (const c of remaining) {
    const arr = byRank.get(c.rank) ?? [];
    arr.push(c);
    byRank.set(c.rank, arr);
  }
  for (const [, list] of byRank) {
    if (list.length === 4) {
      take(list);
    }
  }

  // 2. Same-suit straights (>= 3, no 2)
  for (const suit of SUITS) {
    const suitCards = remaining
      .filter((c) => !used.has(c.id) && c.suit === suit && c.rank <= 14)
      .sort(compareCards);
    let run: Card[] = [];
    for (const c of suitCards) {
      if (run.length === 0 || c.rank === run[run.length - 1].rank + 1) {
        run.push(c);
      } else {
        if (run.length >= 3) take(run);
        run = [c];
      }
    }
    if (run.length >= 3) take(run);
  }

  // 3. Triples
  for (const [, list] of byRank) {
    const avail = list.filter((c) => !used.has(c.id));
    if (avail.length === 3) {
      take(avail);
    }
  }

  // 4. Same-color pairs
  for (const [, list] of byRank) {
    const avail = list.filter((c) => !used.has(c.id));
    const blacks = avail.filter((c) => c.suit === 'spades' || c.suit === 'clubs');
    const reds = avail.filter((c) => c.suit === 'diamonds' || c.suit === 'hearts');
    if (blacks.length === 2) take(blacks);
    if (reds.length === 2) take(reds);
  }

  // 5. Remaining singles
  for (const c of remaining) {
    if (!used.has(c.id)) {
      grouped.push(c);
    }
  }

  return grouped;
}

export function sortHand(cards: Card[], mode: SortMode): Card[] {
  return mode === 'combo' ? sortCardsByCombo(cards) : sortCardsByRank(cards);
}
