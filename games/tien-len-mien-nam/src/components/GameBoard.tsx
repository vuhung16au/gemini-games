import React from 'react';
import {
  detectCombo,
  formatComboLabel,
  isBombCombo,
} from '../game/combos';
import { canPass, validatePlay } from '../game/engine';
import type { GameState } from '../game/types';
import { CardView } from './CardView';
import { OpponentSeat } from './OpponentSeat';
import { PrivacyCurtain } from './PrivacyCurtain';
import { RoundOverOverlay } from './RoundOverOverlay';

interface GameBoardProps {
  state: GameState;
  onToggleCard: (cardId: string) => void;
  onPlaySelected: () => void;
  onPassTurn: () => void;
  onSortHand: () => void;
  onClearSelection: () => void;
  onHint: () => void;
  onRevealHand: () => void;
  onNextRound: () => void;
  onStartFullGame: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  state,
  onToggleCard,
  onPlaySelected,
  onPassTurn,
  onSortHand,
  onClearSelection,
  onHint,
  onRevealHand,
  onNextRound,
  onStartFullGame,
}) => {
  // Determine which seat is rendered at the bottom for interaction
  const bottomSeatIndex =
    state.mode === 'pass-and-play' ? state.currentTurn : 0;
  const bottomPlayer = state.players[bottomSeatIndex];
  const opponents = state.players.filter((p) => p.id !== bottomSeatIndex);

  const isBottomTurn =
    state.status === 'PLAYING' &&
    state.currentTurn === bottomSeatIndex &&
    !bottomPlayer.isAi &&
    !state.privacyCurtain;

  const selectedCards = bottomPlayer.hand.filter((c) =>
    state.selectedCardIds.includes(c.id),
  );
  const selectedCombo = detectCombo(selectedCards);
  const playValidation = isBottomTurn
    ? validatePlay(state, bottomSeatIndex, state.selectedCardIds)
    : { ok: false as const, reason: '' };

  const allowPass = isBottomTurn && canPass(state);
  const hintedSet = new Set(state.hintedCardIds);
  const selectedSet = new Set(state.selectedCardIds);

  const playButtonText =
    selectedCombo && playValidation.ok
      ? `Đánh ${formatComboLabel(selectedCombo).split(' / ')[0]} / Play`
      : 'Đánh / Play';

  return (
    <main className="tl-board game-surface">
      {/* Opponents Row */}
      <section
        className={`tl-opponents-grid count-${opponents.length}`}
        aria-label="Opponents"
      >
        {opponents.map((opp) => (
          <OpponentSeat
            key={opp.id}
            player={opp}
            isCurrentTurn={
              state.status === 'PLAYING' && state.currentTurn === opp.id
            }
            isTrickLeader={state.trickLeader === opp.id}
          />
        ))}
      </section>

      {/* Center Trick Table */}
      <section className="tl-table-center" aria-label="Center trick area">
        <div className="tl-felt-ring" data-testid="table-center">
          {state.lastPlay ? (
            <div className="tl-last-play">
              <div className="tl-last-play-meta">
                <span className="tl-last-player">
                  {state.players[state.lastPlay.playerId].nameVi} /{' '}
                  {state.players[state.lastPlay.playerId].nameEn}
                </span>
                <span
                  className={`tl-combo-badge ${
                    isBombCombo(state.lastPlay.combo.type) ||
                    state.lastPlay.isCut
                      ? 'is-bomb'
                      : ''
                  }`}
                  data-testid="current-combo-label"
                >
                  {state.lastPlay.isCut ? '🔥 Chặt Heo · ' : ''}
                  {formatComboLabel(state.lastPlay.combo)}
                </span>
              </div>
              <div className="tl-table-cards">
                {state.lastPlay.combo.cards.map((card) => (
                  <CardView key={card.id} card={card} />
                ))}
              </div>
            </div>
          ) : (
            <div className="tl-empty-table" data-testid="empty-table-prompt">
              <span className="tl-empty-vi">
                {state.mustIncludeCardId
                  ? 'Nước đi đầu tiên bắt buộc có lá nhỏ nhất!'
                  : 'Vòng mới — Đánh bộ bài bất kỳ'}
              </span>
              <span className="tl-empty-en">
                {state.mustIncludeCardId
                  ? 'Opening round — must include lowest card'
                  : 'Free lead — play any valid combo'}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Guidance / Status Banner */}
      <div
        className={`tl-guidance-banner ${
          state.tutorial.active ? 'is-tutorial' : ''
        }`}
        data-testid="guidance-banner"
        role="status"
        aria-live="polite"
      >
        <span>
          {state.bannerMessage ??
            `${state.players[state.currentTurn].nameVi} / ${state.players[state.currentTurn].nameEn} đang suy nghĩ...`}
        </span>
        {state.tutorial.active && state.tutorial.step === 4 && (
          <button
            type="button"
            className="game-btn game-btn-primary tl-btn-sm"
            onClick={onStartFullGame}
          >
            Chơi ván mới / Start Full Game
          </button>
        )}
      </div>

      {/* Bottom Active Player Hand & Action Bar */}
      <section className="tl-player-dock" aria-label="Your hand and actions">
        <div className="tl-dock-header">
          <div className="tl-active-seat-badge" data-testid="active-player-label">
            <span className="tl-seat-dot" />
            <strong>
              {bottomPlayer.nameVi} / {bottomPlayer.nameEn}
            </strong>
            <span className="tl-seat-stats">
              ({bottomPlayer.hand.length} lá · {bottomPlayer.score} đ)
            </span>
          </div>

          <div className="tl-action-bar">
            <button
              type="button"
              className="game-btn game-btn-primary tl-action-btn"
              disabled={!playValidation.ok}
              onClick={onPlaySelected}
              data-testid="play-btn"
            >
              {playButtonText}
            </button>
            <button
              type="button"
              className="game-btn game-btn-danger tl-action-btn"
              disabled={!allowPass}
              onClick={onPassTurn}
              data-testid="pass-btn"
            >
              Bỏ lượt / Pass
            </button>
            <button
              type="button"
              className="game-btn game-btn-secondary tl-action-btn"
              onClick={onSortHand}
              data-testid="sort-btn"
            >
              Xếp bài / Sort
            </button>
            <button
              type="button"
              className="game-btn game-btn-secondary tl-action-btn"
              disabled={state.selectedCardIds.length === 0}
              onClick={onClearSelection}
              data-testid="clear-btn"
            >
              Bỏ chọn / Clear
            </button>
            <button
              type="button"
              className="game-btn game-btn-secondary tl-action-btn"
              disabled={!isBottomTurn}
              onClick={onHint}
              data-testid="hint-btn"
            >
              💡 Gợi ý / Hint
            </button>
          </div>
        </div>

        <div className="tl-hand-fan" data-testid="player-hand">
          {bottomPlayer.hand.map((card) => (
            <CardView
              key={card.id}
              card={card}
              interactive={isBottomTurn}
              isSelected={selectedSet.has(card.id)}
              isHinted={hintedSet.has(card.id)}
              isRequired={state.mustIncludeCardId === card.id}
              onClick={() => onToggleCard(card.id)}
            />
          ))}
        </div>
      </section>

      {/* Pass & Play Privacy Handoff Curtain */}
      {state.status === 'PLAYING' &&
        state.mode === 'pass-and-play' &&
        state.privacyCurtain && (
          <PrivacyCurtain
            player={state.players[state.currentTurn]}
            onReveal={onRevealHand}
          />
        )}

      {/* Round Over / Tutorial Done Overlay */}
      <RoundOverOverlay
        state={state}
        onNextRound={onNextRound}
        onStartFullGame={onStartFullGame}
      />
    </main>
  );
};
