export interface ModelInfo {
  id: string
  name: string
  provider: string
  contextWindow: number
  maxOutput: number
  inputCostPer1k: number
  outputCostPer1k: number
}

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOptions {
  model: string
  messages: ChatCompletionMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface ChatCompletionResult {
  id: string
  model: string
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface IZenthorixProvider {
  readonly name: string
  generate(options: ChatCompletionOptions): Promise<ChatCompletionResult>
  stream(options: ChatCompletionOptions): AsyncIterable<string>
  countTokens(messages: ChatCompletionMessage[]): number
  listModels(): Promise<ModelInfo[]>
}

export abstract class BaseProvider implements IZenthorixProvider {
  abstract readonly name: string
  abstract generate(options: ChatCompletionOptions): Promise<ChatCompletionResult>
  abstract stream(options: ChatCompletionOptions): AsyncIterable<string>
  abstract listModels(): Promise<ModelInfo[]>

  countTokens(messages: ChatCompletionMessage[]): number {
    let total = 0
    for (const msg of messages) {
      total += Math.ceil(msg.content.length / 4)
    }
    return total
  }
}

export const MODEL_COST_MAP: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-5-haiku': { input: 0.0008, output: 0.004 },
}
