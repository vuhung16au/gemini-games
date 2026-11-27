export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts';

export type Rank = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type ComboType = 'SINGLE' | 'PAIR' | 'TRIPLE' | 'STRAIGHT' | 'TU_QUY';

export type SuitColor = 'black' | 'red';

export interface Combo {
  type: ComboType;
  cards: Card[];
  highRank: Rank;
  highSuit: Suit;
  length: number;
  suitKey: string;
  color?: SuitColor;
}

export type PlayerCount = 2 | 3 | 4;

export type GameMode = 'ai' | 'hotseat';

export type SortMode = 'rank' | 'combo';

export interface Player {
  id: number;
  nameVi: string;
  nameEn: string;
  isHuman: boolean;
  hand: Card[];
  passed: boolean;
  chatHeoPoints: number;
}

export interface RoundScoreEntry {
  playerId: number;
  nameVi: string;
  nameEn: string;
  cardsLeft: number;
  thoi2Count: number;
  thoiTuQuyCount: number;
  chatHeoPoints: number;
  delta: number;
  isWinner: boolean;
  thoi2Loss?: boolean;
}

export interface EventBanner {
  vi: string;
  en: string;
  tone: 'info' | 'warning' | 'special';
}

export interface GameState {
  playerCount: PlayerCount;
  mode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  lastPlayerIndex: number | null;
  tableCombo: Combo | null;
  tableOwnerName: string | null;
  isFirstTurnOfMatch: boolean;
  mustIncludeCardId: string | null;
  handoffRequired: boolean;
  status: 'playing' | 'finished';
  winnerIndex: number | null;
  roundScores: RoundScoreEntry[];
  eventBanner: EventBanner | null;
  isTutorial: boolean;
  tutorialStep: number;
  sortMode: SortMode;
}

export interface SaveData {
  wins: number;
  gamesPlayed: number;
  bestScore: number;
  totalScore: number;
  muted: boolean;
  playerCount: PlayerCount;
  mode: GameMode;
}

export interface HintResult {
  cards: Card[];
  combo: Combo;
  reasonVi: string;
  reasonEn: string;
}

export interface ValidationResult {
  valid: boolean;
  combo?: Combo;
  isThoi2Block?: boolean;
  warnsThoi2?: boolean;
  reasonVi?: string;
  reasonEn?: string;
}
