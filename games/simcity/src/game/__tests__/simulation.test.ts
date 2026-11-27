import { describe, expect, it } from 'vitest';
import { BRIDGE_COST, STARTING_TREASURY, TICKS_PER_MONTH } from '../constants';
import {
  applyTool,
  createCityState,
  createStarterTownState,
  idxOf,
  setTaxRate,
  stepSimulationTick,
} from '../engine';
import { getCityHint } from '../hints';
import { loadCityData, saveCityData } from '../storage';
import { getTutorialProgress } from '../tutorial';

describe('SimCity 3D Simulation Engine', () => {
  it('generates deterministic terrain presets and starter town', () => {
    const a = createCityState('riverside');
    const b = createCityState('riverside');
    expect(a.tiles.length).toBe(400);
    expect(a.treasury).toBe(STARTING_TREASURY);
    expect(a.tiles.map((t) => t.terrain)).toEqual(b.tiles.map((t) => t.terrain));
    expect(a.tiles.some((t) => t.terrain === 'water')).toBe(true);
    expect(a.tiles[idxOf(10, 0)].kind).toBe('road');

    const islands = createCityState('islands');
    expect(islands.tiles.some((t) => t.terrain === 'water')).toBe(true);

    const starter = createStarterTownState();
    expect(starter.metrics.population).toBeGreaterThan(0);
    expect(starter.metrics.powerCapacity).toBeGreaterThan(0);
    expect(starter.metrics.waterCapacity).toBeGreaterThan(0);
  });

  it('enforces placement costs, bridge costs on water, and bulldozing', () => {
    let state = createCityState('riverside');
    const waterTile = state.tiles.find((t) => t.terrain === 'water')!;

    // Cannot build residential on water
    const badRes = applyTool(state, waterTile.x, waterTile.y, 'residential');
    expect(badRes.changed).toBe(false);

    // Can build bridge over water for BRIDGE_COST
    const bridge = applyTool(state, waterTile.x, waterTile.y, 'road');
    expect(bridge.changed).toBe(true);
    expect(bridge.cost).toBe(BRIDGE_COST);
    expect(bridge.state.tiles[idxOf(waterTile.x, waterTile.y)].kind).toBe('road');

    // Bulldoze removes it
    const cleared = applyTool(bridge.state, waterTile.x, waterTile.y, 'bulldoze');
    expect(cleared.changed).toBe(true);
    expect(cleared.state.tiles[idxOf(waterTile.x, waterTile.y)].kind).toBe('empty');

    // Rejects placement if treasury is too low
    state = { ...state, treasury: 5 };
    const broke = applyTool(state, 9, 1, 'power');
    expect(broke.changed).toBe(false);
  });

  it('propagates power and water via BFS across connected roads and zones', () => {
    let state = createCityState('plains');
    // Entry road is at (10,0)..(10,2)
    state = applyTool(state, 9, 1, 'power').state;
    state = applyTool(state, 11, 1, 'water').state;
    state = applyTool(state, 9, 2, 'residential').state;

    const connectedRes = state.tiles[idxOf(9, 2)];
    expect(connectedRes.hasRoadAccess).toBe(true);
    expect(connectedRes.powered).toBe(true);
    expect(connectedRes.watered).toBe(true);

    // Isolated residential zone far from road/utilities
    state = applyTool(state, 2, 2, 'residential').state;
    const isolated = state.tiles[idxOf(2, 2)];
    expect(isolated.hasRoadAccess).toBe(false);
    expect(isolated.powered).toBe(false);
    expect(isolated.watered).toBe(false);
  });

  it('evolves zones, collects monthly budget, and updates milestones', () => {
    let state = createCityState('plains');
    state = applyTool(state, 9, 1, 'power').state;
    state = applyTool(state, 11, 1, 'water').state;
    state = applyTool(state, 9, 2, 'residential').state;
    state = applyTool(state, 11, 2, 'commercial').state;

    const initialTreasury = state.treasury;
    for (let i = 0; i < TICKS_PER_MONTH; i++) {
      state = stepSimulationTick(state).state;
    }

    expect(state.metrics.population).toBeGreaterThan(0);
    expect(state.month).toBe(2);
    expect(state.treasury).not.toBe(initialTreasury);

    // Tax rate adjusts demand & happiness
    const highTax = setTaxRate(state, 15);
    expect(highTax.metrics.happiness).toBeLessThan(state.metrics.happiness);
  });

  it('tracks 5-step tutorial progression and contextual advisor hints', () => {
    let state = createCityState('plains');
    expect(getTutorialProgress(state).currentStepIndex).toBe(0);
    expect(getCityHint(state).recommendedTool).toBe('power');

    state = applyTool(state, 9, 1, 'power').state;
    expect(getTutorialProgress(state).currentStepIndex).toBe(1);
    expect(getCityHint(state).recommendedTool).toBe('water');

    state = applyTool(state, 11, 1, 'water').state;
    expect(getTutorialProgress(state).currentStepIndex).toBe(2);

    for (let y = 3; y <= 6; y++) {
      state = applyTool(state, 10, y, 'road').state;
    }
    expect(getTutorialProgress(state).currentStepIndex).toBe(3);

    state = applyTool(state, 9, 3, 'residential').state;
    state = applyTool(state, 9, 4, 'residential').state;
    state = applyTool(state, 11, 3, 'commercial').state;
    expect(getTutorialProgress(state).currentStepIndex).toBe(4);

    state = applyTool(state, 9, 5, 'park').state;
    expect(getTutorialProgress(state).completed).toBe(true);
  });

  it('persists and restores city state safely in localStorage', () => {
    const starter = createStarterTownState();
    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveCityData(starter, { muted: true, lighting: 'night' }, mockStorage);
    const loaded = loadCityData(mockStorage);
    expect(loaded.muted).toBe(true);
    expect(loaded.lighting).toBe('night');
    expect(loaded.state?.metrics.population).toBe(starter.metrics.population);

    // Corrupt JSON fallback
    store.set('simcity_v1', '{bad-json');
    const recovered = loadCityData(mockStorage);
    expect(recovered.state).toBeNull();
    expect(recovered.lighting).toBe('day');
  });
});
