# Architecture — Tấn Đỡ (Bài Tấn)

Tấn Đỡ separates pure deterministic game simulation (`src/game/`), browser services (audio & storage), and React UI components (`src/components/`).

## Module Layout
- **`src/game/types.ts` & `src/game/constants.ts`**: Immutable state contracts (`TanDoState`, `TableSlot`, `BoutPhase`, `SaveData`) and deck/suit metadata.
- **`src/game/engine.ts`**: Pure rules engine—52-card deal, `canBeat` trump comparison, `applyAttack`, `applyDefend`, `applyThrowIn`, `applyPassThrowIn`, `applyTakeCards`, bout clearing, Nọc refill ordering (Attacker first, Defender last), and victory checks.
- **`src/game/ai.ts`**: Minimum-cost defense backtracking (`findBestDefenseAssignment`) and smart AI turn selection (`chooseAIMove`).
- **`src/game/hints.ts`**: Contextual bilingual advisor (`getTanDoHint`) highlighting optimal attack, defense, throw-in, take, or pass moves.
- **`src/game/tutorial.ts`**: Scripted 3-step walkthrough teaching Attack, Throw-in, and Trump Defense.
- **`src/game/audio.ts` & `src/game/storage.ts`**: Procedural Web Audio API sound effects (`SoundEngine`) and safe `try/catch` persistence under `tan_do_v1`.
- **`src/components/`**: `Header`, `TanDoBoard`, `CardView`, `SuitSvg`, `HowToPlayModal`, and `GameOverlay`.

## State Machine & Turn Flow
1. **`ATTACK_OPEN`**: Primary Attacker plays 1 card (or same-rank cards) onto the table → transitions to `DEFEND_OR_PASS`.
2. **`DEFEND_OR_PASS`**: Defender either beats each undefended attack card (`applyDefend`) or takes all table cards (`applyTakeCards`). Once all slots are defended, if further throw-ins are allowed, phase moves to `THROW_IN`; otherwise the bout resolves immediately.
3. **`THROW_IN`**: Active Attacker (and co-attackers clockwise in 3P/4P) may add cards matching any rank on the table (up to 6 slots and Defender's remaining hand size) or click `Thôi / Done` (`applyPassThrowIn`). Once all attackers pass, the bout clears and Defender becomes the next Attacker.
4. **Pass & Play Handoff**: Whenever `mode === 'pass-and-play'` and `activePlayerIndex` changes between seats, `handoffPending` activates the Privacy Curtain until the incoming player clicks **Xem bài / Reveal Hand**.
