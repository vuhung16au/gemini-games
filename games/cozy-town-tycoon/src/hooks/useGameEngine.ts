import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createInitialGameState,
  MIN_OFFLINE_MODAL_SECONDS,
  PRODUCT_MAP,
} from '../game/config';
import {
  applyBakeWork,
  buyUpgrade,
  calculateOfflineEarnings,
  getAutoBakeProgressPerSec,
  getBakePower,
  getCustomerIntervalMs,
  hireStaff,
  sellOneItem,
  unlockProduct,
} from '../game/economy';
import { SceneVisualState } from '../game/canvasScene';
import { playBakeSound, playCoinSound, playUpgradeSound } from '../game/sound';
import { loadGame, resetSavedGame, saveGame } from '../game/storage';
import { GameState, OfflineSummary, ProductId, StaffId, UpgradeId } from '../game/types';

export function useGameEngine() {
  const initialLoadRef = useRef<{ state: GameState; offline: OfflineSummary | null } | null>(null);
  if (!initialLoadRef.current) {
    const now = Date.now();
    const { state, fromSave } = loadGame(now);
    let offline: OfflineSummary | null = null;
    if (fromSave) {
      const summary = calculateOfflineEarnings(state, now);
      if (summary.elapsedSeconds >= MIN_OFFLINE_MODAL_SECONDS && summary.coinsEarned > 0) {
        offline = summary;
      }
    }
    initialLoadRef.current = { state, offline };
  }

  const [state, setState] = useState<GameState>(initialLoadRef.current.state);
  const [offlineSummary, setOfflineSummary] = useState<OfflineSummary | null>(
    initialLoadRef.current.offline
  );

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  const visualRef = useRef<SceneVisualState>({
    timeSec: 0,
    ovenPulse: 0,
    customers: [],
    floatingTexts: [],
    steam: [],
  });

  const nextEntityId = useRef(1);
  const spawnTimerMs = useRef(800);
  const autoBakeAccum = useRef(0);

  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    visualRef.current.floatingTexts.push({
      id: nextEntityId.current++,
      x,
      y,
      text,
      color,
      life: 1.1,
      maxLife: 1.1,
    });
  }, []);

  const spawnSteam = useCallback((count = 3) => {
    for (let i = 0; i < count; i++) {
      visualRef.current.steam.push({
        id: nextEntityId.current++,
        x: 34 + Math.random() * 26,
        y: 34 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 10,
        vy: -14 - Math.random() * 10,
        life: 0.9 + Math.random() * 0.4,
        maxLife: 1.3,
      });
    }
  }, []);

  const handleTapBake = useCallback(() => {
    const current = stateRef.current;
    const power = getBakePower(current);
    const { nextState, bakedCount, capacityFull } = applyBakeWork(current, power);

    visualRef.current.ovenPulse = 1;
    spawnSteam(bakedCount > 0 ? 4 : 2);

    if (capacityFull) {
      spawnFloatingText(52, 32, 'COUNTER FULL!', '#ff8c69');
      return;
    }

    if (bakedCount > 0) {
      const prodName = PRODUCT_MAP[current.activeProduct].name.split(' ')[1] || 'Item';
      spawnFloatingText(54, 34, `+${bakedCount} ${prodName}`, '#fff9ed');
      playBakeSound(current.muted, true);
    } else {
      playBakeSound(current.muted, false);
    }

    stateRef.current = nextState;
    setState(nextState);
  }, [spawnFloatingText, spawnSteam]);

  const handleSelectProduct = useCallback((productId: ProductId) => {
    setState((prev) => {
      if (!prev.unlockedProducts.includes(productId)) return prev;
      const next = { ...prev, activeProduct: productId, bakeProgress: 0 };
      stateRef.current = next;
      return next;
    });
  }, []);

  const handleUnlockProduct = useCallback((productId: ProductId) => {
    setState((prev) => {
      const next = unlockProduct(prev, productId);
      if (next !== prev) {
        playUpgradeSound(prev.muted);
        stateRef.current = next;
      }
      return next;
    });
  }, []);

  const handleBuyUpgrade = useCallback((upgradeId: UpgradeId) => {
    setState((prev) => {
      const next = buyUpgrade(prev, upgradeId);
      if (next !== prev) {
        playUpgradeSound(prev.muted);
        stateRef.current = next;
      }
      return next;
    });
  }, []);

  const handleHireStaff = useCallback((staffId: StaffId) => {
    setState((prev) => {
      const next = hireStaff(prev, staffId);
      if (next !== prev) {
        playUpgradeSound(prev.muted);
        stateRef.current = next;
      }
      return next;
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, muted: !prev.muted };
      stateRef.current = next;
      saveGame(next);
      return next;
    });
  }, []);

  const handleCollectOffline = useCallback(() => {
    if (!offlineSummary) return;
    const earned = offlineSummary.coinsEarned;
    const sold = offlineSummary.itemsSold;
    setState((prev) => {
      const next: GameState = {
        ...prev,
        coins: prev.coins + earned,
        totalCoinsEarned: prev.totalCoinsEarned + earned,
        totalItemsSold: prev.totalItemsSold + sold,
        lastSavedAt: Date.now(),
      };
      stateRef.current = next;
      saveGame(next);
      playCoinSound(prev.muted, true);
      return next;
    });
    setOfflineSummary(null);
  }, [offlineSummary]);

  const handleResetGame = useCallback(() => {
    resetSavedGame();
    const fresh = createInitialGameState(Date.now());
    stateRef.current = fresh;
    visualRef.current.customers = [];
    visualRef.current.floatingTexts = [];
    visualRef.current.steam = [];
    setOfflineSummary(null);
    setState(fresh);
  }, []);

  // Main simulation loop (customers, staff auto-baking, particles)
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const visual = visualRef.current;
      visual.timeSec += dt;
      if (visual.ovenPulse > 0) {
        visual.ovenPulse = Math.max(0, visual.ovenPulse - dt * 6);
      }

      let currentState = stateRef.current;
      let stateChanged = false;

      // 1. Apprentice Baker auto-baking
      const autoBakeRate = getAutoBakeProgressPerSec(currentState);
      if (autoBakeRate > 0) {
        autoBakeAccum.current += autoBakeRate * dt;
        if (autoBakeAccum.current >= 0.25) {
          const work = autoBakeAccum.current;
          autoBakeAccum.current = 0;
          const { nextState, bakedCount } = applyBakeWork(currentState, work);
          if (nextState !== currentState) {
            currentState = nextState;
            stateChanged = true;
            if (bakedCount > 0) {
              spawnSteam(2);
            }
          }
        }
      }

      // 2. Spawn customers
      spawnTimerMs.current -= dt * 1000;
      const maxCustomers = 4;
      if (spawnTimerMs.current <= 0 && visual.customers.length < maxCustomers) {
        spawnTimerMs.current = getCustomerIntervalMs(currentState);
        const slotIndex = visual.customers.length;
        visual.customers.push({
          id: nextEntityId.current++,
          variant: (Math.floor(Math.random() * 3) as 0 | 1 | 2),
          x: 280,
          y: 136 + (slotIndex % 2) * 14,
          targetX: 122 + (slotIndex % 3) * 32 + Math.random() * 8,
          state: 'entering',
          waitTimer: 0.45,
          boughtProduct: null,
          happy: false,
        });
      }

      // 3. Move customers & process sales at counter
      const speed = 56;
      for (const c of visual.customers) {
        if (c.state === 'entering') {
          c.x -= speed * dt;
          if (c.x <= c.targetX) {
            c.x = c.targetX;
            c.state = 'browsing';
          }
        } else if (c.state === 'browsing') {
          c.waitTimer -= dt;
          if (c.waitTimer <= 0) {
            const sale = sellOneItem(currentState);
            if (sale.soldProduct) {
              currentState = sale.nextState;
              stateChanged = true;
              c.boughtProduct = sale.soldProduct;
              c.happy = true;
              c.state = 'leaving';
              playCoinSound(currentState.muted, sale.tipped);
              spawnFloatingText(
                c.x + 10,
                c.y - 12,
                sale.tipped ? `+${sale.earned} TIP!` : `+${sale.earned}`,
                sale.tipped ? '#ffdf6b' : '#f7c948'
              );
            } else {
              // Wait briefly for player to bake, then leave if counter stays empty
              c.waitTimer = 0.6;
              if (c.waitTimer > 0 && Math.random() < 0.25) {
                c.state = 'leaving';
              }
            }
          }
        } else if (c.state === 'leaving') {
          c.x += speed * 1.1 * dt;
        }
      }
      visual.customers = visual.customers.filter((c) => c.x < 310);

      // 4. Update steam & floating text particles
      for (const p of visual.steam) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      }
      visual.steam = visual.steam.filter((p) => p.life > 0);

      for (const ft of visual.floatingTexts) {
        ft.y -= 18 * dt;
        ft.life -= dt;
      }
      visual.floatingTexts = visual.floatingTexts.filter((ft) => ft.life > 0);

      if (stateChanged) {
        stateRef.current = currentState;
        setState(currentState);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [spawnFloatingText, spawnSteam]);

  // Autosave every 2 seconds & on page unload
  useEffect(() => {
    const interval = window.setInterval(() => {
      saveGame(stateRef.current);
    }, 2000);
    const onUnload = () => saveGame(stateRef.current);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  return {
    state,
    visualRef,
    offlineSummary,
    handleTapBake,
    handleSelectProduct,
    handleUnlockProduct,
    handleBuyUpgrade,
    handleHireStaff,
    handleToggleMute,
    handleCollectOffline,
    handleResetGame,
  };
}
