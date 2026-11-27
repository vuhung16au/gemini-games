# Architecture — Tá Lả (Phỏm)

The codebase strictly separates pure deterministic game rules (`src/game/`) from React UI components (`src/components/`).

## Module Structure

```text
src/
├── main.tsx                 # Imports shared tokens.css, game-ui.css, and local style.css
├── App.tsx                  # Top-level state orchestration, AI turn timer, keyboard & stats persistence
├── style.css                # 100dvh felt table, responsive card sizing, overlays
├── game/
│   ├── types.ts             # Core types: Card, PhomMeld, TaLaState, PlayerResult, PhomHint
│   ├── constants.ts         # STORAGE_KEY ('ta_la_phom_v1'), rank/suit helpers, cardPoints
│   ├── deck.ts              # 52-card deck creation, Fisher-Yates shuffle, card comparators
│   ├── phom.ts              # isValidPhom, solveOptimalMelds, canLayOffCard, findLayOffOptions, canDeclareU
│   ├── engine.ts            # Pure state transitions: createNewGame, eatLastDiscard, drawFromNoc, meldOptimalPhoms, layOffSingleCard, discardCard, declareU
│   ├── ai.ts                # Smart AI heuristics (shouldAiEat, chooseAiDiscardCardId, runAiStep)
│   ├── hints.ts             # Bilingual getPhomHint(state)
│   ├── tutorial.ts          # 3-step scripted tutorial (Draw/Eat -> Discard -> Form Phỏm)
│   ├── audio.ts             # Procedural Web Audio API SoundEngine
│   └── storage.ts           # Safe try/catch localStorage persistence
└── components/
    ├── SuitSvg.tsx          # SVG suit pips and ornamental card back
    ├── CardView.tsx         # Crisp CSS/SVG card component with Phỏm/Ăn/Hint indicators
    ├── Header.tsx           # Emblem, player count (2P/3P/4P), mode tabs, Hint/Tutorial/Help/Mute
    ├── TableBoard.tsx       # Opponents, Nọc & Discard piles, viewer hand, and phase action bar
    ├── PrivacyCurtain.tsx   # Pass & Play device handoff screen
    ├── ResultOverlay.tsx    # Hand summary with melds, deadwood, Ù/Móm badges
    └── HowToPlayModal.tsx   # Bilingual VN/EN rules dialog
```

## State Machine & Data Flow

1. **Setup:** `createNewGame` deals 10 cards to `dealerIndex` (`phase = 'discard'`) and 9 cards to other players, placing remaining cards in `nocPile`.
2. **Turn Cycle (Rounds 1–3):**
   - `draw_or_eat` → `eatLastDiscard` (strictly validated via `solveOptimalMelds`) or `drawFromNoc` → `discard`.
   - `discard` → `discardCard` moves a legal card (non-eaten and preserving eaten-card Phỏms) to `discards`, advances `currentPlayerIndex`, and increments `round` after all players act.
3. **Round 4 (Hạ bài):**
   - `draw_or_eat` → `meld` → `meldOptimalPhoms` & optional `layOffSingleCard` (`Gửi bài`) → `proceedToDiscard` → `discard` → `game_over` (`finishByPoints` or `finishWithU`).
4. **Instant Ù:** Available whenever `canDeclareU` detects 0 deadwood (10 cards in Phỏms or 9 cards in Phỏms + 1 discard).
