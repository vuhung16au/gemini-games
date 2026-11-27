import {
  BULLET_SIZE,
  CANVAS_SIZE,
  GRID_SUBTILES,
  SUBTILE_PX,
  TANK_SIZE,
} from '../game/constants';
import type {
  BattleState,
  Direction,
  EnemyKind,
  PowerUpKind,
} from '../game/types';

function drawTank(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: Direction,
  bodyColor: string,
  accentColor: string,
  treadColor: string,
  treadPhase: number,
  options?: { stars?: number; shield?: boolean; stunned?: boolean; elapsed?: number },
): void {
  if (options?.stunned && Math.floor((options.elapsed ?? 0) * 14) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.translate(x + TANK_SIZE / 2, y + TANK_SIZE / 2);

  const angle =
    dir === 'up' ? 0 : dir === 'right' ? Math.PI / 2 : dir === 'down' ? Math.PI : -Math.PI / 2;
  ctx.rotate(angle);

  const r = TANK_SIZE / 2;
  const treadOffset = Math.floor(treadPhase) % 2 === 0 ? 0 : 2;

  // Left & Right treads
  ctx.fillStyle = treadColor;
  ctx.fillRect(-r, -r + 1, 6, TANK_SIZE - 2);
  ctx.fillRect(r - 6, -r + 1, 6, TANK_SIZE - 2);

  ctx.fillStyle = '#181818';
  for (let ty = -r + 2 + treadOffset; ty < r - 2; ty += 5) {
    ctx.fillRect(-r, ty, 6, 2);
    ctx.fillRect(r - 6, ty, 6, 2);
  }

  // Main chassis
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-r + 5, -r + 4, TANK_SIZE - 10, TANK_SIZE - 8);

  // Turret & barrel
  ctx.fillStyle = accentColor;
  ctx.fillRect(-6, -6, 12, 12);
  ctx.fillRect(-2, -r - 1, 4, 12);

  // Star tier indicator on turret
  if (options?.stars && options.stars > 0) {
    ctx.fillStyle = '#ffffff';
    for (let s = 0; s < options.stars; s++) {
      ctx.fillRect(-4 + s * 3, 2, 2, 2);
    }
  }

  ctx.restore();

  // Helmet shield ring
  if (options?.shield) {
    const blink = Math.floor((options.elapsed ?? 0) * 16) % 2 === 0;
    ctx.save();
    ctx.strokeStyle = blink ? '#f6e05e' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 1, y - 1, TANK_SIZE + 2, TANK_SIZE + 2);
    ctx.restore();
  }
}

function enemyPalette(kind: EnemyKind, hp: number, bonus: boolean, elapsed: number) {
  if (bonus && Math.floor(elapsed * 8) % 2 === 0) {
    return { body: '#e53e3e', accent: '#feb2b2', tread: '#742a2a' };
  }
  if (kind === 'fast') {
    return { body: '#cbd5e0', accent: '#90cdf4', tread: '#4a5568' };
  }
  if (kind === 'power') {
    return { body: '#d69e2e', accent: '#faf089', tread: '#744210' };
  }
  if (kind === 'armor') {
    if (hp >= 4) return { body: '#38a169', accent: '#9ae6b4', tread: '#22543d' };
    if (hp === 3) return { body: '#d69e2e', accent: '#faf089', tread: '#744210' };
    if (hp === 2) return { body: '#ed8936', accent: '#fbd38d', tread: '#7b341e' };
    return { body: '#e2e8f0', accent: '#a0aec0', tread: '#4a5568' };
  }
  return { body: '#cbd5e0', accent: '#edf2f7', tread: '#4a5568' };
}

function drawPowerUp(
  ctx: CanvasRenderingContext2D,
  kind: PowerUpKind,
  x: number,
  y: number,
  elapsed: number,
): void {
  if (Math.floor(elapsed * 8) % 5 === 0) return; // Classic subtle blink

  ctx.save();
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(x, y, 28, 28);
  ctx.strokeStyle = '#f6e05e';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, 26, 26);

  const labelMap: Record<PowerUpKind, string> = {
    star: '★',
    helmet: '⛑',
    clock: '⏱',
    shovel: '⛏',
    grenade: '💣',
    tank: '1UP',
  };
  ctx.fillStyle = kind === 'star' || kind === 'tank' ? '#f6e05e' : '#ffffff';
  ctx.font = kind === 'tank' ? 'bold 10px monospace' : 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelMap[kind], x + 14, y + 15);
  ctx.restore();
}

export function renderBattleCanvas(ctx: CanvasRenderingContext2D, state: BattleState): void {
  ctx.imageSmoothingEnabled = false;

  // Battlefield void background
  ctx.fillStyle = '#08080a';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const waterBlink = Math.floor(state.elapsed * 3) % 2 === 0;
  const shovelWarning = state.shovelTimer > 0 && state.shovelTimer < 3 && Math.floor(state.elapsed * 8) % 2 === 0;

  // 1. Base terrain pass (brick, steel, water, ice, eagle)
  for (let ty = 0; ty < GRID_SUBTILES; ty++) {
    for (let tx = 0; tx < GRID_SUBTILES; tx++) {
      const kind = state.grid[ty * GRID_SUBTILES + tx];
      const px = tx * SUBTILE_PX;
      const py = ty * SUBTILE_PX;

      if (kind === 'brick') {
        const displaySteel = state.shovelTimer > 0 && !shovelWarning && tx >= 11 && tx <= 14 && ty >= 23;
        if (displaySteel) {
          ctx.fillStyle = '#cbd5e0';
          ctx.fillRect(px, py, SUBTILE_PX, SUBTILE_PX);
        } else {
          ctx.fillStyle = '#b84a27';
          ctx.fillRect(px, py, SUBTILE_PX, SUBTILE_PX);
          ctx.fillStyle = '#6c2411';
          ctx.fillRect(px, py + 7, SUBTILE_PX, 2);
          ctx.fillRect(px + (ty % 2 === 0 ? 7 : 3), py, 2, 8);
          ctx.fillRect(px + (ty % 2 === 0 ? 3 : 11), py + 8, 2, 8);
        }
      } else if (kind === 'steel') {
        ctx.fillStyle = '#a0aec0';
        ctx.fillRect(px, py, SUBTILE_PX, SUBTILE_PX);
        ctx.fillStyle = '#edf2f7';
        ctx.fillRect(px + 3, py + 3, SUBTILE_PX - 6, SUBTILE_PX - 6);
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(px + 1, py + 1, 2, 2);
        ctx.fillRect(px + SUBTILE_PX - 3, py + SUBTILE_PX - 3, 2, 2);
      } else if (kind === 'water') {
        ctx.fillStyle = waterBlink ? '#1e4e8c' : '#2b6cb0';
        ctx.fillRect(px, py, SUBTILE_PX, SUBTILE_PX);
        ctx.fillStyle = '#63b3ed';
        ctx.fillRect(px + (waterBlink ? 2 : 6), py + 4, 6, 2);
        ctx.fillRect(px + (waterBlink ? 8 : 3), py + 11, 5, 2);
      } else if (kind === 'ice') {
        ctx.fillStyle = '#a3bffa';
        ctx.fillRect(px, py, SUBTILE_PX, SUBTILE_PX);
        ctx.fillStyle = '#ebf4ff';
        ctx.fillRect(px + 2, py + 2, 5, 2);
        ctx.fillRect(px + 9, py + 10, 5, 2);
      }
    }
  }

  // Eagle HQ (2x2 subtiles at 12,24)
  const eagleX = 12 * SUBTILE_PX;
  const eagleY = 24 * SUBTILE_PX;
  const eagleDead = state.grid[24 * GRID_SUBTILES + 12] === 'eagle_dead';
  ctx.fillStyle = eagleDead ? '#4a2020' : '#2d3748';
  ctx.fillRect(eagleX, eagleY, 32, 32);
  ctx.fillStyle = eagleDead ? '#a0aec0' : '#f6e05e';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(eagleDead ? '✖' : '🦅', eagleX + 16, eagleY + 17);

  // 2. Spawn stars
  for (const sp of state.pendingSpawns) {
    const pulse = (Math.floor(sp.timer * 10) % 4) * 3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sp.x + 12 - pulse / 2, sp.y + 4, 4 + pulse, 20);
    ctx.fillRect(sp.x + 4, sp.y + 12 - pulse / 2, 20, 4 + pulse);
  }

  // 3. Players
  for (const p of state.players) {
    if (!p.active || !p.alive) continue;
    const isP1 = p.id === 1;
    drawTank(
      ctx,
      p.x,
      p.y,
      p.dir,
      isP1 ? '#e5b822' : '#38a169',
      isP1 ? '#f6e05e' : '#9ae6b4',
      isP1 ? '#975a16' : '#22543d',
      p.treadPhase,
      {
        stars: p.stars,
        shield: p.shieldTimer > 0,
        stunned: p.stunTimer > 0,
        elapsed: state.elapsed,
      },
    );
  }

  // 4. Enemies
  for (const e of state.enemies) {
    const pal = enemyPalette(e.kind, e.hp, e.bonus, state.elapsed);
    drawTank(ctx, e.x, e.y, e.dir, pal.body, pal.accent, pal.tread, e.treadPhase);
  }

  // 5. Bullets
  ctx.fillStyle = '#ffffff';
  for (const b of state.bullets) {
    ctx.fillRect(Math.round(b.x), Math.round(b.y), BULLET_SIZE, BULLET_SIZE);
  }

  // 6. Forest canopy foreground pass (tanks hide underneath)
  for (let ty = 0; ty < GRID_SUBTILES; ty++) {
    for (let tx = 0; tx < GRID_SUBTILES; tx++) {
      if (state.grid[ty * GRID_SUBTILES + tx] !== 'forest') continue;
      const px = tx * SUBTILE_PX;
      const py = ty * SUBTILE_PX;
      ctx.fillStyle = 'rgba(39, 103, 73, 0.88)';
      ctx.fillRect(px + 1, py + 1, SUBTILE_PX - 2, SUBTILE_PX - 2);
      ctx.fillStyle = 'rgba(72, 187, 120, 0.85)';
      ctx.fillRect(px + 3, py + 3, 5, 5);
      ctx.fillRect(px + 9, py + 8, 5, 5);
    }
  }

  // 7. Power-ups, Explosions, Score Popups
  for (const item of state.powerUps) {
    drawPowerUp(ctx, item.kind, item.x, item.y, state.elapsed);
  }

  for (const ex of state.explosions) {
    const prog = ex.timer / ex.duration;
    const radius = (ex.big ? 22 : 10) * Math.sin(prog * Math.PI);
    ctx.fillStyle = prog < 0.5 ? '#fbd38d' : '#e53e3e';
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, Math.max(2, radius), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  for (const pop of state.popups) {
    ctx.fillText(String(pop.value), pop.x, pop.y);
  }
}
