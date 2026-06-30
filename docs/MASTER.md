# Zenthorix — Master Plan

## Vision
Zenthorix is an AI-powered software engineering platform that enables developers to build, debug, and deploy applications through natural language conversations with autonomous agents.

## Architecture Overview
- **Monorepo** (pnpm + Turborepo) with 10 workspace packages
- **Frontend**: Next.js 15 App Router + Tailwind CSS v4
- **Backend**: Fastify API server
- **Database**: SQLite via Drizzle ORM (LibSQL)
- **Auth**: NextAuth v5 (beta) with GitHub OAuth, JWT sessions
- **Agents**: Modular agent engine with state machine orchestration
- **AI Providers**: OpenAI, Anthropic, DeepSeek, OpenRouter (unified via provider-sdk)
- **Token Optimization**: Token engine with estimation, cost management, caching, context compression

## Package Structure

| Package | Role |
|---------|------|
| `apps/web` | Next.js frontend (IDE, auth, settings) |
| `apps/api` | Fastify API server |
| `packages/core` | Shared logic: providers, VFS, encryption, stores, events |
| `packages/agent-engine` | Multi-agent orchestration, state machine, merge/debate |
| `packages/token-engine` | Token estimation, cost budgeting, semantic cache, summarization |
| `packages/provider-sdk` | Provider interface, base implementation, model cost map |
| `packages/plugin-sdk` | Plugin interface and registry |
| `packages/plugins` | Concrete plugin implementations |
| `packages/database` | Drizzle schema, client, seed |
| `packages/ui` | Shared UI components (Button, ThemeToggle) |

## Key Design Decisions
- **JWT sessions** over DB adapter to avoid native binary conflicts
- **AST compression** targets 1000→50 lines via structural extraction
- **Agents use template method** pattern for unified status/error handling
- **Plugin lifecycle hooks** allow intercepting pre-task, debate, merge, build, VFS events
- **API keys stored in sessionStorage** (frontend); AES-256-GCM ready for backend

## Development Status
- 120+ features implemented across all packages
- Core architecture audited and refactored (2026-06-30)
- Next steps: complete Prompts 106-120, production-readiness validation
