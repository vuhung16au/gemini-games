import React from 'react';
import type { ToolId } from '../game/types';

interface AdvisorToastProps {
  title: string;
  message: string;
  badge: string;
  actionLabel?: string;
  recommendedTool?: ToolId;
  onApplyTool?: (tool: ToolId) => void;
  onDismiss: () => void;
}

export const AdvisorToast: React.FC<AdvisorToastProps> = ({
  title,
  message,
  badge,
  actionLabel,
  recommendedTool,
  onApplyTool,
  onDismiss,
}) => {
  return (
    <div className="sim-advisor-toast" role="status" data-testid="advisor-toast">
      <span className="advisor-badge">{badge}</span>
      <div className="advisor-copy">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      {recommendedTool && onApplyTool && (
        <button
          type="button"
          className="sim-pill-btn active"
          onClick={() => onApplyTool(recommendedTool)}
        >
          {actionLabel ?? 'Select Tool'}
        </button>
      )}
      <button
        type="button"
        className="inspector-close"
        onClick={onDismiss}
        aria-label="Dismiss message"
      >
        ✕
      </button>
    </div>
  );
};
