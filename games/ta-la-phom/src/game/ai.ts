import { cardPoints } from './constants';
import {
  canEatLastDiscard,
  declareU,
  discardCard,
  drawFromNoc,
  eatLastDiscard,
  getLegalDiscardIds,
  layOffSingleCard,
  meldOptimalPhoms,
  proceedToDiscard,
} from './engine';
import { canDeclareU, findLayOffOptions, solveOptimalMelds } from './phom';
import type { Card, TaLaState } from './types';

/**
 * Evaluates whether the active AI player should eat the previous player's discard.
 */
export function shouldAiEat(state: TaLaState): boolean {
  const currIdx = state.currentPlayerIndex;
  if (!canEatLastDiscard(state, currIdx)) return false;

  const player = state.players[currIdx];
  const candidate = state.lastDiscard!.card;

  const before = solveOptimalMelds(player.hand, player.eatenCardIds, { maxEatenPerMeld: 1 });
  const after = solveOptimalMelds(
    [...player.hand, candidate],
    [...player.eatenCardIds, candidate.id],
    { maxEatenPerMeld: 1 },
  );

  if (!after.isPossible) return false;
  // Eating is almost always strong in Tá Lả if it forms a new Phỏm or drops deadwood
  if (after.melds.length > before.melds.length) return true;
  if (after.deadwoodPoints <= before.deadwoodPoints) return true;
  return state.round >= 3 && after.deadwood.length <= 2;
}

/**
 * Scores a candidate discard card (higher score = better card to discard).
 * Prefers isolated high-point deadwood, avoids breaking Phỏms or near-Phỏms (cạ),
 * and avoids feeding the next player's known eaten cards.
 */
export function chooseAiDiscardCardId(state: TaLaState): string {
  const currIdx = state.currentPlayerIndex;
  const player = state.players[currIdx];
  const legalIds = getLegalDiscardIds(state, currIdx);
  if (legalIds.length === 0) {
    return player.hand[0].id;
  }
  if (legalIds.length === 1) return legalIds[0];

  const solved = solveOptimalMelds(player.hand, player.eatenCardIds, { maxEatenPerMeld: 1 });
  const meldedSet = new Set<string>();
  for (const m of solved.melds) {
    for (const c of m) meldedSet.add(c.id);
  }

  const nextIdx = (currIdx + 1) % state.playerCount;
  const nextPlayer = state.players[nextIdx];
  const nextEatenCards = nextPlayer.hand.filter((c) => nextPlayer.eatenCardIds.includes(c.id));

  let bestId = legalIds[0];
  let bestScore = -Infinity;

  for (const id of legalIds) {
    const card = player.hand.find((c) => c.id === id)!;
    let score = cardPoints(card) * 2;

    // Strongly avoid breaking an already-formed Phỏm
    if (meldedSet.has(id)) {
      score -= 1000;
    }

    // Check near-Phỏm (Cạ) synergy with remaining cards in hand
    for (const other of player.hand) {
      if (other.id === id) continue;
      if (other.rank === card.rank) {
        score -= 14; // Pair synergy
      }
      if (other.suit === card.suit) {
        const diff = Math.abs(other.rank - card.rank);
        if (diff === 1) score -= 16; // Adjacent suited connector
        else if (diff === 2) score -= 8; // Suited 1-gapper
      }
    }

    // Avoid feeding cards matching next player's eaten cards (or same suit neighbors)
    for (const eaten of nextEatenCards) {
      if (eaten.rank === card.rank) score -= 18;
      if (eaten.suit === card.suit && Math.abs(eaten.rank - card.rank) <= 2) {
        score -= 15;
      }
    }

    // Prefer discarding cards that other players have already discarded (safer)
    const sameRankDiscarded = state.players.some((p) =>
      p.discards.some((d: Card) => d.rank === card.rank),
    );
    if (sameRankDiscarded) {
      score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  return bestId;
}

/**
 * Executes a single AI step so the UI can animate draw/eat -> meld -> discard cleanly.
 */
export function runAiStep(state: TaLaState): TaLaState {
  if (state.phase === 'game_over') return state;
  const player = state.players[state.currentPlayerIndex];
  if (!player.isAi) return state;

  if (state.phase === 'draw_or_eat') {
    if (shouldAiEat(state)) {
      return eatLastDiscard(state);
    }
    return drawFromNoc(state);
  }

  // Check instant Ù before proceeding
  if (canDeclareU(player.hand, player.eatenCardIds)) {
    return declareU(state);
  }

  if (state.phase === 'meld') {
    let working = state;
    if (!working.players[working.currentPlayerIndex].hasMelded) {
      working = meldOptimalPhoms(working);
      if (working.phase === 'game_over') return working;
    }

    // Greedily lay off highest-point cards onto existing table melds
    while (working.phase === 'meld') {
      const active = working.players[working.currentPlayerIndex];
      if (active.melds.length === 0) break;
      const options = findLayOffOptions(active.hand, working.players);
      if (options.length === 0) break;
      options.sort((a, b) => cardPoints(b.card) - cardPoints(a.card));
      const best = options[0];
      working = layOffSingleCard(
        working,
        best.card.id,
        best.targetPlayerIndex,
        best.targetMeldId,
      );
    }

    if (working.phase === 'game_over') return working;
    return proceedToDiscard(working);
  }

  if (state.phase === 'discard') {
    const cardId = chooseAiDiscardCardId(state);
    return discardCard(state, cardId);
  }

  return state;
}

/**
 * Runs an entire AI turn until control passes to a different player or the game ends.
 */
export function runAiFullTurn(state: TaLaState): TaLaState {
  let working = state;
  const startPlayer = working.currentPlayerIndex;
  let guard = 0;
  while (
    working.phase !== 'game_over' &&
    working.currentPlayerIndex === startPlayer &&
    working.players[working.currentPlayerIndex].isAi &&
    guard < 10
  ) {
    working = runAiStep(working);
    guard++;
  }
  return working;
}
