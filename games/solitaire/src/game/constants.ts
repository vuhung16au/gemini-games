export const SUITS = ['spades', 'hearts', 'clubs', 'diamonds'] as const;

export const TABLEAU_COUNT = 7;
export const FOUNDATION_COUNT = 4;
export const MAX_UNDO_HISTORY = 100;
export const STORAGE_KEY = 'solitaire_v1';

export const SCORE_WASTE_TO_TABLEAU = 5;
export const SCORE_TO_FOUNDATION = 10;
export const SCORE_FLIP_TABLEAU = 5;
export const SCORE_FOUNDATION_TO_TABLEAU = -15;
export const SCORE_RECYCLE_DRAW1 = -20;
