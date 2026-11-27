import { GRID_SIZE } from './constants';
import type { CityTile, MapPreset, TerrainType, TileKind } from './types';

function makeTile(x: number, y: number, terrain: TerrainType): CityTile {
  return {
    x,
    y,
    terrain,
    kind: 'empty',
    level: 0,
    hasRoadAccess: false,
    powered: false,
    watered: false,
    landValue: 50,
    pollution: 0,
    unservicedTicks: 0,
    revision: 0,
  };
}

function isForestCluster(x: number, y: number, seed: number): boolean {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  const frac = n - Math.floor(n);
  return frac > 0.77;
}

export function generateMapTiles(preset: MapPreset): CityTile[] {
  const tiles: CityTile[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let terrain: TerrainType = 'grass';

      if (preset === 'riverside') {
        const riverCenter = 13.5 - x * 0.25 + Math.sin(x * 0.45) * 1.3;
        if (Math.abs(y - riverCenter) <= 1.15) {
          terrain = 'water';
        } else if (isForestCluster(x, y, 1) && !(x >= 8 && x <= 12 && y <= 5)) {
          terrain = 'forest';
        }
      } else if (preset === 'islands') {
        const channel = 9.5 + Math.sin(x * 0.35) * 1.1;
        const onEdge = x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1;
        if (Math.abs(y - channel) <= 1.4 || (onEdge && y >= 7 && y <= 12)) {
          terrain = 'water';
        } else if (isForestCluster(x, y, 2) && !(x >= 8 && x <= 12 && y <= 4)) {
          terrain = 'forest';
        }
      } else {
        // 'plains'
        const cornerPond = Math.hypot(x - 16.5, y - 16.5) <= 2.2;
        if (cornerPond) {
          terrain = 'water';
        } else if (isForestCluster(x, y, 3) && !(x >= 8 && x <= 12 && y <= 5)) {
          terrain = 'forest';
        }
      }

      tiles.push(makeTile(x, y, terrain));
    }
  }

  // Entry highway stub at top-center (x = 10, y = 0..2) so players have an anchor
  for (let y = 0; y <= 2; y++) {
    const idx = y * GRID_SIZE + 10;
    tiles[idx].terrain = 'grass';
    tiles[idx].kind = 'road';
  }

  return tiles;
}

export interface StarterPlacement {
  x: number;
  y: number;
  kind: TileKind;
  level?: number;
}

export const STARTER_TOWN_PLACEMENTS: StarterPlacement[] = [
  // Main avenue & side streets
  { x: 10, y: 3, kind: 'road' },
  { x: 10, y: 4, kind: 'road' },
  { x: 10, y: 5, kind: 'road' },
  { x: 10, y: 6, kind: 'road' },
  { x: 9, y: 4, kind: 'road' },
  { x: 8, y: 4, kind: 'road' },
  { x: 7, y: 4, kind: 'road' },
  { x: 11, y: 4, kind: 'road' },
  { x: 12, y: 4, kind: 'road' },
  { x: 13, y: 4, kind: 'road' },
  { x: 11, y: 6, kind: 'road' },
  { x: 12, y: 6, kind: 'road' },

  // Utilities
  { x: 9, y: 2, kind: 'power' },
  { x: 11, y: 2, kind: 'water' },

  // Residential cottages & townhouses
  { x: 7, y: 3, kind: 'residential', level: 1 },
  { x: 8, y: 3, kind: 'residential', level: 2 },
  { x: 7, y: 5, kind: 'residential', level: 1 },
  { x: 8, y: 5, kind: 'residential', level: 2 },
  { x: 9, y: 5, kind: 'residential', level: 1 },
  { x: 9, y: 6, kind: 'residential', level: 1 },

  // Commercial shops
  { x: 11, y: 3, kind: 'commercial', level: 1 },
  { x: 12, y: 3, kind: 'commercial', level: 2 },
  { x: 11, y: 5, kind: 'commercial', level: 1 },

  // Industrial workshops (tucked on east edge)
  { x: 13, y: 5, kind: 'industrial', level: 1 },
  { x: 13, y: 3, kind: 'industrial', level: 1 },

  // Parks
  { x: 12, y: 5, kind: 'park' },
  { x: 6, y: 4, kind: 'park' },
];
