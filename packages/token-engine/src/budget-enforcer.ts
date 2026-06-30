import { TokenEstimator, type ChatMessage } from './index'

export class ContextBudgetEnforcer {
  private estimator = new TokenEstimator()

  constructor(
    private maxContextTokens: number,
    private maxDailyBudget: number = Infinity,
    private dailySpend: number = 0,
  ) {}

  enforce(messages: ChatMessage[], model: string): { messages: ChatMessage[]; truncated: boolean; overBudget: boolean } {
    let currentTokens = this.estimator.estimateMessages(messages)
    let truncated = false

    if (currentTokens > this.maxContextTokens) {
      const systemMessages = messages.filter(m => m.role === 'system')
      const nonSystem = messages.filter(m => m.role !== 'system')
      const preserveCount = Math.max(2, Math.floor(nonSystem.length * 0.3))
      const kept = [...systemMessages, ...nonSystem.slice(-preserveCount)]
      currentTokens = this.estimator.estimateMessages(kept)
      truncated = true
      return { messages: kept, truncated, overBudget: currentTokens > this.maxContextTokens }
    }

    const cost = this.estimator.estimateCost(model, {
      promptTokens: currentTokens,
      completionTokens: 0,
      totalTokens: currentTokens,
    })

    return { messages, truncated: false, overBudget: (this.dailySpend + cost) > this.maxDailyBudget }
  }
}
