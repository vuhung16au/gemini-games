import type { ComboType, Rank, Suit } from './types';

export const STORAGE_KEY = 'tien_len_mien_nam_v1';

export const SUITS: readonly Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];

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

export const RANKS: readonly Rank[] = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];

export const RANK_LABELS: Record<Rank, string> = {
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A',
  15: '2',
};

export const COMBO_LABELS: Record<ComboType, { vi: string; en: string }> = {
  SINGLE: { vi: 'Lẻ', en: 'Single' },
  PAIR: { vi: 'Đôi', en: 'Pair' },
  TRIPLE: { vi: 'Sám cô', en: 'Triple' },
  STRAIGHT: { vi: 'Sảnh', en: 'Straight' },
  THREE_PAIRS: { vi: '3 Đôi thông', en: '3 Consec. Pairs' },
  FOUR_OF_A_KIND: { vi: 'Tứ quý', en: 'Four of a Kind' },
  FOUR_PAIRS: { vi: '4 Đôi thông', en: '4 Consec. Pairs' },
};

export const AI_THINK_DELAY_MS = 520;
export const CARDS_PER_PLAYER = 13;
