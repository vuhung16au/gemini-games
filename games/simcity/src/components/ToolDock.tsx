import React from 'react';
import { MAX_TAX_RATE, MIN_TAX_RATE, TOOL_LIST } from '../game/constants';
import type { DataOverlay, LightingMood, ToolId } from '../game/types';

interface ToolDockProps {
  activeTool: ToolId;
  overlay: DataOverlay;
  lighting: LightingMood;
  taxRate: number;
  treasury: number;
  onSelectTool: (tool: ToolId) => void;
  onSelectOverlay: (overlay: DataOverlay) => void;
  onSelectLighting: (lighting: LightingMood) => void;
  onChangeTaxRate: (taxRate: number) => void;
  onZoom: (delta: number) => void;
  onRotate: (deltaYaw: number) => void;
  onResetCamera: () => void;
}

export const ToolDock: React.FC<ToolDockProps> = ({
  activeTool,
  overlay,
  lighting,
  taxRate,
  treasury,
  onSelectTool,
  onSelectOverlay,
  onSelectLighting,
  onChangeTaxRate,
  onZoom,
  onRotate,
  onResetCamera,
}) => {
  return (
    <footer className="sim-bottom-dock">
      <div className="sim-subbar">
        <div className="sim-sub-group" role="group" aria-label="Data overlays">
          <span className="sim-sub-label">View:</span>
          {(
            [
              ['none', 'Normal'],
              ['power', '⚡ Power'],
              ['water', '💧 Water'],
              ['landValue', '💎 Value'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`sim-mini-btn ${overlay === id ? 'active' : ''}`}
              onClick={() => onSelectOverlay(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sim-sub-group" role="group" aria-label="Time of day">
          <span className="sim-sub-label">Sky:</span>
          {(
            [
              ['day', '☀️ Day'],
              ['sunset', '🌇 Sunset'],
              ['night', '🌙 Night'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`sim-mini-btn ${lighting === id ? 'active' : ''}`}
              onClick={() => onSelectLighting(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sim-sub-group" aria-label="Tax rate">
          <span className="sim-sub-label">Tax:</span>
          <button
            type="button"
            className="sim-mini-btn"
            disabled={taxRate <= MIN_TAX_RATE}
            onClick={() => onChangeTaxRate(taxRate - 1)}
            aria-label="Decrease tax rate"
          >
            −
          </button>
          <span className="sim-tax-val">{taxRate}%</span>
          <button
            type="button"
            className="sim-mini-btn"
            disabled={taxRate >= MAX_TAX_RATE}
            onClick={() => onChangeTaxRate(taxRate + 1)}
            aria-label="Increase tax rate"
          >
            +
          </button>
        </div>

        <div className="sim-sub-group" aria-label="Camera controls">
          <button
            type="button"
            className="sim-mini-btn"
            onClick={() => onRotate(-Math.PI / 4)}
            title="Rotate Left (Q)"
          >
            ⟲
          </button>
          <button
            type="button"
            className="sim-mini-btn"
            onClick={() => onRotate(Math.PI / 4)}
            title="Rotate Right (E)"
          >
            ⟳
          </button>
          <button
            type="button"
            className="sim-mini-btn"
            onClick={() => onZoom(-3)}
            title="Zoom In (+)"
          >
            🔍+
          </button>
          <button
            type="button"
            className="sim-mini-btn"
            onClick={() => onZoom(3)}
            title="Zoom Out (-)"
          >
            🔍−
          </button>
          <button
            type="button"
            className="sim-mini-btn"
            onClick={onResetCamera}
            title="Reset Camera"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="sim-tool-palette" role="toolbar" aria-label="Build tools">
        {TOOL_LIST.map((tool) => {
          const isActive = activeTool === tool.id;
          const cantAfford = tool.cost > 0 && treasury < tool.cost;
          return (
            <button
              key={tool.id}
              type="button"
              className={`sim-tool-btn ${isActive ? 'active' : ''} ${cantAfford ? 'broke' : ''}`}
              onClick={() => onSelectTool(tool.id)}
              aria-pressed={isActive}
              title={`${tool.label} (${tool.hotkey}) — ${tool.description}`}
              data-tool-id={tool.id}
            >
              <span className="tool-hotkey">{tool.hotkey}</span>
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-name">{tool.shortLabel}</span>
              <span className="tool-cost">{tool.cost > 0 ? `$${tool.cost}` : 'Free'}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};
