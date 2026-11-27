import type { Rank, Suit } from './types';

export const STORAGE_KEY = 'tan_do_v1';

export const INITIAL_HAND_SIZE = 8;
export const MAX_TABLE_SLOTS = 6;

export const SUITS: readonly Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];

export const RANKS: readonly Rank[] = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
];

export const SUIT_INFO: Record<
  Suit,
  { symbol: string; nameVi: string; nameEn: string; isRed: boolean }
> = {
  spades: { symbol: '♠', nameVi: 'Bích', nameEn: 'Spades', isRed: false },
  clubs: { symbol: '♣', nameVi: 'Tép', nameEn: 'Clubs', isRed: false },
  diamonds: { symbol: '♦', nameVi: 'Rô', nameEn: 'Diamonds', isRed: true },
  hearts: { symbol: '♥', nameVi: 'Cơ', nameEn: 'Hearts', isRed: true },
};
