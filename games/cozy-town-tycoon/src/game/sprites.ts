import { ProductId } from './types';

export type SpriteMatrix = string[];
export type Palette = Record<string, string>;

export const PALETTE: Palette = {
  '.': '',
  k: '#2c1e1a', // dark outline
  w: '#fff9ed', // warm white / chef hat / apron
  s: '#f4c7a1', // skin light
  d: '#d99a74', // skin shadow
  h: '#6e3f28', // brown hair
  r: '#d94e67', // berry red / dress
  b: '#4b7fa8', // denim blue
  g: '#5c946e', // sage green
  y: '#f7c948', // gold / butter / coin
  o: '#e07a3d', // crust orange
  c: '#c87d4b', // bread crust
  m: '#f6d8a6', // crumb / pastry light
  p: '#a3485a', // berry dark
  t: '#8c5a3c', // wood medium
  l: '#ffd97d', // sparkle / coin highlight
};

export const BREAD_SPRITE: SpriteMatrix = [
  '..kkkkkk..',
  '.kcoooock.',
  'koommmmooc',
  'kocmmmmmck',
  'kcccccccck',
  '.kkkkkkkk.',
];

export const CROISSANT_SPRITE: SpriteMatrix = [
  '...kkkk...',
  '.kkyyyykk.',
  'kyyommmoyk',
  'kyomyyymyk',
  '.kkoyyokk.',
  '...kkkk...',
];

export const TART_SPRITE: SpriteMatrix = [
  '..krrprk..',
  '.krprrrpk.',
  'kmmmmmmmmk',
  'kcoooooock',
  '.kcccccck.',
  '..kkkkkk..',
];

export const PRODUCT_SPRITES: Record<ProductId, SpriteMatrix> = {
  bread: BREAD_SPRITE,
  croissant: CROISSANT_SPRITE,
  tart: TART_SPRITE,
};

export const BAKER_SPRITE: SpriteMatrix = [
  '..kwwwwk..',
  '.kwwwwwwk.',
  '.kwwwwwwk.',
  '..kssssk..',
  '.kskssksk.',
  '..kssssk..',
  '.kkwwwwkk.',
  'kwwkwwkwwk',
  'ksskwwkssk',
  '..kwwwwk..',
  '..kbbkbbk.',
  '..kttkttk.',
];

export const CASHIER_SPRITE: SpriteMatrix = [
  '..khhhhk..',
  '.khhhhhhk.',
  '.khsssssk.',
  '.kskssksk.',
  '..kssssk..',
  '.kkggggkk.',
  'kggkwwkggk',
  'ksskwwkssk',
  '..kggggk..',
  '..kbbkbbk.',
  '..kttkttk.',
];

export const CUSTOMER_SPRITES: [SpriteMatrix, SpriteMatrix, SpriteMatrix] = [
  // Variant 0: Red sweater neighbor
  [
    '..khhhhk..',
    '.khsssssk.',
    '.kskssksk.',
    '..kssssk..',
    '.kkrrrrkk.',
    'krrkrrkrrk',
    'ksskrrkssk',
    '..krrrrk..',
    '..kbbkbbk.',
    '..kttkttk.',
  ],
  // Variant 1: Blue coat neighbor
  [
    '..kyyyyk..',
    '.kysssssk.',
    '.kskssksk.',
    '..kssssk..',
    '.kkbbbbkk.',
    'kbbkwwkbbk',
    'ksskwwkssk',
    '..kbbbbk..',
    '..kttkttk.',
    '..kkkkkkk.',
  ],
  // Variant 2: Sage cardigan neighbor
  [
    '..kttttk..',
    '.ktsssssk.',
    '.kskssksk.',
    '..kssssk..',
    '.kkggggkk.',
    'kggkyykggk',
    'ksskyykssk',
    '..kggggk..',
    '..kbbkbbk.',
    '..kttkttk.',
  ],
];

export const COIN_SPRITE: SpriteMatrix = [
  '.kkkk.',
  'kyllkk',
  'kyloyk',
  'kyyoyk',
  '.kkkk.',
];

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  matrix: SpriteMatrix,
  x: number,
  y: number,
  scale = 1,
  palette: Palette = PALETTE
): void {
  const rx = Math.round(x);
  const ry = Math.round(y);
  for (let row = 0; row < matrix.length; row++) {
    const line = matrix[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(rx + col * scale, ry + row * scale, scale, scale);
    }
  }
}
