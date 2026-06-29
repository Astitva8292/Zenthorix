import type { EventBus, AgentStatus, AgentEvent } from '@zenthorix/core'

export interface AgentConfig {
  id: string
  name: string
  model: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

export interface AgentContext {
  config: AgentConfig
  status: AgentStatus
  eventBus: EventBus<Record<string, unknown>>
  metadata: Record<string, unknown>
}

export abstract class BaseAgent {
  public readonly config: AgentConfig
  protected context: AgentContext
  protected eventBus: EventBus<Record<string, unknown>>

  constructor(config: AgentConfig, eventBus: EventBus<Record<string, unknown>>) {
    this.config = config
    this.eventBus = eventBus
    this.context = {
      config,
      status: 'idle',
      eventBus,
      metadata: {},
    }
  }

  get status(): AgentStatus {
    return this.context.status
  }

  protected setStatus(status: AgentStatus): void {
    this.context.status = status
    this.eventBus.emit('agent', {
      type: 'status_change',
      agentId: this.config.id,
      timestamp: Date.now(),
      data: { status },
    } as AgentEvent)
  }

  abstract start(input: string): Promise<void>
  abstract pause(): Promise<void>
  abstract resume(): Promise<void>
  abstract stop(): Promise<void>
}
