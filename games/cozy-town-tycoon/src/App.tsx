import React, { useState } from 'react';
import { BakeryCanvas } from './components/BakeryCanvas';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HUD } from './components/HUD';
import { ManagementPanel } from './components/ManagementPanel';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { formatCoins } from './game/economy';
import { getNextActionHint } from './game/hints';
import { useGameEngine } from './hooks/useGameEngine';

export const App: React.FC = () => {
  const {
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
  } = useGameEngine();

  const [showHelp, setShowHelp] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [tutorialStartBaked, setTutorialStartBaked] = useState<number | null>(
    null,
  );
  const [tutorialHintChecked, setTutorialHintChecked] = useState(false);

  const isTutorial = tutorialStartBaked !== null;
  const bakedSinceTutorial = isTutorial
    ? state.totalItemsBaked - tutorialStartBaked
    : 0;

  let tutorialBanner = '';
  if (isTutorial) {
    if (bakedSinceTutorial < 1) {
      tutorialBanner =
        'Step 1 of 3: Tap the oven or Bake button to bake your first Country Bread!';
    } else if (bakedSinceTutorial < 3) {
      tutorialBanner = `Step 2 of 3: Bake 3 loaves onto the counter (${bakedSinceTutorial}/3) for customers!`;
    } else if (!tutorialHintChecked) {
      tutorialBanner =
        'Step 3 of 3: Click 💡 Hint in the HUD to see your next smart bakery move!';
    } else {
      tutorialBanner =
        'Tutorial complete! Keep baking, unlock pastries, and hire staff!';
    }
  }

  const handleStartTutorial = () => {
    setHintText(null);
    setTutorialHintChecked(false);
    setTutorialStartBaked(state.totalItemsBaked);
  };

  const handleHint = () => {
    if (isTutorial && bakedSinceTutorial >= 3) {
      setTutorialHintChecked(true);
    }
    setHintText(getNextActionHint(state));
  };

  return (
    <div className="app-shell">
      <HUD
        state={state}
        isTutorial={isTutorial}
        onStartTutorial={handleStartTutorial}
        onHint={handleHint}
        onOpenHelp={() => setShowHelp(true)}
        onToggleMute={handleToggleMute}
        onReset={handleResetGame}
      />

      {(isTutorial || hintText) && (
        <div
          className="pixel-box guidance-pixel-banner"
          role="status"
          data-testid="guidance-banner"
        >
          {isTutorial ? tutorialBanner : `Hint: ${hintText}`}
        </div>
      )}

      <main className="main-grid">
        <BakeryCanvas
          state={state}
          visualRef={visualRef}
          onTapBake={handleTapBake}
        />

        <ManagementPanel
          state={state}
          onSelectProduct={handleSelectProduct}
          onUnlockProduct={handleUnlockProduct}
          onBuyUpgrade={handleBuyUpgrade}
          onHireStaff={handleHireStaff}
        />
      </main>

      <footer className="footer-bar">
        <span>Baked: {formatCoins(state.totalItemsBaked)}</span>
        <span>·</span>
        <span>Sold: {formatCoins(state.totalItemsSold)}</span>
        <span>·</span>
        <span>Lifetime Coins: 🪙 {formatCoins(state.totalCoinsEarned)}</span>
      </footer>

      {offlineSummary && (
        <WelcomeBackModal
          summary={offlineSummary}
          onCollect={handleCollectOffline}
        />
      )}

      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default App;
