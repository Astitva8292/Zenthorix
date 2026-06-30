# Zenthorix Architecture

## Multi-Agent Orchestration
```
                    ┌─────────────┐
                    │ AgentState  │
                    │  Machine    │
                    └──────┬──────┘
                           │ events
                    ┌──────▼──────┐
                    │ Orchestrator│ (future)
                    └──┬───┬───┬──┘
                       │   │   │
              ┌────────┘   │   └────────┐
              ▼             ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Developer│ │ Security │ │  Test    │
        │  Agent   │ │  Agent   │ │  Agent   │
        └──────────┘ └──────────┘ └──────────┘
              │             │            │
              └─────────────┼────────────┘
                            ▼
                    ┌──────────────┐
                    │  MergeEngine │
                    │  /Debate     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   BuildRunner│
                    └──────────────┘
```

## Provider Abstraction
```
IZenthorixProvider (interface)
    ├── BaseProvider (abstract, default countTokens)
    │   ├── OpenAIProvider
    │   ├── AnthropicProvider
    │   ├── DeepSeekProvider
    │   └── OpenRouterProvider
    │
    Methods: generate(), stream(), countTokens(), listModels()
```

## Plugin Lifecycle
```
Task Start → onPreTask → Agent Execute → onAgentDebate
  → Merge Results → onPostMerge → Build → onBuildSuccess
  → VFS Update → onVfsUpdate
```

## State Machine States
```
idle → planning → proposing → reviewing → merging
  → building → success (or debugging → building loop)
  → error (from any state)
```

## Data Flow
1. User issues task via ChatInterface
2. TaskPlannerAgent creates execution plan
3. ModelRouter selects optimal model per task complexity
4. Dispatcher runs agents in parallel (Promise.allSettled)
5. MergeEngine evaluates and merges proposals
6. ReviewerAgent validates output quality
7. BuildRunner executes in temp directory
8. Results streamed back via EventStream (WebSocket)

## Key Architectural Rules
- Packages import only from declared workspace dependencies
- Agents extend BaseAgent and implement doExecute()
- Providers extend BaseProvider from provider-sdk
- All API keys handled via sessionStorage (frontend) or encryption.ts (backend)
- State transitions guard against invalid events and infinite loops
