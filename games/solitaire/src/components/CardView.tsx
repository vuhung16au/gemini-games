import React from 'react';
import { getRankLabel, isRedSuit } from '../game/engine';
import type { Card } from '../game/types';
import { CardBackSvg, SuitSvg } from './SuitSvg';

interface CardViewProps {
  card: Card;
  isSelected?: boolean;
  isHinted?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected = false,
  isHinted = false,
  style,
  onClick,
  onDoubleClick,
  onDragStart,
}) => {
  if (!card.faceUp) {
    return (
      <div
        className="playing-card is-face-down"
        style={style}
        data-card-id={card.id}
        data-face-up="false"
      >
        <CardBackSvg />
      </div>
    );
  }

  const red = isRedSuit(card.suit);
  const rankLabel = getRankLabel(card.rank);
  const classes = [
    'playing-card',
    'is-face-up',
    red ? 'is-red' : 'is-black',
    isSelected ? 'is-selected' : '',
    isHinted ? 'is-hinted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      style={style}
      data-card-id={card.id}
      data-face-up="true"
      draggable
      aria-label={`${rankLabel} of ${card.suit}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
    >
      <div className="card-corner top-left">
        <span className="card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="corner-suit" />
      </div>

      <SuitSvg suit={card.suit} className="center-suit" />

      <div className="card-corner bottom-right" aria-hidden="true">
        <span className="card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="corner-suit" />
      </div>
    </button>
  );
};
