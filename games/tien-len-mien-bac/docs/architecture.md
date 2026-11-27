# Architecture — Tiến Lên Miền Bắc

The codebase cleanly separates pure deterministic game rules (`src/game/`), procedural Web Audio & storage adapters, and React 18 UI overlays (`src/components/`).

## Module Structure

```text
src/
├── main.tsx                    # Imports shared styles (tokens.css, game-ui.css) + ./style.css
├── App.tsx                     # Root controller, AI turn scheduler, keyboard shortcuts, persistence
├── style.css                   # 100dvh scrollbar-free card table & responsive CSS/SVG card layout
├── game/
│   ├── types.ts                # Card, Combo, Player, GameState, SaveData, ValidationResult types
│   ├── deck.ts                 # 52-card deck creation, shuffle, rank/suit sort & combo grouping
│   ├── rules.ts                # classifyNorthernCombo, canBeatNorthern, validatePlay, findValidPlays
│   ├── hints.ts                # getNorthernHint(state) lowest valid beating combo selector
│   ├── ai.ts                   # chooseAiAction(state) smart Northern AI heuristics
│   ├── engine.ts               # createGameState, playCards, passTurn, revealHandoff, toggleSortMode
│   ├── tutorial.ts             # Curated 3-step Tutorial state & step progression
│   ├── audio.ts                # Web Audio API procedural SFX (SoundEngine)
│   └── storage.ts              # Safe try/catch localStorage under tien_len_mien_bac_v1
└── components/
    ├── Header.tsx              # 2P/3P/4P, vs AI / Pass & Play, Stats, Tutorial, Hint, Help, Mute
    ├── TableBoard.tsx          # Opponent seats, center trick felt, hand fan, Privacy Handoff Curtain
    ├── PlayingCard.tsx         # Crisp CSS/SVG playing cards (♠ ♣ ♦ ♥) & CardBack
    ├── HowToPlayModal.tsx      # Bilingual VN/EN rules & keyboard shortcuts modal
    └── GameOverlay.tsx         # End-of-round score breakdown (Thối 2, Chặt Heo, Winner)
```

## State Transitions & Data Flow

1. **Dealing (`createGameState`):** Deals 13 cards per player (`2P`–`4P`). Locates `3♠` if dealt to set opening player and `mustIncludeCardId = 'spades-3'`; otherwise the lowest-card holder leads freely.
2. **Play / Pass (`playCards`, `passTurn`):**
   - `validatePlay` verifies Northern combo structure, `3♠` opening requirement, `canBeatNorthern`, and **Thối 2** (`isThoi2Block` / `warnsThoi2`).
   - Passing locks the player out of the active trick; when only one active player remains, the trick clears and that player leads freely.
   - A deadlock guard automatically resolves **Thối 2** if a player reaches a free lead holding only `2`s.
3. **Pass & Play Handoff:** Whenever `mode === 'hotseat'` transitions to a human player, `handoffRequired` becomes `true`, masking the hand behind the Privacy Handoff Curtain until `revealHandoff` is triggered.
4. **Persistence:** Match wins, total score, best score, mute state, player count, and mode are persisted via `saveSaveData` under `tien_len_mien_bac_v1`.
