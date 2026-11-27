import { FOUNDATION_COUNT, TABLEAU_COUNT } from './constants';
import { canMoveToFoundation, canMoveToTableau } from './engine';
import type { GameState, MoveHint } from './types';

function findCardInTableau(
  state: GameState,
  cardId: string,
): { pileIndex: number; cardIndex: number } | null {
  for (let p = 0; p < state.tableau.length; p++) {
    const col = state.tableau[p];
    for (let i = 0; i < col.length; i++) {
      if (col[i].id === cardId && col[i].faceUp) {
        return { pileIndex: p, cardIndex: i };
      }
    }
  }
  return null;
}

function findTutorialHint(state: GameState): MoveHint | null {
  if (state.tutorialStep === 0) {
    const pos = findCardInTableau(state, 'hearts-1');
    const emptyFoundation = state.foundations.findIndex((f) => f.length === 0);
    if (pos && emptyFoundation !== -1) {
      return {
        type: 'move',
        from: { zone: 'tableau', ...pos },
        to: { zone: 'foundation', pileIndex: emptyFoundation },
        reason: 'Send A♥ to the Foundation',
      };
    }
  }

  if (state.tutorialStep === 1) {
    const from = findCardInTableau(state, 'hearts-6');
    const target = findCardInTableau(state, 'spades-7');
    if (from && target) {
      return {
        type: 'move',
        from: { zone: 'tableau', ...from },
        to: { zone: 'tableau', pileIndex: target.pileIndex },
        reason: 'Stack Red 6♥ onto Black 7♠',
      };
    }
  }

  if (state.tutorialStep === 2) {
    const from = findCardInTableau(state, 'spades-13');
    const emptyCol = state.tableau.findIndex((c) => c.length === 0);
    if (from && emptyCol !== -1) {
      return {
        type: 'move',
        from: { zone: 'tableau', ...from },
        to: { zone: 'tableau', pileIndex: emptyCol },
        reason: 'Move K♠ to the empty column',
      };
    }
  }

  return null;
}

/** Suggest the highest-value next move on the current Klondike board. */
export function findBestHint(state: GameState): MoveHint | null {
  if (state.status !== 'PLAYING') return null;

  if (state.isTutorial && !state.tutorialCompleted) {
    const tutHint = findTutorialHint(state);
    if (tutHint) return tutHint;
  }

  // 1. Tableau top card -> Foundation
  for (let c = 0; c < TABLEAU_COUNT; c++) {
    const col = state.tableau[c];
    if (col.length === 0) continue;
    const top = col[col.length - 1];
    for (let f = 0; f < FOUNDATION_COUNT; f++) {
      if (canMoveToFoundation(top, state.foundations[f])) {
        return {
          type: 'move',
          from: { zone: 'tableau', pileIndex: c, cardIndex: col.length - 1 },
          to: { zone: 'foundation', pileIndex: f },
          reason: 'Move card to Foundation',
        };
      }
    }
  }

  // 2. Waste top card -> Foundation
  if (state.waste.length > 0) {
    const top = state.waste[state.waste.length - 1];
    for (let f = 0; f < FOUNDATION_COUNT; f++) {
      if (canMoveToFoundation(top, state.foundations[f])) {
        return {
          type: 'move',
          from: {
            zone: 'waste',
            pileIndex: 0,
            cardIndex: state.waste.length - 1,
          },
          to: { zone: 'foundation', pileIndex: f },
          reason: 'Move Waste card to Foundation',
        };
      }
    }
  }

  // 3. Tableau stack that uncovers a face-down card -> another Tableau column
  for (let fromCol = 0; fromCol < TABLEAU_COUNT; fromCol++) {
    const col = state.tableau[fromCol];
    const firstFaceUpIdx = col.findIndex((c) => c.faceUp);
    if (firstFaceUpIdx <= 0) continue; // does not uncover a face-down card
    const leadCard = col[firstFaceUpIdx];
    for (let toCol = 0; toCol < TABLEAU_COUNT; toCol++) {
      if (toCol === fromCol) continue;
      if (canMoveToTableau(leadCard, state.tableau[toCol])) {
        return {
          type: 'move',
          from: { zone: 'tableau', pileIndex: fromCol, cardIndex: firstFaceUpIdx },
          to: { zone: 'tableau', pileIndex: toCol },
          reason: 'Uncover face-down card',
        };
      }
    }
  }

  // 4. Move a King stack that has cards below it into an empty column
  for (let fromCol = 0; fromCol < TABLEAU_COUNT; fromCol++) {
    const col = state.tableau[fromCol];
    const firstFaceUpIdx = col.findIndex((c) => c.faceUp);
    if (firstFaceUpIdx <= 0) continue;
    const leadCard = col[firstFaceUpIdx];
    if (leadCard.rank !== 13) continue;
    const emptyCol = state.tableau.findIndex((c) => c.length === 0);
    if (emptyCol !== -1) {
      return {
        type: 'move',
        from: { zone: 'tableau', pileIndex: fromCol, cardIndex: firstFaceUpIdx },
        to: { zone: 'tableau', pileIndex: emptyCol },
        reason: 'Move King to empty column',
      };
    }
  }

  // 5. Waste top card -> Tableau
  if (state.waste.length > 0) {
    const top = state.waste[state.waste.length - 1];
    for (let toCol = 0; toCol < TABLEAU_COUNT; toCol++) {
      if (canMoveToTableau(top, state.tableau[toCol])) {
        return {
          type: 'move',
          from: {
            zone: 'waste',
            pileIndex: 0,
            cardIndex: state.waste.length - 1,
          },
          to: { zone: 'tableau', pileIndex: toCol },
          reason: 'Play card from Waste to Tableau',
        };
      }
    }
  }

  // 6. Tableau stack -> Tableau (only if it vacates a column for a King or changes rank parent cleanly)
  for (let fromCol = 0; fromCol < TABLEAU_COUNT; fromCol++) {
    const col = state.tableau[fromCol];
    const firstFaceUpIdx = col.findIndex((c) => c.faceUp);
    if (firstFaceUpIdx !== 0) continue;
    const leadCard = col[0];
    if (leadCard.rank === 13) continue; // never bounce a base King to another empty column
    for (let toCol = 0; toCol < TABLEAU_COUNT; toCol++) {
      if (toCol === fromCol || state.tableau[toCol].length === 0) continue;
      if (canMoveToTableau(leadCard, state.tableau[toCol])) {
        return {
          type: 'move',
          from: { zone: 'tableau', pileIndex: fromCol, cardIndex: 0 },
          to: { zone: 'tableau', pileIndex: toCol },
          reason: 'Consolidate columns',
        };
      }
    }
  }

  // 7. Draw or recycle Stock
  if (state.stock.length > 0 || state.waste.length > 0) {
    return {
      type: 'draw',
      reason:
        state.stock.length > 0
          ? 'Draw from Stock pile'
          : 'Recycle Waste back to Stock',
    };
  }

  return null;
}
