import React from 'react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="sim-modal-backdrop" role="dialog" aria-modal="true" aria-label="How to Play SimCity 3D">
      <div className="sim-modal-card">
        <div className="sim-modal-head">
          <h2>How to Play SimCity 3D</h2>
          <button type="button" className="inspector-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="sim-modal-body">
          <section>
            <h3>1. Build Your Infrastructure</h3>
            <p>
              Start by placing a <strong>Power Plant (⚡, key 6)</strong> and{' '}
              <strong>Water Tower (💧, key 7)</strong> beside the entry road. Power and water flow
              automatically along connected <strong>Roads (🛣️, key 2)</strong> and adjacent zones.
              You can also build <strong>Bridges ($30)</strong> across water with the Road tool!
            </p>
          </section>

          <section>
            <h3>2. Zone &amp; Balance RCI Demand</h3>
            <p>
              Watch the <strong>R / C / I</strong> demand bars in the top HUD. Zone{' '}
              <strong>Residential (🏠)</strong> for citizens, <strong>Commercial (🏢)</strong> for
              shops and taxes, and <strong>Industrial (🏭)</strong> for jobs—keep factories away
              from homes or buffer them with <strong>Parks (🌳)</strong>. Add a{' '}
              <strong>Civic Plaza (🏛️)</strong> to unlock Level 3–4 skyscrapers!
            </p>
          </section>

          <section>
            <h3>3. Camera &amp; Keyboard Shortcuts</h3>
            <ul>
              <li>
                <strong>Left Click / Drag:</strong> Inspect or place the selected tool
              </li>
              <li>
                <strong>Right Drag / Q &amp; E:</strong> Orbit 3D camera
              </li>
              <li>
                <strong>WASD / Arrows:</strong> Pan across the city
              </li>
              <li>
                <strong>Mouse Wheel / + &amp; −:</strong> Zoom in &amp; out
              </li>
              <li>
                <strong>Keys 1–9, B:</strong> Quick-switch tools · <strong>Space:</strong> Pause/Resume
              </li>
            </ul>
          </section>
        </div>

        <div className="sim-modal-foot">
          <button type="button" className="sim-primary-btn" onClick={onClose}>
            Back to City
          </button>
        </div>
      </div>
    </div>
  );
};
