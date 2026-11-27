export type ProductId = 'bread' | 'croissant' | 'tart';

export type StaffId = 'baker' | 'cashier';

export type UpgradeId =
  | 'tier1_cast_iron_oven'
  | 'tier2_warm_display'
  | 'tier3_stone_hearth'
  | 'tier4_cozy_neon'
  | 'tier5_master_patisserie';

export interface ProductDef {
  id: ProductId;
  name: string;
  description: string;
  unlockCost: number;
  tapsToBake: number;
  basePrice: number;
  accentColor: string;
}

export interface UpgradeDef {
  id: UpgradeId;
  tier: number;
  name: string;
  description: string;
  cost: number;
}

export interface StaffDef {
  id: StaffId;
  name: string;
  description: string;
  baseCost: number;
  costScale: number;
}

export interface TownTeaserDef {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  badge: string;
}

export interface GameState {
  version: number;
  coins: number;
  totalCoinsEarned: number;
  totalItemsBaked: number;
  totalItemsSold: number;
  activeProduct: ProductId;
  unlockedProducts: ProductId[];
  /** Current bake progress (0 .. tapsToBake) toward the next item */
  bakeProgress: number;
  /** Stocked items currently sitting in the display counter */
  stock: Record<ProductId, number>;
  /** Purchased upgrade tier IDs */
  upgrades: UpgradeId[];
  /** Staff levels (0 = not hired yet) */
  staff: Record<StaffId, number>;
  muted: boolean;
  lastSavedAt: number;
}

export interface OfflineSummary {
  elapsedSeconds: number;
  capped: boolean;
  coinsEarned: number;
  itemsSold: number;
  coinsPerSec: number;
}

export interface CustomerEntity {
  id: number;
  variant: 0 | 1 | 2;
  x: number;
  y: number;
  targetX: number;
  state: 'entering' | 'browsing' | 'leaving';
  waitTimer: number;
  boughtProduct: ProductId | null;
  happy: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface SteamParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}
