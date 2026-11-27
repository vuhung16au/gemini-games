import type { Rank, Suit } from './types';

export const STORAGE_KEY = 'ta_la_phom_v1';

export const SUITS: readonly Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];

export const RANKS: readonly Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥',
};

export const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,
  clubs: 1,
  diamonds: 2,
  hearts: 3,
};

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function formatRank(rank: Rank): string {
  switch (rank) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return String(rank);
  }
}

export function cardPoints(card: { rank: Rank }): number {
  return card.rank; // A=1, 2..10=face, J=11, Q=12, K=13
}

export function formatCardShort(card: { suit: Suit; rank: Rank }): string {
  return `${formatRank(card.rank)}${SUIT_SYMBOLS[card.suit]}`;
}
