---
name: game-i18n-and-docs
description: Maintain English (en), Chinese (zh), and Vietnamese (vi) multilingual support across READMEs, courses, hub translations, and per-game documentation in gemini-games.
---

# Multilingual (`en`, `zh`, `vi`) & Documentation Standard

This repository supports **English (`en`)**, **Chinese (`zh`)**, and **Vietnamese (`vi`)**.

## 1. Required Files per Game (`games/<slug>/docs/`)
Every game must include all 8 files:
- `README.md` (English), `README.zh.md` (中文), `README.vi.md` (Tiếng Việt)
- `QUICKSTART.md`
- `architecture.md`
- `techstack.md`
- `user-guide.md`
- `developer-guide.md`

## 2. Language Switcher Header
Place the matching 3-language switcher at line 1 of every `README*.md` (root, `courses/`, `courses/day-*/`, and `games/*/docs/`):
- In `README.md`: `**English** | [中文](./README.zh.md) | [Tiếng Việt](./README.vi.md)`
- In `README.zh.md`: `[English](./README.md) | **中文** | [Tiếng Việt](./README.vi.md)`
- In `README.vi.md`: `[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**`

## 3. Hub Localization (`src/i18n/translations.ts`)
Whenever adding or renaming a game:
- Add `zh` and `vi` entries (`title`, `description`, `controls`) under `GAME_LOCALIZATIONS['<slug>']` in `src/i18n/translations.ts`.
- Run `make check-docs` and `make test` to verify all 3 locales pass `translations.test.ts` and `scripts/check-compliance.mjs`.
