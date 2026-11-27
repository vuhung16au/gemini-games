import { RANKS, SUITS, SUIT_ORDER } from './constants';
import type { Card } from './types';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck: readonly Card[], rng: () => number = Math.random): Card[] {
  const copy = deck.map((c) => ({ ...c }));
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function compareCardsByRank(a: Card, b: Card): number {
  if (a.rank !== b.rank) return a.rank - b.rank;
  return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
}

export function compareCardsBySuit(a: Card, b: Card): number {
  if (a.suit !== b.suit) return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
  return a.rank - b.rank;
}
