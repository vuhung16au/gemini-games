export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts';

export type Rank = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
}

export type ComboType =
  | 'SINGLE'
  | 'PAIR'
  | 'TRIPLE'
  | 'STRAIGHT'
  | 'THREE_PAIRS'
  | 'FOUR_OF_A_KIND'
  | 'FOUR_PAIRS';

export interface Combo {
  type: ComboType;
  cards: Card[];
  highCard: Card;
  length: number;
}

export type PlayerCount = 2 | 3 | 4;
export type GameMode = 'vs-ai' | 'pass-and-play';
export type SortMode = 'rank' | 'suit' | 'combo';

export type ToiTrangReason = 'DRAGON_STRAIGHT' | 'SIX_PAIRS' | 'FOUR_TWOS';

export interface Player {
  id: number;
  nameVi: string;
  nameEn: string;
  isAi: boolean;
  hand: Card[];
  passedThisTrick: boolean;
  cardsPlayedCount: number;
  score: number;
  wins: number;
}

export interface TablePlay {
  playerId: number;
  combo: Combo;
  isCut: boolean;
}

export interface PlayerPenaltySummary {
  playerId: number;
  nameVi: string;
  nameEn: string;
  remainingCards: number;
  heoPenalty: number;
  bombPenalty: number;
  congPenalty: boolean;
  totalDelta: number;
}

export interface RoundResult {
  winnerId: number;
  reason: 'OUT_OF_CARDS' | 'TOI_TRANG';
  toiTrangReason?: ToiTrangReason;
  winningCards?: Card[];
  pointsEarned: number;
  penalties: PlayerPenaltySummary[];
}

export interface TutorialState {
  active: boolean;
  step: 1 | 2 | 3 | 4; // 4 = completed
  hintCardIds: string[];
  message: string;
}

export interface GameState {
  playerCount: PlayerCount;
  mode: GameMode;
  roundNumber: number;
  players: Player[];
  currentTurn: number;
  trickLeader: number | null;
  currentCombo: Combo | null;
  lastPlay: TablePlay | null;
  tableHistory: TablePlay[];
  mustIncludeCardId: string | null;
  selectedCardIds: string[];
  sortMode: SortMode;
  privacyCurtain: boolean;
  status: 'PLAYING' | 'ROUND_OVER';
  roundResult: RoundResult | null;
  bannerMessage: string | null;
  hintedCardIds: string[];
  cutEventCount: number;
  tutorial: TutorialState;
}
