import React from 'react';
import type { CityTile } from '../game/types';

interface TileInspectorProps {
  tile: CityTile | null;
  onClose: () => void;
  onBulldoze: (x: number, y: number) => void;
}

const KIND_LABELS: Record<CityTile['kind'], string> = {
  empty: 'Open Terrain',
  road: 'Road / Bridge',
  residential: 'Residential Zone',
  commercial: 'Commercial Zone',
  industrial: 'Industrial Zone',
  power: 'Power Plant',
  water: 'Water Tower',
  park: 'City Park',
  civic: 'Civic Plaza',
};

export const TileInspector: React.FC<TileInspectorProps> = ({ tile, onClose, onBulldoze }) => {
  if (!tile) return null;

  return (
    <aside className="sim-inspector" aria-label="Tile Inspector">
      <div className="inspector-header">
        <strong>
          {KIND_LABELS[tile.kind]} ({tile.x}, {tile.y})
        </strong>
        <button type="button" className="inspector-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="inspector-body">
        <div>Terrain: {tile.terrain}</div>
        {tile.kind !== 'empty' && tile.kind !== 'road' && (
          <>
            <div>
              Level: {tile.level > 0 ? `L${tile.level}` : 'Lot'}
            </div>
            <div>Road Access: {tile.hasRoadAccess ? '✅ Connected' : '❌ Missing'}</div>
            <div>Power: {tile.powered ? '⚡ Powered' : '❌ Unpowered'}</div>
            <div>Water: {tile.watered ? '💧 Supplied' : '❌ Dry'}</div>
          </>
        )}
        <div>Land Value: {tile.landValue}/100</div>
        <div>Pollution: {tile.pollution}</div>
      </div>
      {(tile.kind !== 'empty' || tile.terrain === 'forest') && (
        <button
          type="button"
          className="sim-mini-btn danger"
          onClick={() => onBulldoze(tile.x, tile.y)}
        >
          🚜 Bulldoze ($5)
        </button>
      )}
    </aside>
  );
};
