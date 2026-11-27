import {
  BASE_CUSTOMER_INTERVAL_MS,
  BASE_DISPLAY_CAPACITY,
  MAX_OFFLINE_SECONDS,
  PRODUCT_MAP,
  PRODUCTS,
  STAFF,
  UPGRADES,
} from './config';
import { GameState, OfflineSummary, ProductId, StaffId, UpgradeId } from './types';

export function hasUpgrade(state: GameState, id: UpgradeId): boolean {
  return state.upgrades.includes(id);
}

export function getTotalStock(state: GameState): number {
  return state.stock.bread + state.stock.croissant + state.stock.tart;
}

export function getDisplayCapacity(state: GameState): number {
  let cap = BASE_DISPLAY_CAPACITY;
  if (hasUpgrade(state, 'tier2_warm_display')) cap += 4;
  if (hasUpgrade(state, 'tier5_master_patisserie')) cap += 6;
  return cap;
}

export function getBakePower(state: GameState): number {
  let power = 1;
  if (hasUpgrade(state, 'tier1_cast_iron_oven')) power += 1;
  if (hasUpgrade(state, 'tier3_stone_hearth')) power *= 2;
  return power;
}

export function getSellMultiplier(state: GameState): number {
  let mult = 1;
  if (hasUpgrade(state, 'tier3_stone_hearth')) mult *= 1.25;
  if (hasUpgrade(state, 'tier5_master_patisserie')) mult *= 2;
  mult *= 1 + state.staff.cashier * 0.15;
  return mult;
}

export function getTipChance(state: GameState): number {
  return hasUpgrade(state, 'tier4_cozy_neon') ? 0.2 : 0;
}

export function getProductSellPrice(state: GameState, productId: ProductId): number {
  const base = PRODUCT_MAP[productId].basePrice;
  return Math.max(1, Math.round(base * getSellMultiplier(state)));
}

export function getCustomerIntervalMs(state: GameState): number {
  let speedMult = 1;
  if (hasUpgrade(state, 'tier2_warm_display')) speedMult *= 1.35;
  if (hasUpgrade(state, 'tier4_cozy_neon')) speedMult *= 1.5;
  speedMult *= 1 + state.staff.cashier * 0.08;
  return Math.max(450, Math.round(BASE_CUSTOMER_INTERVAL_MS / speedMult));
}

export function getStaffCost(staffId: StaffId, currentLevel: number): number {
  const def = STAFF.find((s) => s.id === staffId);
  if (!def) return 0;
  return Math.floor(def.baseCost * Math.pow(def.costScale, currentLevel));
}

/** Auto-bake progress points generated per second by Apprentice Bakers */
export function getAutoBakeProgressPerSec(state: GameState): number {
  if (state.staff.baker <= 0) return 0;
  const ovenBonus = hasUpgrade(state, 'tier3_stone_hearth') ? 1.25 : 1;
  return state.staff.baker * 0.5 * ovenBonus;
}

/**
 * Estimates sustainable passive coins/sec from hired staff,
 * limited by whichever is slower: auto-baking throughput or customer arrival rate.
 */
export function getEstimatedCoinsPerSec(state: GameState): number {
  const bakeProgressPerSec = getAutoBakeProgressPerSec(state);
  if (bakeProgressPerSec <= 0) return 0;

  const activeDef = PRODUCT_MAP[state.activeProduct];
  const itemsBakedPerSec = bakeProgressPerSec / activeDef.tapsToBake;
  const customersPerSec = 1000 / getCustomerIntervalMs(state);
  const itemsSoldPerSec = Math.min(itemsBakedPerSec, customersPerSec);

  const avgTipFactor = 1 + getTipChance(state) * 0.5;
  const pricePerItem = getProductSellPrice(state, state.activeProduct) * avgTipFactor;
  return itemsSoldPerSec * pricePerItem;
}

/**
 * Picks the highest-value stocked product for a customer to buy.
 */
export function pickProductToSell(state: GameState): ProductId | null {
  for (let i = PRODUCTS.length - 1; i >= 0; i--) {
    const id = PRODUCTS[i].id;
    if (state.stock[id] > 0) {
      return id;
    }
  }
  return null;
}

/**
 * Applies `progressAmount` of baking work to the active product,
 * moving completed items into the display counter up to display capacity.
 */
export function applyBakeWork(
  state: GameState,
  progressAmount: number
): { nextState: GameState; bakedCount: number; capacityFull: boolean } {
  const cap = getDisplayCapacity(state);
  const currentTotal = getTotalStock(state);

  if (currentTotal >= cap) {
    return { nextState: state, bakedCount: 0, capacityFull: true };
  }

  const product = PRODUCT_MAP[state.activeProduct];
  let progress = state.bakeProgress + progressAmount;
  let bakedCount = 0;
  let remainingSpace = cap - currentTotal;

  while (progress >= product.tapsToBake && remainingSpace > 0) {
    progress -= product.tapsToBake;
    bakedCount += 1;
    remainingSpace -= 1;
  }

  if (remainingSpace === 0) {
    progress = Math.min(progress, product.tapsToBake - 0.01);
  }

  return {
    bakedCount,
    capacityFull: remainingSpace === 0 && bakedCount === 0,
    nextState: {
      ...state,
      bakeProgress: progress,
      totalItemsBaked: state.totalItemsBaked + bakedCount,
      stock:
        bakedCount > 0
          ? {
              ...state.stock,
              [state.activeProduct]: state.stock[state.activeProduct] + bakedCount,
            }
          : state.stock,
    },
  };
}

/**
 * Sells one item from the display counter, applying sell multiplier and tip chance.
 */
export function sellOneItem(
  state: GameState,
  rng: () => number = Math.random
): { nextState: GameState; soldProduct: ProductId | null; earned: number; tipped: boolean } {
  const productId = pickProductToSell(state);
  if (!productId) {
    return { nextState: state, soldProduct: null, earned: 0, tipped: false };
  }

  const baseSale = getProductSellPrice(state, productId);
  const tipped = getTipChance(state) > 0 && rng() < getTipChance(state);
  const earned = tipped ? Math.round(baseSale * 1.5) : baseSale;

  return {
    soldProduct: productId,
    earned,
    tipped,
    nextState: {
      ...state,
      coins: state.coins + earned,
      totalCoinsEarned: state.totalCoinsEarned + earned,
      totalItemsSold: state.totalItemsSold + 1,
      stock: {
        ...state.stock,
        [productId]: state.stock[productId] - 1,
      },
    },
  };
}

export function canUnlockProduct(state: GameState, productId: ProductId): boolean {
  if (state.unlockedProducts.includes(productId)) return false;
  return state.coins >= PRODUCT_MAP[productId].unlockCost;
}

export function unlockProduct(state: GameState, productId: ProductId): GameState {
  if (!canUnlockProduct(state, productId)) return state;
  const cost = PRODUCT_MAP[productId].unlockCost;
  return {
    ...state,
    coins: state.coins - cost,
    unlockedProducts: [...state.unlockedProducts, productId],
    activeProduct: productId,
    bakeProgress: 0,
  };
}

export function canBuyUpgrade(state: GameState, upgradeId: UpgradeId): boolean {
  if (hasUpgrade(state, upgradeId)) return false;
  const def = UPGRADES.find((u) => u.id === upgradeId);
  if (!def) return false;
  return state.coins >= def.cost;
}

export function buyUpgrade(state: GameState, upgradeId: UpgradeId): GameState {
  if (!canBuyUpgrade(state, upgradeId)) return state;
  const def = UPGRADES.find((u) => u.id === upgradeId)!;
  return {
    ...state,
    coins: state.coins - def.cost,
    upgrades: [...state.upgrades, upgradeId],
  };
}

export function canHireStaff(state: GameState, staffId: StaffId): boolean {
  const cost = getStaffCost(staffId, state.staff[staffId]);
  return state.coins >= cost;
}

export function hireStaff(state: GameState, staffId: StaffId): GameState {
  if (!canHireStaff(state, staffId)) return state;
  const cost = getStaffCost(staffId, state.staff[staffId]);
  return {
    ...state,
    coins: state.coins - cost,
    staff: {
      ...state.staff,
      [staffId]: state.staff[staffId] + 1,
    },
  };
}

/**
 * Calculates offline earnings capped at 8 hours (MAX_OFFLINE_SECONDS).
 */
export function calculateOfflineEarnings(state: GameState, nowMs: number): OfflineSummary {
  const rawElapsedSec = Math.max(0, Math.floor((nowMs - state.lastSavedAt) / 1000));
  const capped = rawElapsedSec > MAX_OFFLINE_SECONDS;
  const elapsedSeconds = Math.min(rawElapsedSec, MAX_OFFLINE_SECONDS);
  const coinsPerSec = getEstimatedCoinsPerSec(state);

  if (elapsedSeconds <= 0 || coinsPerSec <= 0) {
    return {
      elapsedSeconds,
      capped,
      coinsEarned: 0,
      itemsSold: 0,
      coinsPerSec,
    };
  }

  const coinsEarned = Math.floor(elapsedSeconds * coinsPerSec);
  const activePrice = Math.max(1, getProductSellPrice(state, state.activeProduct));
  const itemsSold = Math.max(1, Math.floor(coinsEarned / activePrice));

  return {
    elapsedSeconds,
    capped,
    coinsEarned,
    itemsSold,
    coinsPerSec,
  };
}

export function formatCoins(value: number): string {
  const n = Math.floor(value);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('en-US');
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
