import React from 'react';
import type { CityState, SimSpeed } from '../game/types';

interface TopHUDProps {
  state: CityState;
  speed: SimSpeed;
  muted: boolean;
  tutorialActive: boolean;
  onSetSpeed: (speed: SimSpeed) => void;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onToggleTutorial: () => void;
  onRequestHint: () => void;
  onOpenNewCity: () => void;
}

function DemandBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(8, Math.min(100, Math.round(((value + 100) / 200) * 100)));
  return (
    <div className="rci-col" title={`${label} Demand: ${value > 0 ? `+${value}` : value}`}>
      <div className="rci-track">
        <div className="rci-fill" style={{ height: `${pct}%`, background: color }} />
      </div>
      <span className="rci-label">{label}</span>
    </div>
  );
}

export const TopHUD: React.FC<TopHUDProps> = ({
  state,
  speed,
  muted,
  tutorialActive,
  onSetSpeed,
  onToggleMute,
  onOpenHelp,
  onToggleTutorial,
  onRequestHint,
  onOpenNewCity,
}) => {
  const { metrics } = state;
  const netStr = metrics.monthlyNet >= 0 ? `+$${metrics.monthlyNet}` : `-$${Math.abs(metrics.monthlyNet)}`;
  const powerOk = metrics.powerUsed <= metrics.powerCapacity && metrics.unpoweredCount === 0;
  const waterOk = metrics.waterUsed <= metrics.waterCapacity && metrics.unwateredCount === 0;

  return (
    <header className="sim-top-hud">
      <div className="sim-brand">
        <img src="./icons/icon-192.png" alt="SimCity 3D emblem" className="sim-emblem" />
        <div>
          <div className="sim-title-row">
            <h1 className="sim-title">SimCity 3D</h1>
            <span className="sim-rank-badge">{state.milestoneName}</span>
          </div>
          <div className="sim-date">
            Y{state.year} · M{state.month}
          </div>
        </div>
      </div>

      <div className="sim-stats-strip">
        <div className="sim-stat" data-testid="hud-treasury">
          <span className="sim-stat-label">Treasury</span>
          <span className="sim-stat-value">${state.treasury.toLocaleString()}</span>
          <span className={`sim-stat-sub ${metrics.monthlyNet >= 0 ? 'pos' : 'neg'}`}>
            {netStr}/mo
          </span>
        </div>

        <div className="sim-stat" data-testid="hud-population">
          <span className="sim-stat-label">Population</span>
          <span className="sim-stat-value">{metrics.population.toLocaleString()}</span>
          <span className="sim-stat-sub">Best {state.bestPopulation}</span>
        </div>

        <div className="sim-stat">
          <span className="sim-stat-label">Happiness</span>
          <span className="sim-stat-value">{metrics.happiness}%</span>
          <span className="sim-stat-sub">{metrics.jobs} jobs</span>
        </div>

        <div className={`sim-stat ${!powerOk && metrics.powerUsed > 0 ? 'warn' : ''}`}>
          <span className="sim-stat-label">⚡ Power</span>
          <span className="sim-stat-value">
            {metrics.powerUsed}/{metrics.powerCapacity}
          </span>
        </div>

        <div className={`sim-stat ${!waterOk && metrics.waterUsed > 0 ? 'warn' : ''}`}>
          <span className="sim-stat-label">💧 Water</span>
          <span className="sim-stat-value">
            {metrics.waterUsed}/{metrics.waterCapacity}
          </span>
        </div>

        <div className="rci-meter" aria-label="RCI Demand">
          <DemandBar label="R" value={metrics.demand.residential} color="#2e7d32" />
          <DemandBar label="C" value={metrics.demand.commercial} color="#1565c0" />
          <DemandBar label="I" value={metrics.demand.industrial} color="#d97706" />
        </div>
      </div>

      <div className="sim-top-actions">
        <div className="speed-group" role="group" aria-label="Simulation speed">
          {([0, 1, 2, 3] as SimSpeed[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`sim-pill-btn ${speed === s ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSetSpeed(s);
              }}
              aria-pressed={speed === s}
              title={s === 0 ? 'Pause (Space)' : `${s}x Speed`}
            >
              {s === 0 ? '⏸' : `${s}×`}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`sim-pill-btn ${tutorialActive ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleTutorial();
          }}
        >
          Tutorial
        </button>

        <button
          type="button"
          className="sim-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRequestHint();
          }}
        >
          💡 Hint
        </button>

        <button
          type="button"
          className="sim-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenHelp();
          }}
        >
          ? Help
        </button>

        <button
          type="button"
          className="sim-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenNewCity();
          }}
        >
          New City
        </button>

        <button
          type="button"
          className="sim-pill-btn"
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          aria-pressed={muted}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  );
};
