import { MODEL_COST_MAP } from '@zenthorix/provider-sdk'

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface ChatMessage {
  role: string
  content: string
}

export class TokenEstimator {
  estimateTokens(text: string): number {
    if (!text) return 0
    return Math.ceil(text.length / 4)
  }

  estimateMessages(messages: ChatMessage[]): number {
    if (!messages || !Array.isArray(messages)) return 0
    let total = 3
    for (const msg of messages) {
      if (!msg || !msg.content) continue
      total += this.estimateTokens(msg.content)
      total += 4
    }
    return total
  }

  estimateCost(model: string, usage: TokenUsage): number {
    const costs = MODEL_COST_MAP[model]
    if (!costs) return 0
    const inputCost = (usage.promptTokens / 1000) * costs.input
    const outputCost = (usage.completionTokens / 1000) * costs.output
    return inputCost + outputCost
  }
}

export class CostEstimator {
  private estimator = new TokenEstimator()

  estimateRunCost(model: string, messages: ChatMessage[], estimatedOutputTokens = 1024): number {
    const promptTokens = this.estimator.estimateMessages(messages)
    return this.estimator.estimateCost(model, {
      promptTokens,
      completionTokens: estimatedOutputTokens,
      totalTokens: promptTokens + estimatedOutputTokens,
    })
  }
}

export class BudgetEnforcer {
  private estimator = new TokenEstimator()
  private accumulatedCost = 0
  private resetDate = Date.now()

  constructor(private maxTokens: number, private dailyBudget: number) {}

  check(messages: ChatMessage[], model: string, completionTokens = 0): { allowed: boolean; reason?: string } {
    const estimatedTokens = this.estimator.estimateMessages(messages)
    if (estimatedTokens > this.maxTokens) {
      return { allowed: false, reason: `Estimated ${estimatedTokens} tokens exceeds max ${this.maxTokens}` }
    }
    const estimatedCost = this.estimator.estimateCost(model, { promptTokens: estimatedTokens, completionTokens, totalTokens: estimatedTokens + completionTokens })
    this.accumulatedCost += estimatedCost
    const dayMs = 24 * 60 * 60 * 1000
    if (Date.now() - this.resetDate > dayMs) {
      this.accumulatedCost = estimatedCost
      this.resetDate = Date.now()
    }
    if (this.accumulatedCost > this.dailyBudget) {
      return { allowed: false, reason: `Accumulated cost $${this.accumulatedCost.toFixed(4)} exceeds daily budget $${this.dailyBudget.toFixed(4)}` }
    }
    return { allowed: true }
  }
}

export { ASTCompressor } from './ast-compressor'
export type { CompressedFile } from './ast-compressor'
export { SemanticCache } from './semantic-cache'
export type { CacheEntry } from './semantic-cache'
export { ContextSummarizer } from './summarizer'
export { PromptOptimizer } from './prompt-optimizer'
export { ContextBudgetEnforcer } from './budget-enforcer'
