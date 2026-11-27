# Minesweeper — Tech Stack

Aligned with [techstack.md](../../../techstacks/techstack.md):

| Layer | Choice | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.5 | Strict typing across grid logic, solver, and UI |
| **UI & Board** | React 18 + CSS Grid | Responsive tactile tiles, LCD bar, and modals |
| **Build Tool** | Vite 5 (`base: './'`) | Fast HMR and static `dist/` output |
| **Audio** | Web Audio API | Zero-asset click, flag, win, and explosion SFX |
| **Unit Testing** | Vitest | First-click safety, flood-fill, chording, win/loss, and storage tests |
| **E2E Testing** | Playwright | Real browser difficulty switching, custom board, flagging, and persistence |
