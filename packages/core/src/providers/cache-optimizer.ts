import type { ChatCompletionMessage } from '@zenthorix/provider-sdk'

export class PromptCacheOptimizer {
  optimize(messages: ChatCompletionMessage[]): ChatCompletionMessage[] {
    const systemMessages = messages.filter(m => m.role === 'system')
    const nonSystem = messages.filter(m => m.role !== 'system')
    return [...systemMessages, ...nonSystem]
  }

  addCacheControl(messages: ChatCompletionMessage[]): ChatCompletionMessage[] {
    if (messages.length > 1) {
      const lastSystemIdx = messages.map(m => m.role).lastIndexOf('system')
      if (lastSystemIdx >= 0) {
        const copy = [...messages]
        copy[lastSystemIdx] = { ...copy[lastSystemIdx], content: `[CACHE_BREAKER:${Date.now()}]\n${copy[lastSystemIdx].content}` }
        return copy
      }
    }
    return messages
  }
}
