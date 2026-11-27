import { describe, expect, it } from 'vitest';
import { createInitialGameState, MAX_OFFLINE_SECONDS, PRODUCTS, UPGRADES } from '../config';
import {
  applyBakeWork,
  buyUpgrade,
  calculateOfflineEarnings,
  getBakePower,
  getDisplayCapacity,
  getEstimatedCoinsPerSec,
  getProductSellPrice,
  getStaffCost,
  hireStaff,
  sellOneItem,
  unlockProduct,
} from '../economy';
import { getNextActionHint } from '../hints';
import { loadGame, saveGame, StorageLike } from '../storage';

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
  };
}

describe('Cozy Town Tycoon Economy & Progression', () => {
  it('starts with 1 unlocked product (Country Bread), 3 total products, and 5 upgrade tiers', () => {
    const state = createInitialGameState(1000);
    expect(PRODUCTS).toHaveLength(3);
    expect(UPGRADES).toHaveLength(5);
    expect(state.unlockedProducts).toEqual(['bread']);
    expect(state.activeProduct).toBe('bread');
  });

  it('lets the player bake, sell, and reach Tier 1 upgrade within ~9 bread sales', () => {
    let state = createInitialGameState(1000);
    for (let i = 0; i < 9; i++) {
      state = applyBakeWork(state, getBakePower(state)).nextState;
      state = sellOneItem(state, () => 0.9).nextState;
    }
    expect(state.coins).toBe(27);
    const upgraded = buyUpgrade(state, 'tier1_cast_iron_oven');
    expect(upgraded.coins).toBe(2);
    expect(getBakePower(upgraded)).toBe(2);
  });

  it('respects display capacity when baking', () => {
    let state = createInitialGameState(1000);
    const cap = getDisplayCapacity(state);
    for (let i = 0; i < cap + 3; i++) {
      state = applyBakeWork(state, 1).nextState;
    }
    expect(state.stock.bread).toBe(cap);
    const extra = applyBakeWork(state, 1);
    expect(extra.capacityFull).toBe(true);
    expect(extra.bakedCount).toBe(0);
  });

  it('unlocks products, scales staff costs, and boosts sell prices', () => {
    let state = { ...createInitialGameState(1000), coins: 1000 };
    state = unlockProduct(state, 'croissant');
    expect(state.unlockedProducts).toContain('croissant');
    expect(state.activeProduct).toBe('croissant');

    const baseCost = getStaffCost('baker', 0);
    const lvl1Cost = getStaffCost('baker', 1);
    expect(lvl1Cost).toBeGreaterThan(baseCost);

    const beforePrice = getProductSellPrice(state, 'croissant');
    state = hireStaff(state, 'cashier');
    expect(getProductSellPrice(state, 'croissant')).toBeGreaterThan(beforePrice);
  });

  it('calculates offline earnings only with automation and caps at 8 hours', () => {
    const t0 = 1_000_000;
    const noStaffState = createInitialGameState(t0);
    const noStaffOffline = calculateOfflineEarnings(noStaffState, t0 + 3600 * 1000);
    expect(noStaffOffline.coinsEarned).toBe(0);

    const withBaker = {
      ...createInitialGameState(t0),
      staff: { baker: 1, cashier: 0 },
    };
    const cps = getEstimatedCoinsPerSec(withBaker);
    expect(cps).toBeGreaterThan(0);

    // 10 hours away -> should cap at 8 hours (28,800s)
    const tenHoursMs = 10 * 3600 * 1000;
    const cappedOffline = calculateOfflineEarnings(withBaker, t0 + tenHoursMs);
    expect(cappedOffline.capped).toBe(true);
    expect(cappedOffline.elapsedSeconds).toBe(MAX_OFFLINE_SECONDS);
    expect(cappedOffline.coinsEarned).toBe(Math.floor(MAX_OFFLINE_SECONDS * cps));
  });

  it('handles negative clock skew safely in offline earnings', () => {
    const t0 = 5_000_000;
    const withBaker = { ...createInitialGameState(t0), staff: { baker: 2, cashier: 1 } };
    const skewed = calculateOfflineEarnings(withBaker, t0 - 60_000);
    expect(skewed.elapsedSeconds).toBe(0);
    expect(skewed.coinsEarned).toBe(0);
  });

  it('saves and loads game state cleanly and recovers from corrupted JSON', () => {
    const storage = createMemoryStorage();
    const state = {
      ...createInitialGameState(2000),
      coins: 345,
      upgrades: ['tier1_cast_iron_oven' as const],
      staff: { baker: 2, cashier: 1 },
    };

    saveGame(state, 5000, storage);
    const loaded = loadGame(6000, storage);
    expect(loaded.fromSave).toBe(true);
    expect(loaded.state.coins).toBe(345);
    expect(loaded.state.staff.baker).toBe(2);
    expect(loaded.state.lastSavedAt).toBe(5000);

    storage.setItem('cozy_town_tycoon_v1', '{broken json');
    const recovered = loadGame(7000, storage);
    expect(recovered.fromSave).toBe(false);
    expect(recovered.state.coins).toBe(0);
  });

  it('provides contextual next-action hints based on stock and coins', () => {
    const emptyState = createInitialGameState(1000);
    expect(getNextActionHint(emptyState)).toContain('empty');

    const readyToUpgrade = {
      ...applyBakeWork(emptyState, 1).nextState,
      coins: 30,
    };
    expect(getNextActionHint(readyToUpgrade)).toContain('Cast-Iron Oven');
  });
});
