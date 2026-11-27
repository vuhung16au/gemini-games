import { SUPPORTED_LOCALES, type Locale } from '../i18n/translations';

export type ThemeMode = 'light' | 'dark';

export interface HubData {
  favorites: string[];
  recentSlugs: string[];
  theme: ThemeMode;
  locale: Locale;
}

export const HUB_STORAGE_KEY = 'gemini_games_hub_v1';
export const MAX_RECENT_GAMES = 4;

const DEFAULT_HUB_DATA: HubData = {
  favorites: [],
  recentSlugs: [],
  theme: 'light',
  locale: 'en',
};

function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

function getDefaultStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function toggleFavorite(favorites: string[], slug: string): string[] {
  return favorites.includes(slug)
    ? favorites.filter((s) => s !== slug)
    : [...favorites, slug];
}

export function recordRecentGame(
  recentSlugs: string[],
  slug: string,
  limit = MAX_RECENT_GAMES,
): string[] {
  const deduped = [slug, ...recentSlugs.filter((s) => s !== slug)];
  return deduped.slice(0, Math.max(1, limit));
}

export function loadHubData(
  storage: Storage | null = getDefaultStorage(),
): HubData {
  if (!storage) return { ...DEFAULT_HUB_DATA, favorites: [], recentSlugs: [] };

  try {
    const raw = storage.getItem(HUB_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_HUB_DATA, favorites: [], recentSlugs: [] };
    const parsed = JSON.parse(raw) as Partial<HubData>;

    return {
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites.filter((s): s is string => typeof s === 'string')
        : [],
      recentSlugs: Array.isArray(parsed.recentSlugs)
        ? parsed.recentSlugs
            .filter((s): s is string => typeof s === 'string')
            .slice(0, MAX_RECENT_GAMES)
        : [],
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      locale: isSupportedLocale(parsed.locale) ? parsed.locale : 'en',
    };
  } catch {
    return { ...DEFAULT_HUB_DATA, favorites: [], recentSlugs: [] };
  }
}

export function saveHubData(
  data: HubData,
  storage: Storage | null = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(HUB_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}
