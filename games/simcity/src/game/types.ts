export type TerrainType = 'grass' | 'water' | 'forest';

export type TileKind =
  | 'empty'
  | 'road'
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'power'
  | 'water'
  | 'park'
  | 'civic';

export type ToolId =
  | 'inspect'
  | 'road'
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'power'
  | 'water'
  | 'park'
  | 'civic'
  | 'bulldoze';

export type DataOverlay = 'none' | 'power' | 'water' | 'landValue';

export type LightingMood = 'day' | 'sunset' | 'night';

export type SimSpeed = 0 | 1 | 2 | 3;

export type MapPreset = 'riverside' | 'islands' | 'plains';

export interface CityTile {
  x: number;
  y: number;
  terrain: TerrainType;
  kind: TileKind;
  /** 0 = zoned lot, 1..4 = developed building level (Industrial max 3). */
  level: number;
  /** Derived simulation flags/fields. */
  hasRoadAccess: boolean;
  powered: boolean;
  watered: boolean;
  landValue: number;
  pollution: number;
  /** Number of consecutive ticks a developed zone lacked utilities. */
  unservicedTicks: number;
  /** Monotonic version counter incremented when this tile visually changes. */
  revision: number;
}

export interface DemandScores {
  residential: number; // -100..100
  commercial: number;  // -100..100
  industrial: number;  // -100..100
}

export interface CityMetrics {
  population: number;
  jobs: number;
  happiness: number; // 0..100
  powerUsed: number;
  powerCapacity: number;
  waterUsed: number;
  waterCapacity: number;
  monthlyIncome: number;
  monthlyUpkeep: number;
  monthlyNet: number;
  unpoweredCount: number;
  unwateredCount: number;
  unroadedCount: number;
  avgPollution: number;
  demand: DemandScores;
}

export interface CityState {
  gridSize: number;
  preset: MapPreset;
  tiles: CityTile[];
  treasury: number;
  taxRate: number; // 5..15 (%)
  tickCount: number;
  month: number; // 1..12
  year: number;
  bestPopulation: number;
  milestoneName: string;
  metrics: CityMetrics;
}

export interface ToolActionResult {
  state: CityState;
  changed: boolean;
  cost: number;
  sound?: 'build' | 'road' | 'bulldoze' | 'error';
  reason?: string;
}

export interface CityHint {
  title: string;
  message: string;
  recommendedTool?: ToolId;
}

export interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  check: (state: CityState) => boolean;
}
