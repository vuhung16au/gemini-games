import {
  COYOTE_TIME,
  FRICTION,
  GRAVITY,
  INVULN_DURATION,
  JUMP_VELOCITY,
  MAX_FALL_SPEED,
  RUN_ACCEL,
  RUN_MAX_SPEED,
  SMALL_HEIGHT,
  SMALL_WIDTH,
  STAR_DURATION,
  STOMP_BOUNCE_VELOCITY,
  SUPER_HEIGHT,
  SUPER_WIDTH,
  TILE_SIZE,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  WALK_ACCEL,
  WALK_MAX_SPEED,
} from './constants';
import { getLevelDefinition } from './levels';
import type {
  EnemyEntity,
  LevelId,
  MarioForm,
  MarioState,
  PlayerEntity,
  PlayerInput,
  TileKind,
} from './types';

function isSolidTile(kind: TileKind): boolean {
  return (
    kind === 'ground' ||
    kind === 'brick' ||
    kind === 'question' ||
    kind === 'used' ||
    kind === 'pipe_tl' ||
    kind === 'pipe_tr' ||
    kind === 'pipe_bl' ||
    kind === 'pipe_br' ||
    kind === 'hard' ||
    kind === 'bridge' ||
    kind === 'castle_wall'
  );
}

function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function makePlayer(form: MarioForm = 'small', lives = 3, score = 0, coins = 0): PlayerEntity {
  const height = form === 'small' ? SMALL_HEIGHT : SUPER_HEIGHT;
  return {
    id: 1,
    x: 2 * TILE_SIZE,
    y: 10 * TILE_SIZE - height,
    vx: 0,
    vy: 0,
    width: form === 'small' ? SMALL_WIDTH : SUPER_WIDTH,
    height,
    facing: 1,
    form,
    onGround: true,
    crouching: false,
    coyoteTimer: 0,
    starTimer: 0,
    invulnTimer: 0,
    stompCombo: 0,
    walkPhase: 0,
    alive: true,
    lives,
    score,
    coins,
  };
}

export function createMarioState(
  levelId: LevelId = '1-1',
  options?: { highScore?: number; carryPlayer?: PlayerEntity },
): MarioState {
  const def = getLevelDefinition(levelId);
  let uid = 1;

  const enemies: EnemyEntity[] = def.enemies.map((spec) => {
    if (spec.kind === 'bowser') {
      return {
        uid: uid++,
        kind: 'bowser',
        x: spec.tx * TILE_SIZE,
        y: spec.ty * TILE_SIZE - 16,
        vx: -42,
        vy: 0,
        width: 48,
        height: 48,
        alive: true,
        hp: 5,
        timer: 1.4,
      };
    }
    if (spec.kind === 'piranha') {
      const baseY = spec.ty * TILE_SIZE;
      return {
        uid: uid++,
        kind: 'piranha',
        x: spec.tx * TILE_SIZE + 18,
        y: baseY,
        vx: 0,
        vy: 0,
        width: 26,
        height: 32,
        alive: true,
        hp: 1,
        baseY,
        timer: 0,
      };
    }
    if (spec.kind === 'koopa') {
      return {
        uid: uid++,
        kind: 'koopa',
        x: spec.tx * TILE_SIZE,
        y: spec.ty * TILE_SIZE - 8,
        vx: -54,
        vy: 0,
        width: 26,
        height: 38,
        alive: true,
        hp: 1,
      };
    }
    return {
      uid: uid++,
      kind: 'goomba',
      x: spec.tx * TILE_SIZE,
      y: spec.ty * TILE_SIZE + 2,
      vx: -48,
      vy: 0,
      width: 26,
      height: 28,
      alive: true,
      hp: 1,
    };
  });

  const items = def.coins.map((c) => ({
    uid: uid++,
    kind: 'coin' as const,
    x: c.tx * TILE_SIZE + 6,
    y: c.ty * TILE_SIZE + 4,
    vx: 0,
    vy: 0,
    width: 20,
    height: 24,
  }));

  const platforms = def.platforms.map((p) => {
    const startX = p.tx * TILE_SIZE;
    const startY = p.ty * TILE_SIZE;
    const min = p.axis === 'x' ? startX : startY - p.rangeTiles * TILE_SIZE;
    const max = p.axis === 'x' ? startX + p.rangeTiles * TILE_SIZE : startY;
    return {
      uid: uid++,
      x: startX,
      y: startY,
      width: p.widthTiles * TILE_SIZE,
      height: 14,
      axis: p.axis,
      min,
      max,
      speed: p.speed,
      dir: (p.axis === 'x' ? 1 : -1) as 1 | -1,
      dx: 0,
      dy: 0,
    };
  });

  const fireBars = def.fireBars.map((fb) => ({
    uid: uid++,
    cx: fb.tx * TILE_SIZE + TILE_SIZE / 2,
    cy: fb.ty * TILE_SIZE + TILE_SIZE / 2,
    length: fb.balls,
    angle: 0,
    speed: fb.speed,
  }));

  const player = options?.carryPlayer
    ? makePlayer(
        options.carryPlayer.form,
        options.carryPlayer.lives,
        options.carryPlayer.score,
        options.carryPlayer.coins,
      )
    : makePlayer();

  return {
    levelId: def.id,
    theme: def.theme,
    phase: 'playing',
    isTutorial: def.id === 'tutorial',
    widthTiles: def.widthTiles,
    heightTiles: def.heightTiles,
    tiles: [...def.tiles],
    rewards: { ...def.rewards },
    players: [player],
    enemies,
    items,
    fireballs: [],
    platforms,
    fireBars,
    particles: [],
    popups: [],
    goalType: def.goalType,
    goalX: def.goalTx * TILE_SIZE,
    goalY: def.goalTy * TILE_SIZE,
    bridgeCollapsing: false,
    cameraX: 0,
    timeLeft: def.timeLimit,
    highScore: options?.highScore ?? 0,
    blocksHit: 0,
    mushroomsCollected: 0,
    enemiesStomped: 0,
    nextUid: uid,
    elapsed: 0,
    soundQueue: [],
  };
}

export function createTutorialMarioState(highScore = 0): MarioState {
  return createMarioState('tutorial', { highScore });
}

function addScore(state: MarioState, p: PlayerEntity, pts: number, x: number, y: number, label?: string): void {
  p.score += pts;
  state.highScore = Math.max(state.highScore, p.score);
  state.popups.push({
    uid: state.nextUid++,
    x,
    y,
    text: label ?? String(pts),
    timer: 0.75,
  });
}

function addCoin(state: MarioState, p: PlayerEntity, x: number, y: number): void {
  p.coins += 1;
  if (p.coins >= 100) {
    p.coins -= 100;
    p.lives += 1;
    state.soundQueue.push('oneup');
    addScore(state, p, 0, x, y - 10, '1UP');
  } else {
    state.soundQueue.push('coin');
  }
  addScore(state, p, 200, x, y);
}

function setPlayerForm(p: PlayerEntity, nextForm: MarioForm): void {
  if (p.form === nextForm) return;
  const bottom = p.y + p.height;
  p.form = nextForm;
  p.width = nextForm === 'small' ? SMALL_WIDTH : SUPER_WIDTH;
  p.height = nextForm === 'small' ? SMALL_HEIGHT : SUPER_HEIGHT;
  p.y = bottom - p.height;
}

function damagePlayer(state: MarioState, p: PlayerEntity): void {
  if (p.starTimer > 0 || p.invulnTimer > 0 || !p.alive) return;
  if (p.form !== 'small') {
    setPlayerForm(p, 'small');
    p.invulnTimer = INVULN_DURATION;
    state.soundQueue.push('hurt');
    return;
  }
  p.alive = false;
  p.lives = Math.max(0, p.lives - 1);
  state.soundQueue.push('hurt');
  if (p.lives <= 0) {
    state.phase = 'game_over';
    state.soundQueue.push('game_over');
  } else {
    // Respawn cleanly at start of current level
    const fresh = makePlayer('small', p.lives, p.score, p.coins);
    state.players[0] = fresh;
    state.cameraX = 0;
  }
}

function hitBlockFromBelow(state: MarioState, p: PlayerEntity, tx: number, ty: number): void {
  const idx = ty * state.widthTiles + tx;
  const kind = state.tiles[idx];
  const wx = tx * TILE_SIZE + 16;
  const wy = ty * TILE_SIZE;

  if (kind === 'question' || kind === 'hidden_1up') {
    state.tiles[idx] = 'used';
    state.blocksHit += 1;
    const reward = state.rewards[`${tx},${ty}`] ?? 'coin';
    if (reward === 'coin') {
      addCoin(state, p, wx, wy - 8);
    } else if (reward === 'mushroom') {
      const itemKind = p.form === 'small' ? 'mushroom' : 'flower';
      state.items.push({
        uid: state.nextUid++,
        kind: itemKind,
        x: tx * TILE_SIZE + 3,
        y: (ty - 1) * TILE_SIZE + 2,
        vx: itemKind === 'mushroom' ? 68 : 0,
        vy: 0,
        width: 26,
        height: 28,
      });
      state.soundQueue.push('bump');
    } else if (reward === 'star') {
      state.items.push({
        uid: state.nextUid++,
        kind: 'star',
        x: tx * TILE_SIZE + 3,
        y: (ty - 1) * TILE_SIZE + 2,
        vx: 85,
        vy: -180,
        width: 26,
        height: 28,
      });
      state.soundQueue.push('bump');
    } else if (reward === 'oneup') {
      state.items.push({
        uid: state.nextUid++,
        kind: 'oneup',
        x: tx * TILE_SIZE + 3,
        y: (ty - 1) * TILE_SIZE + 2,
        vx: 68,
        vy: 0,
        width: 26,
        height: 28,
      });
      state.soundQueue.push('bump');
    }
  } else if (kind === 'brick') {
    state.blocksHit += 1;
    if (p.form === 'small') {
      state.soundQueue.push('bump');
    } else {
      state.tiles[idx] = 'empty';
      p.score += 50;
      state.highScore = Math.max(state.highScore, p.score);
      state.soundQueue.push('brick');
      for (let i = 0; i < 4; i++) {
        state.particles.push({
          uid: state.nextUid++,
          x: wx,
          y: wy + 8,
          vx: (i % 2 === 0 ? -1 : 1) * (65 + i * 18),
          vy: -220 - (i < 2 ? 70 : 0),
          color: '#c85a32',
          timer: 0.65,
        });
      }
    }
  } else {
    state.soundQueue.push('bump');
  }

  // Knock out enemies standing directly on top of the bumped block
  for (const e of state.enemies) {
    if (!e.alive || e.kind === 'piranha' || e.kind === 'bowser') continue;
    if (rectsOverlap(e.x, e.y, e.width, e.height, tx * TILE_SIZE, (ty - 1) * TILE_SIZE - 4, TILE_SIZE, TILE_SIZE)) {
      e.alive = false;
      addScore(state, p, 100, e.x + 12, e.y);
      state.soundQueue.push('stomp');
    }
  }
}

function resolveEntityTilesX(
  tiles: TileKind[],
  widthTiles: number,
  heightTiles: number,
  entity: { x: number; y: number; vx: number; width: number; height: number },
): boolean {
  let hitWall = false;
  const minTy = Math.max(0, Math.floor((entity.y + 2) / TILE_SIZE));
  const maxTy = Math.min(heightTiles - 1, Math.floor((entity.y + entity.height - 2) / TILE_SIZE));
  const minTx = Math.max(0, Math.floor(entity.x / TILE_SIZE));
  const maxTx = Math.min(widthTiles - 1, Math.floor((entity.x + entity.width - 0.01) / TILE_SIZE));

  for (let ty = minTy; ty <= maxTy; ty++) {
    for (let tx = minTx; tx <= maxTx; tx++) {
      if (isSolidTile(tiles[ty * widthTiles + tx])) {
        if (entity.vx > 0) {
          entity.x = tx * TILE_SIZE - entity.width;
        } else if (entity.vx < 0) {
          entity.x = (tx + 1) * TILE_SIZE;
        }
        entity.vx = 0;
        hitWall = true;
      }
    }
  }
  return hitWall;
}

export function stepMario(
  prevState: MarioState,
  input: PlayerInput,
  rawDt: number,
): MarioState {
  if (prevState.phase !== 'playing') return prevState;
  const dt = Math.min(0.05, Math.max(0, rawDt));

  const state: MarioState = {
    ...prevState,
    tiles: [...prevState.tiles],
    players: prevState.players.map((p) => ({ ...p })),
    enemies: prevState.enemies.map((e) => ({ ...e })),
    items: prevState.items.map((it) => ({ ...it })),
    fireballs: prevState.fireballs.map((fb) => ({ ...fb })),
    platforms: prevState.platforms.map((pl) => ({ ...pl })),
    fireBars: prevState.fireBars.map((fb) => ({ ...fb })),
    particles: prevState.particles.map((pt) => ({ ...pt })),
    popups: prevState.popups.map((pp) => ({ ...pp })),
    soundQueue: [],
    elapsed: prevState.elapsed + dt,
  };

  const p = state.players[0];

  // Countdown timer
  state.timeLeft = Math.max(0, state.timeLeft - dt * 1.4);
  if (state.timeLeft <= 0 && p.alive) {
    p.form = 'small';
    damagePlayer(state, p);
    return state;
  }

  // Update moving platforms
  for (const pl of state.platforms) {
    const prevX = pl.x;
    const prevY = pl.y;
    if (pl.axis === 'x') {
      pl.x += pl.speed * pl.dir * dt;
      if (pl.x >= pl.max) {
        pl.x = pl.max;
        pl.dir = -1;
      } else if (pl.x <= pl.min) {
        pl.x = pl.min;
        pl.dir = 1;
      }
    } else {
      pl.y += pl.speed * pl.dir * dt;
      if (pl.y >= pl.max) {
        pl.y = pl.max;
        pl.dir = -1;
      } else if (pl.y <= pl.min) {
        pl.y = pl.min;
        pl.dir = 1;
      }
    }
    pl.dx = pl.x - prevX;
    pl.dy = pl.y - prevY;
  }

  // Update Fire Bars
  for (const fb of state.fireBars) {
    fb.angle += fb.speed * dt;
  }

  // Player timers & horizontal physics
  if (p.starTimer > 0) p.starTimer = Math.max(0, p.starTimer - dt);
  if (p.invulnTimer > 0) p.invulnTimer = Math.max(0, p.invulnTimer - dt);

  p.crouching = input.crouch && p.form !== 'small' && p.onGround;

  const maxSpeed = input.run ? RUN_MAX_SPEED : WALK_MAX_SPEED;
  const accel = input.run ? RUN_ACCEL : WALK_ACCEL;

  if (!p.crouching && input.left && !input.right) {
    p.facing = -1;
    p.vx = Math.max(-maxSpeed, p.vx - accel * dt);
  } else if (!p.crouching && input.right && !input.left) {
    p.facing = 1;
    p.vx = Math.min(maxSpeed, p.vx + accel * dt);
  } else {
    if (Math.abs(p.vx) <= FRICTION * dt) {
      p.vx = 0;
    } else {
      p.vx -= Math.sign(p.vx) * FRICTION * dt;
    }
  }

  if (Math.abs(p.vx) > 8 && p.onGround) {
    p.walkPhase += Math.abs(p.vx) * 0.05 * dt;
  }

  // Coyote time & variable-height jump
  if (p.onGround) {
    p.coyoteTimer = COYOTE_TIME;
    p.stompCombo = 0;
  } else {
    p.coyoteTimer = Math.max(0, p.coyoteTimer - dt);
  }

  if (input.jumpPressed && p.coyoteTimer > 0) {
    p.vy = JUMP_VELOCITY;
    p.onGround = false;
    p.coyoteTimer = 0;
    state.soundQueue.push('jump');
  }
  if (!input.jumpHeld && p.vy < -180) {
    p.vy *= 0.65;
  }

  // Fireball throw (Fire Mario)
  if (input.firePressed && p.form === 'fire') {
    const activePlayerFireballs = state.fireballs.filter((f) => f.owner === 'player').length;
    if (activePlayerFireballs < 2) {
      state.fireballs.push({
        uid: state.nextUid++,
        owner: 'player',
        x: p.x + (p.facing === 1 ? p.width : -10),
        y: p.y + 16,
        vx: p.facing * 290,
        vy: 60,
      });
      state.soundQueue.push('fireball');
    }
  }

  // Move X & resolve X tiles
  p.x += p.vx * dt;
  const minAllowedX = state.cameraX;
  const maxAllowedX = state.widthTiles * TILE_SIZE - p.width;
  if (p.x < minAllowedX) {
    p.x = minAllowedX;
    p.vx = Math.max(0, p.vx);
  } else if (p.x > maxAllowedX) {
    p.x = maxAllowedX;
    p.vx = Math.min(0, p.vx);
  }
  resolveEntityTilesX(state.tiles, state.widthTiles, state.heightTiles, p);

  // Move Y & resolve Y tiles
  p.vy = Math.min(MAX_FALL_SPEED, p.vy + GRAVITY * dt);
  p.y += p.vy * dt;
  p.onGround = false;

  const minTx = Math.max(0, Math.floor((p.x + 2) / TILE_SIZE));
  const maxTx = Math.min(state.widthTiles - 1, Math.floor((p.x + p.width - 2) / TILE_SIZE));
  const minTy = Math.max(0, Math.floor(p.y / TILE_SIZE));
  const maxTy = Math.min(state.heightTiles - 1, Math.floor((p.y + p.height - 0.01) / TILE_SIZE));

  for (let ty = minTy; ty <= maxTy; ty++) {
    for (let tx = minTx; tx <= maxTx; tx++) {
      const kind = state.tiles[ty * state.widthTiles + tx];
      if (kind === 'lava') {
        p.form = 'small';
        p.starTimer = 0;
        p.invulnTimer = 0;
        damagePlayer(state, p);
        return state;
      }
      if (kind === 'hidden_1up' && p.vy < 0) {
        p.y = (ty + 1) * TILE_SIZE;
        p.vy = 0;
        hitBlockFromBelow(state, p, tx, ty);
        continue;
      }
      if (!isSolidTile(kind)) continue;

      if (p.vy > 0) {
        p.y = ty * TILE_SIZE - p.height;
        p.vy = 0;
        p.onGround = true;
      } else if (p.vy < 0) {
        p.y = (ty + 1) * TILE_SIZE;
        p.vy = 0;
        hitBlockFromBelow(state, p, tx, ty);
      }
    }
  }

  // Moving platform landing & carry
  for (const pl of state.platforms) {
    if (
      p.vy >= 0 &&
      p.x + p.width > pl.x + 2 &&
      p.x < pl.x + pl.width - 2 &&
      p.y + p.height >= pl.y - 4 &&
      p.y + p.height <= pl.y + pl.height + 8
    ) {
      p.y = pl.y - p.height;
      p.vy = 0;
      p.onGround = true;
      p.x += pl.dx;
    }
  }

  // Bottomless pit check
  if (p.y > VIEW_HEIGHT + 16) {
    p.form = 'small';
    p.starTimer = 0;
    p.invulnTimer = 0;
    damagePlayer(state, p);
    return state;
  }

  // Update camera (one-way NES scroll forward)
  const targetCam = Math.max(
    state.cameraX,
    Math.min(state.widthTiles * TILE_SIZE - VIEW_WIDTH, p.x - VIEW_WIDTH * 0.4),
  );
  state.cameraX = targetCam;

  // Update Items
  for (let i = state.items.length - 1; i >= 0; i--) {
    const it = state.items[i];
    if (it.kind !== 'coin' && it.kind !== 'flower') {
      it.vy = Math.min(MAX_FALL_SPEED, it.vy + GRAVITY * dt);
      it.x += it.vx * dt;
      const hitW = resolveEntityTilesX(state.tiles, state.widthTiles, state.heightTiles, {
        ...it,
        vx: it.vx,
      });
      if (hitW) it.vx = -it.vx;
      it.y += it.vy * dt;

      const itMinTx = Math.max(0, Math.floor((it.x + 2) / TILE_SIZE));
      const itMaxTx = Math.min(state.widthTiles - 1, Math.floor((it.x + it.width - 2) / TILE_SIZE));
      const itBotTy = Math.min(state.heightTiles - 1, Math.floor((it.y + it.height) / TILE_SIZE));
      for (let tx = itMinTx; tx <= itMaxTx; tx++) {
        if (isSolidTile(state.tiles[itBotTy * state.widthTiles + tx])) {
          it.y = itBotTy * TILE_SIZE - it.height;
          it.vy = it.kind === 'star' ? -280 : 0;
          break;
        }
      }
    }

    if (rectsOverlap(p.x, p.y, p.width, p.height, it.x, it.y, it.width, it.height)) {
      if (it.kind === 'coin') {
        addCoin(state, p, it.x + 10, it.y);
      } else if (it.kind === 'mushroom') {
        state.mushroomsCollected += 1;
        if (p.form === 'small') setPlayerForm(p, 'super');
        addScore(state, p, 1000, it.x + 12, it.y);
        state.soundQueue.push('powerup');
      } else if (it.kind === 'flower') {
        state.mushroomsCollected += 1;
        setPlayerForm(p, 'fire');
        addScore(state, p, 1000, it.x + 12, it.y);
        state.soundQueue.push('powerup');
      } else if (it.kind === 'star') {
        p.starTimer = STAR_DURATION;
        addScore(state, p, 1000, it.x + 12, it.y);
        state.soundQueue.push('powerup');
      } else if (it.kind === 'oneup') {
        p.lives += 1;
        addScore(state, p, 0, it.x + 12, it.y, '1UP');
        state.soundQueue.push('oneup');
      }
      state.items.splice(i, 1);
    }
  }

  // Update Enemies
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    if (!e.alive) {
      state.enemies.splice(i, 1);
      continue;
    }
    // Activate when near camera
    if (e.x > state.cameraX + VIEW_WIDTH + 96) continue;

    if (e.kind === 'piranha') {
      e.timer = (e.timer ?? 0) + dt;
      const cycle = Math.sin(e.timer * 2.2);
      const nearPipe = Math.abs(p.x - e.x) < 42;
      if (nearPipe && cycle < -0.5) {
        e.y = e.baseY ?? e.y;
      } else {
        e.y = (e.baseY ?? e.y) - Math.max(0, cycle) * 28;
      }
    } else if (e.kind === 'bowser') {
      e.timer = (e.timer ?? 0) - dt;
      e.x += e.vx * dt;
      if (e.x < 73 * TILE_SIZE) {
        e.x = 73 * TILE_SIZE;
        e.vx = Math.abs(e.vx);
      } else if (e.x > 82 * TILE_SIZE) {
        e.x = 82 * TILE_SIZE;
        e.vx = -Math.abs(e.vx);
      }
      if (e.timer <= 0) {
        state.fireballs.push({
          uid: state.nextUid++,
          owner: 'bowser',
          x: e.x - 14,
          y: e.y + 16,
          vx: -175,
          vy: 0,
        });
        e.timer = 1.9;
      }
    } else {
      // Goomba, Koopa, Shell
      e.vy = Math.min(MAX_FALL_SPEED, e.vy + GRAVITY * dt);
      const prevVx = e.vx;
      e.x += e.vx * dt;
      const hitX = resolveEntityTilesX(state.tiles, state.widthTiles, state.heightTiles, e);
      if (hitX) e.vx = -prevVx;

      e.y += e.vy * dt;
      const eMinTx = Math.max(0, Math.floor((e.x + 2) / TILE_SIZE));
      const eMaxTx = Math.min(state.widthTiles - 1, Math.floor((e.x + e.width - 2) / TILE_SIZE));
      const eBotTy = Math.min(state.heightTiles - 1, Math.floor((e.y + e.height) / TILE_SIZE));
      for (let tx = eMinTx; tx <= eMaxTx; tx++) {
        if (isSolidTile(state.tiles[eBotTy * state.widthTiles + tx])) {
          e.y = eBotTy * TILE_SIZE - e.height;
          e.vy = 0;
          break;
        }
      }

      if (e.y > VIEW_HEIGHT + 32) {
        e.alive = false;
        continue;
      }

      // Moving Shell hits other enemies
      if (e.kind === 'shell' && e.shellMoving) {
        for (const other of state.enemies) {
          if (other.uid === e.uid || !other.alive || other.kind === 'bowser') continue;
          if (rectsOverlap(e.x, e.y, e.width, e.height, other.x, other.y, other.width, other.height)) {
            other.alive = false;
            addScore(state, p, 200, other.x + 12, other.y);
            state.soundQueue.push('stomp');
          }
        }
      }
    }

    // Player vs Enemy collision
    if (rectsOverlap(p.x, p.y, p.width, p.height, e.x, e.y, e.width, e.height)) {
      if (p.starTimer > 0 && e.kind !== 'bowser') {
        e.alive = false;
        state.enemiesStomped += 1;
        addScore(state, p, 200, e.x + 12, e.y);
        state.soundQueue.push('stomp');
      } else if (e.kind === 'shell' && !e.shellMoving) {
        e.shellMoving = true;
        e.vx = p.x < e.x ? 280 : -280;
        addScore(state, p, 400, e.x + 12, e.y);
        state.soundQueue.push('stomp');
      } else if (
        e.kind !== 'piranha' &&
        e.kind !== 'bowser' &&
        p.vy > 0 &&
        p.y + p.height - p.vy * dt <= e.y + e.height * 0.65
      ) {
        p.vy = STOMP_BOUNCE_VELOCITY;
        p.stompCombo += 1;
        state.enemiesStomped += 1;
        if (e.kind === 'goomba') {
          e.alive = false;
        } else if (e.kind === 'koopa') {
          e.kind = 'shell';
          e.height = 24;
          e.y += 14;
          e.vx = 0;
          e.shellMoving = false;
        } else if (e.kind === 'shell') {
          e.shellMoving = false;
          e.vx = 0;
        }
        const pts = Math.min(1000, 100 * Math.pow(2, p.stompCombo - 1));
        addScore(state, p, pts, e.x + 12, e.y);
        state.soundQueue.push('stomp');
      } else {
        damagePlayer(state, p);
      }
    }
  }

  // Update Fireballs
  for (let i = state.fireballs.length - 1; i >= 0; i--) {
    const fb = state.fireballs[i];
    if (fb.owner === 'player') {
      fb.vy = Math.min(MAX_FALL_SPEED, fb.vy + GRAVITY * dt);
      fb.x += fb.vx * dt;
      fb.y += fb.vy * dt;

      if (fb.x < state.cameraX - 32 || fb.x > state.cameraX + VIEW_WIDTH + 32 || fb.y > VIEW_HEIGHT) {
        state.fireballs.splice(i, 1);
        continue;
      }

      const tx = Math.floor((fb.x + 5) / TILE_SIZE);
      const ty = Math.floor((fb.y + 5) / TILE_SIZE);
      if (tx >= 0 && ty >= 0 && tx < state.widthTiles && ty < state.heightTiles) {
        if (isSolidTile(state.tiles[ty * state.widthTiles + tx])) {
          // Bounce on floor, vanish on wall
          const prevTy = Math.floor((fb.y + 5 - fb.vy * dt) / TILE_SIZE);
          if (prevTy < ty) {
            fb.y = ty * TILE_SIZE - 10;
            fb.vy = -250;
          } else {
            state.fireballs.splice(i, 1);
            continue;
          }
        }
      }

      let hitEnemy = false;
      for (const e of state.enemies) {
        if (!e.alive || e.kind === 'piranha') continue;
        if (rectsOverlap(fb.x, fb.y, 10, 10, e.x, e.y, e.width, e.height)) {
          hitEnemy = true;
          e.hp -= 1;
          if (e.hp <= 0) {
            e.alive = false;
            state.enemiesStomped += 1;
            addScore(state, p, e.kind === 'bowser' ? 5000 : 200, e.x + 12, e.y);
          }
          state.soundQueue.push('stomp');
          break;
        }
      }
      if (hitEnemy) {
        state.fireballs.splice(i, 1);
      }
    } else {
      // Bowser fireball
      fb.x += fb.vx * dt;
      if (fb.x < state.cameraX - 64) {
        state.fireballs.splice(i, 1);
        continue;
      }
      if (rectsOverlap(fb.x, fb.y, 16, 12, p.x, p.y, p.width, p.height)) {
        damagePlayer(state, p);
        state.fireballs.splice(i, 1);
      }
    }
  }

  // Rotating Fire Bar collision
  for (const fb of state.fireBars) {
    for (let b = 1; b <= fb.length; b++) {
      const bx = fb.cx + Math.cos(fb.angle) * (b * 16) - 5;
      const by = fb.cy + Math.sin(fb.angle) * (b * 16) - 5;
      if (rectsOverlap(bx, by, 10, 10, p.x + 2, p.y + 2, p.width - 4, p.height - 4)) {
        damagePlayer(state, p);
        break;
      }
    }
  }

  // Particles & Popups
  state.particles = state.particles
    .map((pt) => ({
      ...pt,
      x: pt.x + pt.vx * dt,
      y: pt.y + pt.vy * dt,
      vy: pt.vy + GRAVITY * 0.8 * dt,
      timer: pt.timer - dt,
    }))
    .filter((pt) => pt.timer > 0);

  state.popups = state.popups
    .map((pp) => ({ ...pp, y: pp.y - 24 * dt, timer: pp.timer - dt }))
    .filter((pp) => pp.timer > 0);

  // Goal check (Flagpole or Castle Axe)
  if (state.goalType === 'flagpole') {
    if (p.x + p.width >= state.goalX + 8) {
      const heightBonus = Math.max(100, Math.min(5000, Math.round((state.goalY - p.y) * 18)));
      const timeBonus = Math.round(state.timeLeft) * 50;
      addScore(state, p, heightBonus + timeBonus, state.goalX, p.y);
      state.phase = 'stage_clear';
      state.soundQueue.push('flagpole');
    }
  } else {
    // 1-4 Axe
    if (rectsOverlap(p.x, p.y, p.width, p.height, state.goalX, state.goalY, TILE_SIZE, TILE_SIZE)) {
      // Collapse bridge tiles
      for (let i = 0; i < state.tiles.length; i++) {
        if (state.tiles[i] === 'bridge') state.tiles[i] = 'empty';
      }
      state.enemies = [];
      state.fireballs = [];
      addScore(state, p, 5000 + Math.round(state.timeLeft) * 50, state.goalX, state.goalY);
      state.phase = 'victory';
      state.soundQueue.push('castle_clear');
    }
  }

  return state;
}
