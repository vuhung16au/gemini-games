# Minesweeper — User Guide

## Objective
Clear every safe square on the grid without clicking a mine. Numbers indicate how many mines touch that square across its 8 neighbors.

## Difficulty Presets & Custom Size
- **Easy (Default):** `9×9`, `10` mines
- **Medium:** `16×16`, `40` mines
- **Hard:** `30×16`, `99` mines
- **Custom:** Click **Custom…** to set Rows (`5–24`), Columns (`5–36`), and Mines.

## Controls
- **Left Click / Tap:** Reveal square (or toggle Flag when **Flag Mode** is on)
- **Right Click:** Plant or remove a flag (`🚩`)
- **Click a Revealed Number (Chord):** Reveals all unflagged neighbors if adjacent flags match the number

## Persistence
Best clear times per preset, selected difficulty, and Mute state persist in `localStorage` (`minesweeper_v1`).
