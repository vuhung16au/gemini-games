---
name: deploy-cloudflare-games
description: Verify, build, dry-run, and deploy the unified Gemini Games hub and all standalone games to Cloudflare Workers Static Assets.
---

# Build & Deploy to Cloudflare Workers

## 1. Pre-Deployment Gates (Mandatory)
Run all local verification gates before deploying (`.github/workflows/` is kept blank intentionally):
```bash
make verify
make test-all
make deploy-dry-run
```

## 2. Deploy to Cloudflare Workers Static Assets
`wrangler.jsonc` serves `./dist` with `"not_found_handling": "single-page-application"`.
```bash
make deploy   # runs npm run build && wrangler deploy
```

## 3. Live Verification
After `wrangler deploy` prints the `*.workers.dev` URL and Version ID, verify HTTP `200` on the root hub and any newly added or updated game:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://gemini-games.vuhung16plus.workers.dev/
curl -s -o /dev/null -w "%{http_code}\n" https://gemini-games.vuhung16plus.workers.dev/games/<slug>/
curl -s -o /dev/null -w "%{http_code}\n" https://gemini-games.vuhung16plus.workers.dev/games/<slug>/graphics/cover-hd.png
```
