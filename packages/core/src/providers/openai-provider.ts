import { BaseProvider, type ChatCompletionOptions, type ChatCompletionResult, type ModelInfo } from '@zenthorix/provider-sdk'

export class OpenAIProvider extends BaseProvider {
  readonly name = 'openai'
  private apiKey: string

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  async generate(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: options.model, messages: options.messages, temperature: options.temperature, max_tokens: options.maxTokens }),
    })
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`)
    const json = await res.json()
    return {
      id: json.id,
      model: json.model,
      content: json.choices[0].message.content,
      usage: { promptTokens: json.usage.prompt_tokens, completionTokens: json.usage.completion_tokens, totalTokens: json.usage.total_tokens },
    }
  }

  async *stream(options: ChatCompletionOptions): AsyncIterable<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: options.model, messages: options.messages, temperature: options.temperature, max_tokens: options.maxTokens, stream: true }),
    })
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`)
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') return
          try {
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.delta?.content
            if (content) yield content
          } catch {}
        }
      }
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    return [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', contextWindow: 128000, maxOutput: 4096, inputCostPer1k: 0.005, outputCostPer1k: 0.015 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', contextWindow: 128000, maxOutput: 4096, inputCostPer1k: 0.00015, outputCostPer1k: 0.0006 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', contextWindow: 128000, maxOutput: 4096, inputCostPer1k: 0.01, outputCostPer1k: 0.03 },
    ]
  }
}
