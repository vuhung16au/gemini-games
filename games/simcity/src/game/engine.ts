import {
  BRIDGE_COST,
  COMMERCIAL_JOBS_BY_LEVEL,
  DEFAULT_TAX_RATE,
  FOREST_CLEAR_SURCHARGE,
  GRID_SIZE,
  INDUSTRIAL_JOBS_BY_LEVEL,
  MAX_TAX_RATE,
  MILESTONES,
  MIN_TAX_RATE,
  POPULATION_BY_LEVEL,
  POWER_PLANT_CAPACITY,
  STARTING_TREASURY,
  TICKS_PER_MONTH,
  TOOL_BY_ID,
  WATER_TOWER_CAPACITY,
} from './constants';
import { generateMapTiles, STARTER_TOWN_PLACEMENTS } from './maps';
import type {
  CityMetrics,
  CityState,
  CityTile,
  MapPreset,
  TileKind,
  ToolActionResult,
  ToolId,
} from './types';

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function idxOf(x: number, y: number, gridSize = GRID_SIZE): number {
  return y * gridSize + x;
}

export function inBounds(x: number, y: number, gridSize = GRID_SIZE): boolean {
  return x >= 0 && y >= 0 && x < gridSize && y < gridSize;
}

export function getCityMilestone(population: number): string {
  let name = MILESTONES[0].name;
  for (const m of MILESTONES) {
    if (population >= m.minPop) {
      name = m.name;
    }
  }
  return name;
}

export function isZoneKind(kind: TileKind): boolean {
  return kind === 'residential' || kind === 'commercial' || kind === 'industrial';
}

function tileUtilityDemand(tile: CityTile): number {
  if (tile.kind === 'empty' || tile.kind === 'road' || tile.kind === 'power' || tile.kind === 'water') {
    return 0;
  }
  if (tile.kind === 'park') return 0;
  if (tile.kind === 'civic') return 2;
  return Math.max(1, tile.level + 1);
}

function cloneTiles(tiles: CityTile[]): CityTile[] {
  return tiles.map((t) => ({ ...t }));
}

function emptyMetrics(): CityMetrics {
  return {
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
  };
}

export function createCityState(preset: MapPreset = 'riverside'): CityState {
  const tiles = generateMapTiles(preset);
  const state: CityState = {
    gridSize: GRID_SIZE,
    preset,
    tiles,
    treasury: STARTING_TREASURY,
    taxRate: DEFAULT_TAX_RATE,
    tickCount: 0,
    month: 1,
    year: 1,
    bestPopulation: 0,
    milestoneName: MILESTONES[0].name,
    metrics: emptyMetrics(),
  };
  return recomputeCityMetrics(state);
}

export function createStarterTownState(): CityState {
  const tiles = generateMapTiles('riverside');
  for (const item of STARTER_TOWN_PLACEMENTS) {
    const tile = tiles[idxOf(item.x, item.y)];
    if (tile.terrain === 'forest') tile.terrain = 'grass';
    tile.kind = item.kind;
    tile.level = item.level ?? 0;
    tile.revision += 1;
  }
  const state: CityState = {
    gridSize: GRID_SIZE,
    preset: 'riverside',
    tiles,
    treasury: 1850,
    taxRate: DEFAULT_TAX_RATE,
    tickCount: 0,
    month: 4,
    year: 1,
    bestPopulation: 0,
    milestoneName: MILESTONES[0].name,
    metrics: emptyMetrics(),
  };
  const recomputed = recomputeCityMetrics(state);
  return {
    ...recomputed,
    bestPopulation: recomputed.metrics.population,
    milestoneName: getCityMilestone(recomputed.metrics.population),
  };
}

function bfsReachable(
  tiles: CityTile[],
  gridSize: number,
  sourceKind: 'power' | 'water',
): number[] {
  const visited = new Uint8Array(tiles.length);
  const queue: number[] = [];

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].kind === sourceKind) {
      visited[i] = 1;
      queue.push(i);
    }
  }

  let head = 0;
  const order: number[] = [];
  while (head < queue.length) {
    const cur = queue[head++];
    order.push(cur);
    const tile = tiles[cur];
    // Utilities conduct along generators, roads, and contiguous built/zoned tiles.
    if (tile.kind === 'empty') continue;

    for (const [dx, dy] of DIRS) {
      const nx = tile.x + dx;
      const ny = tile.y + dy;
      if (!inBounds(nx, ny, gridSize)) continue;
      const nIdx = idxOf(nx, ny, gridSize);
      if (visited[nIdx]) continue;
      if (tiles[nIdx].kind !== 'empty') {
        visited[nIdx] = 1;
        queue.push(nIdx);
      }
    }
  }

  return order;
}

export function recomputeCityMetrics(state: CityState): CityState {
  const { gridSize } = state;
  const tiles = state.tiles;

  let powerPlants = 0;
  let waterTowers = 0;
  const parks: CityTile[] = [];
  const civics: CityTile[] = [];
  const industrials: CityTile[] = [];

  for (const t of tiles) {
    t.hasRoadAccess = false;
    t.powered = false;
    t.watered = false;

    if (t.kind === 'power') powerPlants++;
    else if (t.kind === 'water') waterTowers++;
    else if (t.kind === 'park') parks.push(t);
    else if (t.kind === 'civic') civics.push(t);
    else if (t.kind === 'industrial') industrials.push(t);
  }

  // 1. Road access check (orthogonal neighbor is a road)
  for (const t of tiles) {
    if (t.kind === 'empty' || t.kind === 'road') continue;
    for (const [dx, dy] of DIRS) {
      const nx = t.x + dx;
      const ny = t.y + dy;
      if (inBounds(nx, ny, gridSize) && tiles[idxOf(nx, ny, gridSize)].kind === 'road') {
        t.hasRoadAccess = true;
        break;
      }
    }
  }

  // 2. BFS Power distribution with capacity allocation
  const powerCapacity = powerPlants * POWER_PLANT_CAPACITY;
  let powerRemaining = powerCapacity;
  let powerUsed = 0;
  for (const idx of bfsReachable(tiles, gridSize, 'power')) {
    const t = tiles[idx];
    if (t.kind === 'power') {
      t.powered = true;
      continue;
    }
    const need = tileUtilityDemand(t);
    if (need === 0) {
      t.powered = true;
    } else if (powerRemaining >= need) {
      t.powered = true;
      powerRemaining -= need;
      powerUsed += need;
    } else {
      powerUsed += need;
    }
  }

  // 3. BFS Water distribution with capacity allocation
  const waterCapacity = waterTowers * WATER_TOWER_CAPACITY;
  let waterRemaining = waterCapacity;
  let waterUsed = 0;
  for (const idx of bfsReachable(tiles, gridSize, 'water')) {
    const t = tiles[idx];
    if (t.kind === 'water') {
      t.watered = true;
      continue;
    }
    const need = tileUtilityDemand(t);
    if (need === 0) {
      t.watered = true;
    } else if (waterRemaining >= need) {
      t.watered = true;
      waterRemaining -= need;
      waterUsed += need;
    } else {
      waterUsed += need;
    }
  }

  // 4. Pollution, Land Value, Population, Jobs & Budget
  let population = 0;
  let commercialJobs = 0;
  let industrialJobs = 0;
  let resZones = 0;
  let comZones = 0;
  let indZones = 0;
  let unpoweredCount = 0;
  let unwateredCount = 0;
  let unroadedCount = 0;
  let totalPollution = 0;
  let monthlyUpkeep = 0;
  let taxBase = 0;

  for (const t of tiles) {
    // Pollution from nearby industrial tiles
    let pol = 0;
    for (const ind of industrials) {
      const dist = Math.abs(t.x - ind.x) + Math.abs(t.y - ind.y);
      const strength = (ind.level + 1) * 14;
      if (dist <= 4) {
        pol += Math.max(0, strength - dist * 9);
      }
    }
    for (const park of parks) {
      const dist = Math.abs(t.x - park.x) + Math.abs(t.y - park.y);
      if (dist <= 3) {
        pol = Math.max(0, pol - (12 - dist * 2));
      }
    }
    t.pollution = Math.min(100, Math.round(pol));
    totalPollution += t.pollution;

    // Land value
    let val = t.terrain === 'forest' ? 58 : 48;
    for (const [dx, dy] of DIRS) {
      const nx = t.x + dx;
      const ny = t.y + dy;
      if (inBounds(nx, ny, gridSize) && tiles[idxOf(nx, ny, gridSize)].terrain === 'water') {
        val += 14;
        break;
      }
    }
    for (const park of parks) {
      const dist = Math.abs(t.x - park.x) + Math.abs(t.y - park.y);
      if (dist <= 3) val += 18 - dist * 4;
    }
    for (const civic of civics) {
      const dist = Math.abs(t.x - civic.x) + Math.abs(t.y - civic.y);
      if (dist <= 5) val += 22 - dist * 3;
    }
    val -= Math.round(t.pollution * 0.65);
    t.landValue = Math.max(5, Math.min(100, Math.round(val)));

    // Upkeep
    if (t.kind === 'road') monthlyUpkeep += TOOL_BY_ID.road.upkeep;
    else if (t.kind === 'power') monthlyUpkeep += TOOL_BY_ID.power.upkeep;
    else if (t.kind === 'water') monthlyUpkeep += TOOL_BY_ID.water.upkeep;
    else if (t.kind === 'park') monthlyUpkeep += TOOL_BY_ID.park.upkeep;
    else if (t.kind === 'civic') monthlyUpkeep += TOOL_BY_ID.civic.upkeep;

    if (isZoneKind(t.kind)) {
      if (!t.hasRoadAccess) unroadedCount++;
      if (!t.powered) unpoweredCount++;
      if (!t.watered) unwateredCount++;
    }

    if (t.kind === 'residential') {
      resZones++;
      const pop = POPULATION_BY_LEVEL[Math.min(4, t.level)];
      population += pop;
      taxBase += pop * 0.85;
    } else if (t.kind === 'commercial') {
      comZones++;
      const jobs = COMMERCIAL_JOBS_BY_LEVEL[Math.min(4, t.level)];
      commercialJobs += jobs;
      taxBase += jobs * 1.15;
    } else if (t.kind === 'industrial') {
      indZones++;
      const jobs = INDUSTRIAL_JOBS_BY_LEVEL[Math.min(3, t.level)];
      industrialJobs += jobs;
      taxBase += jobs * 1.05;
    }
  }

  const jobs = commercialJobs + industrialJobs;
  const avgPollution = Math.round(totalPollution / tiles.length);

  // Happiness (0..100)
  let happiness = 76;
  happiness -= (state.taxRate - DEFAULT_TAX_RATE) * 4;
  happiness -= Math.min(28, unpoweredCount * 4 + unwateredCount * 4 + unroadedCount * 3);
  happiness += Math.min(14, parks.length * 3 + civics.length * 6);
  happiness -= Math.min(18, Math.round(avgPollution * 0.7));
  happiness = Math.max(10, Math.min(100, Math.round(happiness)));

  // RCI Demand (-100..100)
  const taxModifier = (DEFAULT_TAX_RATE - state.taxRate) * 7;
  const housingTarget = Math.max(24, jobs * 1.2 + 20);
  const resDemand = clampDemand(
    ((housingTarget - population) / Math.max(30, housingTarget)) * 75 +
      (happiness - 60) * 0.6 +
      taxModifier -
      resZones * 1.5 +
      35,
  );
  const comTarget = Math.max(12, population * 0.45 + 10);
  const comDemand = clampDemand(
    ((comTarget - commercialJobs) / Math.max(20, comTarget)) * 75 +
      taxModifier -
      comZones * 1.5 +
      20,
  );
  const indTarget = Math.max(14, population * 0.35 + commercialJobs * 0.35 + 12);
  const indDemand = clampDemand(
    ((indTarget - industrialJobs) / Math.max(20, indTarget)) * 75 +
      taxModifier -
      indZones * 1.5 +
      25,
  );

  const monthlyIncome = Math.round((taxBase * state.taxRate) / DEFAULT_TAX_RATE);
  const monthlyNet = monthlyIncome - monthlyUpkeep;

  return {
    ...state,
    metrics: {
      population,
      jobs,
      happiness,
      powerUsed,
      powerCapacity,
      waterUsed,
      waterCapacity,
      monthlyIncome,
      monthlyUpkeep,
      monthlyNet,
      unpoweredCount,
      unwateredCount,
      unroadedCount,
      avgPollution,
      demand: {
        residential: resDemand,
        commercial: comDemand,
        industrial: indDemand,
      },
    },
  };
}

function clampDemand(val: number): number {
  return Math.max(-100, Math.min(100, Math.round(val)));
}

export function getPlacementCost(tile: CityTile, tool: ToolId): number {
  if (tool === 'inspect') return 0;
  if (tool === 'road' && tile.terrain === 'water') return BRIDGE_COST;
  const base = TOOL_BY_ID[tool].cost;
  if (tool !== 'bulldoze' && tile.terrain === 'forest') {
    return base + FOREST_CLEAR_SURCHARGE;
  }
  return base;
}

export function canPlaceTool(tile: CityTile, tool: ToolId): { ok: boolean; reason?: string } {
  if (tool === 'inspect') return { ok: true };

  if (tool === 'bulldoze') {
    if (tile.kind === 'empty' && tile.terrain !== 'forest') {
      return { ok: false, reason: 'Nothing to bulldoze here.' };
    }
    return { ok: true };
  }

  if (tool === 'road') {
    if (tile.kind === 'road') return { ok: false, reason: 'Road already exists.' };
    if (tile.kind !== 'empty') return { ok: false, reason: 'Bulldoze existing building first.' };
    return { ok: true };
  }

  if (tile.terrain === 'water') {
    return { ok: false, reason: 'Only Roads (bridges) can be built on water.' };
  }
  if (tile.kind !== 'empty') {
    return { ok: false, reason: 'Tile occupied. Bulldoze first.' };
  }
  return { ok: true };
}

export function applyTool(
  state: CityState,
  x: number,
  y: number,
  tool: ToolId,
): ToolActionResult {
  if (!inBounds(x, y, state.gridSize) || tool === 'inspect') {
    return { state, changed: false, cost: 0 };
  }

  const target = state.tiles[idxOf(x, y, state.gridSize)];
  const check = canPlaceTool(target, tool);
  if (!check.ok) {
    return { state, changed: false, cost: 0, sound: 'error', reason: check.reason };
  }

  const cost = getPlacementCost(target, tool);
  if (state.treasury < cost) {
    return {
      state,
      changed: false,
      cost: 0,
      sound: 'error',
      reason: `Need $${cost} (have $${state.treasury}).`,
    };
  }

  const tiles = cloneTiles(state.tiles);
  const tile = tiles[idxOf(x, y, state.gridSize)];

  if (tool === 'bulldoze') {
    if (tile.kind !== 'empty') {
      tile.kind = 'empty';
      tile.level = 0;
      tile.unservicedTicks = 0;
    } else if (tile.terrain === 'forest') {
      tile.terrain = 'grass';
    }
    tile.revision += 1;
  } else {
    if (tile.terrain === 'forest') {
      tile.terrain = 'grass';
    }
    tile.kind = tool;
    tile.level = 0;
    tile.unservicedTicks = 0;
    tile.revision += 1;
  }

  const nextState = recomputeCityMetrics({
    ...state,
    tiles,
    treasury: state.treasury - cost,
  });

  return {
    state: nextState,
    changed: true,
    cost,
    sound: tool === 'bulldoze' ? 'bulldoze' : tool === 'road' ? 'road' : 'build',
  };
}

export function setTaxRate(state: CityState, taxRate: number): CityState {
  const clamped = Math.max(MIN_TAX_RATE, Math.min(MAX_TAX_RATE, Math.round(taxRate)));
  if (clamped === state.taxRate) return state;
  return recomputeCityMetrics({
    ...state,
    taxRate: clamped,
  });
}

function hasCivicCoverage(tiles: CityTile[], gridSize: number, x: number, y: number): boolean {
  for (const t of tiles) {
    if (t.kind === 'civic') {
      if (Math.abs(t.x - x) + Math.abs(t.y - y) <= 5) return true;
    }
  }
  // Suppress unused warning when gridSize matches
  return gridSize < 0;
}

export interface SimulationTickResult {
  state: CityState;
  leveledUp: boolean;
  monthPassed: boolean;
  milestoneReached?: string;
}

export function stepSimulationTick(state: CityState): SimulationTickResult {
  const tiles = cloneTiles(state.tiles);
  const nextTick = state.tickCount + 1;
  let leveledUp = false;

  const { demand } = state.metrics;

  for (const t of tiles) {
    if (!isZoneKind(t.kind)) continue;

    const serviced = t.hasRoadAccess && t.powered && t.watered;
    if (!serviced) {
      t.unservicedTicks += 1;
      if (t.level > 0 && t.unservicedTicks >= 6) {
        t.level -= 1;
        t.unservicedTicks = 0;
        t.revision += 1;
      }
      continue;
    }

    t.unservicedTicks = 0;
    const zoneDemand =
      t.kind === 'residential'
        ? demand.residential
        : t.kind === 'commercial'
          ? demand.commercial
          : demand.industrial;

    const maxLevel = t.kind === 'industrial' ? 3 : 4;
    if (t.level < maxLevel && zoneDemand >= 0) {
      // Higher levels require higher land value or civic services
      const civicOk = t.level < 2 || hasCivicCoverage(tiles, state.gridSize, t.x, t.y) || t.landValue >= 72;
      const valueGate =
        t.level === 0 ? 0 : t.level === 1 ? 35 : t.level === 2 ? 55 : 68;

      if (civicOk && t.landValue >= valueGate) {
        // Deterministic stagger so the city blossoms organically across ticks
        const hash = (t.x * 7 + t.y * 13 + nextTick) % 3;
        if (t.level === 0 || hash === 0) {
          t.level += 1;
          t.revision += 1;
          leveledUp = true;
        }
      }
    }
  }

  let nextState = recomputeCityMetrics({
    ...state,
    tiles,
    tickCount: nextTick,
  });

  let monthPassed = false;
  let treasury = nextState.treasury;
  let month = nextState.month;
  let year = nextState.year;

  if (nextTick % TICKS_PER_MONTH === 0) {
    monthPassed = true;
    treasury = Math.max(0, treasury + nextState.metrics.monthlyNet);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  const bestPopulation = Math.max(nextState.bestPopulation, nextState.metrics.population);
  const newMilestone = getCityMilestone(nextState.metrics.population);
  const milestoneReached =
    newMilestone !== state.milestoneName && nextState.metrics.population > 0
      ? newMilestone
      : undefined;

  nextState = {
    ...nextState,
    treasury,
    month,
    year,
    bestPopulation,
    milestoneName: milestoneReached ?? state.milestoneName,
  };

  return {
    state: nextState,
    leveledUp,
    monthPassed,
    milestoneReached,
  };
}
