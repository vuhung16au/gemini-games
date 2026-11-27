import { LEVEL_HEIGHT_TILES, TILE_SIZE, VIEW_HEIGHT, VIEW_WIDTH } from '../game/constants';
import type { EnemyEntity, ItemEntity, MarioState, PlayerEntity } from '../game/types';

function drawBackground(ctx: CanvasRenderingContext2D, state: MarioState): void {
  const skyMap: Record<MarioState['theme'], string> = {
    overworld: '#5c94fc',
    underground: '#0b0c14',
    athletic: '#6ba4ff',
    castle: '#181016',
  };
  ctx.fillStyle = skyMap[state.theme];
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  if (state.theme === 'overworld' || state.theme === 'athletic') {
    // Parallax clouds & distant hills
    const cloudShift = -(state.cameraX * 0.25) % 320;
    ctx.fillStyle = '#ffffff';
    for (let cx = cloudShift; cx < VIEW_WIDTH + 160; cx += 180) {
      ctx.fillRect(cx + 20, 44, 48, 18);
      ctx.fillRect(cx + 30, 34, 28, 12);
    }

    if (state.theme === 'overworld') {
      const hillShift = -(state.cameraX * 0.45) % 280;
      ctx.fillStyle = '#2d8a3e';
      for (let hx = hillShift; hx < VIEW_WIDTH + 200; hx += 280) {
        ctx.beginPath();
        ctx.moveTo(hx, 320);
        ctx.lineTo(hx + 65, 240);
        ctx.lineTo(hx + 130, 320);
        ctx.fill();
      }
    }
  }
}

function drawMario(ctx: CanvasRenderingContext2D, p: PlayerEntity, camX: number, elapsed: number): void {
  if (!p.alive) return;
  if (p.invulnTimer > 0 && Math.floor(elapsed * 16) % 2 === 0) return;

  const sx = Math.round(p.x - camX);
  const sy = Math.round(p.y);
  const drawH = p.crouching ? Math.round(p.height * 0.65) : p.height;
  const drawY = p.crouching ? sy + (p.height - drawH) : sy;

  const starFlash = p.starTimer > 0 && Math.floor(elapsed * 18) % 3 === 0;
  const hatColor = starFlash ? '#f6e05e' : p.form === 'fire' ? '#ffffff' : '#e52521';
  const overallsColor = p.form === 'fire' ? '#e52521' : '#1e50b5';

  ctx.save();
  // Cap
  ctx.fillStyle = hatColor;
  ctx.fillRect(sx + 2, drawY, p.width - 4, 8);
  ctx.fillRect(sx + (p.facing === 1 ? 4 : 0), drawY + 5, p.width - 4, 4);

  // Face
  ctx.fillStyle = '#fbd0a0';
  ctx.fillRect(sx + 3, drawY + 9, p.width - 6, 9);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(sx + (p.facing === 1 ? p.width - 8 : 5), drawY + 11, 3, 3);

  // Overalls & torso
  ctx.fillStyle = overallsColor;
  ctx.fillRect(sx + 3, drawY + 18, p.width - 6, drawH - 22);
  ctx.fillStyle = '#f6e05e';
  ctx.fillRect(sx + 6, drawY + 20, 3, 3);
  ctx.fillRect(sx + p.width - 9, drawY + 20, 3, 3);

  // Boots (stride animation)
  const stride = Math.sin(p.walkPhase * 12) * (Math.abs(p.vx) > 20 ? 3 : 0);
  ctx.fillStyle = '#6b3e1b';
  ctx.fillRect(sx + 2 + stride, drawY + drawH - 5, 8, 5);
  ctx.fillRect(sx + p.width - 10 - stride, drawY + drawH - 5, 8, 5);
  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: EnemyEntity, camX: number, elapsed: number): void {
  const sx = Math.round(e.x - camX);
  const sy = Math.round(e.y);
  if (sx + e.width < -32 || sx > VIEW_WIDTH + 32) return;

  if (e.kind === 'goomba') {
    ctx.fillStyle = '#9c4a1a';
    ctx.fillRect(sx + 2, sy + 2, e.width - 4, 16);
    ctx.fillStyle = '#f6d8b8';
    ctx.fillRect(sx + 6, sy + 16, e.width - 12, 8);
    ctx.fillStyle = '#181818';
    const step = Math.floor(elapsed * 6) % 2 === 0 ? 0 : 2;
    ctx.fillRect(sx + 2 + step, sy + 23, 8, 5);
    ctx.fillRect(sx + e.width - 10 - step, sy + 23, 8, 5);
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + 6, sy + 8, 4, 5);
    ctx.fillRect(sx + e.width - 10, sy + 8, 4, 5);
  } else if (e.kind === 'koopa') {
    ctx.fillStyle = '#2f9e44';
    ctx.fillRect(sx + 3, sy + 10, e.width - 6, 20);
    ctx.fillStyle = '#f6e05e';
    ctx.fillRect(sx + (e.vx < 0 ? 2 : 12), sy + 2, 12, 12);
    ctx.fillRect(sx + 4, sy + 30, 7, 8);
    ctx.fillRect(sx + e.width - 11, sy + 30, 7, 8);
  } else if (e.kind === 'shell') {
    ctx.fillStyle = '#2f9e44';
    ctx.fillRect(sx + 1, sy + 2, e.width - 2, e.height - 2);
    ctx.fillStyle = '#e6fcf5';
    ctx.fillRect(sx + 5, sy + 8, e.width - 10, 4);
  } else if (e.kind === 'piranha') {
    ctx.fillStyle = '#e52521';
    ctx.fillRect(sx + 2, sy, e.width - 4, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + 5, sy + 4, 4, 4);
    ctx.fillRect(sx + e.width - 9, sy + 4, 4, 4);
    ctx.fillStyle = '#2f9e44';
    ctx.fillRect(sx + 8, sy + 18, 10, 14);
  } else if (e.kind === 'bowser') {
    // Bowser boss sprite
    ctx.fillStyle = '#2b8a3e';
    ctx.fillRect(sx + 6, sy + 8, e.width - 12, e.height - 14);
    ctx.fillStyle = '#f6e05e';
    ctx.fillRect(sx + 2, sy + 16, 16, 22);
    // Spikes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + e.width - 10, sy + 10, 6, 6);
    ctx.fillRect(sx + e.width - 10, sy + 22, 6, 6);
    // Horns & eyes
    ctx.fillStyle = '#e52521';
    ctx.fillRect(sx + 4, sy + 18, 5, 4);
  }
}

function drawItem(ctx: CanvasRenderingContext2D, it: ItemEntity, camX: number, elapsed: number): void {
  const sx = Math.round(it.x - camX);
  const sy = Math.round(it.y);
  if (it.kind === 'coin') {
    const narrow = Math.floor(elapsed * 8) % 2 === 0 ? 0 : 3;
    ctx.fillStyle = '#ffd43b';
    ctx.fillRect(sx + narrow, sy, it.width - narrow * 2, it.height);
    ctx.fillStyle = '#f08c00';
    ctx.fillRect(sx + 6, sy + 4, Math.max(2, it.width - 12), it.height - 8);
  } else if (it.kind === 'mushroom' || it.kind === 'oneup') {
    ctx.fillStyle = it.kind === 'oneup' ? '#2f9e44' : '#e52521';
    ctx.fillRect(sx, sy, it.width, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + 4, sy + 4, 5, 5);
    ctx.fillRect(sx + it.width - 9, sy + 4, 5, 5);
    ctx.fillStyle = '#fbd0a0';
    ctx.fillRect(sx + 5, sy + 16, it.width - 10, 12);
  } else if (it.kind === 'flower') {
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(sx + 2, sy, it.width - 4, 14);
    ctx.fillStyle = '#ffd43b';
    ctx.fillRect(sx + 7, sy + 4, it.width - 14, 6);
    ctx.fillStyle = '#2f9e44';
    ctx.fillRect(sx + 10, sy + 14, 6, 14);
  } else if (it.kind === 'star') {
    ctx.fillStyle = Math.floor(elapsed * 12) % 2 === 0 ? '#ffd43b' : '#ffffff';
    ctx.fillRect(sx + 4, sy + 2, it.width - 8, it.height - 4);
    ctx.fillRect(sx, sy + 8, it.width, 10);
  }
}

export function renderMarioCanvas(ctx: CanvasRenderingContext2D, state: MarioState): void {
  ctx.imageSmoothingEnabled = false;
  drawBackground(ctx, state);

  const camX = Math.floor(state.cameraX);
  const startTx = Math.max(0, Math.floor(camX / TILE_SIZE));
  const endTx = Math.min(state.widthTiles - 1, Math.ceil((camX + VIEW_WIDTH) / TILE_SIZE));
  const qBlink = Math.floor(state.elapsed * 5) % 2 === 0;

  // Draw Piranha plants behind pipes first
  for (const e of state.enemies) {
    if (e.kind === 'piranha') drawEnemy(ctx, e, camX, state.elapsed);
  }

  // Draw Tiles
  for (let ty = 0; ty < LEVEL_HEIGHT_TILES; ty++) {
    for (let tx = startTx; tx <= endTx; tx++) {
      const kind = state.tiles[ty * state.widthTiles + tx];
      if (kind === 'empty' || kind === 'hidden_1up') continue;
      const sx = tx * TILE_SIZE - camX;
      const sy = ty * TILE_SIZE;

      if (kind === 'ground') {
        ctx.fillStyle =
          state.theme === 'underground' ? '#1c4d7a' : state.theme === 'castle' ? '#595968' : '#b85a27';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle =
          state.theme === 'overworld' ? '#40a032' : state.theme === 'underground' ? '#2c74b3' : '#777788';
        ctx.fillRect(sx, sy, TILE_SIZE, 6);
      } else if (kind === 'brick') {
        ctx.fillStyle = state.theme === 'underground' ? '#2b5f8f' : '#c85a32';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(sx, sy + 15, TILE_SIZE, 2);
        ctx.fillRect(sx + 15, sy, 2, 16);
        ctx.fillRect(sx + 7, sy + 16, 2, 16);
      } else if (kind === 'question') {
        ctx.fillStyle = qBlink ? '#f59f00' : '#d97706';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#5c3400';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx + 1, sy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        ctx.fillStyle = '#fff3bf';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', sx + 16, sy + 17);
      } else if (kind === 'used') {
        ctx.fillStyle = '#7c5338';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#3d2516';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx + 1, sy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      } else if (kind === 'pipe_tl' || kind === 'pipe_tr' || kind === 'pipe_bl' || kind === 'pipe_br') {
        ctx.fillStyle = '#2f9e44';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#69db7c';
        ctx.fillRect(sx + 4, sy, 6, TILE_SIZE);
        if (kind === 'pipe_tl' || kind === 'pipe_tr') {
          ctx.strokeStyle = '#14532d';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 1, sy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        }
      } else if (kind === 'hard' || kind === 'castle_wall') {
        ctx.fillStyle = kind === 'castle_wall' ? '#646874' : '#9c4a1a';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#222226';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx + 1, sy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      } else if (kind === 'bridge') {
        ctx.fillStyle = '#d98a2b';
        ctx.fillRect(sx, sy, TILE_SIZE, 14);
        ctx.fillStyle = '#7c3f0e';
        ctx.fillRect(sx, sy + 6, TILE_SIZE, 3);
      } else if (kind === 'lava') {
        ctx.fillStyle = qBlink ? '#f03e3e' : '#e8590c';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#ffd43b';
        ctx.fillRect(sx + 4, sy + 2, 10, 4);
      }
    }
  }

  // Moving Platforms
  ctx.fillStyle = '#e67700';
  for (const pl of state.platforms) {
    ctx.fillRect(Math.round(pl.x - camX), Math.round(pl.y), pl.width, pl.height);
    ctx.fillStyle = '#fff3bf';
    ctx.fillRect(Math.round(pl.x - camX), Math.round(pl.y), pl.width, 3);
    ctx.fillStyle = '#e67700';
  }

  // Goal (Flagpole or Castle Axe)
  const gx = state.goalX - camX;
  if (state.goalType === 'flagpole') {
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(gx + 13, 96, 6, state.goalY - 96);
    ctx.fillStyle = '#2f9e44';
    ctx.beginPath();
    ctx.arc(gx + 16, 92, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e52521';
    ctx.fillRect(gx - 12, 104, 26, 18);
  } else {
    ctx.fillStyle = '#ffd43b';
    ctx.fillRect(gx + 6, state.goalY + 4, 20, 14);
    ctx.fillStyle = '#adb5bd';
    ctx.fillRect(gx + 14, state.goalY + 14, 4, 16);
  }

  // Fire Bars
  for (const fb of state.fireBars) {
    for (let b = 1; b <= fb.length; b++) {
      const bx = fb.cx + Math.cos(fb.angle) * (b * 16) - camX;
      const by = fb.cy + Math.sin(fb.angle) * (b * 16);
      ctx.fillStyle = qBlink ? '#ff922b' : '#f03e3e';
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Items
  for (const it of state.items) {
    drawItem(ctx, it, camX, state.elapsed);
  }

  // Enemies (non-piranha)
  for (const e of state.enemies) {
    if (e.kind !== 'piranha') drawEnemy(ctx, e, camX, state.elapsed);
  }

  // Fireballs
  for (const fb of state.fireballs) {
    ctx.fillStyle = fb.owner === 'player' ? '#ff922b' : '#f03e3e';
    ctx.beginPath();
    ctx.arc(fb.x - camX + 5, fb.y + 5, fb.owner === 'player' ? 5 : 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Player
  drawMario(ctx, state.players[0], camX, state.elapsed);

  // Particles & Score Popups
  for (const pt of state.particles) {
    ctx.fillStyle = pt.color;
    ctx.fillRect(Math.round(pt.x - camX), Math.round(pt.y), 8, 8);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  for (const pp of state.popups) {
    ctx.fillText(pp.text, pp.x - camX, pp.y);
  }
}
