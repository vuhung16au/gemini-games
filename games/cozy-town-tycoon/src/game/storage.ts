import { createInitialGameState, SAVE_STORAGE_KEY, SAVE_VERSION } from './config';
import { GameState, ProductId, UpgradeId } from './types';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getDefaultStorage(): StorageLike | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

export function saveGame(
  state: GameState,
  now: number = Date.now(),
  storage: StorageLike | null = getDefaultStorage()
): void {
  if (!storage) return;
  try {
    const payload: GameState = {
      ...state,
      version: SAVE_VERSION,
      lastSavedAt: now,
    };
    storage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

export function loadGame(
  now: number = Date.now(),
  storage: StorageLike | null = getDefaultStorage()
): { state: GameState; fromSave: boolean } {
  const fallback = createInitialGameState(now);
  if (!storage) return { state: fallback, fromSave: false };

  try {
    const raw = storage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return { state: fallback, fromSave: false };

    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (!parsed || typeof parsed !== 'object' || parsed.version !== SAVE_VERSION) {
      return { state: fallback, fromSave: false };
    }

    const validProducts: ProductId[] = ['bread', 'croissant', 'tart'];
    const unlockedProducts: ProductId[] = Array.isArray(parsed.unlockedProducts)
      ? parsed.unlockedProducts.filter((p): p is ProductId =>
          validProducts.includes(p as ProductId)
        )
      : ['bread'];
    if (!unlockedProducts.includes('bread')) unlockedProducts.unshift('bread');

    const activeProduct: ProductId =
      parsed.activeProduct && unlockedProducts.includes(parsed.activeProduct)
        ? parsed.activeProduct
        : 'bread';

    const state: GameState = {
      version: SAVE_VERSION,
      coins: typeof parsed.coins === 'number' && Number.isFinite(parsed.coins) ? Math.max(0, parsed.coins) : 0,
      totalCoinsEarned:
        typeof parsed.totalCoinsEarned === 'number' && Number.isFinite(parsed.totalCoinsEarned)
          ? Math.max(0, parsed.totalCoinsEarned)
          : 0,
      totalItemsBaked:
        typeof parsed.totalItemsBaked === 'number' && Number.isFinite(parsed.totalItemsBaked)
          ? Math.max(0, parsed.totalItemsBaked)
          : 0,
      totalItemsSold:
        typeof parsed.totalItemsSold === 'number' && Number.isFinite(parsed.totalItemsSold)
          ? Math.max(0, parsed.totalItemsSold)
          : 0,
      activeProduct,
      unlockedProducts,
      bakeProgress:
        typeof parsed.bakeProgress === 'number' && Number.isFinite(parsed.bakeProgress)
          ? Math.max(0, parsed.bakeProgress)
          : 0,
      stock: {
        bread: Math.max(0, Math.floor(parsed.stock?.bread ?? 0)),
        croissant: Math.max(0, Math.floor(parsed.stock?.croissant ?? 0)),
        tart: Math.max(0, Math.floor(parsed.stock?.tart ?? 0)),
      },
      upgrades: Array.isArray(parsed.upgrades) ? (parsed.upgrades as UpgradeId[]) : [],
      staff: {
        baker: Math.max(0, Math.floor(parsed.staff?.baker ?? 0)),
        cashier: Math.max(0, Math.floor(parsed.staff?.cashier ?? 0)),
      },
      muted: Boolean(parsed.muted),
      lastSavedAt:
        typeof parsed.lastSavedAt === 'number' && Number.isFinite(parsed.lastSavedAt)
          ? parsed.lastSavedAt
          : now,
    };

    return { state, fromSave: true };
  } catch {
    return { state: fallback, fromSave: false };
  }
}

export function resetSavedGame(storage: StorageLike | null = getDefaultStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(SAVE_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
