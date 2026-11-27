import {
  BULLET_SIZE,
  CANVAS_SIZE,
  CLOCK_DURATION,
  ENEMY_SPAWN_COORDS,
  ENEMY_STATS,
  FORTRESS_SUBTILES,
  GRID_SUBTILES,
  HELMET_DURATION,
  MAX_ACTIVE_ENEMIES,
  P1_SPAWN,
  P2_SPAWN,
  PLAYER_BULLET_SPEED_BASE,
  PLAYER_BULLET_SPEED_FAST,
  PLAYER_SPEED,
  POWERUP_SCORE,
  SHOVEL_DURATION,
  SPAWN_ANIM_DURATION,
  STUN_DURATION,
  SUBTILE_PX,
  TANK_SIZE,
} from './constants';
import { buildStageEnemyQueue, buildStageGrid, buildTutorialGrid } from './stages';
import type {
  BattleInput,
  BattleState,
  Direction,
  GameMode,
  PlayerTank,
  PowerUpKind,
  SubTileKind,
} from './types';

function makePlayer(id: 1 | 2, active: boolean): PlayerTank {
  const spawn = id === 1 ? P1_SPAWN : P2_SPAWN;
  return {
    id,
    active,
    alive: active,
    x: spawn.x,
    y: spawn.y,
    dir: 'up',
    lives: active ? 3 : 0,
    stars: 0,
    score: 0,
    kills: { basic: 0, fast: 0, power: 0, armor: 0 },
    shieldTimer: active ? 3 : 0,
    stunTimer: 0,
    respawnTimer: 0,
    fireCooldown: 0,
    velX: 0,
    velY: 0,
    treadPhase: 0,
  };
}

export function createBattleState(
  mode: GameMode,
  stage = 1,
  options?: { highScore?: number; carryPlayers?: [PlayerTank, PlayerTank] },
): BattleState {
  const p1 = options?.carryPlayers
    ? {
        ...options.carryPlayers[0],
        active: true,
        alive: options.carryPlayers[0].lives > 0,
        x: P1_SPAWN.x,
        y: P1_SPAWN.y,
        dir: 'up' as Direction,
        kills: { basic: 0, fast: 0, power: 0, armor: 0 },
        shieldTimer: 3,
        stunTimer: 0,
        respawnTimer: 0,
        fireCooldown: 0,
        velX: 0,
        velY: 0,
      }
    : makePlayer(1, true);

  const p2 = options?.carryPlayers
    ? {
        ...options.carryPlayers[1],
        active: mode === '2p',
        alive: mode === '2p' && options.carryPlayers[1].lives > 0,
        x: P2_SPAWN.x,
        y: P2_SPAWN.y,
        dir: 'up' as Direction,
        kills: { basic: 0, fast: 0, power: 0, armor: 0 },
        shieldTimer: mode === '2p' ? 3 : 0,
        stunTimer: 0,
        respawnTimer: 0,
        fireCooldown: 0,
        velX: 0,
        velY: 0,
      }
    : makePlayer(2, mode === '2p');

  return {
    mode,
    phase: 'playing',
    stage,
    isTutorial: false,
    grid: buildStageGrid(stage),
    players: [p1, p2],
    enemies: [],
    pendingSpawns: [],
    enemyQueue: buildStageEnemyQueue(stage),
    spawnTimer: 0.25,
    nextSpawnSlot: 1,
    bullets: [],
    powerUps: [],
    explosions: [],
    popups: [],
    freezeTimer: 0,
    shovelTimer: 0,
    stageClearTimer: 0,
    highScore: options?.highScore ?? 0,
    bricksBroken: 0,
    powerUpsCollected: 0,
    nextUid: 1,
    elapsed: 0,
    soundQueue: ['stage_start'],
  };
}

export function createTutorialBattleState(highScore = 0): BattleState {
  return {
    mode: '1p',
    phase: 'playing',
    stage: 1,
    isTutorial: true,
    grid: buildTutorialGrid(),
    players: [makePlayer(1, true), makePlayer(2, false)],
    enemies: [],
    pendingSpawns: [],
    enemyQueue: [
      { kind: 'basic', bonus: true },
      { kind: 'basic', bonus: false },
      { kind: 'fast', bonus: false },
    ],
    spawnTimer: 0.25,
    nextSpawnSlot: 1,
    bullets: [],
    powerUps: [],
    explosions: [],
    popups: [],
    freezeTimer: 0,
    shovelTimer: 0,
    stageClearTimer: 0,
    highScore,
    bricksBroken: 0,
    powerUpsCollected: 0,
    nextUid: 1,
    elapsed: 0,
    soundQueue: ['stage_start'],
  };
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

function isBlockingTileForTank(kind: SubTileKind): boolean {
  return (
    kind === 'brick' ||
    kind === 'steel' ||
    kind === 'water' ||
    kind === 'eagle' ||
    kind === 'eagle_dead'
  );
}

function tankCollidesWithGrid(grid: SubTileKind[], x: number, y: number): boolean {
  if (x < 0 || y < 0 || x + TANK_SIZE > CANVAS_SIZE || y + TANK_SIZE > CANVAS_SIZE) {
    return true;
  }
  const minTx = Math.floor(x / SUBTILE_PX);
  const maxTx = Math.floor((x + TANK_SIZE - 0.01) / SUBTILE_PX);
  const minTy = Math.floor(y / SUBTILE_PX);
  const maxTy = Math.floor((y + TANK_SIZE - 0.01) / SUBTILE_PX);

  for (let ty = minTy; ty <= maxTy; ty++) {
    for (let tx = minTx; tx <= maxTx; tx++) {
      if (isBlockingTileForTank(grid[ty * GRID_SUBTILES + tx])) {
        return true;
      }
    }
  }
  return false;
}

function tankOverlapsOtherTanks(
  state: BattleState,
  x: number,
  y: number,
  ignoreId: string,
): boolean {
  for (const p of state.players) {
    if (!p.alive || `p${p.id}` === ignoreId) continue;
    if (rectsOverlap(x, y, TANK_SIZE, TANK_SIZE, p.x, p.y, TANK_SIZE, TANK_SIZE)) {
      return true;
    }
  }
  for (const e of state.enemies) {
    if (`e${e.uid}` === ignoreId) continue;
    if (rectsOverlap(x, y, TANK_SIZE, TANK_SIZE, e.x, e.y, TANK_SIZE, TANK_SIZE)) {
      return true;
    }
  }
  return false;
}

function isOnIce(grid: SubTileKind[], x: number, y: number): boolean {
  const cx = Math.floor((x + TANK_SIZE / 2) / SUBTILE_PX);
  const cy = Math.floor((y + TANK_SIZE / 2) / SUBTILE_PX);
  if (cx < 0 || cy < 0 || cx >= GRID_SUBTILES || cy >= GRID_SUBTILES) return false;
  return grid[cy * GRID_SUBTILES + cx] === 'ice';
}

function dirDelta(dir: Direction): [number, number] {
  if (dir === 'up') return [0, -1];
  if (dir === 'down') return [0, 1];
  if (dir === 'left') return [-1, 0];
  return [1, 0];
}

function moveTankWithSnap(
  state: BattleState,
  x: number,
  y: number,
  prevDir: Direction,
  nextDir: Direction,
  dist: number,
  ignoreId: string,
): { x: number; y: number; moved: boolean } {
  let nx = x;
  let ny = y;

  // Classic NES lane-alignment snap when turning 90 degrees
  const wasVertical = prevDir === 'up' || prevDir === 'down';
  const nowVertical = nextDir === 'up' || nextDir === 'down';
  if (wasVertical !== nowVertical) {
    if (nowVertical) {
      const snappedX = Math.round(nx / SUBTILE_PX) * SUBTILE_PX;
      if (
        Math.abs(snappedX - nx) <= 8 &&
        !tankCollidesWithGrid(state.grid, snappedX, ny)
      ) {
        nx = snappedX;
      }
    } else {
      const snappedY = Math.round(ny / SUBTILE_PX) * SUBTILE_PX;
      if (
        Math.abs(snappedY - ny) <= 8 &&
        !tankCollidesWithGrid(state.grid, nx, snappedY)
      ) {
        ny = snappedY;
      }
    }
  }

  const [dx, dy] = dirDelta(nextDir);
  const tx = nx + dx * dist;
  const ty = ny + dy * dist;

  if (
    !tankCollidesWithGrid(state.grid, tx, ty) &&
    !tankOverlapsOtherTanks(state, tx, ty, ignoreId)
  ) {
    return { x: tx, y: ty, moved: true };
  }
  return { x: nx, y: ny, moved: false };
}

function awardScore(state: BattleState, player: PlayerTank, pts: number): void {
  const prevMilestone = Math.floor(player.score / 20000);
  player.score += pts;
  const nextMilestone = Math.floor(player.score / 20000);
  if (nextMilestone > prevMilestone) {
    player.lives += 1;
    state.soundQueue.push('oneup');
  }
  const combinedBest = Math.max(state.highScore, player.score);
  state.highScore = combinedBest;
}

function setFortressMaterial(grid: SubTileKind[], kind: 'brick' | 'steel'): void {
  for (const [x, y] of FORTRESS_SUBTILES) {
    if (grid[y * GRID_SUBTILES + x] !== 'eagle_dead') {
      grid[y * GRID_SUBTILES + x] = kind;
    }
  }
}

const POWERUP_ROTATION: PowerUpKind[] = [
  'star',
  'helmet',
  'clock',
  'shovel',
  'grenade',
  'tank',
];

function spawnPowerUp(state: BattleState, nearX: number, nearY: number): void {
  const kind = state.isTutorial
    ? 'star'
    : POWERUP_ROTATION[(state.powerUpsCollected + state.enemies.length + state.nextUid) % POWERUP_ROTATION.length];
  // Place power-up at a reachable open subtile
  const candidates = [
    { x: Math.min(CANVAS_SIZE - 32, Math.max(16, Math.round(nearX / 16) * 16)), y: Math.min(CANVAS_SIZE - 48, Math.max(16, Math.round(nearY / 16) * 16)) },
    { x: 6 * SUBTILE_PX, y: 12 * SUBTILE_PX },
    { x: 18 * SUBTILE_PX, y: 12 * SUBTILE_PX },
  ];
  const pos = candidates.find((c) => !tankCollidesWithGrid(state.grid, c.x, c.y)) ?? candidates[1];
  state.powerUps.push({
    uid: state.nextUid++,
    kind,
    x: pos.x,
    y: pos.y,
    timer: 14,
  });
}

function applyPowerUp(state: BattleState, player: PlayerTank, kind: PowerUpKind): void {
  state.powerUpsCollected += 1;
  awardScore(state, player, POWERUP_SCORE);
  state.popups.push({
    uid: state.nextUid++,
    x: player.x + 14,
    y: player.y,
    value: POWERUP_SCORE,
    timer: 0.9,
  });

  if (kind === 'star') {
    player.stars = Math.min(3, player.stars + 1);
    state.soundQueue.push('powerup');
  } else if (kind === 'helmet') {
    player.shieldTimer = HELMET_DURATION;
    state.soundQueue.push('powerup');
  } else if (kind === 'clock') {
    state.freezeTimer = CLOCK_DURATION;
    state.soundQueue.push('powerup');
  } else if (kind === 'shovel') {
    state.shovelTimer = SHOVEL_DURATION;
    setFortressMaterial(state.grid, 'steel');
    state.soundQueue.push('powerup');
  } else if (kind === 'tank') {
    player.lives += 1;
    state.soundQueue.push('oneup');
  } else if (kind === 'grenade') {
    for (const e of state.enemies) {
      state.explosions.push({
        uid: state.nextUid++,
        x: e.x + 14,
        y: e.y + 14,
        big: true,
        timer: 0,
        duration: 0.4,
      });
    }
    state.enemies = [];
    state.soundQueue.push('explosion');
  }
}

export function stepBattle(
  prevState: BattleState,
  input: BattleInput,
  rawDt: number,
): BattleState {
  if (prevState.phase !== 'playing') return prevState;
  const dt = Math.min(0.05, Math.max(0, rawDt));

  // Shallow clone collections for clean state updates
  const state: BattleState = {
    ...prevState,
    grid: [...prevState.grid],
    players: [
      { ...prevState.players[0], kills: { ...prevState.players[0].kills } },
      { ...prevState.players[1], kills: { ...prevState.players[1].kills } },
    ],
    enemies: prevState.enemies.map((e) => ({ ...e })),
    pendingSpawns: prevState.pendingSpawns.map((s) => ({ ...s })),
    enemyQueue: [...prevState.enemyQueue],
    bullets: prevState.bullets.map((b) => ({ ...b })),
    powerUps: prevState.powerUps.map((p) => ({ ...p })),
    explosions: prevState.explosions.map((ex) => ({ ...ex })),
    popups: prevState.popups.map((p) => ({ ...p })),
    soundQueue: [],
    elapsed: prevState.elapsed + dt,
  };

  // Global timers
  if (state.freezeTimer > 0) {
    state.freezeTimer = Math.max(0, state.freezeTimer - dt);
  }
  if (state.shovelTimer > 0) {
    state.shovelTimer = Math.max(0, state.shovelTimer - dt);
    if (state.shovelTimer === 0) {
      setFortressMaterial(state.grid, 'brick');
    }
  }

  // Update players
  const playerInputs = [input.p1, input.p2] as const;
  for (let i = 0; i < 2; i++) {
    const p = state.players[i];
    const pIn = playerInputs[i];
    if (!p.active) continue;

    if (!p.alive) {
      if (p.lives > 0) {
        p.respawnTimer -= dt;
        if (p.respawnTimer <= 0) {
          const spawn = p.id === 1 ? P1_SPAWN : P2_SPAWN;
          p.alive = true;
          p.x = spawn.x;
          p.y = spawn.y;
          p.dir = 'up';
          p.shieldTimer = 3.0;
          p.stunTimer = 0;
        }
      }
      continue;
    }

    if (p.shieldTimer > 0) p.shieldTimer = Math.max(0, p.shieldTimer - dt);
    if (p.stunTimer > 0) p.stunTimer = Math.max(0, p.stunTimer - dt);
    if (p.fireCooldown > 0) p.fireCooldown = Math.max(0, p.fireCooldown - dt);

    if (p.stunTimer <= 0) {
      const onIce = isOnIce(state.grid, p.x, p.y);
      if (pIn.dir) {
        const res = moveTankWithSnap(
          state,
          p.x,
          p.y,
          p.dir,
          pIn.dir,
          PLAYER_SPEED * dt,
          `p${p.id}`,
        );
        p.dir = pIn.dir;
        p.x = res.x;
        p.y = res.y;
        const [vx, vy] = dirDelta(pIn.dir);
        p.velX = vx * 52;
        p.velY = vy * 52;
        if (res.moved) p.treadPhase += dt * 12;
      } else if (onIce && (Math.abs(p.velX) > 4 || Math.abs(p.velY) > 4)) {
        const res = moveTankWithSnap(
          state,
          p.x,
          p.y,
          p.dir,
          p.dir,
          Math.hypot(p.velX, p.velY) * dt,
          `p${p.id}`,
        );
        p.x = res.x;
        p.y = res.y;
        p.velX *= 0.9;
        p.velY *= 0.9;
      } else {
        p.velX = 0;
        p.velY = 0;
      }

      if (pIn.fire && p.fireCooldown <= 0) {
        const ownerTag = p.id === 1 ? 'p1' : 'p2';
        const maxBullets = p.stars >= 2 ? 2 : 1;
        const activeCount = state.bullets.filter((b) => b.owner === ownerTag).length;
        if (activeCount < maxBullets) {
          const [dx, dy] = dirDelta(p.dir);
          state.bullets.push({
            uid: state.nextUid++,
            owner: ownerTag,
            x: p.x + TANK_SIZE / 2 - BULLET_SIZE / 2 + dx * 12,
            y: p.y + TANK_SIZE / 2 - BULLET_SIZE / 2 + dy * 12,
            dir: p.dir,
            speed: p.stars >= 1 ? PLAYER_BULLET_SPEED_FAST : PLAYER_BULLET_SPEED_BASE,
            canBreakSteel: p.stars >= 3,
          });
          p.fireCooldown = 0.22;
          state.soundQueue.push('fire');
        }
      }
    }
  }

  // Spawn enemies
  if (
    state.enemyQueue.length > 0 &&
    state.enemies.length + state.pendingSpawns.length < MAX_ACTIVE_ENEMIES
  ) {
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      const slot = ENEMY_SPAWN_COORDS[state.nextSpawnSlot % ENEMY_SPAWN_COORDS.length];
      state.nextSpawnSlot += 1;
      const blocked = tankOverlapsOtherTanks(state, slot.x, slot.y, 'none');
      if (!blocked) {
        const nextEnemy = state.enemyQueue.shift()!;
        state.pendingSpawns.push({
          uid: state.nextUid++,
          kind: nextEnemy.kind,
          bonus: nextEnemy.bonus,
          x: slot.x,
          y: slot.y,
          timer: SPAWN_ANIM_DURATION,
        });
        state.spawnTimer = state.isTutorial ? 2.4 : 1.7;
      } else {
        state.spawnTimer = 0.5;
      }
    }
  }

  // Resolve pending enemy spawns
  for (let i = state.pendingSpawns.length - 1; i >= 0; i--) {
    const sp = state.pendingSpawns[i];
    sp.timer -= dt;
    if (sp.timer <= 0) {
      const stats = ENEMY_STATS[sp.kind];
      state.enemies.push({
        uid: sp.uid,
        kind: sp.kind,
        x: sp.x,
        y: sp.y,
        dir: 'down',
        hp: stats.hp,
        maxHp: stats.hp,
        bonus: sp.bonus,
        fireCooldown: 0.7 + (sp.uid % 3) * 0.35,
        turnTimer: 1.5 + (sp.uid % 4) * 0.5,
        treadPhase: 0,
      });
      state.pendingSpawns.splice(i, 1);
    }
  }

  // Update enemy AI (if not frozen)
  const dirs: Direction[] = ['down', 'left', 'right', 'up'];
  if (state.freezeTimer <= 0) {
    for (const e of state.enemies) {
      const stats = ENEMY_STATS[e.kind];
      e.turnTimer -= dt;
      e.fireCooldown -= dt;

      const res = moveTankWithSnap(
        state,
        e.x,
        e.y,
        e.dir,
        e.dir,
        stats.speed * dt,
        `e${e.uid}`,
      );
      e.x = res.x;
      e.y = res.y;
      if (res.moved) e.treadPhase += dt * 10;

      if (!res.moved || e.turnTimer <= 0) {
        const idx = (Math.floor(state.elapsed * 10) + e.uid + (res.moved ? 1 : 2)) % dirs.length;
        // Bias toward down when stuck or periodically
        e.dir = !res.moved && e.y < 320 && idx === 3 ? 'down' : dirs[idx];
        e.turnTimer = 1.2 + (e.uid % 3) * 0.6;
      }

      if (e.fireCooldown <= 0) {
        const enemyBullets = state.bullets.filter((b) => b.owner === 'enemy').length;
        if (enemyBullets < 6) {
          const [dx, dy] = dirDelta(e.dir);
          state.bullets.push({
            uid: state.nextUid++,
            owner: 'enemy',
            x: e.x + TANK_SIZE / 2 - BULLET_SIZE / 2 + dx * 12,
            y: e.y + TANK_SIZE / 2 - BULLET_SIZE / 2 + dy * 12,
            dir: e.dir,
            speed: stats.bulletSpeed,
            canBreakSteel: false,
          });
        }
        e.fireCooldown = 1.15 + (e.uid % 3) * 0.45;
      }
    }
  }

  // Update bullets
  const removedBullets = new Set<number>();

  for (const b of state.bullets) {
    if (removedBullets.has(b.uid)) continue;
    const [dx, dy] = dirDelta(b.dir);
    b.x += dx * b.speed * dt;
    b.y += dy * b.speed * dt;

    // Boundary check
    if (
      b.x < 0 ||
      b.y < 0 ||
      b.x + BULLET_SIZE > CANVAS_SIZE ||
      b.y + BULLET_SIZE > CANVAS_SIZE
    ) {
      removedBullets.add(b.uid);
      if (b.owner !== 'enemy') state.soundQueue.push('steel');
      continue;
    }

    // Tile collision check
    const minTx = Math.max(0, Math.floor(b.x / SUBTILE_PX));
    const maxTx = Math.min(GRID_SUBTILES - 1, Math.floor((b.x + BULLET_SIZE - 0.01) / SUBTILE_PX));
    const minTy = Math.max(0, Math.floor(b.y / SUBTILE_PX));
    const maxTy = Math.min(GRID_SUBTILES - 1, Math.floor((b.y + BULLET_SIZE - 0.01) / SUBTILE_PX));

    let hitWall = false;
    let hitBrick = false;
    let hitSteel = false;
    let hitEagle = false;

    for (let ty = minTy; ty <= maxTy; ty++) {
      for (let tx = minTx; tx <= maxTx; tx++) {
        const gIdx = ty * GRID_SUBTILES + tx;
        const kind = state.grid[gIdx];
        if (kind === 'brick') {
          state.grid[gIdx] = 'empty';
          state.bricksBroken += 1;
          hitWall = true;
          hitBrick = true;
        } else if (kind === 'steel') {
          hitWall = true;
          if (b.canBreakSteel) {
            state.grid[gIdx] = 'empty';
            hitBrick = true;
          } else {
            hitSteel = true;
          }
        } else if (kind === 'eagle') {
          hitWall = true;
          hitEagle = true;
        }
      }
    }

    if (hitEagle) {
      for (const [ex, ey] of [
        [12, 24],
        [13, 24],
        [12, 25],
        [13, 25],
      ]) {
        state.grid[ey * GRID_SUBTILES + ex] = 'eagle_dead';
      }
      state.explosions.push({
        uid: state.nextUid++,
        x: 13 * SUBTILE_PX,
        y: 25 * SUBTILE_PX,
        big: true,
        timer: 0,
        duration: 0.55,
      });
      state.phase = 'game_over';
      state.soundQueue.push('eagle_dead', 'game_over');
      removedBullets.add(b.uid);
      break;
    }

    if (hitWall) {
      removedBullets.add(b.uid);
      state.explosions.push({
        uid: state.nextUid++,
        x: b.x + BULLET_SIZE / 2,
        y: b.y + BULLET_SIZE / 2,
        big: false,
        timer: 0,
        duration: 0.18,
      });
      if (b.owner !== 'enemy') {
        state.soundQueue.push(hitSteel && !hitBrick ? 'steel' : 'brick');
      }
      continue;
    }
  }

  // Bullet vs Bullet cancellation
  for (let i = 0; i < state.bullets.length; i++) {
    const a = state.bullets[i];
    if (removedBullets.has(a.uid)) continue;
    for (let j = i + 1; j < state.bullets.length; j++) {
      const b = state.bullets[j];
      if (removedBullets.has(b.uid)) continue;
      if (a.owner === b.owner) continue;
      if (rectsOverlap(a.x, a.y, BULLET_SIZE, BULLET_SIZE, b.x, b.y, BULLET_SIZE, BULLET_SIZE)) {
        removedBullets.add(a.uid);
        removedBullets.add(b.uid);
      }
    }
  }

  // Bullet vs Tanks
  for (const b of state.bullets) {
    if (removedBullets.has(b.uid)) continue;

    if (b.owner === 'p1' || b.owner === 'p2') {
      const shooter = b.owner === 'p1' ? state.players[0] : state.players[1];
      const partner = b.owner === 'p1' ? state.players[1] : state.players[0];

      // Hit enemy
      let hitEnemy = false;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const e = state.enemies[ei];
        if (rectsOverlap(b.x, b.y, BULLET_SIZE, BULLET_SIZE, e.x, e.y, TANK_SIZE, TANK_SIZE)) {
          removedBullets.add(b.uid);
          hitEnemy = true;
          e.hp -= 1;
          if (e.bonus) {
            e.bonus = false;
            spawnPowerUp(state, e.x, e.y);
          }
          if (e.hp <= 0) {
            const pts = ENEMY_STATS[e.kind].points;
            shooter.kills[e.kind] += 1;
            awardScore(state, shooter, pts);
            state.explosions.push({
              uid: state.nextUid++,
              x: e.x + 14,
              y: e.y + 14,
              big: true,
              timer: 0,
              duration: 0.36,
            });
            state.popups.push({
              uid: state.nextUid++,
              x: e.x + 14,
              y: e.y,
              value: pts,
              timer: 0.75,
            });
            state.enemies.splice(ei, 1);
            state.soundQueue.push('explosion');
          } else {
            state.soundQueue.push('steel');
          }
          break;
        }
      }
      if (hitEnemy) continue;

      // 2P Friendly Fire stun (does not kill partner)
      if (
        state.mode === '2p' &&
        partner.alive &&
        partner.shieldTimer <= 0 &&
        rectsOverlap(b.x, b.y, BULLET_SIZE, BULLET_SIZE, partner.x, partner.y, TANK_SIZE, TANK_SIZE)
      ) {
        removedBullets.add(b.uid);
        partner.stunTimer = STUN_DURATION;
      }
    } else {
      // Enemy bullet vs players
      for (const p of state.players) {
        if (!p.alive) continue;
        if (rectsOverlap(b.x, b.y, BULLET_SIZE, BULLET_SIZE, p.x, p.y, TANK_SIZE, TANK_SIZE)) {
          removedBullets.add(b.uid);
          if (p.shieldTimer <= 0) {
            p.alive = false;
            p.lives = Math.max(0, p.lives - 1);
            p.stars = 0;
            p.respawnTimer = 1.2;
            state.explosions.push({
              uid: state.nextUid++,
              x: p.x + 14,
              y: p.y + 14,
              big: true,
              timer: 0,
              duration: 0.45,
            });
            state.soundQueue.push('explosion');
          }
          break;
        }
      }
    }
  }

  state.bullets = state.bullets.filter((b) => !removedBullets.has(b.uid));

  // Power-up timers & player pickup
  for (let i = state.powerUps.length - 1; i >= 0; i--) {
    const item = state.powerUps[i];
    item.timer -= dt;
    if (item.timer <= 0) {
      state.powerUps.splice(i, 1);
      continue;
    }
    for (const p of state.players) {
      if (!p.alive) continue;
      if (rectsOverlap(p.x, p.y, TANK_SIZE, TANK_SIZE, item.x, item.y, 28, 28)) {
        applyPowerUp(state, p, item.kind);
        state.powerUps.splice(i, 1);
        break;
      }
    }
  }

  // Explosions & popups
  state.explosions = state.explosions
    .map((ex) => ({ ...ex, timer: ex.timer + dt }))
    .filter((ex) => ex.timer < ex.duration);

  state.popups = state.popups
    .map((pop) => ({ ...pop, y: pop.y - 18 * dt, timer: pop.timer - dt }))
    .filter((pop) => pop.timer > 0);

  // Check all players out of lives
  const anyPlayerRemaining = state.players.some((p) => p.active && (p.alive || p.lives > 0));
  if (!anyPlayerRemaining && state.phase === 'playing') {
    state.phase = 'game_over';
    state.soundQueue.push('game_over');
  }

  // Check stage clear
  if (
    state.phase === 'playing' &&
    state.enemyQueue.length === 0 &&
    state.pendingSpawns.length === 0 &&
    state.enemies.length === 0
  ) {
    state.phase = 'stage_clear';
    state.stageClearTimer = 2.5;
  }

  return state;
}

export function getTotalKills(player: PlayerTank): number {
  return (
    player.kills.basic +
    player.kills.fast +
    player.kills.power +
    player.kills.armor
  );
}
