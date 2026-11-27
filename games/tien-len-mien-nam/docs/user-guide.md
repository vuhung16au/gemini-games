# User Guide — Tiến Lên Miền Nam

## Objective

Be the first player to empty all **13 cards** from your hand—or win immediately upon dealing via **Tới Trắng**!

## Card Ranking & Suit Tie-Breaker

- **Ranks (Low → High):** `3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A < 2 (Heo)`
- **Suits (Low → High):** `♠ (Bích) < ♣ (Chuồn) < ♦ (Rô) < ♥ (Cơ)`
- Example: `2♥` is the strongest single card; `3♠` is the weakest.

## Valid Combinations

- **Lẻ / Single:** Any 1 card.
- **Đôi / Pair:** 2 cards of identical rank.
- **Sám cô / Triple:** 3 cards of identical rank.
- **Sảnh / Straight:** 3 or more consecutive ranks (mixed suits allowed; **cannot include `2`**). Beats another straight of the exact same length if its highest card is stronger.

## Chặt Heo (Bomb / Cut Rules)

- **3 Đôi thông (3 Consecutive Pairs, e.g. `5-5-6-6-7-7`):** Cuts a single `2` or a smaller 3 Đôi thông.
- **Tứ quý (Four of a Kind):** Cuts a single `2`, a pair of `2`s, any 3 Đôi thông, or a smaller Tứ quý.
- **4 Đôi thông (4 Consecutive Pairs):** Cuts all of the above and any smaller 4 Đôi thông.

## Tới Trắng (Instant Win on Deal)

A player wins immediately upon deal if holding:
- **Sảnh Rồng:** All 12 ranks from `3` to `A` (`3-4-5-6-7-8-9-10-J-Q-K-A`).
- **6 Đôi:** 6 or more pairs in the 13-card hand.
- **Tứ quý 2:** All four `2`s (`2♠, 2♣, 2♦, 2♥`).

## Modes & Controls

- **Player Counts:** Select `2P`, `3P`, or `4P` in the header.
- **vs AI:** Play Seat 1 against 1–3 smart AI opponents.
- **Pass & Play:** Local hotseat mode. Between turns, a privacy curtain displays `"Chuyển máy cho Người chơi X / Pass device to Player X"`. Pass the device and tap `"Xem bài / Reveal Hand"`.
- **Mouse / Touch:** Click/tap cards to select/deselect, then press `Đánh / Play`, `Bỏ lượt / Pass`, `Xếp bài / Sort`, or `💡 Gợi ý / Hint`.
- **Keyboard Shortcuts:** `Enter` = Play selected, `P` = Pass, `S` = Cycle sort (`Rank` / `Group` / `Suit`), `H` = Hint, `Esc` = Clear selection or close modal.
- **Audio & Persistence:** Click `🔊 / 🔇` in the top-right to mute/unmute SFX. Wins, best score, mode preferences, and mute state are saved locally under `tien_len_mien_nam_v1`.
