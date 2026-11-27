import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sfx } from './audio/sfx';
import { AdvisorToast } from './components/AdvisorToast';
import { HowToPlayModal } from './components/HowToPlayModal';
import { NewCityModal } from './components/NewCityModal';
import { TileInspector } from './components/TileInspector';
import { ToolDock } from './components/ToolDock';
import { TopHUD } from './components/TopHUD';
import { TOOL_LIST } from './game/constants';
import {
  applyTool,
  createCityState,
  createStarterTownState,
  idxOf,
  setTaxRate,
  stepSimulationTick,
} from './game/engine';
import { getCityHint } from './game/hints';
import { loadCityData, saveCityData } from './game/storage';
import { getTutorialProgress } from './game/tutorial';
import type {
  CityHint,
  CityState,
  DataOverlay,
  LightingMood,
  MapPreset,
  SimSpeed,
  ToolId,
} from './game/types';
import { CityScene } from './renderer/CityScene';

const SPEED_MS: Record<SimSpeed, number> = {
  0: 0,
  1: 1200,
  2: 600,
  3: 300,
};

export const App: React.FC = () => {
  const initialSave = useMemo(() => loadCityData(), []);
  const [cityState, setCityState] = useState<CityState>(
    () => initialSave.state ?? createCityState('riverside'),
  );
  const [activeTool, setActiveTool] = useState<ToolId>('road');
  const [overlay, setOverlay] = useState<DataOverlay>('none');
  const [lighting, setLighting] = useState<LightingMood>(initialSave.lighting);
  const [speed, setSpeed] = useState<SimSpeed>(1);
  const [lastActiveSpeed, setLastActiveSpeed] = useState<SimSpeed>(1);
  const [muted, setMuted] = useState<boolean>(initialSave.muted);

  const [selectedCoord, setSelectedCoord] = useState<{ x: number; y: number } | null>(null);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [newCityOpen, setNewCityOpen] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [activeHint, setActiveHint] = useState<CityHint | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);

  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<CityScene | null>(null);

  const stateRef = useRef(cityState);
  stateRef.current = cityState;
  const toolRef = useRef(activeTool);
  toolRef.current = activeTool;

  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted]);

  // Persist city state & preferences
  useEffect(() => {
    saveCityData(cityState, { muted, lighting });
  }, [cityState, muted, lighting]);

  // Notice auto-clear
  useEffect(() => {
    if (!statusNotice) return;
    const t = window.setTimeout(() => setStatusNotice(null), 2600);
    return () => window.clearTimeout(t);
  }, [statusNotice]);

  const handleTileInteract = useCallback((x: number, y: number, isDrag: boolean) => {
    sfx.unlock();
    const tool = toolRef.current;
    if (tool === 'inspect') {
      if (!isDrag) {
        setSelectedCoord({ x, y });
      }
      return;
    }

    const res = applyTool(stateRef.current, x, y, tool);
    if (res.changed) {
      setCityState(res.state);
      if (tool === 'bulldoze') {
        sceneRef.current?.spawnBulldozeDust(x, y);
      }
      if (res.sound) sfx.play(res.sound);
    } else if (!isDrag && res.reason) {
      setStatusNotice(res.reason);
      sfx.play('error');
    }
  }, []);

  // Initialize Three.js CityScene
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;
    const scene = new CityScene(mount, stateRef.current, {
      onTileInteract: handleTileInteract,
      onHoverTile: setHoverCoord,
      onWebGLError: setWebglError,
    });
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [handleTileInteract]);

  // Sync Three.js scene with state / overlay / lighting / selection
  useEffect(() => {
    sceneRef.current?.setActiveTool(activeTool);
  }, [activeTool]);

  useEffect(() => {
    sceneRef.current?.syncState(cityState, overlay, lighting, selectedCoord);
  }, [cityState, overlay, lighting, selectedCoord]);

  // Fixed-rate simulation loop + visibilitychange handling
  useEffect(() => {
    if (speed === 0) return;

    let timerId: number | null = null;
    const startLoop = () => {
      if (timerId !== null) window.clearInterval(timerId);
      if (document.hidden) return;
      timerId = window.setInterval(() => {
        setCityState((prev) => {
          const tick = stepSimulationTick(prev);
          if (tick.milestoneReached) {
            sfx.play('milestone');
            setStatusNotice(`City Milestone Reached: ${tick.milestoneReached}!`);
          } else if (tick.leveledUp) {
            sfx.play('levelUp');
          } else if (tick.monthPassed) {
            sfx.play('coin');
          }
          return tick.state;
        });
      }, SPEED_MS[speed]);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (timerId !== null) {
          window.clearInterval(timerId);
          timerId = null;
        }
      } else {
        startLoop();
      }
    };

    startLoop();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      if (timerId !== null) window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [speed]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === 'Space' || e.code.startsWith('Arrow')) {
        e.preventDefault();
      }
      if (e.repeat) return;

      if (e.code === 'Space') {
        setSpeed((prev) => {
          if (prev === 0) return lastActiveSpeed;
          setLastActiveSpeed(prev);
          return 0;
        });
        return;
      }

      if (e.code === 'Escape') {
        setHelpOpen(false);
        setNewCityOpen(false);
        setActiveTool('inspect');
        return;
      }

      if (e.code === 'Equal' || e.code === 'NumpadAdd') {
        sceneRef.current?.zoomBy(-3);
        return;
      }
      if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
        sceneRef.current?.zoomBy(3);
        return;
      }

      const keyUpper = e.key.toUpperCase();
      if (keyUpper === '0' || keyUpper === 'B') {
        setActiveTool('bulldoze');
        return;
      }
      const matchedTool = TOOL_LIST.find((t) => t.hotkey === keyUpper);
      if (matchedTool) {
        setActiveTool(matchedTool.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lastActiveSpeed]);

  const tutorialProgress = useMemo(() => getTutorialProgress(cityState), [cityState]);

  const selectedTile = useMemo(() => {
    if (!selectedCoord) return null;
    return cityState.tiles[idxOf(selectedCoord.x, selectedCoord.y, cityState.gridSize)] ?? null;
  }, [cityState, selectedCoord]);

  const handleSetSpeed = (next: SimSpeed) => {
    if (next > 0) setLastActiveSpeed(next);
    setSpeed(next);
  };

  const handleStartMap = (preset: MapPreset) => {
    setCityState(createCityState(preset));
    setSelectedCoord(null);
    setNewCityOpen(false);
    setStatusNotice(`Started new ${preset} city!`);
  };

  const handleLoadStarterTown = () => {
    setCityState(createStarterTownState());
    setSelectedCoord(null);
    setNewCityOpen(false);
    setTutorialActive(false);
    setStatusNotice('Starter Town loaded — watch the cars and buildings!');
  };

  const handleRequestHint = () => {
    setTutorialActive(false);
    setActiveHint(getCityHint(cityState));
  };

  return (
    <div className="simcity-shell">
      <TopHUD
        state={cityState}
        speed={speed}
        muted={muted}
        tutorialActive={tutorialActive}
        onSetSpeed={handleSetSpeed}
        onToggleMute={() => setMuted((m) => !m)}
        onOpenHelp={() => setHelpOpen(true)}
        onToggleTutorial={() => {
          setActiveHint(null);
          setTutorialActive((v) => !v);
        }}
        onRequestHint={handleRequestHint}
        onOpenNewCity={() => setNewCityOpen(true)}
      />

      <main className="sim-viewport">
        <div ref={canvasMountRef} className="sim-canvas-host" />

        {webglError && (
          <div className="sim-webgl-fallback" role="alert">
            <strong>3D Renderer Unavailable:</strong> {webglError}
          </div>
        )}

        {tutorialActive && (
          <AdvisorToast
            badge={tutorialProgress.completed ? 'Done' : `Tutorial ${tutorialProgress.currentStepIndex + 1}/5`}
            title={
              tutorialProgress.completed
                ? 'Tutorial Complete!'
                : tutorialProgress.step?.title ?? ''
            }
            message={
              tutorialProgress.completed
                ? 'Great work, Mayor! Keep expanding roads, parks, and Civic Plazas to grow skyscrapers.'
                : tutorialProgress.step?.instruction ?? ''
            }
            onDismiss={() => setTutorialActive(false)}
          />
        )}

        {!tutorialActive && activeHint && (
          <AdvisorToast
            badge="Advisor"
            title={activeHint.title}
            message={activeHint.message}
            recommendedTool={activeHint.recommendedTool}
            actionLabel="Use Tool"
            onApplyTool={(tool) => {
              setActiveTool(tool);
              setActiveHint(null);
            }}
            onDismiss={() => setActiveHint(null)}
          />
        )}

        {statusNotice && (
          <div className="sim-notice-pill" role="status">
            {statusNotice}
          </div>
        )}

        {hoverCoord && (
          <div className="sim-coord-chip">
            Tile ({hoverCoord.x}, {hoverCoord.y})
          </div>
        )}

        <TileInspector
          tile={selectedTile}
          onClose={() => setSelectedCoord(null)}
          onBulldoze={(x, y) => {
            const res = applyTool(cityState, x, y, 'bulldoze');
            if (res.changed) {
              setCityState(res.state);
              sceneRef.current?.spawnBulldozeDust(x, y);
              sfx.play('bulldoze');
            }
          }}
        />
      </main>

      <ToolDock
        activeTool={activeTool}
        overlay={overlay}
        lighting={lighting}
        taxRate={cityState.taxRate}
        treasury={cityState.treasury}
        onSelectTool={setActiveTool}
        onSelectOverlay={setOverlay}
        onSelectLighting={setLighting}
        onChangeTaxRate={(rate) => setCityState((prev) => setTaxRate(prev, rate))}
        onZoom={(delta) => sceneRef.current?.zoomBy(delta)}
        onRotate={(deltaYaw) => sceneRef.current?.rotateBy(deltaYaw)}
        onResetCamera={() => sceneRef.current?.resetCamera()}
      />

      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <NewCityModal
        open={newCityOpen}
        onClose={() => setNewCityOpen(false)}
        onStartMap={handleStartMap}
        onLoadStarterTown={handleLoadStarterTown}
      />
    </div>
  );
};
