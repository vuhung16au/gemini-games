import React from 'react';
import { getComboLabel, validatePlay } from '../game/rules';
import type { GameState, Player } from '../game/types';
import { CardBack, PlayingCard } from './PlayingCard';

interface TableBoardProps {
  state: GameState;
  selectedIds: string[];
  hintCardIds: string[];
  onToggleCard: (cardId: string) => void;
  onPlay: () => void;
  onPass: () => void;
  onClearSelection: () => void;
  onSort: () => void;
  onRevealHandoff: () => void;
  onFinishTutorial: () => void;
}

interface OpponentSeatProps {
  player: Player;
  isActive: boolean;
  positionClass: string;
}

const OpponentSeat: React.FC<OpponentSeatProps> = ({
  player,
  isActive,
  positionClass,
}) => {
  const visibleBacks = Math.min(player.hand.length, 6);
  return (
    <div
      className={`tl-seat ${positionClass} ${isActive ? 'tl-seat-active' : ''} ${
        player.passed ? 'tl-seat-passed' : ''
      }`}
      data-testid={`seat-${player.id}`}
    >
      <div className="tl-seat-header">
        <span className="tl-seat-name">
          {player.nameVi} / {player.nameEn}
        </span>
        <span className="tl-seat-count">{player.hand.length} lá</span>
      </div>
      {player.passed && (
        <span className="tl-passed-pill">Bỏ lượt / Passed</span>
      )}
      <div className="tl-mini-backs">
        {Array.from({ length: visibleBacks }).map((_, idx) => (
          <CardBack key={idx} mini />
        ))}
      </div>
    </div>
  );
};

export const TableBoard: React.FC<TableBoardProps> = ({
  state,
  selectedIds,
  hintCardIds,
  onToggleCard,
  onPlay,
  onPass,
  onClearSelection,
  onSort,
  onRevealHandoff,
  onFinishTutorial,
}) => {
  // Determine which player is shown at the bottom:
  // In hotseat, show currentPlayerIndex (covered by curtain until revealed);
  // In vs AI, always show Player 0 (human) at bottom!
  const bottomIdx = state.mode === 'hotseat' ? state.currentPlayerIndex : 0;
  const bottomPlayer = state.players[bottomIdx];
  const isBottomTurn =
    state.status === 'playing' &&
    state.currentPlayerIndex === bottomIdx &&
    !state.handoffRequired;

  // Compute opponent seats clockwise from bottomIdx
  const otherIndices: number[] = [];
  for (let offset = 1; offset < state.players.length; offset++) {
    otherIndices.push((bottomIdx + offset) % state.players.length);
  }

  const getPositionClass = (posIdx: number, totalOthers: number): string => {
    if (totalOthers === 1) return 'tl-seat-top';
    if (totalOthers === 2) return posIdx === 0 ? 'tl-seat-left' : 'tl-seat-top';
    if (posIdx === 0) return 'tl-seat-left';
    if (posIdx === 1) return 'tl-seat-top';
    return 'tl-seat-right';
  };

  const selectedSet = new Set(selectedIds);
  const hintSet = new Set(hintCardIds);

  const selectionCheck =
    isBottomTurn && selectedIds.length > 0 && !state.isTutorial
      ? validatePlay(state, selectedIds)
      : null;

  const comboPreview =
    selectionCheck?.valid && selectionCheck.combo
      ? getComboLabel(selectionCheck.combo)
      : null;

  const canPass =
    isBottomTurn && !state.isTutorial && state.tableCombo !== null;

  const tableLabel = state.tableCombo ? getComboLabel(state.tableCombo) : null;

  return (
    <main className="tl-table">
      {/* Guidance / Event Banner */}
      {state.eventBanner && (
        <div
          className={`tl-banner tl-banner-${state.eventBanner.tone}`}
          data-testid="guidance-banner"
        >
          <span>
            {state.eventBanner.vi} · {state.eventBanner.en}
          </span>
          {state.isTutorial && state.tutorialStep >= 3 && (
            <button
              type="button"
              className="game-btn game-btn-primary tl-btn-sm"
              onClick={onFinishTutorial}
              data-testid="start-full-game-btn"
            >
              Chơi ván đầy đủ / Start Full Game
            </button>
          )}
        </div>
      )}

      {/* Thối 2 live pre-play warning */}
      {selectionCheck?.warnsThoi2 && (
        <div className="tl-banner tl-banner-warning" data-testid="thoi2-warning">
          ⚠️ Cảnh báo: Đánh bộ này sẽ chỉ còn toàn quân 2 (nguy cơ Thối 2)! / Warning: Only 2s will remain!
        </div>
      )}

      {/* Opponent Seats */}
      <div className="tl-arena">
        {otherIndices.map((pIdx, idx) => (
          <OpponentSeat
            key={state.players[pIdx].id}
            player={state.players[pIdx]}
            isActive={
              state.status === 'playing' && state.currentPlayerIndex === pIdx
            }
            positionClass={getPositionClass(idx, otherIndices.length)}
          />
        ))}

        {/* Center Trick Felt */}
        <div className="tl-center-felt" data-testid="table-center">
          {state.tableCombo ? (
            <>
              <div className="tl-table-meta">
                <span className="tl-table-owner">{state.tableOwnerName}</span>
                {tableLabel && (
                  <span className="tl-table-combo-tag">
                    {tableLabel.vi} / {tableLabel.en}
                  </span>
                )}
              </div>
              <div className="tl-table-cards">
                {state.tableCombo.cards.map((c) => (
                  <PlayingCard key={c.id} card={c} compact />
                ))}
              </div>
            </>
          ) : (
            <div className="tl-table-empty">
              <span className="tl-table-empty-vi">
                {state.isFirstTurnOfMatch && state.mustIncludeCardId === 'spades-3'
                  ? 'Lượt mở đầu: Đánh kèm 3♠'
                  : 'Vòng mới — Tự do đánh'}
              </span>
              <span className="tl-table-empty-en">
                {state.isFirstTurnOfMatch && state.mustIncludeCardId === 'spades-3'
                  ? 'Opening Turn: Must include 3♠'
                  : 'New Trick — Free Lead'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Active Player Area */}
      <section className="tl-bottom-zone" aria-label="Bài của bạn / Your Hand">
        <div className="tl-controls-bar">
          <div className="tl-player-badge">
            <span
              className={`tl-turn-dot ${isBottomTurn ? 'active' : ''}`}
              aria-hidden="true"
            />
            <strong>
              {bottomPlayer.nameVi} / {bottomPlayer.nameEn}
            </strong>
            <span className="tl-hand-count">({bottomPlayer.hand.length})</span>
            {comboPreview && (
              <span className="tl-selection-preview">
                {comboPreview.vi} · {comboPreview.en}
              </span>
            )}
            {selectionCheck && !selectionCheck.valid && (
              <span className="tl-selection-error">
                {selectionCheck.reasonVi} / {selectionCheck.reasonEn}
              </span>
            )}
          </div>

          <div className="tl-action-buttons">
            <button
              type="button"
              className="game-btn game-btn-secondary tl-btn-action"
              onClick={onSort}
              data-testid="sort-btn"
            >
              Xếp bài / Sort ({state.sortMode === 'rank' ? '3→2' : 'Bộ'})
            </button>
            <button
              type="button"
              className="game-btn game-btn-secondary tl-btn-action"
              onClick={onClearSelection}
              disabled={selectedIds.length === 0}
              data-testid="clear-btn"
            >
              Bỏ chọn / Clear
            </button>
            <button
              type="button"
              className="game-btn game-btn-danger tl-btn-action"
              onClick={onPass}
              disabled={!canPass}
              data-testid="pass-btn"
            >
              Bỏ lượt / Pass
            </button>
            <button
              type="button"
              className="game-btn game-btn-primary tl-btn-action"
              onClick={onPlay}
              disabled={!isBottomTurn || selectedIds.length === 0}
              data-testid="play-btn"
            >
              Đánh / Play
            </button>
          </div>
        </div>

        <div className="tl-hand" data-testid="player-hand">
          {bottomPlayer.hand.map((c) => (
            <PlayingCard
              key={c.id}
              card={c}
              selected={selectedSet.has(c.id)}
              hinted={hintSet.has(c.id)}
              mustPlay={
                state.isFirstTurnOfMatch && state.mustIncludeCardId === c.id
              }
              onClick={() => isBottomTurn && onToggleCard(c.id)}
            />
          ))}
        </div>
      </section>

      {/* Privacy Handoff Curtain for Pass & Play (Hotseat) */}
      {state.handoffRequired && state.status === 'playing' && (
        <div
          className="game-overlay-backdrop tl-handoff-curtain"
          data-testid="handoff-curtain"
        >
          <div className="game-card tl-handoff-card">
            <div className="tl-result-badge">PASS &amp; PLAY · BẢO MẬT BÀI</div>
            <h2>
              Chuyển máy cho {bottomPlayer.nameVi} / Pass device to{' '}
              {bottomPlayer.nameEn}
            </h2>
            <p className="tl-handoff-sub">
              Đảm bảo người chơi khác không nhìn thấy bài của bạn trước khi mở.
              <br />
              Make sure other players aren&apos;t looking before revealing your hand.
            </p>
            <button
              type="button"
              className="game-btn game-btn-primary"
              onClick={onRevealHandoff}
              data-testid="reveal-hand-btn"
            >
              Xem bài / Reveal Hand
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
