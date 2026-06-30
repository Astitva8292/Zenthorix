import { TokenEstimator, type ChatMessage } from './index'

export class ContextSummarizer {
  private threshold: number
  private minPreserve: number
  private estimator = new TokenEstimator()

  constructor(threshold = 50000, minPreserve = 10) {
    this.threshold = threshold
    this.minPreserve = minPreserve
  }

  needsSummarization(messages: ChatMessage[]): boolean {
    const totalTokens = this.estimator.estimateMessages(messages)
    return totalTokens > this.threshold
  }

  summarize(messages: ChatMessage[]): ChatMessage[] {
    if (!this.needsSummarization(messages)) return messages

    const systemMessages = messages.filter(m => m.role === 'system')
    const recentMessages = messages.slice(-this.minPreserve)
    const oldMessages = messages.slice(systemMessages.length, -this.minPreserve)

    if (oldMessages.length === 0) return messages

    const summaryContent = `Previous conversation summary: ${oldMessages.length} messages covering the earlier context have been summarized to save tokens.`
    const summaryMessage: ChatMessage = { role: 'system', content: summaryContent }

    return [...systemMessages, summaryMessage, ...recentMessages]
  }
}
