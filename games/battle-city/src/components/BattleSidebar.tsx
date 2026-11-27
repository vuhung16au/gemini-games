import React from 'react';
import type { BattleState } from '../game/types';

interface BattleSidebarProps {
  state: BattleState;
}

export const BattleSidebar: React.FC<BattleSidebarProps> = ({ state }) => {
  const remainingEnemies =
    state.enemyQueue.length + state.pendingSpawns.length + state.enemies.length;
  const [p1, p2] = state.players;

  return (
    <aside className="bc-sidebar" aria-label="Battle Status">
      <div className="bc-enemy-grid" aria-label={`Enemies remaining: ${remainingEnemies}`}>
        {Array.from({ length: Math.min(20, remainingEnemies) }).map((_, i) => (
          <span key={i} className="bc-enemy-pip" title="Enemy Tank" />
        ))}
      </div>

      <div className="bc-stat-block" data-testid="p1-hud">
        <div className="bc-stat-title">I P</div>
        <div className="bc-stat-row">
          <span>❤️ {p1.lives}</span>
          <span>★ {p1.stars}</span>
        </div>
        <div className="bc-score-val">{p1.score}</div>
      </div>

      {state.mode === '2p' && (
        <div className="bc-stat-block p2" data-testid="p2-hud">
          <div className="bc-stat-title">II P</div>
          <div className="bc-stat-row">
            <span>❤️ {p2.lives}</span>
            <span>★ {p2.stars}</span>
          </div>
          <div className="bc-score-val">{p2.score}</div>
        </div>
      )}

      <div className="bc-stage-block">
        <span className="bc-flag">🚩</span>
        <strong>STAGE {state.isTutorial ? 'TUT' : state.stage}</strong>
      </div>

      <div className="bc-hi-block">
        <span>HI-SCORE</span>
        <strong>{state.highScore}</strong>
      </div>
    </aside>
  );
};
