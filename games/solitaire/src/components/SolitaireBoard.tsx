import React from 'react';
import type {
  CardLocation,
  DropTarget,
  GameState,
  MoveHint,
} from '../game/types';
import { CardView } from './CardView';

interface SolitaireBoardProps {
  state: GameState;
  selected: CardLocation | null;
  hint: MoveHint | null;
  onDrawStock: () => void;
  onCardClick: (loc: CardLocation) => void;
  onCardDoubleClick: (loc: CardLocation) => void;
  onTargetClick: (target: DropTarget) => void;
  onDragStart: (loc: CardLocation, e: React.DragEvent) => void;
  onDropTarget: (target: DropTarget, e: React.DragEvent) => void;
}

function isSameLocation(a: CardLocation | null, b: CardLocation): boolean {
  return (
    a !== null &&
    a.zone === b.zone &&
    a.pileIndex === b.pileIndex &&
    a.cardIndex === b.cardIndex
  );
}

function isHintSource(hint: MoveHint | null, loc: CardLocation): boolean {
  return hint?.type === 'move' && isSameLocation(hint.from, loc);
}

function isHintTarget(hint: MoveHint | null, target: DropTarget): boolean {
  return (
    hint?.type === 'move' &&
    hint.to.zone === target.zone &&
    hint.to.pileIndex === target.pileIndex
  );
}

export const SolitaireBoard: React.FC<SolitaireBoardProps> = ({
  state,
  selected,
  hint,
  onDrawStock,
  onCardClick,
  onCardDoubleClick,
  onTargetClick,
  onDragStart,
  onDropTarget,
}) => {
  const wasteVisibleCount = state.drawMode === 3 ? 3 : 1;
  const wasteStartIdx = Math.max(0, state.waste.length - wasteVisibleCount);
  const visibleWaste = state.waste.slice(wasteStartIdx);

  return (
    <div className="solitaire-board game-surface">
      {/* Top Row: Stock + Waste + Spacer + 4 Foundations */}
      <div className="top-piles-row">
        <button
          type="button"
          className={`pile-slot stock-slot ${
            hint?.type === 'draw' ? 'is-hint-slot' : ''
          }`}
          data-testid="stock-pile"
          onClick={onDrawStock}
          aria-label={
            state.stock.length > 0
              ? `Draw from stock (${state.stock.length} remaining)`
              : 'Recycle waste pile to stock'
          }
        >
          {state.stock.length > 0 ? (
            <div className="stock-stack">
              <CardView card={state.stock[state.stock.length - 1]} />
              <span className="stock-count">{state.stock.length}</span>
            </div>
          ) : (
            <span className="slot-watermark">↻</span>
          )}
        </button>

        <div className="pile-slot waste-slot" data-testid="waste-pile">
          {visibleWaste.length === 0 ? (
            <span className="slot-watermark">·</span>
          ) : (
            visibleWaste.map((card, offset) => {
              const actualIdx = wasteStartIdx + offset;
              const isTop = actualIdx === state.waste.length - 1;
              const loc: CardLocation = {
                zone: 'waste',
                pileIndex: 0,
                cardIndex: actualIdx,
              };
              const fanShift = offset * 16;

              return (
                <CardView
                  key={card.id}
                  card={card}
                  isSelected={isTop && isSameLocation(selected, loc)}
                  isHinted={isTop && isHintSource(hint, loc)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${fanShift}px`,
                    width: '100%',
                    height: '100%',
                    zIndex: offset + 1,
                    pointerEvents: isTop ? 'auto' : 'none',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isTop) onCardClick(loc);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (isTop) onCardDoubleClick(loc);
                  }}
                  onDragStart={(e) => {
                    if (isTop) onDragStart(loc, e);
                  }}
                />
              );
            })
          )}
        </div>

        <div className="top-spacer" aria-hidden="true" />

        {state.foundations.map((pile, fIdx) => {
          const target: DropTarget = { zone: 'foundation', pileIndex: fIdx };
          const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
          const topLoc: CardLocation | null = topCard
            ? { zone: 'foundation', pileIndex: fIdx, cardIndex: pile.length - 1 }
            : null;

          return (
            <div
              key={fIdx}
              className={`pile-slot foundation-slot ${
                isHintTarget(hint, target) ? 'is-hint-slot' : ''
              }`}
              data-testid={`foundation-${fIdx}`}
              onClick={() => onTargetClick(target)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropTarget(target, e)}
            >
              {topCard && topLoc ? (
                <CardView
                  card={topCard}
                  isSelected={isSameLocation(selected, topLoc)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selected && !isSameLocation(selected, topLoc)) {
                      onTargetClick(target);
                    } else {
                      onCardClick(topLoc);
                    }
                  }}
                  onDragStart={(e) => onDragStart(topLoc, e)}
                />
              ) : (
                <span className="slot-watermark">A</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Row: 7 Tableau Columns */}
      <div className="tableau-row">
        {state.tableau.map((column, colIdx) => {
          const target: DropTarget = { zone: 'tableau', pileIndex: colIdx };
          let downCount = 0;
          let upCount = 0;

          return (
            <div
              key={colIdx}
              className={`tableau-col ${
                isHintTarget(hint, target) ? 'is-hint-col' : ''
              }`}
              data-testid={`tableau-${colIdx}`}
              onClick={() => {
                if (column.length === 0) {
                  onTargetClick(target);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropTarget(target, e)}
            >
              {column.length === 0 ? (
                <div className="pile-slot tableau-empty-slot">
                  <span className="slot-watermark">K</span>
                </div>
              ) : (
                <div className="tableau-stack">
                  {column.map((card, cardIdx) => {
                    const cardStyle = {
                      '--down-count': downCount,
                      '--up-count': upCount,
                      zIndex: cardIdx + 1,
                    } as React.CSSProperties;

                    if (card.faceUp) {
                      upCount += 1;
                    } else {
                      downCount += 1;
                    }

                    const loc: CardLocation = {
                      zone: 'tableau',
                      pileIndex: colIdx,
                      cardIndex: cardIdx,
                    };
                    const isBottomCard = cardIdx === column.length - 1;
                    const isCardSelected =
                      selected !== null &&
                      selected.zone === 'tableau' &&
                      selected.pileIndex === colIdx &&
                      cardIdx >= selected.cardIndex;

                    return (
                      <CardView
                        key={card.id}
                        card={card}
                        isSelected={isCardSelected}
                        isHinted={isHintSource(hint, loc)}
                        style={cardStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            selected &&
                            selected.zone !== 'foundation' &&
                            (selected.zone !== 'tableau' ||
                              selected.pileIndex !== colIdx) &&
                            isBottomCard
                          ) {
                            onTargetClick(target);
                          } else {
                            onCardClick(loc);
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (isBottomCard) {
                            onCardDoubleClick(loc);
                          }
                        }}
                        onDragStart={(e) => onDragStart(loc, e)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
