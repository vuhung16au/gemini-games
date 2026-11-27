import React from 'react';
import { ENEMY_STATS } from '../game/constants';
import { getTotalKills } from '../game/engine';
import type { BattleState, EnemyKind } from '../game/types';

interface StageClearOverlayProps {
  state: BattleState;
  onNextStage: () => void;
}

const ORDER: EnemyKind[] = ['basic', 'fast', 'power', 'armor'];

export const StageClearOverlay: React.FC<StageClearOverlayProps> = ({ state, onNextStage }) => {
  const [p1, p2] = state.players;

  return (
    <div className="bc-overlay-card" data-testid="stage-clear-overlay">
      <h2 className="bc-hero-heading">
        {state.isTutorial ? 'TUTORIAL COMPLETE!' : `STAGE ${state.stage} CLEAR!`}
      </h2>

      <table className="bc-tally-table">
        <thead>
          <tr>
            <th>Enemy</th>
            <th>P1</th>
            {state.mode === '2p' && <th>P2</th>}
          </tr>
        </thead>
        <tbody>
          {ORDER.map((kind) => (
            <tr key={kind}>
              <td>
                {ENEMY_STATS[kind].label} ({ENEMY_STATS[kind].points})
              </td>
              <td>{p1.kills[kind]}</td>
              {state.mode === '2p' && <td>{p2.kills[kind]}</td>}
            </tr>
          ))}
          <tr className="total-row">
            <td>Total Destroyed</td>
            <td>{getTotalKills(p1)}</td>
            {state.mode === '2p' && <td>{getTotalKills(p2)}</td>}
          </tr>
        </tbody>
      </table>

      <button type="button" className="bc-primary-btn" onClick={onNextStage}>
        {state.isTutorial ? 'Play Stage 1' : `Next Stage (${state.stage + 1})`}
      </button>
    </div>
  );
};
