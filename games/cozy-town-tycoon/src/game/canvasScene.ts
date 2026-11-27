import { getDisplayCapacity, hasUpgrade } from './economy';
import {
  BAKER_SPRITE,
  CASHIER_SPRITE,
  COIN_SPRITE,
  CUSTOMER_SPRITES,
  drawSprite,
  PRODUCT_SPRITES,
} from './sprites';
import { CustomerEntity, FloatingText, GameState, ProductId, SteamParticle } from './types';

export const SCENE_WIDTH = 320;
export const SCENE_HEIGHT = 200;

export interface SceneVisualState {
  timeSec: number;
  ovenPulse: number; // 0..1 bounce when tapped
  customers: CustomerEntity[];
  floatingTexts: FloatingText[];
  steam: SteamParticle[];
}

export function renderBakeryScene(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  visual: SceneVisualState
): void {
  ctx.imageSmoothingEnabled = false;

  // 1. Back wall (warm cream & wainscot)
  ctx.fillStyle = '#f6e7cb';
  ctx.fillRect(0, 0, SCENE_WIDTH, 112);

  // Subtle wallpaper vertical stripes
  ctx.fillStyle = '#eed9b7';
  for (let x = 0; x < SCENE_WIDTH; x += 16) {
    ctx.fillRect(x, 0, 4, 90);
  }

  // Lower wooden wainscoting
  ctx.fillStyle = '#b98055';
  ctx.fillRect(0, 90, SCENE_WIDTH, 24);
  ctx.fillStyle = '#8c5a3c';
  ctx.fillRect(0, 90, SCENE_WIDTH, 3);
  ctx.fillRect(0, 112, SCENE_WIDTH, 3);

  // 2. Checkered cozy tile floor
  const tileSize = 16;
  for (let y = 115; y < SCENE_HEIGHT; y += tileSize) {
    for (let x = 0; x < SCENE_WIDTH; x += tileSize) {
      const alt = ((x / tileSize) + Math.floor((y - 115) / tileSize)) % 2 === 0;
      ctx.fillStyle = alt ? '#e8cfa6' : '#d6b485';
      ctx.fillRect(x, y, tileSize, tileSize);
    }
  }

  // 3. Cozy Window (top center-left)
  drawWindow(ctx, 118, 16, visual.timeSec);

  // 4. Shop Sign / Tier 4 Cozy Neon Sign
  drawShopSign(ctx, 210, 18, hasUpgrade(state, 'tier4_cozy_neon'), visual.timeSec);

  // 5. Doorway (right side)
  drawDoor(ctx, 272, 42);

  // 6. Brick Oven (left side — main tap target)
  drawOven(ctx, 18, 36, state, visual.timeSec, visual.ovenPulse);

  // 7. Staff behind counter / oven
  const bob = Math.sin(visual.timeSec * 5) > 0 ? 1 : 0;
  if (state.staff.baker > 0) {
    drawSprite(ctx, BAKER_SPRITE, 84, 72 + bob, 2);
  }
  if (state.staff.cashier > 0) {
    drawSprite(ctx, CASHIER_SPRITE, 198, 74 + (1 - bob), 2);
  }

  // 8. Display Counter & Stocked Pastries
  drawDisplayCounter(ctx, 106, 98, state);

  // 9. Walking Customers
  for (const c of visual.customers) {
    const walkBob = c.state === 'browsing' ? 0 : Math.abs(Math.sin(visual.timeSec * 10 + c.id)) * 2;
    drawSprite(ctx, CUSTOMER_SPRITES[c.variant], c.x, c.y - walkBob, 2);

    // Speech/purchase bubble when browsing or happy
    if (c.happy && c.boughtProduct) {
      ctx.fillStyle = '#fff9ed';
      ctx.fillRect(Math.round(c.x + 2), Math.round(c.y - 18), 18, 13);
      ctx.strokeStyle = '#2c1e1a';
      ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(c.x + 2.5), Math.round(c.y - 17.5), 17, 12);
      drawSprite(ctx, PRODUCT_SPRITES[c.boughtProduct], c.x + 6, c.y - 14, 1);
    }
  }

  // 10. Steam particles above oven
  for (const p of visual.steam) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = `rgba(255, 249, 237, ${(alpha * 0.85).toFixed(2)})`;
    const size = alpha > 0.5 ? 4 : 3;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), size, size);
  }

  // 11. Floating coin/bake texts
  ctx.font = 'bold 8px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  for (const ft of visual.floatingTexts) {
    const alpha = Math.min(1, ft.life / (ft.maxLife * 0.4));
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = '#2c1e1a';
    ctx.fillText(ft.text, Math.round(ft.x) + 1, Math.round(ft.y) + 1);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y));
  }
  ctx.globalAlpha = 1;
}

function drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number, timeSec: number): void {
  // Sky
  ctx.fillStyle = '#8ecae6';
  ctx.fillRect(x + 4, y + 4, 64, 42);

  // Drifting pixel cloud
  const cloudX = x + 8 + Math.floor((timeSec * 4) % 44);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cloudX, y + 12, 16, 6);
  ctx.fillRect(cloudX + 4, y + 8, 8, 4);

  // Distant cozy town roof silhouettes
  ctx.fillStyle = '#d98a4e';
  ctx.fillRect(x + 6, y + 32, 18, 14);
  ctx.fillStyle = '#5c946e';
  ctx.fillRect(x + 42, y + 28, 22, 18);

  // Window wooden frame & crossbars
  ctx.fillStyle = '#7c4d32';
  ctx.fillRect(x, y, 72, 4);
  ctx.fillRect(x, y + 46, 72, 5);
  ctx.fillRect(x, y, 4, 50);
  ctx.fillRect(x + 68, y, 4, 50);
  ctx.fillRect(x + 34, y, 4, 48);
  ctx.fillRect(x, y + 23, 72, 3);

  // Cute striped awning top
  for (let i = 0; i < 72; i += 12) {
    ctx.fillStyle = (i / 12) % 2 === 0 ? '#d94e67' : '#fff9ed';
    ctx.fillRect(x + i, y - 4, 12, 6);
  }
}

function drawShopSign(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  neonUnlocked: boolean,
  timeSec: number
): void {
  ctx.fillStyle = neonUnlocked ? '#2b1e36' : '#5e3a24';
  ctx.fillRect(x, y, 52, 20);
  ctx.strokeStyle = neonUnlocked
    ? Math.sin(timeSec * 6) > 0
      ? '#ff6b9d'
      : '#ffd97d'
    : '#d9a066';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, 50, 18);

  ctx.fillStyle = neonUnlocked ? '#ffd97d' : '#fff9ed';
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAKERY', x + 26, y + 13);
}

function drawDoor(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Door frame
  ctx.fillStyle = '#6e3f28';
  ctx.fillRect(x, y, 36, 72);
  // Door inner
  ctx.fillStyle = '#9c6644';
  ctx.fillRect(x + 4, y + 4, 28, 68);
  // Glass pane
  ctx.fillStyle = '#bde0fe';
  ctx.fillRect(x + 8, y + 10, 20, 26);
  // Brass knob
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x + 26, y + 44, 3, 3);
  // Welcome mat
  ctx.fillStyle = '#b56576';
  ctx.fillRect(x + 2, y + 73, 32, 7);
}

function drawOven(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  state: GameState,
  timeSec: number,
  pulse: number
): void {
  const offsetY = Math.round(pulse * 2);
  const upgradedHearth = hasUpgrade(state, 'tier3_stone_hearth');
  const upgradedIron = hasUpgrade(state, 'tier1_cast_iron_oven');

  // Chimney
  ctx.fillStyle = upgradedHearth ? '#6d6875' : '#9c4a3b';
  ctx.fillRect(x + 20, 0, 24, y + 4);

  // Main oven body
  ctx.fillStyle = upgradedHearth ? '#8d8694' : '#b85c48';
  ctx.fillRect(x, y + offsetY, 64, 78 - offsetY);

  // Brick mortar lines
  ctx.fillStyle = upgradedHearth ? '#5c5763' : '#8a3e2f';
  for (let row = 0; row < 5; row++) {
    ctx.fillRect(x, y + offsetY + row * 15, 64, 2);
  }

  // Iron trim if Tier 1+
  if (upgradedIron) {
    ctx.fillStyle = '#3b373d';
    ctx.fillRect(x - 2, y + offsetY, 68, 5);
    ctx.fillRect(x - 2, y + 73, 68, 5);
  }

  // Oven arch & glowing fire
  ctx.fillStyle = '#2c1e1a';
  ctx.fillRect(x + 12, y + 26 + offsetY, 40, 28);
  ctx.fillRect(x + 16, y + 22 + offsetY, 32, 4);

  // Animated flame inside oven
  const flicker = Math.sin(timeSec * 14) > 0 ? 1 : 0;
  ctx.fillStyle = '#e05a2b';
  ctx.fillRect(x + 16, y + 42 + offsetY - flicker, 32, 12 + flicker);
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x + 22, y + 46 + offsetY + flicker, 20, 8 - flicker);

  // Active product preview baking inside
  drawSprite(ctx, PRODUCT_SPRITES[state.activeProduct], x + 27, y + 34 + offsetY, 1);

  // Subtle "TAP!" badge above oven
  ctx.fillStyle = '#2c1e1a';
  ctx.fillRect(x + 12, y + 6 + offsetY, 40, 12);
  ctx.fillStyle = '#ffd97d';
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAKE!', x + 32, y + 15 + offsetY);
}

function drawDisplayCounter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  state: GameState
): void {
  const warmDisplay = hasUpgrade(state, 'tier2_warm_display');
  const patisserie = hasUpgrade(state, 'tier5_master_patisserie');
  const width = 132;
  const height = 34;

  // Counter base
  ctx.fillStyle = patisserie ? '#7f4f24' : '#a47148';
  ctx.fillRect(x, y + 10, width, height);
  ctx.fillStyle = '#582f0e';
  ctx.fillRect(x, y + 10, width, 3);
  ctx.fillRect(x, y + 10 + height - 3, width, 3);

  // Glass display case
  ctx.fillStyle = warmDisplay ? 'rgba(255, 232, 163, 0.45)' : 'rgba(224, 242, 254, 0.45)';
  ctx.fillRect(x + 6, y - 6, width - 12, 18);
  ctx.strokeStyle = patisserie ? '#f7c948' : '#7c4d32';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 6, y - 6, width - 12, 18);

  // Draw individual stocked pastries inside glass case
  const items: ProductId[] = [];
  (['tart', 'croissant', 'bread'] as ProductId[]).forEach((pid) => {
    for (let i = 0; i < state.stock[pid]; i++) {
      items.push(pid);
    }
  });

  const maxVisible = Math.min(items.length, Math.min(16, getDisplayCapacity(state)));
  for (let i = 0; i < maxVisible; i++) {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const px = x + 11 + col * 14;
    const py = y - 2 + row * 7;
    drawSprite(ctx, PRODUCT_SPRITES[items[i]], px, py, 1);
  }

  // Little register on right end of counter
  ctx.fillStyle = '#4a4e69';
  ctx.fillRect(x + width - 22, y - 4, 16, 14);
  ctx.fillStyle = '#9a8c98';
  ctx.fillRect(x + width - 20, y - 2, 12, 5);
  drawSprite(ctx, COIN_SPRITE, x + width - 17, y + 4, 1);
}
