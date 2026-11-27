# User Guide — Checkers

## Objective
Capture all of your opponent's pieces or block them so they have no legal moves remaining.

## Controls
- **Click / Tap** a highlighted piece to select it, then click/tap a highlighted destination dot to move or jump.
- **Z** — **Undo** the last turn.
- **H** — **Hint** (highlights a recommended move).
- **Mute (🔊 / 🔇)** — Toggle procedural sound effects.

## Rules
- **Movement:** Regular pieces move diagonally forward one square onto dark squares.
- **Mandatory Captures:** If a jump capture is available, you must take it.
- **Multi-Jumps:** If the jumping piece can capture another piece from its landing square, it must continue jumping on the same turn.
- **Kings:** Reaching the opponent's back row crowns your piece as a **King** (`♛`), allowing diagonal movement and captures both forward and backward. Reaching the back row ends the current turn.
## Learning & Assist Tools
- **? Help:** Opens the in-game rules and shortcut modal.
- **Tutorial:** Launches a 3-step guided practice drill (diagonal step, mandatory capture, and King crowning).
- **Persistence:** Your win/loss record (vs AI), preferred mode, AI difficulty, and mute setting are saved automatically in `localStorage`.
