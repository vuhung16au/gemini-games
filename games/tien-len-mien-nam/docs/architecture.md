# Architecture — Tiến Lên Miền Nam

The project enforces a strict separation between pure game simulation (`src/game/`), audio/persistence adapters, and React UI components (`src/components/`).

## Module Breakdown

```text
src/
├── main.tsx                 # Imports shared tokens.css, game-ui.css, and style.css
├── App.tsx                  # Top-level state coordinator, AI timer loop, keyboard shortcuts
├── style.css                # 100dvh responsive felt table & crisp CSS playing card styling
├── game/
│   ├── types.ts             # Card, Combo, Player, GameState, RoundResult, TutorialState types
│   ├── constants.ts         # Ranks, suits, bilingual labels, STORAGE_KEY, AI_THINK_DELAY_MS
│   ├── combos.ts            # Deck, sorting, detectCombo, canBeat, checkToiTrang, findLegalPlays
│   ├── engine.ts            # Pure state transitions (createNewGame, playCards, passTurn, scoring)
│   ├── ai.ts                # Southern AI heuristic (chooseAiPlay)
│   ├── hints.ts             # Smart hint provider (getSouthernHint)
│   ├── tutorial.ts          # Deterministic 3-step Tutorial scenario & validator
│   ├── audio.ts             # Procedural Web Audio API sound effects (soundManager)
│   ├── storage.ts           # Safe try/catch localStorage adapter (tien_len_mien_nam_v1)
│   └── __tests__/
│       └── tienLen.test.ts  # Vitest unit suite for rules, bombs, Tới Trắng, AI, & storage
└── components/
    ├── Header.tsx           # Emblem, bilingual title, stats, 2P/3P/4P & mode tabs, Help/Mute
    ├── GameBoard.tsx        # Felt table, opponent grid, center trick area, dock & action bar
    ├── OpponentSeat.tsx     # Compact opponent hand count, score, and turn/pass status
    ├── CardView.tsx         # Crisp interactive SVG/CSS playing card
    ├── SuitSvg.tsx          # Inline SVG vectors for ♠ ♣ ♦ ♥ and card back pattern
    ├── PrivacyCurtain.tsx   # Pass & Play handoff curtain ("Chuyển máy cho Người chơi X")
    ├── HowToPlayModal.tsx   # Bilingual rules & Chặt Heo reference modal
    └── RoundOverOverlay.tsx # Round summary, Tới Trắng showcase, & penalty breakdown
```

## State & Turn Lifecycle

1. **Initialization (`createNewGame`)**: Shuffles 52 cards, deals 13 cards per player (`2P`, `3P`, or `4P`), locates the lowest dealt card (`3♠` in 4P) as `mustIncludeCardId`, and checks `checkToiTrang` clockwise.
2. **Active Play (`PLAYING`)**:
   - In `vs AI`, when `players[currentTurn].isAi` is true, `App.tsx` schedules `chooseAiPlay(state)` after `AI_THINK_DELAY_MS` (`520ms`).
   - In `Pass & Play`, transitioning turns between distinct human players sets `privacyCurtain = true`, hiding cards behind `PrivacyCurtain` until `"Xem bài / Reveal Hand"` is clicked.
3. **Trick Resolution**: `passTurn` marks `passedThisTrick = true`. When only one non-passed player remains, the trick clears (`currentCombo = null`, `passedThisTrick` resets) and that player leads freely.
4. **Round End (`ROUND_OVER`)**: Triggered on `TOI_TRANG` or when a player empties their hand (`OUT_OF_CARDS`). Calculates remaining card, Cóng (`×2`), and Thối Heo/Hàng penalties, updates `tien_len_mien_nam_v1` via `savePersistedData`, and presents `RoundOverOverlay`.
