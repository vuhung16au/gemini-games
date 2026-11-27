import {
  FOUNDATION_COUNT,
  MAX_UNDO_HISTORY,
  SCORE_FLIP_TABLEAU,
  SCORE_FOUNDATION_TO_TABLEAU,
  SCORE_RECYCLE_DRAW1,
  SCORE_TO_FOUNDATION,
  SCORE_WASTE_TO_TABLEAU,
  SUITS,
  TABLEAU_COUNT,
} from './constants';
import type {
  Card,
  CardLocation,
  DrawMode,
  DropTarget,
  GameState,
  HistorySnapshot,
  MoveResult,
  Rank,
  Suit,
} from './types';
import { evaluateTutorialProgress } from './tutorial';

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function getRankLabel(rank: Rank): string {
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

export function cloneCards(cards: Card[]): Card[] {
  return cards.map((c) => ({ ...c }));
}

function makeSnapshot(state: GameState): HistorySnapshot {
  return {
    stock: cloneCards(state.stock),
    waste: cloneCards(state.waste),
    foundations: state.foundations.map(cloneCards),
    tableau: state.tableau.map(cloneCards),
    score: state.score,
    moves: state.moves,
    tutorialStep: state.tutorialStep,
    tutorialCompleted: state.tutorialCompleted,
  };
}

/** Create an ordered 52-card standard deck (face-down). */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let r = 1; r <= 13; r++) {
      const rank = r as Rank;
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp: false,
      });
    }
  }
  return deck;
}

/** Fisher-Yates shuffle returning a new array. */
export function shuffleDeck(
  deck: Card[],
  rng: () => number = Math.random,
): Card[] {
  const copy = cloneCards(deck);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Deal a standard Klondike Solitaire board (28 tableau + 24 stock). */
export function createGameState(
  drawMode: DrawMode = 1,
  rng: () => number = Math.random,
): GameState {
  const deck = shuffleDeck(createDeck(), rng);
  const tableau: Card[][] = Array.from({ length: TABLEAU_COUNT }, () => []);

  let deckIdx = 0;
  for (let col = 0; col < TABLEAU_COUNT; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[deckIdx++], faceUp: row === col };
      tableau[col].push(card);
    }
  }

  const stock = deck.slice(deckIdx).map((c) => ({ ...c, faceUp: false }));

  return {
    stock,
    waste: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau,
    drawMode,
    score: 0,
    moves: 0,
    elapsedSeconds: 0,
    status: 'PLAYING',
    isTutorial: false,
    tutorialStep: 0,
    tutorialCompleted: false,
    history: [],
  };
}

export function canMoveToFoundation(card: Card, foundationPile: Card[]): boolean {
  if (!card.faceUp) return false;
  if (foundationPile.length === 0) {
    return card.rank === 1;
  }
  const top = foundationPile[foundationPile.length - 1];
  return top.suit === card.suit && card.rank === top.rank + 1;
}

export function canMoveToTableau(card: Card, tableauPile: Card[]): boolean {
  if (!card.faceUp) return false;
  if (tableauPile.length === 0) {
    return card.rank === 13;
  }
  const top = tableauPile[tableauPile.length - 1];
  if (!top.faceUp) return false;
  return (
    isRedSuit(card.suit) !== isRedSuit(top.suit) && card.rank === top.rank - 1
  );
}

export function isGameWon(foundations: Card[][]): boolean {
  return foundations.every((pile) => pile.length === 13);
}

/** Draw 1 or 3 cards from stock, or recycle waste when stock is empty. */
export function drawFromStock(state: GameState): GameState {
  if (state.status !== 'PLAYING') return state;
  if (state.stock.length === 0 && state.waste.length === 0) {
    return state;
  }

  const snapshot = makeSnapshot(state);

  if (state.stock.length === 0) {
    const recycledStock = cloneCards(state.waste)
      .reverse()
      .map((c) => ({ ...c, faceUp: false }));
    const nextScore =
      state.drawMode === 1
        ? Math.max(0, state.score + SCORE_RECYCLE_DRAW1)
        : state.score;

    return {
      ...state,
      stock: recycledStock,
      waste: [],
      score: nextScore,
      moves: state.moves + 1,
      history: [...state.history, snapshot].slice(-MAX_UNDO_HISTORY),
    };
  }

  const nextStock = cloneCards(state.stock);
  const nextWaste = cloneCards(state.waste);
  const drawCount = Math.min(state.drawMode, nextStock.length);

  for (let i = 0; i < drawCount; i++) {
    const drawn = nextStock.pop()!;
    drawn.faceUp = true;
    nextWaste.push(drawn);
  }

  return {
    ...state,
    stock: nextStock,
    waste: nextWaste,
    moves: state.moves + 1,
    history: [...state.history, snapshot].slice(-MAX_UNDO_HISTORY),
  };
}

function extractMovingCards(
  state: GameState,
  from: CardLocation,
): Card[] | null {
  if (from.zone === 'waste') {
    if (
      state.waste.length === 0 ||
      from.cardIndex !== state.waste.length - 1
    ) {
      return null;
    }
    return [state.waste[state.waste.length - 1]];
  }

  if (from.zone === 'foundation') {
    const pile = state.foundations[from.pileIndex];
    if (!pile || pile.length === 0 || from.cardIndex !== pile.length - 1) {
      return null;
    }
    return [pile[pile.length - 1]];
  }

  const col = state.tableau[from.pileIndex];
  if (!col || from.cardIndex < 0 || from.cardIndex >= col.length) {
    return null;
  }
  const slice = col.slice(from.cardIndex);
  if (slice.length === 0 || !slice[0].faceUp) {
    return null;
  }
  return slice;
}

/** Move a card (or face-up tableau stack) from `from` to `to`. */
export function moveCards(
  state: GameState,
  from: CardLocation,
  to: DropTarget,
): MoveResult {
  if (state.status !== 'PLAYING') {
    return { state, moved: false, toFoundation: false, wonNow: false };
  }
  if (from.zone === to.zone && from.pileIndex === to.pileIndex) {
    return { state, moved: false, toFoundation: false, wonNow: false };
  }

  const moving = extractMovingCards(state, from);
  if (!moving || moving.length === 0) {
    return { state, moved: false, toFoundation: false, wonNow: false };
  }

  if (to.zone === 'foundation') {
    if (moving.length !== 1) {
      return { state, moved: false, toFoundation: false, wonNow: false };
    }
    const targetPile = state.foundations[to.pileIndex];
    if (!targetPile || !canMoveToFoundation(moving[0], targetPile)) {
      return { state, moved: false, toFoundation: false, wonNow: false };
    }
  } else {
    const targetCol = state.tableau[to.pileIndex];
    if (!targetCol || !canMoveToTableau(moving[0], targetCol)) {
      return { state, moved: false, toFoundation: false, wonNow: false };
    }
  }

  const snapshot = makeSnapshot(state);
  const nextWaste = cloneCards(state.waste);
  const nextFoundations = state.foundations.map(cloneCards);
  const nextTableau = state.tableau.map(cloneCards);
  let scoreDelta = 0;

  // Remove from source
  if (from.zone === 'waste') {
    nextWaste.pop();
  } else if (from.zone === 'foundation') {
    nextFoundations[from.pileIndex].pop();
    if (to.zone === 'tableau') {
      scoreDelta += SCORE_FOUNDATION_TO_TABLEAU;
    }
  } else {
    nextTableau[from.pileIndex].splice(from.cardIndex);
    const remaining = nextTableau[from.pileIndex];
    if (remaining.length > 0 && !remaining[remaining.length - 1].faceUp) {
      remaining[remaining.length - 1].faceUp = true;
      scoreDelta += SCORE_FLIP_TABLEAU;
    }
  }

  // Place onto destination
  const placed = cloneCards(moving);
  if (to.zone === 'foundation') {
    nextFoundations[to.pileIndex].push(placed[0]);
    if (from.zone !== 'foundation') {
      scoreDelta += SCORE_TO_FOUNDATION;
    }
  } else {
    nextTableau[to.pileIndex].push(...placed);
    if (from.zone === 'waste') {
      scoreDelta += SCORE_WASTE_TO_TABLEAU;
    }
  }

  const wonNow = isGameWon(nextFoundations);
  let nextState: GameState = {
    ...state,
    waste: nextWaste,
    foundations: nextFoundations,
    tableau: nextTableau,
    score: Math.max(0, state.score + scoreDelta),
    moves: state.moves + 1,
    status: wonNow ? 'WON' : 'PLAYING',
    history: [...state.history, snapshot].slice(-MAX_UNDO_HISTORY),
  };

  if (nextState.isTutorial) {
    nextState = evaluateTutorialProgress(nextState);
  }

  return {
    state: nextState,
    moved: true,
    toFoundation: to.zone === 'foundation',
    wonNow,
  };
}

/** Quick-send the top card of waste or tableau to a legal foundation pile. */
export function autoMoveToFoundation(
  state: GameState,
  from: CardLocation,
): MoveResult {
  if (from.zone === 'foundation') {
    return { state, moved: false, toFoundation: false, wonNow: false };
  }
  const moving = extractMovingCards(state, from);
  if (!moving || moving.length !== 1) {
    return { state, moved: false, toFoundation: false, wonNow: false };
  }

  for (let f = 0; f < FOUNDATION_COUNT; f++) {
    if (canMoveToFoundation(moving[0], state.foundations[f])) {
      return moveCards(state, from, { zone: 'foundation', pileIndex: f });
    }
  }

  return { state, moved: false, toFoundation: false, wonNow: false };
}

/** True when all remaining cards are face-up in tableau and stock/waste are empty. */
export function canAutoComplete(state: GameState): boolean {
  if (
    state.status !== 'PLAYING' ||
    state.isTutorial ||
    state.stock.length > 0 ||
    state.waste.length > 0
  ) {
    return false;
  }

  let hasTableauCards = false;
  for (const col of state.tableau) {
    for (const card of col) {
      hasTableauCards = true;
      if (!card.faceUp) return false;
    }
  }
  return hasTableauCards;
}

/** Advance auto-complete by sending the lowest-rank legal top tableau card to foundation. */
export function stepAutoComplete(state: GameState): MoveResult {
  let bestCol = -1;
  let bestRank = Infinity;
  let bestFoundation = -1;

  for (let c = 0; c < TABLEAU_COUNT; c++) {
    const col = state.tableau[c];
    if (col.length === 0) continue;
    const top = col[col.length - 1];
    if (!top.faceUp) continue;

    for (let f = 0; f < FOUNDATION_COUNT; f++) {
      if (canMoveToFoundation(top, state.foundations[f]) && top.rank < bestRank) {
        bestRank = top.rank;
        bestCol = c;
        bestFoundation = f;
      }
    }
  }

  if (bestCol === -1 || bestFoundation === -1) {
    return { state, moved: false, toFoundation: false, wonNow: false };
  }

  const cardIndex = state.tableau[bestCol].length - 1;
  return moveCards(
    state,
    { zone: 'tableau', pileIndex: bestCol, cardIndex },
    { zone: 'foundation', pileIndex: bestFoundation },
  );
}

export function undoMove(state: GameState): GameState {
  if (state.status !== 'PLAYING' || state.history.length === 0) {
    return state;
  }

  const prev = state.history[state.history.length - 1];
  return {
    ...state,
    stock: cloneCards(prev.stock),
    waste: cloneCards(prev.waste),
    foundations: prev.foundations.map(cloneCards),
    tableau: prev.tableau.map(cloneCards),
    score: prev.score,
    moves: prev.moves,
    tutorialStep: prev.tutorialStep,
    tutorialCompleted: prev.tutorialCompleted,
    history: state.history.slice(0, -1),
  };
}

export function togglePause(state: GameState): GameState {
  if (state.status === 'PLAYING') return { ...state, status: 'PAUSED' };
  if (state.status === 'PAUSED') return { ...state, status: 'PLAYING' };
  return state;
}

export function tickSecond(state: GameState): GameState {
  if (state.status !== 'PLAYING') return state;
  return { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
