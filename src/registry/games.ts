export type GameCategory = 'Puzzle' | 'Board' | 'Arcade' | 'Simulation' | 'Card';

export const GAME_CATEGORIES = [
  'All',
  'Puzzle',
  'Board',
  'Arcade',
  'Simulation',
  'Card',
] as const;

export type CategoryFilter = (typeof GAME_CATEGORIES)[number];

export interface GameEntry {
  slug: string;
  title: string;
  category: GameCategory;
  description: string;
  controls: string;
  iconPath: string;
  coverPath: string;
  entryPath: string;
}

function makeGame(
  slug: string,
  title: string,
  category: GameCategory,
  description: string,
  controls: string,
): GameEntry {
  return {
    slug,
    title,
    category,
    description,
    controls,
    iconPath: `./games/${slug}/icons/icon-192.png`,
    coverPath: `./games/${slug}/graphics/cover-hd.png`,
    entryPath: `./games/${slug}/index.html`,
  };
}

export const GAMES: GameEntry[] = [
  makeGame(
    '1024',
    '1024',
    'Puzzle',
    'Slide and merge matching numbered tiles from 1 up to reach the 1024 tile.',
    'Arrows / WASD / Swipe',
  ),
  makeGame(
    'battle-city',
    'Battle City 1985',
    'Arcade',
    'Classic 1985 Famicom tank battle with 1P & 2P local co-op, destructible walls, and 10 stages.',
    'P1: WASD+Space · P2: Arrows+Enter',
  ),
  makeGame(
    'checkers',
    'Checkers',
    'Board',
    'Classic 8×8 American Checkers with AI opponent, 2-player mode, and multi-jumps.',
    'Click / Tap',
  ),
  makeGame(
    'cozy-town-tycoon',
    'Cozy Town Tycoon',
    'Simulation',
    'Bake pastries, serve townsfolk, hire staff, and expand your pixel-art bakery.',
    'Click / Tap',
  ),
  makeGame(
    'dino-run',
    'Dino Run',
    'Arcade',
    'Chrome offline 404 T-Rex runner with Classic Desert and 404 Math Proof Runner modes.',
    'Space / Up Jump · Down Duck',
  ),
  makeGame(
    'flappy-bird',
    'Flappy Bird',
    'Arcade',
    'Tap or press Space to soar through progressively tighter arcade pipes.',
    'Space / Up / Tap',
  ),
  makeGame(
    'minesweeper',
    'Minesweeper',
    'Puzzle',
    'Classic logic mine-clearing puzzle with Easy, Medium, Hard, and Custom board sizes.',
    'Click / Right-Click Flag / Chord',
  ),
  makeGame(
    'simcity',
    'SimCity 3D',
    'Simulation',
    'Build a living low-poly 3D metropolis with RCI zones, bridges, utilities, and day/night lighting.',
    'Click / Drag / Orbit / WASD / 1–9',
  ),
  makeGame(
    'solitaire',
    'Solitaire',
    'Card',
    'Classic Klondike Solitaire with Turn 1 & 3 modes, smart hints, and tutorial.',
    'Click / Drag / Dbl-Click',
  ),
  makeGame(
    'sudoku',
    'Sudoku',
    'Puzzle',
    'Solve uniquely generated 9×9 Sudoku puzzles with pencil notes, hints, and undo.',
    'Click / 1–9 / Arrows',
  ),
  makeGame(
    'super-mario-bros',
    'Super Mario Bros. 1985',
    'Arcade',
    'Classic 1985 NES side-scrolling platformer across World 1-1 to 1-4.',
    'Arrows/WASD · Space Jump · Shift Run/Fire',
  ),
  makeGame(
    'ta-la-phom',
    'Tá Lả (Phỏm)',
    'Card',
    'Classic Vietnamese Phỏm with Ăn/Bốc, Hạ Phỏm, Gửi bài, 2–4P vs AI & Pass & Play.',
    'Click / Tap · 2–4P',
  ),
  makeGame(
    'tan-do',
    'Tấn Đỡ (Bài Tấn)',
    'Card',
    'Vietnamese Trump Attack & Defend card battle with Tấn/Đỡ/Ôm bài and 2–4P modes.',
    'Click / Tap · 2–4P',
  ),
  makeGame(
    'tetris',
    'Tetris',
    'Arcade',
    'Guideline Tetris with 7-bag randomizer, SRS wall kicks, Hold, Ghost, and Tutorial.',
    'Arrows / Space / C',
  ),
  makeGame(
    'tien-len-mien-bac',
    'Tiến Lên Miền Bắc',
    'Card',
    'Strict Northern Tiến Lên with same-suit/color matching, Tứ quý, and 2–4P modes.',
    'Click / Tap · 2–4P',
  ),
  makeGame(
    'tien-len-mien-nam',
    'Tiến Lên Miền Nam',
    'Card',
    'Southern Tiến Lên with Đôi thông, Tứ quý, Tới Trắng, and 2–4P vs AI & Pass & Play.',
    'Click / Tap · 2–4P',
  ),
];

export function findGameBySlug(slug: string): GameEntry | undefined {
  return GAMES.find((game) => game.slug === slug);
}

export function filterGames(
  games: GameEntry[],
  category: CategoryFilter,
  query: string,
): GameEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  return games.filter((game) => {
    if (category !== 'All' && game.category !== category) {
      return false;
    }
    if (!normalizedQuery) return true;
    return (
      game.title.toLowerCase().includes(normalizedQuery) ||
      game.description.toLowerCase().includes(normalizedQuery) ||
      game.category.toLowerCase().includes(normalizedQuery)
    );
  });
}
