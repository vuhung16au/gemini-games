import { GameState, ProductDef, ProductId, StaffDef, TownTeaserDef, UpgradeDef } from './types';

export const SAVE_VERSION = 1;
export const SAVE_STORAGE_KEY = 'cozy_town_tycoon_v1';

/** Offline earnings cap: 8 hours in seconds */
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60; // 28,800s
/** Minimum away duration before showing Welcome Back modal */
export const MIN_OFFLINE_MODAL_SECONDS = 10;

export const BASE_DISPLAY_CAPACITY = 6;
export const BASE_CUSTOMER_INTERVAL_MS = 2200;

export const PRODUCTS: ProductDef[] = [
  {
    id: 'bread',
    name: 'Country Bread',
    description: 'Warm crusty loaf. Quick to bake, beloved by neighbors.',
    unlockCost: 0,
    tapsToBake: 1,
    basePrice: 3,
    accentColor: '#d98a4e',
  },
  {
    id: 'croissant',
    name: 'Butter Croissant',
    description: 'Flaky golden layers. Takes 2 bake steps, sells for 4x.',
    unlockCost: 75,
    tapsToBake: 2,
    basePrice: 12,
    accentColor: '#f2b84b',
  },
  {
    id: 'tart',
    name: 'Berry Tart',
    description: 'Sweet orchard berries & custard. Premium town favorite.',
    unlockCost: 400,
    tapsToBake: 3,
    basePrice: 45,
    accentColor: '#d94e67',
  },
];

export const PRODUCT_MAP: Record<ProductId, ProductDef> = {
  bread: PRODUCTS[0],
  croissant: PRODUCTS[1],
  tart: PRODUCTS[2],
};

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'tier1_cast_iron_oven',
    tier: 1,
    name: 'Cast-Iron Oven',
    description: '+1 bake power per tap (bake twice as fast!)',
    cost: 25,
  },
  {
    id: 'tier2_warm_display',
    tier: 2,
    name: 'Warm Display Case',
    description: '+4 display capacity & +35% customer arrival speed.',
    cost: 180,
  },
  {
    id: 'tier3_stone_hearth',
    tier: 3,
    name: 'Stone Hearth',
    description: '2x tap bake power & +25% pastry sell value.',
    cost: 800,
  },
  {
    id: 'tier4_cozy_neon',
    tier: 4,
    name: 'Cozy Neon Sign',
    description: '+50% customer arrival speed & 20% chance of 1.5x tips.',
    cost: 2200,
  },
  {
    id: 'tier5_master_patisserie',
    tier: 5,
    name: 'Master Patisserie',
    description: '2x all coin earnings & +6 display capacity.',
    cost: 6000,
  },
];

export const STAFF: StaffDef[] = [
  {
    id: 'baker',
    name: 'Apprentice Baker',
    description: 'Auto-bakes your active pastry into the display counter (+0.5 bake/sec per lvl).',
    baseCost: 120,
    costScale: 1.45,
  },
  {
    id: 'cashier',
    name: 'Friendly Cashier',
    description: 'Greets customers faster & adds +15% coin value per level.',
    baseCost: 550,
    costScale: 1.45,
  },
];

export const TOWN_TEASERS: TownTeaserDef[] = [
  {
    id: 'cafe',
    name: 'Roast & Bloom Café',
    tagline: 'Brew pixel espresso & pair with bakery pastries.',
    icon: '☕',
    badge: 'Coming in v2',
  },
  {
    id: 'florist',
    name: 'Petal Corner Florist',
    tagline: 'Arrange seasonal bouquets that boost town foot traffic.',
    icon: '🌷',
    badge: 'Coming in v2',
  },
  {
    id: 'bookshop',
    name: 'Lantern Bookshop',
    tagline: 'Cozy reading nook generating steady passive town charm.',
    icon: '📖',
    badge: 'Coming in v2',
  },
];

export function createInitialGameState(now: number = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    coins: 0,
    totalCoinsEarned: 0,
    totalItemsBaked: 0,
    totalItemsSold: 0,
    activeProduct: 'bread',
    unlockedProducts: ['bread'],
    bakeProgress: 0,
    stock: {
      bread: 0,
      croissant: 0,
      tart: 0,
    },
    upgrades: [],
    staff: {
      baker: 0,
      cashier: 0,
    },
    muted: false,
    lastSavedAt: now,
  };
}
