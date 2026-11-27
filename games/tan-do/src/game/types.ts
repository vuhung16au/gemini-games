export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts';

export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type PlayerCount = 2 | 3 | 4;

export type GameMode = 'ai' | 'pass-and-play';

export type GameStatus = 'PLAYING' | 'WON';

export type BoutPhase = 'ATTACK_OPEN' | 'DEFEND_OR_PASS' | 'THROW_IN';

export interface Player {
  index: number;
  nameVi: string;
  nameEn: string;
  isAI: boolean;
  hand: Card[];
}

export interface TableSlot {
  attack: Card;
  defense: Card | null;
  attackedBy: number;
}

export interface TanDoState {
  playerCount: PlayerCount;
  mode: GameMode;
  status: GameStatus;
  phase: BoutPhase;
  players: Player[];
  /** Draw pile (Nọc); index 0 is top, last element is revealed Trump card while in deck. */
  noc: Card[];
  /** Bottom card of Nọc revealed at start as Chất Trưởng. */
  trumpCard: Card;
  trumpSuit: Suit;
  /** True while trumpCard is still sitting at the bottom of Nọc. */
  trumpCardInNoc: boolean;
  table: TableSlot[];
  attackerIndex: number;
  defenderIndex: number;
  activePlayerIndex: number;
  /** Player indices who passed during the current THROW_IN phase. */
  passedPlayers: number[];
  /** True when Pass & Play requires the Privacy Handoff Curtain before showing cards. */
  handoffPending: boolean;
  roundNumber: number;
  discardCount: number;
  winnerIndex: number | null;
  lastEventVi: string;
  lastEventEn: string;
  isTutorial: boolean;
  tutorialStep: number;
}

export interface TanDoHint {
  action: 'ATTACK' | 'DEFEND' | 'THROW_IN' | 'TAKE' | 'PASS';
  cardIds: string[];
  targetSlotIndex?: number;
  messageVi: string;
  messageEn: string;
}

export interface SaveData {
  wins: number;
  score: number;
  gamesPlayed: number;
  playerCount: PlayerCount;
  mode: GameMode;
  muted: boolean;
}
