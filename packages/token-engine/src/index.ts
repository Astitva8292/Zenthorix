import { MODEL_COST_MAP } from '@zenthorix/provider-sdk'

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export class CostEstimator {
  estimateCost(model: string, usage: TokenUsage): number {
    const costs = MODEL_COST_MAP[model]
    if (!costs) return 0
    const inputCost = (usage.promptTokens / 1000) * costs.input
    const outputCost = (usage.completionTokens / 1000) * costs.output
    return inputCost + outputCost
  }

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }
}
