import React from 'react';
import { PIECE_COLORS, PIECE_SHAPES, type PieceType } from '../game/constants';

interface PiecePreviewSvgProps {
  type: PieceType | null;
  size?: number;
}

export const PiecePreviewSvg: React.FC<PiecePreviewSvgProps> = ({
  type,
  size = 56,
}) => {
  if (!type) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        aria-label="Empty piece slot"
      />
    );
  }

  const cells = PIECE_SHAPES[type][0];
  const color = PIECE_COLORS[type];

  let minR = 4;
  let maxR = 0;
  let minC = 4;
  let maxC = 0;
  for (const [r, c] of cells) {
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
    minC = Math.min(minC, c);
    maxC = Math.max(maxC, c);
  }

  const cellSize = 16;
  const width = (maxC - minC + 1) * cellSize;
  const height = (maxR - minR + 1) * cellSize;
  const offsetX = (80 - width) / 2;
  const offsetY = (80 - height) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      aria-label={`${type} piece`}
    >
      {cells.map(([r, c], idx) => {
        const x = offsetX + (c - minC) * cellSize;
        const y = offsetY + (r - minR) * cellSize;
        return (
          <g key={idx}>
            <rect
              x={x + 1}
              y={y + 1}
              width={cellSize - 2}
              height={cellSize - 2}
              rx={2}
              fill={color}
              stroke="#302c2a"
              strokeWidth={1.5}
            />
            <rect
              x={x + 2}
              y={y + 2}
              width={cellSize - 4}
              height={3}
              fill="rgba(255,255,255,0.28)"
            />
          </g>
        );
      })}
    </svg>
  );
};
