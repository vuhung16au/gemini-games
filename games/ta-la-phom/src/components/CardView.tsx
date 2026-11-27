import React from 'react';
import { formatCardShort, formatRank, isRedSuit } from '../game/constants';
import type { Card } from '../game/types';
import { CardBackSvg, SuitSvg } from './SuitSvg';

interface CardViewProps {
  card?: Card;
  faceDown?: boolean;
  selected?: boolean;
  inPhom?: boolean;
  isEaten?: boolean;
  isHinted?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onDoubleClick?: () => void;
  testId?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  faceDown = false,
  selected = false,
  inPhom = false,
  isEaten = false,
  isHinted = false,
  disabled = false,
  size = 'lg',
  onClick,
  onDoubleClick,
  testId,
}) => {
  if (faceDown || !card) {
    return (
      <div
        className={`tala-card tala-card-back tala-card-${size}${isHinted ? ' is-hinted' : ''}`}
        data-testid={testId}
        onClick={onClick}
        aria-label="Face-down card"
      >
        <CardBackSvg />
      </div>
    );
  }

  const red = isRedSuit(card.suit);
  const rankLabel = formatRank(card.rank);
  const interactive = Boolean(onClick);

  const classes = [
    'tala-card',
    `tala-card-${size}`,
    red ? 'is-red' : 'is-black',
    selected ? 'is-selected' : '',
    inPhom ? 'is-in-phom' : '',
    isEaten ? 'is-eaten' : '',
    isHinted ? 'is-hinted' : '',
    disabled ? 'is-disabled' : '',
    interactive ? 'is-interactive' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      data-card-id={card.id}
      data-testid={testId}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      disabled={disabled && !interactive}
      aria-pressed={selected}
      aria-label={`${formatCardShort(card)}${inPhom ? ' (Phỏm)' : ''}${isEaten ? ' (Đã ăn / Eaten)' : ''}`}
    >
      <div className="tala-card-corner top-left">
        <span className="tala-card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="tala-card-suit-sm" />
      </div>

      <div className="tala-card-center">
        <SuitSvg suit={card.suit} className="tala-card-suit-lg" />
      </div>

      <div className="tala-card-corner bottom-right" aria-hidden="true">
        <span className="tala-card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="tala-card-suit-sm" />
      </div>

      {isEaten && <span className="tala-card-tag tag-eaten">Ăn</span>}
      {!isEaten && inPhom && size === 'lg' && (
        <span className="tala-card-tag tag-phom">Phỏm</span>
      )}
    </button>
  );
};
