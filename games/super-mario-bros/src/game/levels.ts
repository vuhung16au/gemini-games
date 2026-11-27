import { DEFAULT_TIME_LIMIT, LEVEL_HEIGHT_TILES } from './constants';
import type { LevelDefinition, LevelId, QuestionReward, TileKind } from './types';

function createEmptyTiles(widthTiles: number): TileKind[] {
  return new Array(widthTiles * LEVEL_HEIGHT_TILES).fill('empty');
}

function setTile(
  tiles: TileKind[],
  widthTiles: number,
  tx: number,
  ty: number,
  kind: TileKind,
): void {
  if (tx < 0 || ty < 0 || tx >= widthTiles || ty >= LEVEL_HEIGHT_TILES) return;
  tiles[ty * widthTiles + tx] = kind;
}

function fillRect(
  tiles: TileKind[],
  widthTiles: number,
  x0: number,
  y0: number,
  w: number,
  h: number,
  kind: TileKind,
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      setTile(tiles, widthTiles, x, y, kind);
    }
  }
}

function placePipe(
  tiles: TileKind[],
  widthTiles: number,
  tx: number,
  topY: number,
  bottomY = 9,
): void {
  setTile(tiles, widthTiles, tx, topY, 'pipe_tl');
  setTile(tiles, widthTiles, tx + 1, topY, 'pipe_tr');
  for (let y = topY + 1; y <= bottomY; y++) {
    setTile(tiles, widthTiles, tx, y, 'pipe_bl');
    setTile(tiles, widthTiles, tx + 1, y, 'pipe_br');
  }
}

function placeStair(
  tiles: TileKind[],
  widthTiles: number,
  startX: number,
  width: number,
  direction: 1 | -1,
): void {
  for (let i = 0; i < width; i++) {
    const h = direction === 1 ? i + 1 : width - i;
    fillRect(tiles, widthTiles, startX + i, 10 - h, 1, h, 'hard');
  }
}

function buildWorld1_1(): LevelDefinition {
  const w = 132;
  const tiles = createEmptyTiles(w);
  const rewards: Record<string, QuestionReward> = {};
  const q = (tx: number, ty: number, reward: QuestionReward = 'coin') => {
    setTile(tiles, w, tx, ty, 'question');
    rewards[`${tx},${ty}`] = reward;
  };

  // Ground with classic pits
  fillRect(tiles, w, 0, 10, 42, 2, 'ground');
  fillRect(tiles, w, 45, 10, 16, 2, 'ground');
  fillRect(tiles, w, 64, 10, 68, 2, 'ground');

  // Opening ? & Brick setpiece
  q(12, 6, 'coin');
  fillRect(tiles, w, 16, 6, 5, 1, 'brick');
  q(17, 6, 'mushroom');
  q(19, 6, 'coin');
  q(18, 3, 'coin');

  // Pipes (with Piranha Plant on pipe 3)
  placePipe(tiles, w, 24, 8);
  placePipe(tiles, w, 32, 7);
  placePipe(tiles, w, 38, 6);

  // Hidden 1-UP before first pit
  setTile(tiles, w, 41, 6, 'hidden_1up');
  rewards['41,6'] = 'oneup';

  // Mid-stage brick bridge & Star block
  fillRect(tiles, w, 49, 6, 3, 1, 'brick');
  q(50, 6, 'mushroom');
  fillRect(tiles, w, 53, 3, 6, 1, 'brick');
  q(68, 6, 'star');
  fillRect(tiles, w, 72, 6, 4, 1, 'brick');

  // Classic ascending/descending stairs
  placeStair(tiles, w, 82, 4, 1);
  placeStair(tiles, w, 88, 4, -1);
  placeStair(tiles, w, 96, 4, 1);
  placeStair(tiles, w, 102, 4, -1);

  // Final staircase & castle
  placeStair(tiles, w, 110, 6, 1);
  fillRect(tiles, w, 123, 7, 5, 3, 'castle_wall');

  return {
    id: '1-1',
    name: 'World 1-1: Overworld',
    theme: 'overworld',
    widthTiles: w,
    heightTiles: LEVEL_HEIGHT_TILES,
    timeLimit: DEFAULT_TIME_LIMIT,
    tiles,
    rewards,
    enemies: [
      { kind: 'goomba', tx: 18, ty: 9 },
      { kind: 'goomba', tx: 29, ty: 9 },
      { kind: 'piranha', tx: 38, ty: 6 },
      { kind: 'goomba', tx: 52, ty: 9 },
      { kind: 'koopa', tx: 69, ty: 9 },
      { kind: 'goomba', tx: 75, ty: 9 },
      { kind: 'goomba', tx: 78, ty: 9 },
      { kind: 'koopa', tx: 93, ty: 9 },
    ],
    coins: [
      { tx: 43, ty: 6 },
      { tx: 44, ty: 6 },
      { tx: 55, ty: 2 },
      { tx: 56, ty: 2 },
    ],
    platforms: [],
    fireBars: [],
    goalType: 'flagpole',
    goalTx: 119,
    goalTy: 9,
  };
}

function buildWorld1_2(): LevelDefinition {
  const w = 118;
  const tiles = createEmptyTiles(w);
  const rewards: Record<string, QuestionReward> = {};
  const q = (tx: number, ty: number, reward: QuestionReward = 'coin') => {
    setTile(tiles, w, tx, ty, 'question');
    rewards[`${tx},${ty}`] = reward;
  };

  // Underground ceiling
  fillRect(tiles, w, 0, 0, 100, 1, 'brick');
  // Ground with chasm pits
  fillRect(tiles, w, 0, 10, 36, 2, 'ground');
  fillRect(tiles, w, 40, 10, 20, 2, 'ground');
  fillRect(tiles, w, 68, 10, 50, 2, 'ground');

  q(10, 6, 'mushroom');
  q(11, 6, 'coin');
  q(12, 6, 'coin');
  fillRect(tiles, w, 17, 7, 1, 3, 'hard');
  fillRect(tiles, w, 21, 6, 1, 4, 'hard');
  fillRect(tiles, w, 25, 5, 1, 5, 'hard');

  // Brick cavern + secret ceiling coins
  fillRect(tiles, w, 43, 6, 6, 1, 'brick');
  q(46, 6, 'mushroom');
  fillRect(tiles, w, 51, 4, 8, 1, 'brick');

  // Pipe cluster before exit
  placePipe(tiles, w, 74, 8);
  placePipe(tiles, w, 82, 7);
  placeStair(tiles, w, 92, 5, 1);
  fillRect(tiles, w, 109, 7, 5, 3, 'castle_wall');

  return {
    id: '1-2',
    name: 'World 1-2: Underground',
    theme: 'underground',
    widthTiles: w,
    heightTiles: LEVEL_HEIGHT_TILES,
    timeLimit: DEFAULT_TIME_LIMIT,
    tiles,
    rewards,
    enemies: [
      { kind: 'goomba', tx: 14, ty: 9 },
      { kind: 'goomba', tx: 29, ty: 9 },
      { kind: 'koopa', tx: 45, ty: 9 },
      { kind: 'goomba', tx: 54, ty: 3 },
      { kind: 'piranha', tx: 74, ty: 8 },
      { kind: 'koopa', tx: 86, ty: 9 },
    ],
    coins: [
      { tx: 37, ty: 6 },
      { tx: 38, ty: 6 },
      { tx: 53, ty: 2 },
      { tx: 54, ty: 2 },
      { tx: 55, ty: 2 },
      { tx: 56, ty: 2 },
    ],
    platforms: [
      { tx: 61, ty: 8, widthTiles: 3, axis: 'y', rangeTiles: 4, speed: 60 },
      { tx: 64, ty: 5, widthTiles: 3, axis: 'y', rangeTiles: 4, speed: 60 },
    ],
    fireBars: [],
    goalType: 'flagpole',
    goalTx: 105,
    goalTy: 9,
  };
}

function buildWorld1_3(): LevelDefinition {
  const w = 112;
  const tiles = createEmptyTiles(w);
  const rewards: Record<string, QuestionReward> = {};

  // Starting and ending earth
  fillRect(tiles, w, 0, 10, 14, 2, 'ground');
  fillRect(tiles, w, 90, 10, 22, 2, 'ground');

  // Treetop bridges
  fillRect(tiles, w, 15, 8, 7, 1, 'bridge');
  fillRect(tiles, w, 24, 6, 8, 1, 'bridge');
  fillRect(tiles, w, 34, 8, 6, 1, 'bridge');
  fillRect(tiles, w, 46, 5, 7, 1, 'bridge');
  fillRect(tiles, w, 62, 7, 8, 1, 'bridge');
  fillRect(tiles, w, 78, 6, 7, 1, 'bridge');

  setTile(tiles, w, 27, 3, 'question');
  rewards['27,3'] = 'mushroom';
  setTile(tiles, w, 65, 4, 'question');
  rewards['65,4'] = 'star';

  placeStair(tiles, w, 92, 4, 1);
  fillRect(tiles, w, 103, 7, 5, 3, 'castle_wall');

  return {
    id: '1-3',
    name: 'World 1-3: Treetop Heights',
    theme: 'athletic',
    widthTiles: w,
    heightTiles: LEVEL_HEIGHT_TILES,
    timeLimit: 300,
    tiles,
    rewards,
    enemies: [
      { kind: 'koopa', tx: 18, ty: 7 },
      { kind: 'goomba', tx: 27, ty: 5 },
      { kind: 'koopa', tx: 49, ty: 4 },
      { kind: 'goomba', tx: 66, ty: 6 },
      { kind: 'koopa', tx: 81, ty: 5 },
    ],
    coins: [
      { tx: 17, ty: 6 },
      { tx: 18, ty: 6 },
      { tx: 48, ty: 3 },
      { tx: 49, ty: 3 },
      { tx: 64, ty: 5 },
      { tx: 65, ty: 5 },
    ],
    platforms: [
      { tx: 41, ty: 7, widthTiles: 3, axis: 'x', rangeTiles: 4, speed: 65 },
      { tx: 55, ty: 7, widthTiles: 3, axis: 'y', rangeTiles: 3, speed: 55 },
      { tx: 72, ty: 7, widthTiles: 3, axis: 'x', rangeTiles: 4, speed: 70 },
    ],
    fireBars: [],
    goalType: 'flagpole',
    goalTx: 99,
    goalTy: 9,
  };
}

function buildWorld1_4(): LevelDefinition {
  const w = 104;
  const tiles = createEmptyTiles(w);
  const rewards: Record<string, QuestionReward> = {};

  // Castle ceiling & floor with lava pits
  fillRect(tiles, w, 0, 0, w, 2, 'castle_wall');
  fillRect(tiles, w, 0, 10, 22, 2, 'castle_wall');
  fillRect(tiles, w, 22, 11, 5, 1, 'lava');
  fillRect(tiles, w, 27, 10, 24, 2, 'castle_wall');
  fillRect(tiles, w, 51, 11, 6, 1, 'lava');
  fillRect(tiles, w, 57, 10, 14, 2, 'castle_wall');
  fillRect(tiles, w, 71, 11, 16, 1, 'lava');
  fillRect(tiles, w, 87, 10, 17, 2, 'castle_wall');

  // Power-up ? block early in the castle
  setTile(tiles, w, 14, 6, 'question');
  rewards['14,6'] = 'mushroom';

  // Stone obstacles & mid-platforms over lava
  fillRect(tiles, w, 24, 8, 2, 1, 'castle_wall');
  fillRect(tiles, w, 34, 7, 4, 1, 'castle_wall');
  fillRect(tiles, w, 53, 8, 2, 1, 'castle_wall');

  // Bowser's Bridge (tx 72..84 at ty 8)
  fillRect(tiles, w, 72, 8, 13, 1, 'bridge');
  fillRect(tiles, w, 85, 8, 2, 2, 'castle_wall');

  return {
    id: '1-4',
    name: "World 1-4: Bowser's Castle",
    theme: 'castle',
    widthTiles: w,
    heightTiles: LEVEL_HEIGHT_TILES,
    timeLimit: 300,
    tiles,
    rewards,
    enemies: [{ kind: 'bowser', tx: 80, ty: 6 }],
    coins: [
      { tx: 35, ty: 5 },
      { tx: 36, ty: 5 },
    ],
    platforms: [],
    fireBars: [
      { tx: 31, ty: 7, balls: 5, speed: 1.8 },
      { tx: 45, ty: 8, balls: 5, speed: -2.0 },
      { tx: 63, ty: 7, balls: 6, speed: 2.1 },
    ],
    goalType: 'axe',
    goalTx: 85,
    goalTy: 7,
  };
}

function buildTutorialLevel(): LevelDefinition {
  const w = 44;
  const tiles = createEmptyTiles(w);
  const rewards: Record<string, QuestionReward> = {};

  fillRect(tiles, w, 0, 10, w, 2, 'ground');
  setTile(tiles, w, 10, 6, 'question');
  rewards['10,6'] = 'mushroom';
  setTile(tiles, w, 12, 6, 'brick');
  placePipe(tiles, w, 18, 8);
  placeStair(tiles, w, 30, 3, 1);
  fillRect(tiles, w, 39, 7, 4, 3, 'castle_wall');

  return {
    id: 'tutorial',
    name: 'Practice Course',
    theme: 'overworld',
    widthTiles: w,
    heightTiles: LEVEL_HEIGHT_TILES,
    timeLimit: DEFAULT_TIME_LIMIT,
    tiles,
    rewards,
    enemies: [{ kind: 'goomba', tx: 24, ty: 9 }],
    coins: [
      { tx: 14, ty: 6 },
      { tx: 15, ty: 6 },
    ],
    platforms: [],
    fireBars: [],
    goalType: 'flagpole',
    goalTx: 36,
    goalTy: 9,
  };
}

const LEVEL_BUILDERS: Record<LevelId, () => LevelDefinition> = {
  '1-1': buildWorld1_1,
  '1-2': buildWorld1_2,
  '1-3': buildWorld1_3,
  '1-4': buildWorld1_4,
  tutorial: buildTutorialLevel,
};

export function getLevelDefinition(id: LevelId): LevelDefinition {
  return LEVEL_BUILDERS[id]();
}
