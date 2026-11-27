import React from 'react';
import { SUIT_INFO } from '../game/constants';
import {
  canAttackWithSelection,
  canBeat,
  canThrowInWithSelection,
  getPlayableCardIds,
  getUndefendedIndices,
} from '../game/engine';
import { TUTORIAL_STEPS } from '../game/tutorial';
import type { TanDoHint, TanDoState } from '../game/types';
import { CardView } from './CardView';
import { SuitSvg } from './SuitSvg';

interface TanDoBoardProps {
  state: TanDoState;
  selectedCardIds: string[];
  selectedSlotIndex: number | null;
  hint: TanDoHint | null;
  onToggleCard: (cardId: string) => void;
  onSelectSlot: (slotIndex: number) => void;
  onAttack: () => void;
  onThrowIn: () => void;
  onPass: () => void;
  onDefend: (slotIndex?: number) => void;
  onTake: () => void;
  onHint: () => void;
  onSortHand: () => void;
  onRevealHand: () => void;
  onStartFullGame: () => void;
}

export const TanDoBoard: React.FC<TanDoBoardProps> = ({
  state,
  selectedCardIds,
  selectedSlotIndex,
  hint,
  onToggleCard,
  onSelectSlot,
  onAttack,
  onThrowIn,
  onPass,
  onDefend,
  onTake,
  onHint,
  onSortHand,
  onRevealHand,
  onStartFullGame,
}) => {
  const bottomPlayerIndex =
    state.mode === 'pass-and-play' ? state.activePlayerIndex : 0;
  const bottomPlayer = state.players[bottomPlayerIndex];
  const isHumanTurn =
    state.status === 'PLAYING' &&
    !state.handoffPending &&
    state.activePlayerIndex === bottomPlayerIndex &&
    !bottomPlayer.isAI;

  const opponents = Array.from(
    { length: state.playerCount - 1 },
    (_, offset) =>
      state.players[(bottomPlayerIndex + 1 + offset) % state.playerCount],
  );

  const playableIds = isHumanTurn
    ? getPlayableCardIds(state, bottomPlayerIndex)
    : new Set<string>();
  const hintedIds = new Set(hint?.cardIds ?? []);
  const selectedSet = new Set(selectedCardIds);

  const undefendedIndices = getUndefendedIndices(state.table);
  const canAttack =
    isHumanTurn &&
    canAttackWithSelection(state, bottomPlayerIndex, selectedCardIds);
  const canThrowIn =
    isHumanTurn &&
    canThrowInWithSelection(state, bottomPlayerIndex, selectedCardIds);
  const canPass =
    isHumanTurn && state.phase === 'THROW_IN' && !state.isTutorial;

  // Determine which undefended slot a single selected card can beat
  let targetDefendSlot: number | null = null;
  if (
    isHumanTurn &&
    state.phase === 'DEFEND_OR_PASS' &&
    selectedCardIds.length === 1
  ) {
    const card = bottomPlayer.hand.find((c) => c.id === selectedCardIds[0]);
    if (card) {
      if (
        selectedSlotIndex !== null &&
        state.table[selectedSlotIndex] &&
        state.table[selectedSlotIndex].defense === null &&
        canBeat(card, state.table[selectedSlotIndex].attack, state.trumpSuit)
      ) {
        targetDefendSlot = selectedSlotIndex;
      } else {
        const firstMatch = undefendedIndices.find((idx) =>
          canBeat(card, state.table[idx].attack, state.trumpSuit),
        );
        if (firstMatch !== undefined) {
          targetDefendSlot = firstMatch;
        }
      }
    }
  }

  const canDefend = targetDefendSlot !== null;
  const canTake =
    isHumanTurn &&
    state.phase === 'DEFEND_OR_PASS' &&
    !state.isTutorial &&
    state.table.length > 0;

  const trumpInfo = SUIT_INFO[state.trumpSuit];
  const tutorialInfo = state.isTutorial
    ? TUTORIAL_STEPS[state.tutorialStep]
    : null;

  const activePlayer = state.players[state.activePlayerIndex];
  const getRoleLabel = (playerIdx: number) => {
    if (playerIdx === state.attackerIndex) return 'Tấn / ATK';
    if (playerIdx === state.defenderIndex) return 'Đỡ / DEF';
    if (state.passedPlayers.includes(playerIdx)) return 'Đã thôi / Done';
    return 'Hội tấn / Co-ATK';
  };

  return (
    <main className="tan-board">
      {/* Opponents Strip */}
      <section className="opponents-strip" aria-label="Opponents">
        {opponents.map((opp) => {
          const isActive =
            state.status === 'PLAYING' && state.activePlayerIndex === opp.index;
          const visibleBacks = Math.min(opp.hand.length, 6);
          return (
            <div
              key={opp.index}
              className={`opponent-seat ${isActive ? 'is-active' : ''}`}
              data-testid={`opponent-seat-${opp.index}`}
            >
              <div className="opponent-meta">
                <span className="opponent-name">
                  {opp.nameVi} <small>/ {opp.nameEn}</small>
                </span>
                <span
                  className={`role-badge ${
                    opp.index === state.defenderIndex
                      ? 'is-def'
                      : opp.index === state.attackerIndex
                        ? 'is-atk'
                        : ''
                  }`}
                >
                  {getRoleLabel(opp.index)}
                </span>
              </div>
              <div className="opponent-cards-row">
                <div className="mini-backs" aria-hidden="true">
                  {Array.from({ length: visibleBacks }).map((_, i) => (
                    <span key={i} className="mini-card-back" />
                  ))}
                </div>
                <span className="card-count-badge">
                  {opp.hand.length} lá / cards
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Guidance / Tutorial / Status Banner */}
      <section
        className={`guidance-banner ${
          tutorialInfo ? 'is-tutorial' : hint ? 'is-hint' : ''
        }`}
        data-testid="guidance-banner"
        aria-live="polite"
      >
        {tutorialInfo ? (
          <div className="guidance-content">
            <span>
              <strong>{tutorialInfo.titleEn}</strong> ({tutorialInfo.titleVi}) —{' '}
              {tutorialInfo.promptVi} <em>({tutorialInfo.promptEn})</em>
            </span>
            {state.tutorialStep === 4 && (
              <button
                type="button"
                className="game-btn game-btn-primary compact-btn"
                onClick={onStartFullGame}
              >
                Chơi ván mới / Start Full Game
              </button>
            )}
          </div>
        ) : hint ? (
          <div className="guidance-content">
            <span>
              💡 {hint.messageVi} <em>({hint.messageEn})</em>
            </span>
          </div>
        ) : (
          <div className="guidance-content">
            <span>
              <strong>
                Lượt: {activePlayer.nameVi} ({activePlayer.nameEn})
              </strong>{' '}
              — {state.lastEventVi}
            </span>
          </div>
        )}
      </section>

      {/* Center Table Arena: Nọc + Trump on left, Battle Slots on center/right */}
      <section className="table-arena" aria-label="Playing table">
        <div className="noc-zone" data-testid="noc-zone">
          <div className="noc-stack">
            {state.trumpCardInNoc && (
              <div className="trump-under-card" title="Chất Trưởng / Trump Card">
                <CardView
                  card={state.trumpCard}
                  size="table"
                  isTrump
                />
              </div>
            )}
            {state.noc.length > 1 ? (
              <div className="noc-back-pile" data-testid="noc-pile">
                <CardView card={state.noc[0]} faceUp={false} size="table" />
                <span className="noc-counter">{state.noc.length}</span>
              </div>
            ) : state.noc.length === 1 ? (
              <div className="noc-empty-badge is-last" data-testid="noc-pile">
                <span>Còn 1 lá Trưởng</span>
              </div>
            ) : (
              <div className="noc-empty-badge" data-testid="noc-pile">
                <SuitSvg suit={state.trumpSuit} className="empty-trump-svg" />
                <span>
                  Hết Nọc · {trumpInfo.symbol}
                </span>
              </div>
            )}
          </div>
          <div className="noc-caption">
            <strong>Nọc: {state.noc.length}</strong>
            <span>
              Trưởng: {trumpInfo.symbol} {trumpInfo.nameVi}
            </span>
          </div>
        </div>

        <div className="table-slots" data-testid="table-slots">
          {state.table.length === 0 ? (
            <div className="table-placeholder">
              <span>
                {state.phase === 'ATTACK_OPEN'
                  ? 'Chọn bài trên tay để Tấn / Select card(s) to Attack'
                  : 'Bàn trống / Empty table'}
              </span>
            </div>
          ) : (
            state.table.map((slot, idx) => {
              const isUndefended = slot.defense === null;
              const isSlotSelected = selectedSlotIndex === idx;
              return (
                <div
                  key={slot.attack.id}
                  className={`table-slot ${
                    isUndefended ? 'is-undefended' : 'is-defended'
                  } ${isSlotSelected ? 'is-target' : ''}`}
                  data-testid={`table-slot-${idx}`}
                  data-undefended={String(isUndefended)}
                  onClick={() => {
                    if (!isHumanTurn || state.phase !== 'DEFEND_OR_PASS') return;
                    if (!isUndefended) return;
                    if (selectedCardIds.length === 1) {
                      const chosen = bottomPlayer.hand.find(
                        (c) => c.id === selectedCardIds[0],
                      );
                      if (
                        chosen &&
                        canBeat(chosen, slot.attack, state.trumpSuit)
                      ) {
                        onDefend(idx);
                        return;
                      }
                    }
                    onSelectSlot(idx);
                  }}
                >
                  <div className="slot-attack">
                    <CardView
                      card={slot.attack}
                      size="table"
                      isTrump={slot.attack.suit === state.trumpSuit}
                    />
                  </div>
                  {slot.defense && (
                    <div className="slot-defense">
                      <CardView
                        card={slot.defense}
                        size="table"
                        isTrump={slot.defense.suit === state.trumpSuit}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Bottom Player Action Bar + Hand */}
      <section className="player-dock" aria-label="Your controls and hand">
        <div className="action-bar">
          <div className="player-turn-meta">
            <span className="player-label" data-testid="active-player-label">
              {bottomPlayer.nameVi} / {bottomPlayer.nameEn}
            </span>
            <span
              className={`role-badge ${
                bottomPlayerIndex === state.defenderIndex
                  ? 'is-def'
                  : bottomPlayerIndex === state.attackerIndex
                    ? 'is-atk'
                    : ''
              }`}
            >
              {getRoleLabel(bottomPlayerIndex)}
            </span>
          </div>

          <div className="action-buttons">
            {state.phase === 'ATTACK_OPEN' && (
              <button
                type="button"
                className="game-btn game-btn-primary"
                data-testid="btn-attack"
                disabled={!canAttack}
                onClick={onAttack}
              >
                Tấn / Attack
              </button>
            )}

            {state.phase === 'THROW_IN' && (
              <>
                <button
                  type="button"
                  className="game-btn game-btn-primary"
                  data-testid="btn-throw-in"
                  disabled={!canThrowIn}
                  onClick={onThrowIn}
                >
                  Tấn thêm / Throw-in
                </button>
                <button
                  type="button"
                  className="game-btn game-btn-secondary"
                  data-testid="btn-pass"
                  disabled={!canPass}
                  onClick={onPass}
                >
                  Thôi / Done
                </button>
              </>
            )}

            {state.phase === 'DEFEND_OR_PASS' && (
              <>
                <button
                  type="button"
                  className="game-btn game-btn-primary"
                  data-testid="btn-defend"
                  disabled={!canDefend}
                  onClick={() => onDefend()}
                >
                  Đỡ / Defend
                </button>
                <button
                  type="button"
                  className="game-btn game-btn-danger"
                  data-testid="btn-take"
                  disabled={!canTake}
                  onClick={onTake}
                >
                  Ôm bài / Take
                </button>
              </>
            )}

            <button
              type="button"
              className="game-btn game-btn-secondary"
              data-testid="btn-hint"
              disabled={!isHumanTurn}
              onClick={onHint}
            >
              💡 Hint
            </button>
            <button
              type="button"
              className="game-btn game-btn-secondary"
              data-testid="btn-sort"
              disabled={state.handoffPending}
              onClick={onSortHand}
              title="Xếp bài / Sort hand"
            >
              ⇅ Xếp / Sort
            </button>
          </div>
        </div>

        <div className="player-hand" data-testid="player-hand">
          {bottomPlayer.hand.map((card) => {
            const isSelected = selectedSet.has(card.id);
            const isHinted = hintedIds.has(card.id);
            const isPlayable = isHumanTurn && playableIds.has(card.id);
            const isTrump = card.suit === state.trumpSuit;

            return (
              <CardView
                key={card.id}
                card={card}
                faceUp={!state.handoffPending}
                size="hand"
                isSelected={isSelected}
                isHinted={isHinted}
                isPlayable={!isHumanTurn || isPlayable}
                isTrump={isTrump}
                disabled={!isHumanTurn}
                onClick={() => {
                  if (!isHumanTurn) return;
                  onToggleCard(card.id);
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Pass & Play Privacy Handoff Curtain */}
      {state.handoffPending && state.status === 'PLAYING' && (
        <div
          className="privacy-curtain"
          data-testid="privacy-curtain"
          role="dialog"
          aria-modal="true"
          aria-label="Pass device privacy screen"
        >
          <div className="game-card curtain-card">
            <span className="game-badge">PASS &amp; PLAY · BẢO MẬT</span>
            <h2>
              Chuyển máy cho Người chơi {activePlayer.index + 1} / Pass device to Player{' '}
              {activePlayer.index + 1}
            </h2>
            <p className="curtain-role">
              Vai trò / Role: <strong>{getRoleLabel(activePlayer.index)}</strong> ·{' '}
              {activePlayer.hand.length} lá trên tay
            </p>
            <button
              type="button"
              className="game-btn game-btn-primary"
              data-testid="btn-reveal-hand"
              onClick={onRevealHand}
            >
              Xem bài / Reveal Hand
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
