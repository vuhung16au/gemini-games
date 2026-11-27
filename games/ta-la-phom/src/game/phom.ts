import { cardPoints, SUIT_ORDER } from './constants';
import { compareCardsByRank } from './deck';
import type {
  Card,
  LayOffOption,
  OptimalMeldResult,
  PhomMeld,
  PhomType,
  Suit,
} from './types';

/**
 * Validates whether a set of cards forms a legal Phỏm:
 * - Set (Phỏm Sáp): 3 or 4 cards of the same rank and distinct suits.
 * - Run (Phỏm Dây): 3+ consecutive-rank cards of the same suit (A=1..K=13).
 */
export function isValidPhom(cards: readonly Card[]): PhomType | null {
  if (cards.length < 3) return null;

  const ids = new Set(cards.map((c) => c.id));
  if (ids.size !== cards.length) return null;

  // Check Set: 3 or 4 cards of the same rank
  if (cards.length <= 4) {
    const firstRank = cards[0].rank;
    if (cards.every((c) => c.rank === firstRank)) {
      const suits = new Set(cards.map((c) => c.suit));
      if (suits.size === cards.length) {
        return 'set';
      }
    }
  }

  // Check Run: 3+ consecutive same suit
  const firstSuit = cards[0].suit;
  if (cards.every((c) => c.suit === firstSuit)) {
    const sorted = [...cards].sort((a, b) => a.rank - b.rank);
    let consecutive = true;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].rank !== sorted[i - 1].rank + 1) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) {
      return 'run';
    }
  }

  return null;
}

/**
 * Enumerates all valid candidate Phỏms (all 3-card & 4-card sets, and all 3+ sub-runs)
 * present inside a given hand.
 */
export function findAllCandidateMelds(hand: readonly Card[]): Card[][] {
  const candidates: Card[][] = [];

  // 1. Group by rank for Sets
  const byRank = new Map<number, Card[]>();
  for (const card of hand) {
    const group = byRank.get(card.rank) ?? [];
    group.push(card);
    byRank.set(card.rank, group);
  }

  for (const group of byRank.values()) {
    if (group.length >= 3) {
      const sorted = [...group].sort((a, b) => SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit]);
      if (sorted.length === 3) {
        candidates.push(sorted);
      } else if (sorted.length === 4) {
        candidates.push(sorted);
        // Also add all 4 three-card subsets in case one card is needed in a Run
        for (let skip = 0; skip < 4; skip++) {
          candidates.push(sorted.filter((_, idx) => idx !== skip));
        }
      }
    }
  }

  // 2. Group by suit for Runs
  const bySuit = new Map<Suit, Card[]>();
  for (const card of hand) {
    const group = bySuit.get(card.suit) ?? [];
    group.push(card);
    bySuit.set(card.suit, group);
  }

  for (const group of bySuit.values()) {
    if (group.length < 3) continue;
    const sorted = [...group].sort((a, b) => a.rank - b.rank);

    // Find maximal consecutive streaks, then emit all sub-runs of length >= 3
    let start = 0;
    while (start < sorted.length) {
      let end = start;
      while (end + 1 < sorted.length && sorted[end + 1].rank === sorted[end].rank + 1) {
        end++;
      }
      const streakLen = end - start + 1;
      if (streakLen >= 3) {
        for (let subStart = start; subStart <= end - 2; subStart++) {
          for (let subEnd = subStart + 2; subEnd <= end; subEnd++) {
            candidates.push(sorted.slice(subStart, subEnd + 1));
          }
        }
      }
      start = end + 1;
    }
  }

  return candidates;
}

interface CandidateBitmask {
  cards: Card[];
  mask: number;
  points: number;
  eatenMask: number;
}

/**
 * Exact backtracking solver that partitions `hand` into disjoint Phỏms to
 * minimize deadwood points, while guaranteeing every card in `requiredCardIds`
 * (eaten cards) is included in a valid Phỏm (with at most `maxEatenPerMeld`
 * eaten cards per meld, defaulting to 1 per authentic Tá Lả rules).
 */
export function solveOptimalMelds(
  hand: readonly Card[],
  requiredCardIds: readonly string[] = [],
  options: { maxEatenPerMeld?: number } = {},
): OptimalMeldResult {
  const maxEatenPerMeld = options.maxEatenPerMeld ?? 1;
  const totalPoints = hand.reduce((sum, c) => sum + cardPoints(c), 0);

  if (hand.length === 0) {
    return {
      melds: [],
      deadwood: [],
      deadwoodPoints: 0,
      isPossible: requiredCardIds.length === 0,
    };
  }

  const indexById = new Map<string, number>();
  hand.forEach((c, idx) => indexById.set(c.id, idx));

  const requiredSet = new Set(requiredCardIds);
  let requiredMask = 0;
  for (const reqId of requiredCardIds) {
    const idx = indexById.get(reqId);
    if (idx === undefined) {
      return {
        melds: [],
        deadwood: [...hand],
        deadwoodPoints: totalPoints,
        isPossible: false,
      };
    }
    requiredMask |= 1 << idx;
  }

  const rawCandidates = findAllCandidateMelds(hand);
  const candidates: CandidateBitmask[] = [];

  for (const meld of rawCandidates) {
    let mask = 0;
    let eatenMask = 0;
    let eatenCount = 0;
    let points = 0;
    for (const c of meld) {
      const idx = indexById.get(c.id)!;
      const bit = 1 << idx;
      mask |= bit;
      points += cardPoints(c);
      if (requiredSet.has(c.id)) {
        eatenMask |= bit;
        eatenCount++;
      }
    }
    if (eatenCount <= maxEatenPerMeld) {
      candidates.push({ cards: meld, mask, points, eatenMask });
    }
  }

  // Sort higher point melds first for fast pruning/tie-breaking
  candidates.sort((a, b) => b.points - a.points || b.cards.length - a.cards.length);

  // Precompute suffix masks of reachable cards and required cards for pruning
  const suffixPossibleMask = new Array<number>(candidates.length + 1).fill(0);
  for (let i = candidates.length - 1; i >= 0; i--) {
    suffixPossibleMask[i] = suffixPossibleMask[i + 1] | candidates[i].mask;
  }

  let bestChosen: Card[][] | null = null;
  let bestUsedMask = 0;
  let bestMeldedPoints = -1;
  let bestMeldedCount = -1;

  const currentChosen: Card[][] = [];

  function backtrack(
    idx: number,
    usedMask: number,
    coveredRequiredMask: number,
    meldedPoints: number,
    meldedCount: number,
  ): void {
    // Check if all required cards can still be covered
    const missingRequired = requiredMask & ~coveredRequiredMask;
    if ((missingRequired & suffixPossibleMask[idx]) !== missingRequired) {
      return;
    }

    if (missingRequired === 0) {
      if (
        bestChosen === null ||
        meldedPoints > bestMeldedPoints ||
        (meldedPoints === bestMeldedPoints && meldedCount > bestMeldedCount)
      ) {
        bestChosen = currentChosen.map((m) => [...m]);
        bestUsedMask = usedMask;
        bestMeldedPoints = meldedPoints;
        bestMeldedCount = meldedCount;
      }
    }

    for (let i = idx; i < candidates.length; i++) {
      const cand = candidates[i];
      if ((usedMask & cand.mask) !== 0) continue;

      currentChosen.push(cand.cards);
      backtrack(
        i + 1,
        usedMask | cand.mask,
        coveredRequiredMask | cand.eatenMask,
        meldedPoints + cand.points,
        meldedCount + cand.cards.length,
      );
      currentChosen.pop();
    }
  }

  backtrack(0, 0, 0, 0, 0);

  if (bestChosen === null) {
    return {
      melds: [],
      deadwood: [...hand],
      deadwoodPoints: totalPoints,
      isPossible: false,
    };
  }

  const deadwood = hand.filter((_, i) => (bestUsedMask & (1 << i)) === 0);
  const deadwoodPoints = deadwood.reduce((sum, c) => sum + cardPoints(c), 0);

  return {
    melds: bestChosen,
    deadwood,
    deadwoodPoints,
    isPossible: true,
  };
}

/**
 * Checks if a single card can legally be laid off (Gửi bài) onto an existing Phỏm meld.
 */
export function canLayOffCard(card: Card, meld: PhomMeld): boolean {
  if (meld.cards.some((c) => c.id === card.id)) return false;
  if (meld.type === 'set') {
    return meld.cards.length < 4 && meld.cards[0].rank === card.rank;
  }
  // Run
  if (meld.cards[0].suit !== card.suit) return false;
  const sorted = [...meld.cards].sort((a, b) => a.rank - b.rank);
  const minRank = sorted[0].rank;
  const maxRank = sorted[sorted.length - 1].rank;
  return card.rank === minRank - 1 || card.rank === maxRank + 1;
}

/**
 * Lists all valid lay-off moves from a player's remaining hand onto existing melds on the table.
 */
export function findLayOffOptions(
  hand: readonly Card[],
  players: readonly { index: number; melds: PhomMeld[] }[],
): LayOffOption[] {
  const options: LayOffOption[] = [];
  for (const card of hand) {
    for (const p of players) {
      for (const meld of p.melds) {
        if (canLayOffCard(card, meld)) {
          options.push({
            card,
            targetPlayerIndex: p.index,
            targetMeldId: meld.id,
            targetMeld: meld,
          });
        }
      }
    }
  }
  return options;
}

/**
 * Detects whether a hand qualifies for instant Ù (0 deadwood after at most 1 non-eaten discard,
 * or 10 cards all in Phỏms = Ù Tròn).
 */
export function canDeclareU(
  hand: readonly Card[],
  requiredCardIds: readonly string[] = [],
): boolean {
  if (hand.length === 0) return true;
  const solved = solveOptimalMelds(hand, requiredCardIds, { maxEatenPerMeld: 1 });
  if (!solved.isPossible || solved.melds.length === 0) return false;
  if (solved.deadwood.length === 0) return true;
  if (hand.length >= 10 && solved.deadwood.length === 1) {
    const reqSet = new Set(requiredCardIds);
    return !reqSet.has(solved.deadwood[0].id);
  }
  return false;
}

/**
 * Orders a hand so detected Phỏm melds appear grouped on the left, followed by deadwood sorted by rank.
 */
export function sortHandSmart(
  hand: readonly Card[],
  requiredCardIds: readonly string[] = [],
): Card[] {
  const solved = solveOptimalMelds(hand, requiredCardIds, { maxEatenPerMeld: 1 });
  if (!solved.isPossible || solved.melds.length === 0) {
    return [...hand].sort(compareCardsByRank);
  }
  const meldedCards: Card[] = [];
  for (const meld of solved.melds) {
    const sortedMeld = [...meld].sort(compareCardsByRank);
    meldedCards.push(...sortedMeld);
  }
  const deadwoodSorted = [...solved.deadwood].sort(compareCardsByRank);
  return [...meldedCards, ...deadwoodSorted];
}
