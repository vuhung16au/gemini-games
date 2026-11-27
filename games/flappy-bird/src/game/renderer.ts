import {
  BIRD_VISUAL_RADIUS,
  FLASH_DURATION,
  GROUND_HEIGHT,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  PIPE_CAP_HEIGHT,
  PIPE_CAP_OVERHANG,
  PIPE_WIDTH,
  PLAYABLE_HEIGHT,
  SHAKE_DURATION,
} from './constants';
import type { GameState, PipePair } from './types';

/** Configure canvas backing store for crisp HiDPI rendering. */
export function configureHiDPICanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): void {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const targetWidth = Math.round(LOGICAL_WIDTH * dpr);
  const targetHeight = Math.round(LOGICAL_HEIGHT * dpr);

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawSky(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createLinearGradient(0, 0, 0, PLAYABLE_HEIGHT);
  grad.addColorStop(0, '#4ec0ca');
  grad.addColorStop(0.75, '#7de2eb');
  grad.addColorStop(1, '#c9f6f8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, PLAYABLE_HEIGHT);
}

function drawCloudCluster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.arc(20, -6, 22, 0, Math.PI * 2);
  ctx.arc(42, 0, 17, 0, Math.PI * 2);
  ctx.arc(20, 6, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawClouds(ctx: CanvasRenderingContext2D, offset: number): void {
  const clouds = [
    { x: 40, y: 95, s: 0.9 },
    { x: 175, y: 65, s: 1.1 },
    { x: 310, y: 120, s: 0.8 },
  ];

  for (const tile of [0, LOGICAL_WIDTH]) {
    for (const c of clouds) {
      drawCloudCluster(ctx, c.x - offset + tile, c.y, c.s);
    }
  }
}

function drawCitySilhouette(
  ctx: CanvasRenderingContext2D,
  offset: number,
): void {
  const buildings = [
    { x: 0, w: 46, h: 78 },
    { x: 44, w: 34, h: 105 },
    { x: 76, w: 52, h: 66 },
    { x: 126, w: 40, h: 118 },
    { x: 164, w: 56, h: 84 },
    { x: 218, w: 38, h: 96 },
    { x: 254, w: 48, h: 70 },
    { x: 300, w: 44, h: 112 },
    { x: 342, w: 58, h: 82 },
  ];

  for (const tile of [0, LOGICAL_WIDTH]) {
    for (const b of buildings) {
      const bx = b.x - offset + tile;
      const by = PLAYABLE_HEIGHT - b.h;
      ctx.fillStyle = '#8ad3cf';
      ctx.fillRect(bx, by, b.w, b.h);
      ctx.fillStyle = '#a7e3df';
      ctx.fillRect(bx + 6, by + 10, 6, 10);
      ctx.fillRect(bx + 18, by + 10, 6, 10);
      ctx.fillRect(bx + 6, by + 28, 6, 10);
      ctx.fillRect(bx + 18, by + 28, 6, 10);
    }
  }
}

function drawPipeSegment(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  if (h <= 0) return;
  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, '#55a630');
  grad.addColorStop(0.22, '#9ef01a');
  grad.addColorStop(0.55, '#70e000');
  grad.addColorStop(1, '#38761d');

  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = '#244f12';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

function drawPipes(ctx: CanvasRenderingContext2D, pipes: PipePair[]): void {
  for (const pipe of pipes) {
    const topBottom = pipe.gapY - pipe.gapHeight / 2;
    const bottomTop = pipe.gapY + pipe.gapHeight / 2;
    const capX = pipe.x - PIPE_CAP_OVERHANG;
    const capW = PIPE_WIDTH + PIPE_CAP_OVERHANG * 2;

    // Top pipe shaft + cap
    drawPipeSegment(ctx, pipe.x, -2, PIPE_WIDTH, topBottom - PIPE_CAP_HEIGHT + 2);
    drawPipeSegment(
      ctx,
      capX,
      topBottom - PIPE_CAP_HEIGHT,
      capW,
      PIPE_CAP_HEIGHT,
    );

    // Bottom pipe cap + shaft
    drawPipeSegment(ctx, capX, bottomTop, capW, PIPE_CAP_HEIGHT);
    drawPipeSegment(
      ctx,
      pipe.x,
      bottomTop + PIPE_CAP_HEIGHT,
      PIPE_WIDTH,
      PLAYABLE_HEIGHT - (bottomTop + PIPE_CAP_HEIGHT),
    );
  }
}

function drawGround(ctx: CanvasRenderingContext2D, offset: number): void {
  const y = PLAYABLE_HEIGHT;

  // Dirt base
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, y, LOGICAL_WIDTH, GROUND_HEIGHT);

  // Subtle dirt shading band
  ctx.fillStyle = '#d0c874';
  ctx.fillRect(0, y + 26, LOGICAL_WIDTH, GROUND_HEIGHT - 26);

  // Grass top strip
  ctx.fillStyle = '#73bf2e';
  ctx.fillRect(0, y, LOGICAL_WIDTH, 18);

  // Scrolling diagonal grass chevrons
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y, LOGICAL_WIDTH, 18);
  ctx.clip();
  ctx.fillStyle = '#9ce659';
  for (let gx = -48; gx < LOGICAL_WIDTH + 48; gx += 24) {
    const sx = gx - (offset % 24);
    ctx.beginPath();
    ctx.moveTo(sx, y + 18);
    ctx.lineTo(sx + 10, y);
    ctx.lineTo(sx + 20, y);
    ctx.lineTo(sx + 10, y + 18);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Top & grass border lines
  ctx.fillStyle = '#533818';
  ctx.fillRect(0, y, LOGICAL_WIDTH, 2);
  ctx.fillStyle = '#558b2f';
  ctx.fillRect(0, y + 18, LOGICAL_WIDTH, 3);
}

function drawParticles(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const p of state.particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = `rgba(255, 250, 230, ${alpha.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (0.5 + 0.5 * alpha), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBird(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { bird } = state;
  const r = BIRD_VISUAL_RADIUS;

  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.rotation);

  // Body
  ctx.fillStyle = '#f7d51d';
  ctx.strokeStyle = '#3b2b10';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, r + 1.5, r - 1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Belly highlight
  ctx.fillStyle = '#fff3a8';
  ctx.beginPath();
  ctx.ellipse(-1, -4, r * 0.65, r * 0.4, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // 3-position animated wing (up, mid, down)
  const wingFrame = Math.floor(bird.wingPhase) % 3;
  const wingYOffset = wingFrame === 0 ? -4 : wingFrame === 1 ? 1 : 5;
  ctx.fillStyle = '#fff8dc';
  ctx.strokeStyle = '#3b2b10';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(-4, wingYOffset, 8, 5.5, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(7, -5, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1d1d1f';
  ctx.beginPath();
  ctx.arc(8.8, -5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#f26419';
  ctx.strokeStyle = '#3b2b10';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(11, -1);
  ctx.lineTo(21, 2);
  ctx.lineTo(11, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/** Render the entire game scene onto the 2D canvas. */
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
): void {
  ctx.save();

  // Damped screen shake on collision
  if (state.shakeTimer > 0) {
    const progress = state.shakeTimer / SHAKE_DURATION;
    const magnitude = 6 * progress;
    const dx = Math.sin(state.elapsed * 90) * magnitude;
    const dy = Math.cos(state.elapsed * 110) * magnitude;
    ctx.translate(dx, dy);
  }

  drawSky(ctx);
  drawClouds(ctx, state.cloudOffset);
  drawCitySilhouette(ctx, state.cityOffset);
  drawPipes(ctx, state.pipes);

  // Contextual flight-corridor Hint overlay
  if (state.hintEnabled && state.phase === 'PLAYING') {
    const nextPipe = state.pipes.find(
      (p) => p.x + PIPE_WIDTH >= state.bird.x - 10,
    );
    if (nextPipe) {
      ctx.save();
      ctx.strokeStyle = '#3c1053';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(
        nextPipe.x - 4,
        nextPipe.gapY - 22,
        PIPE_WIDTH + 8,
        44,
      );
      if (state.bird.y > nextPipe.gapY + 18) {
        ctx.fillStyle = '#3c1053';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FLAP ↑', state.bird.x, state.bird.y - 24);
      }
      ctx.restore();
    }
  }

  drawGround(ctx, state.groundOffset);
  drawParticles(ctx, state);
  drawBird(ctx, state);

  // Brief white impact flash
  if (state.flashTimer > 0) {
    const alpha = (state.flashTimer / FLASH_DURATION) * 0.75;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
    ctx.fillRect(-10, -10, LOGICAL_WIDTH + 20, LOGICAL_HEIGHT + 20);
  }

  ctx.restore();
}
