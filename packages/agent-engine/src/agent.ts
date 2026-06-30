import type { ChatCompletionMessage } from '@zenthorix/provider-sdk'

export interface AgentConfig {
  id: string
  name: string
  model: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

export type AgentStatus = 'idle' | 'planning' | 'working' | 'reviewing' | 'done' | 'error'

export function safeParse<T>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}

export abstract class BaseAgent {
  public readonly config: AgentConfig
  public status: AgentStatus = 'idle'

  constructor(config: AgentConfig) {
    this.config = config
  }

  async execute(input: string, context?: Record<string, unknown>): Promise<string> {
    this.status = 'working'
    try {
      const result = await this.doExecute(input, context)
      this.status = 'done'
      return JSON.stringify(result)
    } catch (err) {
      this.status = 'error'
      throw err
    }
  }

  protected abstract doExecute(input: string, context?: Record<string, unknown>): Promise<unknown>

  protected buildMessages(systemPrompt: string, userInput: string): ChatCompletionMessage[] {
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ]
  }
}

export interface TaskPlan {
  summary: string
  steps: TaskStep[]
}

export interface TaskStep {
  action: 'create' | 'modify' | 'delete' | 'install' | 'search'
  filePath?: string
  description: string
  content?: string
}

export class TaskPlannerAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const steps: TaskStep[] = [
      { action: 'create', filePath: 'example.ts', description: `Implement: ${input.slice(0, 60)}` },
    ]
    return { summary: input.slice(0, 100), steps } as TaskPlan
  }

  parsePlan(raw: string): TaskPlan {
    return safeParse<TaskPlan>(raw, { summary: '', steps: [] })
  }
}
