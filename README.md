# Zenthorix

**AI-Powered Software Engineering Platform**

Zenthorix is an open-source, AI-driven IDE platform that lets you build, debug, and deploy applications through natural language conversations with autonomous agents. It combines a multi-agent orchestration engine with a full-featured web IDE, token optimization, and plugin extensibility.

---

## Features

- **Multi-Agent Orchestration** — Autonomous agents collaborate to plan, code, review, test, and deploy. State-machine-driven workflow with debate, merge, and conflict resolution.
- **AI Provider Agnostic** — Unified interface for OpenAI, Anthropic (Claude), DeepSeek, OpenRouter, and Ollama. Swap models without changing code.
- **Token Optimization Engine** — Semantic caching, AST compression, context budgeting, and cost tracking to keep API usage efficient.
- **Full Web IDE** — File explorer, code editor with syntax highlighting, diff viewer, terminal, collab cursors, and inline completions.
- **Plugin SDK** — Extend any lifecycle hook (pre-task, debate, merge, build, VFS) with custom plugins.
- **Built-in Services** — Snippet manager, knowledge base, notification center, public share with TTL, release changelog generation, i18n support.
- **Desktop Ready** — Tauri scaffold included for native desktop builds.
- **Enterprise Security** — Row-level security policies, AES-256-GCM encryption, local auth, JWT sessions, role-based access.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   apps/web                       │
│  (Next.js 15 · IDE · Auth · Settings · i18n)    │
├─────────────────────────────────────────────────┤
│                   apps/api                       │
│     (Fastify · Services · Webhooks · CRDT)       │
├────────────────────┬────────────────────────────┤
│  packages/core     │  packages/agent-engine     │
│  · Providers       │  · State Machine           │
│  · VFS             │  · Planner / Developer     │
│  · Encryption      │  · Reviewer / Tester       │
│  · Stores / Events │  · Debater / Merger        │
├────────────────────┼────────────────────────────┤
│  packages/         │  packages/                 │
│  token-engine      │  plugin-sdk                │
│  · Token Estimator │  · Plugin API              │
│  · Cost Budget     │  · Lifecycle Hooks         │
│  · Semantic Cache  │  · Registry                │
│  · AST Compressor  │                            │
├────────────────────┴────────────────────────────┤
│  packages/database · packages/ui · packages/     │
│  (Drizzle ORM · SQLite · Shared Components)      │
└─────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Prerequisites: Node.js >= 22, pnpm >= 10
pnpm install
pnpm --filter=web dev
```

Open [http://localhost:3000](http://localhost:3000)

### Configure Environment

```bash
cp apps/web/.env.example apps/web/.env
# Add your API keys:
#   AUTH_GITHUB_ID / AUTH_GITHUB_SECRET — GitHub OAuth
#   AUTH_SECRET — NextAuth encryption secret
#   ENCRYPTION_KEY — AES-256 key (32 chars)
```

### Build All Packages

```bash
pnpm build
# or selectively:
pnpm --filter=@zenthorix/core build
pnpm --filter=@zenthorix/agent-engine build
pnpm --filter=web build
```

### Desktop App (Tauri)

```bash
cd apps/web
pnpm tauri dev
```

## Workspaces

| Package | Description |
|---------|-------------|
| `apps/web` | Next.js 15 web IDE with Tailwind CSS |
| `apps/api` | Fastify API server with webhooks and CRDT sync |
| `packages/core` | AI providers, VFS, encryption, zustand stores |
| `packages/agent-engine` | Multi-agent orchestration and state machine |
| `packages/token-engine` | Token estimation, budgeting, caching, compression |
| `packages/provider-sdk` | Provider interface and base implementation |
| `packages/plugin-sdk` | Plugin interface and lifecycle hooks |
| `packages/plugins` | Concrete plugin implementations |
| `packages/database` | Drizzle ORM schema, client, migrations |
| `packages/ui` | Shared React components (Button, ThemeToggle) |

## Tech Stack

- **Runtime**: Node.js 22+, TypeScript 5.9
- **Framework**: Next.js 15 (App Router), Tailwind CSS v4
- **Monorepo**: pnpm 10, Turborepo 2
- **Auth**: NextAuth v5 (beta), JWT sessions
- **Database**: SQLite via Drizzle ORM (LibSQL)
- **AI SDK**: Unified provider interface (OpenAI, Anthropic, DeepSeek, OpenRouter, Ollama)
- **Desktop**: Tauri v2
- **Build**: esbuild for packages, Webpack for Next.js

## Development

```bash
# Run all workspace tests
pnpm test

# Lint all packages
pnpm lint

# Type-check all packages
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## License

[MIT](LICENSE)
