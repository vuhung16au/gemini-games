import { DEFAULT_TAX_RATE, GRID_SIZE } from './constants';
import { getCityMilestone, recomputeCityMetrics } from './engine';
import { generateMapTiles } from './maps';
import type { CityState, LightingMood, MapPreset, TerrainType, TileKind } from './types';

export const STORAGE_KEY = 'simcity_v1';

interface CompactTile {
  t: TerrainType;
  k: TileKind;
  l: number;
}

export interface SavedCityPayload {
  version: 1;
  preset: MapPreset;
  treasury: number;
  taxRate: number;
  tickCount: number;
  month: number;
  year: number;
  bestPopulation: number;
  muted: boolean;
  lighting: LightingMood;
  tiles: CompactTile[];
}

function getDefaultStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function saveCityData(
  state: CityState,
  prefs: { muted: boolean; lighting: LightingMood },
  storage: Storage | null = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    const payload: SavedCityPayload = {
      version: 1,
      preset: state.preset,
      treasury: state.treasury,
      taxRate: state.taxRate,
      tickCount: state.tickCount,
      month: state.month,
      year: state.year,
      bestPopulation: state.bestPopulation,
      muted: prefs.muted,
      lighting: prefs.lighting,
      tiles: state.tiles.map((tile) => ({
        t: tile.terrain,
        k: tile.kind,
        l: tile.level,
      })),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / security errors
  }
}

const VALID_TERRAINS = new Set<TerrainType>(['grass', 'water', 'forest']);
const VALID_KINDS = new Set<TileKind>([
  'empty',
  'road',
  'residential',
  'commercial',
  'industrial',
  'power',
  'water',
  'park',
  'civic',
]);

export function loadCityData(
  storage: Storage | null = getDefaultStorage(),
): {
  state: CityState | null;
  muted: boolean;
  lighting: LightingMood;
} {
  if (!storage) {
    return { state: null, muted: false, lighting: 'day' };
  }
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { state: null, muted: false, lighting: 'day' };
    const parsed = JSON.parse(raw) as Partial<SavedCityPayload>;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.tiles)) {
      return { state: null, muted: false, lighting: 'day' };
    }
    const preset: MapPreset =
      parsed.preset === 'islands' || parsed.preset === 'plains' ? parsed.preset : 'riverside';
    const lighting: LightingMood =
      parsed.lighting === 'sunset' || parsed.lighting === 'night' ? parsed.lighting : 'day';
    const muted = Boolean(parsed.muted);

    if (parsed.tiles.length !== GRID_SIZE * GRID_SIZE) {
      return { state: null, muted, lighting };
    }

    const baseTiles = generateMapTiles(preset);
    for (let i = 0; i < baseTiles.length; i++) {
      const saved = parsed.tiles[i];
      if (!saved || typeof saved !== 'object') continue;
      if (VALID_TERRAINS.has(saved.t)) baseTiles[i].terrain = saved.t;
      if (VALID_KINDS.has(saved.k)) baseTiles[i].kind = saved.k;
      if (typeof saved.l === 'number' && Number.isFinite(saved.l)) {
        baseTiles[i].level = Math.max(0, Math.min(4, Math.floor(saved.l)));
      }
    }

    const reconstructed = recomputeCityMetrics({
      gridSize: GRID_SIZE,
      preset,
      tiles: baseTiles,
      treasury:
        typeof parsed.treasury === 'number' && Number.isFinite(parsed.treasury)
          ? Math.max(0, Math.round(parsed.treasury))
          : 2500,
      taxRate:
        typeof parsed.taxRate === 'number' && Number.isFinite(parsed.taxRate)
          ? parsed.taxRate
          : DEFAULT_TAX_RATE,
      tickCount: typeof parsed.tickCount === 'number' ? Math.max(0, Math.floor(parsed.tickCount)) : 0,
      month: typeof parsed.month === 'number' ? Math.max(1, Math.min(12, Math.floor(parsed.month))) : 1,
      year: typeof parsed.year === 'number' ? Math.max(1, Math.floor(parsed.year)) : 1,
      bestPopulation:
        typeof parsed.bestPopulation === 'number' ? Math.max(0, Math.floor(parsed.bestPopulation)) : 0,
      milestoneName: 'Hamlet',
      metrics: {
        population: 0,
        jobs: 0,
        happiness: 75,
        powerUsed: 0,
        powerCapacity: 0,
        waterUsed: 0,
        waterCapacity: 0,
        monthlyIncome: 0,
        monthlyUpkeep: 0,
        monthlyNet: 0,
        unpoweredCount: 0,
        unwateredCount: 0,
        unroadedCount: 0,
        avgPollution: 0,
        demand: { residential: 45, commercial: 25, industrial: 35 },
      },
    });

    reconstructed.milestoneName = getCityMilestone(reconstructed.metrics.population);
    reconstructed.bestPopulation = Math.max(
      reconstructed.bestPopulation,
      reconstructed.metrics.population,
    );

    return { state: reconstructed, muted, lighting };
  } catch {
    return { state: null, muted: false, lighting: 'day' };
  }
}
