.DEFAULT_GOAL := help

GAMES := $(sort $(patsubst games/%/,%,$(dir $(wildcard games/*/package.json))))

define run_target
	@if [ -n "$(GAME)" ]; then \
		if [ ! -d "games/$(GAME)" ]; then \
			echo "Error: game 'games/$(GAME)' not found. Run 'make list-games' to see valid slugs."; \
			exit 1; \
		fi; \
		$(MAKE) --no-print-directory -s _exec DIR="games/$(GAME)" CMD="$(1)"; \
	else \
		$(1); \
	fi
endef

.PHONY: help list-games install install-all dev preview \
	lint lint-all typecheck test test-coverage test-watch test-all \
	test-e2e test-e2e-all build check-docs verify \
	deploy-dry-run deploy clean clean-all _exec

_exec:
	@cd "$(DIR)" && $(CMD)

help: ## Show all available Make targets and usage examples
	@echo "Gemini Games Makefile"
	@echo ""
	@echo "Usage: make <target> [GAME=<slug>]"
	@echo "  When GAME=<slug> is set (e.g. GAME=minesweeper), runs inside games/<slug>/."
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z0-9_-]+:.*## / {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

list-games: ## List all game slugs in games/
	@for g in $(GAMES); do echo "$$g"; done

install: ## Install npm dependencies (root or GAME=<slug>)
	$(call run_target,npm install)

install-all: ## Install npm dependencies at root and in all games/*
	npm install
	@for g in $(GAMES); do echo "=== npm install: $$g ===" && (cd "games/$$g" && npm install) || exit 1; done

dev: ## Start Vite dev server (root hub or GAME=<slug>)
	$(call run_target,npm run dev)

preview: ## Preview production build locally (root or GAME=<slug>)
	$(call run_target,npm run preview)

lint: ## Run ESLint code quality checks (root or GAME=<slug>)
	$(call run_target,npm run lint)

lint-all: ## Run ESLint at root and across all games/*
	npm run lint
	@for g in $(GAMES); do echo "=== lint: $$g ===" && (cd "games/$$g" && npm run lint) || exit 1; done

typecheck: ## Run strict TypeScript check (tsc --noEmit)
	$(call run_target,npx tsc --noEmit)

test: ## Run Vitest unit tests with coverage (root or GAME=<slug>)
	$(call run_target,npm test)

test-coverage: ## Run Vitest with >=70% coverage report at root
	npx vitest run --coverage

test-watch: ## Run Vitest in watch mode (root or GAME=<slug>)
	$(call run_target,npm run test:watch)

test-all: ## Run Vitest unit tests at root and across all games/* with overall summary
	@node scripts/test-all.mjs

test-e2e: ## Run Playwright E2E tests (root or GAME=<slug>)
	$(call run_target,npm run test:e2e)

test-e2e-all: ## Run Playwright E2E tests at root and across all games/*
	npm run test:e2e
	@for g in $(GAMES); do echo "=== test:e2e: $$g ===" && (cd "games/$$g" && npm run test:e2e) || exit 1; done

build: ## Build production bundle into dist/ (root or GAME=<slug>)
	$(call run_target,npm run build)

check-docs: ## Verify AGENTS.md required docs, multilingual READMEs, icons, and covers
	@missing=0; \
	for f in README.md courses/README.md courses/day-*/README.md; do \
		d=$$(dirname "$$f"); \
		[ -f "$$d/README.zh.md" ] || { echo "MISSING: $$d/README.zh.md"; missing=1; }; \
		[ -f "$$d/README.vi.md" ] || { echo "MISSING: $$d/README.vi.md"; missing=1; }; \
	done; \
	for g in $(GAMES); do \
		for doc in README.md README.zh.md README.vi.md QUICKSTART.md architecture.md techstack.md user-guide.md developer-guide.md; do \
			[ -f "games/$$g/docs/$$doc" ] || { echo "MISSING: games/$$g/docs/$$doc"; missing=1; }; \
		done; \
		for asset in manifest.webmanifest icons/favicon.ico icons/icon-32.png icons/apple-touch-icon.png icons/icon-192.png icons/icon-512.png graphics/cover-hd.png graphics/cover-fullhd.png; do \
			[ -f "games/$$g/public/$$asset" ] || { echo "MISSING: games/$$g/public/$$asset"; missing=1; }; \
		done; \
	done; \
	if [ $$missing -ne 0 ]; then exit 1; fi; \
	echo "AGENTS.md docs & public assets check passed for all $(words $(GAMES)) games."

verify: lint typecheck test build test-e2e check-docs ## Run full AGENTS.md verification gate

deploy-dry-run: ## Build and run Wrangler deploy dry-run
	npm run build && npx wrangler deploy --dry-run

deploy: ## Build and deploy to Cloudflare Workers
	npm run deploy

clean: ## Remove dist/, coverage/, test-results/, and playwright-report/ artifacts
	rm -rf dist coverage test-results playwright-report
	@for g in $(GAMES); do rm -rf "games/$$g/dist" "games/$$g/test-results" "games/$$g/playwright-report"; done
	@echo "Cleaned build and test artifacts."

clean-all: clean ## Remove artifacts and all node_modules/ directories
	rm -rf node_modules
	@for g in $(GAMES); do rm -rf "games/$$g/node_modules"; done
	@echo "Cleaned all node_modules directories."
