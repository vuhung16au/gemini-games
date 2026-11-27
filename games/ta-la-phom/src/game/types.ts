export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts';

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type PlayerCount = 2 | 3 | 4;

export type GameMode = 'vs-ai' | 'pass-and-play';

export type PhomType = 'set' | 'run';

export interface PhomMeld {
  id: string;
  type: PhomType;
  cards: Card[];
  ownerIndex: number;
}

export type TurnPhase =
  | 'draw_or_eat'
  | 'meld'
  | 'discard'
  | 'game_over';

export type WinReason = 'U' | 'points';

export interface PlayerState {
  index: number;
  nameVi: string;
  nameEn: string;
  isAi: boolean;
  hand: Card[];
  discards: Card[];
  eatenCardIds: string[];
  melds: PhomMeld[];
  hasMelded: boolean;
}

export interface LastDiscard {
  card: Card;
  playerIndex: number;
}

export interface PlayerResult {
  playerIndex: number;
  nameVi: string;
  nameEn: string;
  isAi: boolean;
  rank: number;
  melds: PhomMeld[];
  deadwood: Card[];
  deadwoodPoints: number;
  isMom: boolean;
  isU: boolean;
  matchPointsDelta: number;
}

export interface LayOffOption {
  card: Card;
  targetPlayerIndex: number;
  targetMeldId: string;
  targetMeld: PhomMeld;
}

export interface OptimalMeldResult {
  melds: Card[][];
  deadwood: Card[];
  deadwoodPoints: number;
  isPossible: boolean;
}

export interface TaLaState {
  playerCount: PlayerCount;
  mode: GameMode;
  dealerIndex: number;
  currentPlayerIndex: number;
  round: 1 | 2 | 3 | 4;
  turnsCompletedInRound: number;
  phase: TurnPhase;
  players: PlayerState[];
  nocPile: Card[];
  lastDiscard: LastDiscard | null;
  lastActionText: string;
  results: PlayerResult[] | null;
  winnerIndex: number | null;
  winReason: WinReason | null;
  tutorialMode: boolean;
  tutorialStep: 1 | 2 | 3 | 4; // 4 = completed
}

export interface PhomHint {
  target: 'eat' | 'draw' | 'meld' | 'layoff' | 'discard' | 'declare_u' | 'proceed_discard';
  cardId?: string;
  layOffOption?: LayOffOption;
  message: string;
}

export interface StoredTaLaStats {
  bestScore: number;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  uWins: number;
  muted: boolean;
  playerCount: PlayerCount;
  mode: GameMode;
}
