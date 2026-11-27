import React, { useEffect, useRef } from 'react';
import {
  renderBakeryScene,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  SceneVisualState,
} from '../game/canvasScene';
import { PRODUCT_MAP } from '../game/config';
import { getBakePower, getDisplayCapacity, getTotalStock } from '../game/economy';
import { GameState } from '../game/types';

interface BakeryCanvasProps {
  state: GameState;
  visualRef: React.MutableRefObject<SceneVisualState>;
  onTapBake: () => void;
}

export const BakeryCanvas: React.FC<BakeryCanvasProps> = ({
  state,
  visualRef,
  onTapBake,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let rafId = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderBakeryScene(ctx, stateRef.current, visualRef.current);
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [visualRef]);

  const activeDef = PRODUCT_MAP[state.activeProduct];
  const progressPct = Math.min(100, Math.round((state.bakeProgress / activeDef.tapsToBake) * 100));
  const isFull = getTotalStock(state) >= getDisplayCapacity(state);
  const bakePower = getBakePower(state);

  return (
    <section className="bakery-stage pixel-box">
      <div className="canvas-frame" onClick={onTapBake} role="button" tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onTapBake();
          }
        }}
        aria-label={`Tap to bake ${activeDef.name}`}
      >
        <canvas
          ref={canvasRef}
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          className="bakery-canvas"
        />
      </div>

      <div className="bake-controls">
        <div className="bake-progress-wrap">
          <div className="bake-progress-header">
            <span>Baking: <strong>{activeDef.name}</strong></span>
            <span>Power: {bakePower}/tap</span>
          </div>
          <div className="pixel-progress-track">
            <div
              className="pixel-progress-fill"
              style={{
                width: `${progressPct}%`,
                backgroundColor: activeDef.accentColor,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          className={`pixel-btn btn-bake ${isFull ? 'btn-disabled' : ''}`}
          onClick={onTapBake}
        >
          {isFull ? 'COUNTER FULL!' : `🔥 TAP TO BAKE ${activeDef.name.toUpperCase()}`}
        </button>
      </div>
    </section>
  );
};
