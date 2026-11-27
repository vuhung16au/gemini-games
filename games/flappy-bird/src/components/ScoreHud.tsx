import React from 'react';

interface ScoreHudProps {
  score: number;
}

export const ScoreHud: React.FC<ScoreHudProps> = ({ score }) => {
  return (
    <div className="score-hud" aria-label={`Score: ${score}`}>
      {score}
    </div>
  );
};
