[English](./QUICKSTART.md) | **中文** | [Tiếng Việt](./QUICKSTART.vi.md)

# Gemini 游戏中心 — 快速开始

你可以直接在线体验包含 **16 款游戏** 的统一大厅：**[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**，也可以克隆到本地 **100% 离线** 运行。

## 环境要求
- **Node.js** 20+ 与 **npm**
- **Git**（用于克隆仓库）
- **Wrangler CLI**（已作为开发依赖安装；仅在需要部署到 Cloudflare 时运行 `npx wrangler login`）

---

## 1. 克隆、安装并在本地运行（100% 离线）

```bash
git clone https://github.com/vuhung16au/gemini-games.git
cd gemini-games
npm install

# 启动统一游戏大厅开发服务器（主页 + 全部 16 款游戏）
make dev
# 或：npm run dev
```

单独运行某一款游戏：

```bash
make dev GAME=<game-slug>
# 或：cd games/<game-slug> && npm install && npm run dev
```

运行 `make list-games` 可查看全部 16 款游戏的 slug 名称。

---

## 2. 测试、代码检查与整体验证

```bash
# 运行根目录大厅单元测试（Vitest + >=70% 覆盖率）
make test

# 运行根目录 + 全部 16 款游戏的单元测试
make test-all

# 运行根目录浏览器 E2E 测试（Playwright）
make test-e2e

# 运行 ESLint 与严格 TypeScript 类型检查
make lint
make typecheck

# 运行全仓库验证（lint、typecheck、test、build、test-e2e、check-docs）
make verify
```

上述 `make` 命令同样支持传入 `GAME=<game-slug>`（例如 `make verify GAME=minesweeper`）。

---

## 3. 构建与预览生产包

```bash
# 类型检查并将根目录大厅与全部 16 款游戏打包到静态目录 dist/
make build

# 在本地预览静态 dist/ 构建产物（100% 离线）
make preview
```

---

## 4. 部署上线（Cloudflare Workers 或 Vercel）

### 方案 A：Cloudflare Workers Static Assets（默认）
部署配置位于 [wrangler.jsonc](./wrangler.jsonc)：

```bash
# 仅校验打包，不实际发布
make deploy-dry-run

# 构建 dist/ 并部署到 Cloudflare Workers
make deploy
```

### 方案 B：Vercel（备选）
由于 `dist/` 是纯静态产物，也可以直接部署到 Vercel：

```bash
make build
npx vercel --prod dist
```

---

## 5. 通过本项目学习 Vibe Coding
第一次接触本项目？欢迎从 [courses/README.zh.md](./courses/README.zh.md) 开始 9 天实战课程。
