# Minesweeper

A classic logic puzzle game with **Easy (`9×9`, 10 mines — default)**, **Medium (`16×16`, 40 mines)**, **Hard (`30×16`, 99 mines)**, and **Custom** board sizes.

## Key Features
- **First-Click Safety:** Mines are placed after your first reveal, guaranteeing a safe 3×3 opening pocket.
- **Flood-Fill & Chording:** Clicking `0`-mine cells expands automatically; clicking a satisfied revealed number chords open its remaining unflagged neighbors.
- **Smart Deduction Hints & Tutorial:** Logical border solver (`💡 Hint`), 3-step Tutorial, Flag Mode toggle for touch devices, and `? Help` modal.

## Documentation Index
- [QUICKSTART.md](./QUICKSTART.md) — Local setup, test, and build commands
- [architecture.md](./architecture.md) — Pure engine, solver hints, Web Audio, and React UI
- [techstack.md](./techstack.md) — Stack aligned with `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Rules, controls, difficulty levels, and persistence
- [developer-guide.md](./developer-guide.md) — Custom presets, testing, and verification workflow
