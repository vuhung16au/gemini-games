import React from 'react';
import { formatCardShort } from '../game/constants';
import { canEatLastDiscard, getLegalDiscardIds } from '../game/engine';
import { canDeclareU, findLayOffOptions, solveOptimalMelds } from '../game/phom';
import { getTutorialBannerText } from '../game/tutorial';
import type { LayOffOption, PhomHint, PlayerState, TaLaState } from '../game/types';
import { CardView } from './CardView';

interface TableBoardProps {
  state: TaLaState;
  selectedCardId: string | null;
  hint: PhomHint | null;
  isCurtainOpen: boolean;
  onSelectCard: (cardId: string) => void;
  onDraw: () => void;
  onEat: () => void;
  onMeld: () => void;
  onLayOff: (option: LayOffOption) => void;
  onProceedToDiscard: () => void;
  onDiscard: (cardId: string) => void;
  onDeclareU: () => void;
  onSortHand: () => void;
  onExitTutorialToGame: () => void;
}

export const TableBoard: React.FC<TableBoardProps> = ({
  state,
  selectedCardId,
  hint,
  isCurtainOpen,
  onSelectCard,
  onDraw,
  onEat,
  onMeld,
  onLayOff,
  onProceedToDiscard,
  onDiscard,
  onDeclareU,
  onSortHand,
  onExitTutorialToGame,
}) => {
  const viewerIndex =
    state.mode === 'vs-ai'
      ? 0
      : state.phase === 'game_over'
        ? 0
        : state.currentPlayerIndex;

  const viewer = state.players[viewerIndex];
  const viewerIsActive =
    !isCurtainOpen &&
    state.phase !== 'game_over' &&
    state.currentPlayerIndex === viewerIndex &&
    !viewer.isAi;

  // Arrange opponents clockwise starting after viewer
  const opponents: PlayerState[] = [];
  for (let offset = 1; offset < state.playerCount; offset++) {
    opponents.push(state.players[(viewerIndex + offset) % state.playerCount]);
  }

  const canEat = viewerIsActive && canEatLastDiscard(state, viewerIndex);
  const legalDiscardSet = new Set(
    viewerIsActive && state.phase === 'discard' ? getLegalDiscardIds(state, viewerIndex) : [],
  );

  const solvedViewer = solveOptimalMelds(viewer.hand, viewer.eatenCardIds, {
    maxEatenPerMeld: 1,
  });
  const phomCardIds = new Set<string>();
  for (const meld of solvedViewer.melds) {
    for (const c of meld) phomCardIds.add(c.id);
  }
  const eatenSet = new Set(viewer.eatenCardIds);
  const canU =
    viewerIsActive &&
    (state.phase === 'discard' || state.phase === 'meld') &&
    canDeclareU(viewer.hand, viewer.eatenCardIds);

  const layOffOptions =
    viewerIsActive && state.phase === 'meld' && viewer.hasMelded && viewer.melds.length > 0
      ? findLayOffOptions(viewer.hand, state.players)
      : [];

  const selectedLayOff = selectedCardId
    ? layOffOptions.find((opt) => opt.card.id === selectedCardId) ?? null
    : layOffOptions[0] ?? null;

  const eatCardLabel = state.lastDiscard ? formatCardShort(state.lastDiscard.card) : '';

  // Determine banner message
  const bannerMessage = state.tutorialMode
    ? getTutorialBannerText(state.tutorialStep)
    : hint
      ? hint.message
      : state.lastActionText;

  const selectedIsLegalDiscard =
    selectedCardId !== null && legalDiscardSet.has(selectedCardId);

  const seatClasses =
    state.playerCount === 2
      ? ['seat-top']
      : state.playerCount === 3
        ? ['seat-top-left', 'seat-top-right']
        : ['seat-left', 'seat-top', 'seat-right'];

  return (
    <div className={`tala-table players-${state.playerCount}`}>
      {/* Opponent Seats */}
      <div className="opponents-layer">
        {opponents.map((opp, idx) => {
          const isTurn =
            state.phase !== 'game_over' && state.currentPlayerIndex === opp.index;
          return (
            <div
              key={opp.index}
              className={`opponent-seat ${seatClasses[idx]} ${isTurn ? 'is-turn' : ''}`}
              data-testid={`opponent-seat-${opp.index}`}
            >
              <div className="seat-header">
                <span className="seat-name">
                  {opp.nameVi} / {opp.nameEn}
                </span>
                <span className="seat-count">{opp.hand.length} lá</span>
                {isTurn && <span className="turn-pill">Đang đi</span>}
              </div>

              <div className="seat-cards-row">
                <div className="opp-hand-fan" aria-label={`${opp.nameEn} hand (${opp.hand.length} cards)`}>
                  {opp.hand.slice(0, 6).map((c) => (
                    <CardView key={c.id} faceDown size="xs" />
                  ))}
                  {opp.hand.length > 6 && (
                    <span className="extra-count">+{opp.hand.length - 6}</span>
                  )}
                </div>

                {opp.discards.length > 0 && (
                  <div className="opp-discards" aria-label={`${opp.nameEn} discards`}>
                    {opp.discards.map((d) => (
                      <CardView key={d.id} card={d} size="xs" />
                    ))}
                  </div>
                )}
              </div>

              {opp.melds.length > 0 && (
                <div className="seat-melds">
                  {opp.melds.map((meld) => {
                    const matchingLayoff = layOffOptions.find(
                      (o) =>
                        o.targetPlayerIndex === opp.index &&
                        o.targetMeldId === meld.id &&
                        (!selectedCardId || o.card.id === selectedCardId),
                    );
                    return (
                      <div
                        key={meld.id}
                        className={`meld-group ${matchingLayoff ? 'can-layoff' : ''}`}
                        onClick={matchingLayoff ? () => onLayOff(matchingLayoff) : undefined}
                        title={
                          matchingLayoff
                            ? `Gửi ${formatCardShort(matchingLayoff.card)} vào đây / Lay off here`
                            : undefined
                        }
                      >
                        {meld.cards.map((c) => (
                          <CardView key={c.id} card={c} inPhom size="xs" />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Center Felt: Nọc + Last Discard + Guidance */}
      <div className="table-center">
        <div className="center-piles">
          <div className="pile-box">
            <span className="pile-label">Nọc ({state.nocPile.length})</span>
            <button
              type="button"
              className={`noc-button ${viewerIsActive && state.phase === 'draw_or_eat' ? 'is-ready' : ''} ${hint?.target === 'draw' ? 'is-hint-ring' : ''}`}
              data-testid="noc-pile"
              disabled={!viewerIsActive || state.phase !== 'draw_or_eat'}
              onClick={onDraw}
              aria-label={`Bốc bài từ Nọc / Draw from Nọc (${state.nocPile.length} cards left)`}
            >
              <CardView
                faceDown
                size="md"
                isHinted={hint?.target === 'draw'}
              />
              <span className="noc-count-badge">{state.nocPile.length}</span>
            </button>
          </div>

          <div className="pile-box">
            <span className="pile-label">
              {state.lastDiscard
                ? `Vừa đánh / Discard (${state.players[state.lastDiscard.playerIndex].nameVi})`
                : 'Bài đánh / Discard'}
            </span>
            <div
              className={`eat-slot ${canEat ? 'can-eat' : ''} ${hint?.target === 'eat' ? 'is-hint-ring' : ''}`}
              data-testid="eat-target"
            >
              {state.lastDiscard ? (
                <CardView
                  card={state.lastDiscard.card}
                  size="md"
                  isHinted={hint?.target === 'eat'}
                  onClick={canEat ? onEat : undefined}
                />
              ) : (
                <div className="empty-card-slot">Trống</div>
              )}
            </div>
          </div>
        </div>

        {/* Viewer's own laid-down melds & discards */}
        {(viewer.melds.length > 0 || viewer.discards.length > 0) && (
          <div className="viewer-table-strip">
            {viewer.melds.length > 0 && (
              <div className="viewer-melds" data-testid="viewer-melds">
                <span className="strip-label">Phỏm đã hạ:</span>
                {viewer.melds.map((meld) => {
                  const matchingLayoff = layOffOptions.find(
                    (o) =>
                      o.targetPlayerIndex === viewer.index &&
                      o.targetMeldId === meld.id &&
                      (!selectedCardId || o.card.id === selectedCardId),
                  );
                  return (
                    <div
                      key={meld.id}
                      className={`meld-group ${matchingLayoff ? 'can-layoff' : ''}`}
                      onClick={matchingLayoff ? () => onLayOff(matchingLayoff) : undefined}
                    >
                      {meld.cards.map((c) => (
                        <CardView key={c.id} card={c} inPhom size="xs" />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
            {viewer.discards.length > 0 && (
              <div className="viewer-discards" data-testid="viewer-discards">
                <span className="strip-label">Đã đánh:</span>
                {viewer.discards.map((d) => (
                  <CardView key={d.id} card={d} size="xs" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guidance / Status Banner */}
        <div
          className={`guidance-banner ${state.tutorialMode ? 'is-tutorial' : hint ? 'is-hint' : ''}`}
          data-testid="guidance-banner"
          role="status"
          aria-live="polite"
        >
          <span>{bannerMessage}</span>
          {state.tutorialMode && state.tutorialStep === 4 && (
            <button
              type="button"
              className="game-btn game-btn-primary btn-compact"
              data-testid="start-full-game-btn"
              onClick={onExitTutorialToGame}
            >
              Chơi ván mới / Start Full Game
            </button>
          )}
        </div>
      </div>

      {/* Bottom Active Player Zone */}
      <div className="player-dock">
        <div className="player-status-bar">
          <div className="player-identity">
            <strong>
              {viewer.nameVi} / {viewer.nameEn}
            </strong>
            <span className="status-chip" data-testid="deadwood-display">
              Điểm rác / Deadwood: {solvedViewer.deadwoodPoints}
            </span>
            <span className="status-chip" data-testid="phom-count-display">
              Phỏm: {viewer.melds.length + solvedViewer.melds.length}
            </span>
          </div>

          <div className="phase-indicator" data-testid="phase-display">
            {state.phase === 'draw_or_eat' &&
              (viewerIsActive ? 'Bốc Nọc hoặc Ăn bài / Draw or Eat' : 'Chờ lượt / Waiting...')}
            {state.phase === 'meld' &&
              (viewerIsActive ? 'Vòng 4: Hạ Phỏm & Gửi bài / Meld & Lay Off' : 'Đối thủ đang hạ bài...')}
            {state.phase === 'discard' &&
              (viewerIsActive ? 'Chọn 1 lá để Đánh / Select 1 card to Discard' : 'Đối thủ đang đánh...')}
          </div>
        </div>

        <div className="player-hand-row" data-testid="player-hand">
          {viewer.hand.map((card) => {
            const legal =
              state.phase === 'discard' ? legalDiscardSet.has(card.id) : true;
            return (
              <CardView
                key={card.id}
                card={card}
                faceDown={isCurtainOpen}
                selected={selectedCardId === card.id}
                inPhom={phomCardIds.has(card.id)}
                isEaten={eatenSet.has(card.id)}
                isHinted={hint?.cardId === card.id}
                disabled={viewerIsActive && state.phase === 'discard' && !legal}
                size="lg"
                onClick={() => {
                  if (!viewerIsActive) return;
                  onSelectCard(card.id);
                }}
                onDoubleClick={() => {
                  if (viewerIsActive && state.phase === 'discard' && legal) {
                    onDiscard(card.id);
                  }
                }}
              />
            );
          })}
        </div>

        <div className="action-bar" data-testid="action-bar">
          {state.phase === 'draw_or_eat' && (
            <>
              <button
                type="button"
                className={`game-btn ${canEat ? 'game-btn-danger' : 'game-btn-secondary'} ${hint?.target === 'eat' ? 'is-hint-btn' : ''}`}
                data-testid="eat-btn"
                disabled={!canEat}
                onClick={onEat}
              >
                {state.lastDiscard ? `Ăn ${eatCardLabel} / Eat` : 'Ăn / Eat'}
              </button>
              <button
                type="button"
                className={`game-btn game-btn-primary ${hint?.target === 'draw' ? 'is-hint-btn' : ''}`}
                data-testid="draw-btn"
                disabled={!viewerIsActive}
                onClick={onDraw}
              >
                Bốc / Draw
              </button>
            </>
          )}

          {state.phase === 'meld' && (
            <>
              {!viewer.hasMelded && (
                <button
                  type="button"
                  className={`game-btn game-btn-primary ${hint?.target === 'meld' ? 'is-hint-btn' : ''}`}
                  data-testid="meld-btn"
                  disabled={!viewerIsActive}
                  onClick={onMeld}
                >
                  {solvedViewer.melds.length > 0
                    ? `Hạ ${solvedViewer.melds.length} Phỏm / Meld`
                    : 'Không có Phỏm (Móm) / No Phỏm'}
                </button>
              )}

              {viewer.hasMelded && layOffOptions.length > 0 && selectedLayOff && (
                <button
                  type="button"
                  className={`game-btn game-btn-danger ${hint?.target === 'layoff' ? 'is-hint-btn' : ''}`}
                  data-testid="layoff-btn"
                  disabled={!viewerIsActive}
                  onClick={() => onLayOff(selectedLayOff)}
                >
                  Gửi {formatCardShort(selectedLayOff.card)} / Lay Off
                </button>
              )}

              {viewer.hasMelded && (
                <button
                  type="button"
                  className={`game-btn game-btn-primary ${hint?.target === 'proceed_discard' ? 'is-hint-btn' : ''}`}
                  data-testid="proceed-discard-btn"
                  disabled={!viewerIsActive}
                  onClick={onProceedToDiscard}
                >
                  Đánh bài / Discard →
                </button>
              )}
            </>
          )}

          {state.phase === 'discard' && (
            <button
              type="button"
              className={`game-btn game-btn-primary ${hint?.target === 'discard' ? 'is-hint-btn' : ''}`}
              data-testid="discard-btn"
              disabled={!viewerIsActive || !selectedIsLegalDiscard}
              onClick={() => {
                if (selectedCardId && selectedIsLegalDiscard) {
                  onDiscard(selectedCardId);
                }
              }}
            >
              Đánh / Play
            </button>
          )}

          {canU && (
            <button
              type="button"
              className="game-btn game-btn-danger u-declare-btn"
              data-testid="u-btn"
              onClick={onDeclareU}
            >
              Ù! / Declare Win
            </button>
          )}

          <button
            type="button"
            className="game-btn game-btn-secondary"
            data-testid="sort-btn"
            disabled={!viewerIsActive}
            onClick={onSortHand}
          >
            Xếp bài / Sort
          </button>
        </div>
      </div>
    </div>
  );
};
