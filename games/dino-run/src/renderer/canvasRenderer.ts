import { THEME_COLORS } from '../../../../styles/theme';
import {
  DINO_X,
  GROUND_Y,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  PIXEL_SCALE,
} from '../game/constants';
import type { DinoObstacle, DinoState } from '../game/types';

const DINO_IDLE = [
  '..........########..',
  '.........##########.',
  '.........##.#######.',
  '.........##########.',
  '.........##########.',
  '.........#####......',
  '.........########...',
  '........######......',
  '#......#######......',
  '#.....#########.....',
  '##...###########....',
  '###.############.#..',
  '################.#..',
  '.###############....',
  '..#############.....',
  '...###########......',
  '....#########.......',
  '.....###..##........',
  '.....##...##........',
  '.....##...##........',
  '.....###..###.......',
  '....................',
];

const DINO_RUN_1 = [
  '..........########..',
  '.........##########.',
  '.........##.#######.',
  '.........##########.',
  '.........##########.',
  '.........#####......',
  '.........########...',
  '........######......',
  '#......#######......',
  '#.....#########.....',
  '##...###########....',
  '###.############.#..',
  '################.#..',
  '.###############....',
  '..#############.....',
  '...###########......',
  '....#########.......',
  '.....###..##........',
  '.....##...###.......',
  '.....##.............',
  '.....###............',
  '....................',
];

const DINO_RUN_2 = [
  '..........########..',
  '.........##########.',
  '.........##.#######.',
  '.........##########.',
  '.........##########.',
  '.........#####......',
  '.........########...',
  '........######......',
  '#......#######......',
  '#.....#########.....',
  '##...###########....',
  '###.############.#..',
  '################.#..',
  '.###############....',
  '..#############.....',
  '...###########......',
  '....#########.......',
  '.....###..##........',
  '.....###..##........',
  '..........##........',
  '..........###.......',
  '....................',
];

const DINO_CRASHED = [
  '..........########..',
  '.........#..#######.',
  '.........#.########.',
  '.........#..#######.',
  '.........##########.',
  '.........####.......',
  '.........########...',
  '........######......',
  '#......#######......',
  '#.....#########.....',
  '##...###########....',
  '###.############.#..',
  '################.#..',
  '.###############....',
  '..#############.....',
  '...###########......',
  '....#########.......',
  '.....###..##........',
  '.....##...##........',
  '.....##...##........',
  '.....###..###.......',
  '....................',
];

const DINO_DUCK_1 = [
  '................########..',
  '...............##########.',
  '#.....########.##.#######.',
  '##..#####################.',
  '#########################.',
  '.########################.',
  '..##################......',
  '...################.......',
  '.....######..###..........',
  '.....##.......##..........',
  '.....##.......###.........',
  '.....###..................',
  '..........................',
];

const DINO_DUCK_2 = [
  '................########..',
  '...............##########.',
  '#.....########.##.#######.',
  '##..#####################.',
  '#########################.',
  '.########################.',
  '..##################......',
  '...################.......',
  '.....######..###..........',
  '.....###......##..........',
  '..............##..........',
  '..............###.........',
  '..........................',
];

function drawSprite(
  ctx: CanvasRenderingContext2D,
  grid: string[],
  x: number,
  y: number,
  color: string,
): void {
  ctx.fillStyle = color;
  const rx = Math.round(x);
  const ry = Math.round(y);
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    for (let col = 0; col < line.length; col++) {
      if (line[col] === '#') {
        ctx.fillRect(rx + col * PIXEL_SCALE, ry + row * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
      }
    }
  }
}

function drawGradCap(
  ctx: CanvasRenderingContext2D,
  capX: number,
  capY: number,
  fg: string,
  danger: string,
): void {
  ctx.fillStyle = fg;
  ctx.fillRect(Math.round(capX), Math.round(capY), 22, 4);
  ctx.fillRect(Math.round(capX + 5), Math.round(capY + 4), 12, 3);
  ctx.fillStyle = danger;
  ctx.fillRect(Math.round(capX + 19), Math.round(capY + 3), 2, 7);
}

function drawCactus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
): void {
  ctx.fillStyle = color;
  const rx = Math.round(x);
  const ry = Math.round(y);
  // Central trunk
  ctx.fillRect(rx + Math.floor(w * 0.35), ry, Math.max(6, Math.floor(w * 0.3)), h);
  // Left arm
  ctx.fillRect(rx, ry + Math.floor(h * 0.28), Math.floor(w * 0.35), Math.floor(h * 0.16));
  ctx.fillRect(rx, ry + Math.floor(h * 0.14), Math.max(4, Math.floor(w * 0.22)), Math.floor(h * 0.3));
  // Right arm
  ctx.fillRect(rx + Math.floor(w * 0.65), ry + Math.floor(h * 0.38), Math.floor(w * 0.35), Math.floor(h * 0.16));
  ctx.fillRect(rx + Math.floor(w * 0.78), ry + Math.floor(h * 0.22), Math.max(4, Math.floor(w * 0.22)), Math.floor(h * 0.32));
}

function drawPterodactyl(
  ctx: CanvasRenderingContext2D,
  obs: DinoObstacle,
  animFrame: 0 | 1,
  color: string,
  accent: string,
): void {
  const x = Math.round(obs.x);
  const y = Math.round(obs.y);
  ctx.fillStyle = color;
  // Body + beak
  ctx.fillRect(x, y + 8, 12, 5);
  ctx.fillRect(x + 10, y + 9, 22, 7);
  ctx.fillRect(x + 30, y + 11, 10, 3);
  // Flapping wing
  ctx.fillStyle = accent;
  if (animFrame === 0) {
    ctx.fillRect(x + 14, y, 10, 9);
  } else {
    ctx.fillRect(x + 14, y + 16, 10, 8);
  }
}

function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obs: DinoObstacle,
  animFrame: 0 | 1,
  fg: string,
  accent: string,
  danger: string,
  white: string,
): void {
  if (obs.kind === 'cactus_small' || obs.kind === 'cactus_tall') {
    drawCactus(ctx, obs.x, obs.y, obs.width, obs.height, accent);
    return;
  }
  if (obs.kind === 'cactus_cluster') {
    drawCactus(ctx, obs.x, obs.y + 4, 20, obs.height - 4, accent);
    drawCactus(ctx, obs.x + 22, obs.y, 24, obs.height, accent);
    return;
  }
  if (obs.kind === 'pterodactyl') {
    drawPterodactyl(ctx, obs, animFrame, fg, danger);
    return;
  }

  // 404 Math Proof Runner obstacles
  const x = Math.round(obs.x);
  const y = Math.round(obs.y);
  if (obs.kind === 'flyingSign') {
    ctx.fillStyle = danger;
    ctx.beginPath();
    ctx.roundRect(x, y, obs.width, obs.height, 6);
    ctx.fill();
    ctx.fillStyle = fg;
    const wingY = animFrame === 0 ? y - 5 : y + 4;
    ctx.fillRect(x + 4, wingY, 8, 3);
    ctx.fillRect(x + obs.width - 12, wingY, 8, 3);
    ctx.fillStyle = white;
    ctx.font = 'bold 14px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obs.label, x + obs.width / 2, y + obs.height / 2 + 1);
    ctx.textBaseline = 'alphabetic';
    return;
  }

  ctx.fillStyle = obs.kind === 'integral' ? accent : fg;
  ctx.beginPath();
  ctx.roundRect(x, y, obs.width, obs.height, 4);
  ctx.fill();
  ctx.strokeStyle = white;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 2.5, y + 2.5, obs.width - 5, obs.height - 5);
  ctx.fillStyle = white;
  ctx.font =
    obs.kind === 'matrix'
      ? 'bold 12px ui-monospace, monospace'
      : 'bold 18px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(obs.label, x + obs.width / 2, y + obs.height / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

function formatScore(value: number): string {
  return String(Math.min(99999, Math.floor(value))).padStart(5, '0');
}

export function renderDinoCanvas(
  ctx: CanvasRenderingContext2D,
  state: DinoState,
  showTimingHint: boolean,
): void {
  ctx.imageSmoothingEnabled = false;

  const night = state.isNight;
  const bg = night ? '#201b24' : THEME_COLORS.softivory;
  const fg = night ? '#ede9e3' : THEME_COLORS.deepcharcoal;
  const muted = night ? '#8d8694' : THEME_COLORS.warmstone;
  const accent = night ? '#c084fc' : THEME_COLORS.bookpurple;
  const danger = THEME_COLORS.bookred;
  const white = THEME_COLORS.bookwhite;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  if (state.theme === 'math404') {
    // Subtle graph paper grid & floating formulas
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = muted;
    ctx.lineWidth = 1;
    for (let gx = 20; gx < LOGICAL_WIDTH; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, GROUND_Y);
      ctx.stroke();
    }
    for (let gy = 22; gy < GROUND_Y; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(LOGICAL_WIDTH, gy);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.44;
    ctx.fillStyle = muted;
    ctx.font = 'italic 11px Georgia, serif';
    ctx.textAlign = 'left';
    for (const f of state.formulas) {
      ctx.fillText(f.text, Math.round(f.x), Math.round(f.y));
    }
    ctx.restore();
  } else {
    // Classic desert clouds & optional night stars/moon
    if (night) {
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(LOGICAL_WIDTH - 90, 42, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(LOGICAL_WIDTH - 85, 40, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = night ? 'rgba(255,255,255,0.16)' : 'rgba(145,139,131,0.35)';
    for (const c of state.clouds) {
      ctx.fillRect(Math.round(c.x), Math.round(c.y), c.width, 10);
      ctx.fillRect(Math.round(c.x + 8), Math.round(c.y - 6), c.width - 16, 8);
    }
  }

  // Horizon line + scrolling pebbles/ticks
  ctx.fillStyle = accent;
  ctx.fillRect(0, GROUND_Y, LOGICAL_WIDTH, 2);
  ctx.fillStyle = muted;
  for (const tx of state.groundTicks) {
    ctx.fillRect(Math.round(tx), GROUND_Y + 4, state.theme === 'math404' ? 2 : 5, state.theme === 'math404' ? 5 : 2);
  }
  if (state.theme === 'math404') {
    ctx.font = 'italic 11px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText('x →', LOGICAL_WIDTH - 10, GROUND_Y + 18);
  }

  // Obstacles
  for (const obs of state.obstacles) {
    drawObstacle(ctx, obs, state.animFrame, fg, accent, danger, white);
  }

  // Visual timing hint marker when Hint is active
  if (showTimingHint && state.status === 'running') {
    const nextObs = state.obstacles.find((o) => o.x + o.width > DINO_X && o.x < DINO_X + 190);
    if (nextObs) {
      const isHigh = (nextObs.kind === 'pterodactyl' || nextObs.kind === 'flyingSign') && nextObs.y < 145;
      ctx.fillStyle = danger;
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isHigh ? 'DUCK ↓' : 'JUMP ↑', DINO_X + 20, state.dinoY - 12);
    }
  }

  // T-Rex sprite
  let dinoGrid = DINO_IDLE;
  let dinoColor = accent;
  let capX = DINO_X + 19;
  const capY = state.dinoY - 5;

  if (state.status === 'gameover') {
    dinoGrid = DINO_CRASHED;
    dinoColor = danger;
  } else if (state.status === 'running') {
    if (!state.isGrounded) {
      dinoGrid = DINO_IDLE;
    } else if (state.isDucking) {
      dinoGrid = state.animFrame === 0 ? DINO_DUCK_1 : DINO_DUCK_2;
      capX = DINO_X + 30;
    } else {
      dinoGrid = state.animFrame === 0 ? DINO_RUN_1 : DINO_RUN_2;
    }
  }

  drawSprite(ctx, dinoGrid, DINO_X, state.dinoY, dinoColor);
  if (state.theme === 'math404') {
    drawGradCap(ctx, capX, capY, fg, danger);
  }

  // Scoreboard
  ctx.font = 'bold 13px ui-monospace, monospace';
  ctx.textAlign = 'right';
  if (state.highScore > 0) {
    ctx.fillStyle = muted;
    ctx.fillText(`HI ${formatScore(state.highScore)}`, LOGICAL_WIDTH - 86, 26);
  }
  ctx.fillStyle = state.milestoneFlashTimer > 0 ? danger : accent;
  ctx.fillText(formatScore(state.score), LOGICAL_WIDTH - 16, 26);
}
