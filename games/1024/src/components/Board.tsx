import React, { useRef } from 'react';
import { GRID_SIZE } from '../game/constants';
import type { Direction, GameStatus, Tile } from '../game/types';
import { Overlay } from './Overlay';

interface BoardProps {
  tiles: Tile[];
  status: GameStatus;
  score: number;
  onMove: (direction: Direction) => void;
  onKeepGoing: () => void;
  onNewGame: () => void;
}

const SWIPE_THRESHOLD_PX = 24;

function getTileColorClass(value: number): string {
  if (value > 1024) return 'tile-super';
  return `tile-${value}`;
}

function getTileSizeClass(value: number): string {
  if (value >= 1024) return 'tile-digits-4';
  if (value >= 128) return 'tile-digits-3';
  return '';
}

function renderSingleTile(
  tile: Tile,
  zIndex: number,
  extraClass = '',
): React.ReactNode {
  const style = {
    '--row': tile.row,
    '--col': tile.col,
    zIndex,
  } as React.CSSProperties;

  return (
    <div key={tile.id} className="tile-wrapper" style={style}>
      <div
        className={`tile-inner ${getTileColorClass(tile.value)} ${getTileSizeClass(tile.value)} ${extraClass}`}
      >
        {tile.value}
      </div>
    </div>
  );
}

export const Board: React.FC<BoardProps> = ({
  tiles,
  status,
  score,
  onMove,
  onKeepGoing,
  onNewGame,
}) => {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < SWIPE_THRESHOLD_PX) return;

    if (absX > absY) {
      onMove(dx > 0 ? 'right' : 'left');
    } else {
      onMove(dy > 0 ? 'down' : 'up');
    }
  };

  const handlePointerCancel = () => {
    pointerStartRef.current = null;
  };

  // Flatten active tiles and ghost source tiles so CSS transitions slide smoothly.
  const renderedTiles: React.ReactNode[] = [];
  for (const tile of tiles) {
    if (tile.mergedFrom) {
      renderedTiles.push(renderSingleTile(tile.mergedFrom[0], 1));
      renderedTiles.push(renderSingleTile(tile.mergedFrom[1], 1));
      renderedTiles.push(renderSingleTile(tile, 3, 'tile-merged'));
    } else if (tile.isNew) {
      renderedTiles.push(renderSingleTile(tile, 2, 'tile-new'));
    } else {
      renderedTiles.push(renderSingleTile(tile, 2));
    }
  }

  return (
    <div
      className="board-container"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="application"
      aria-label="1024 game board"
    >
      <div className="board-inner">
        <div className="grid-background" aria-hidden="true">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => (
            <div key={idx} className="grid-cell" />
          ))}
        </div>

        <div className="tile-layer">{renderedTiles}</div>
      </div>

      <Overlay
        status={status}
        score={score}
        onKeepGoing={onKeepGoing}
        onNewGame={onNewGame}
      />
    </div>
  );
};
