import { BaseProvider, type ChatCompletionOptions, type ChatCompletionResult, type ModelInfo } from '@zenthorix/provider-sdk'

export class OpenRouterProvider extends BaseProvider {
  readonly name = 'openrouter'

  constructor(private apiKey: string) {
    super()
  }

  private buildBody(options: ChatCompletionOptions, stream: boolean): Record<string, unknown> {
    return {
      model: options.model,
      messages: options.messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      stream,
    }
  }

  async generate(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(this.buildBody(options, false)),
    })
    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`)
    const json: any = await res.json()
    return {
      id: json.id, model: json.model,
      content: json.choices[0].message.content,
      usage: { promptTokens: json.usage.prompt_tokens, completionTokens: json.usage.completion_tokens, totalTokens: json.usage.total_tokens },
    }
  }

  async *stream(options: ChatCompletionOptions): AsyncIterable<string> {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(this.buildBody(options, true)),
    })
    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`)
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
            const json: any = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) yield delta
          } catch {}
        }
      }
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    })
    if (!res.ok) return []
    const json: any = await res.json()
    return json.data.map((m: { id: string; name?: string; context_length?: number; top_provider?: { max_completion_tokens?: number }; pricing?: { prompt?: number; completion?: number } }) => ({
      id: m.id,
      name: m.name ?? m.id,
      provider: 'openrouter',
      contextWindow: m.context_length ?? 128000,
      maxOutput: m.top_provider?.max_completion_tokens ?? 4096,
      inputCostPer1k: (m.pricing?.prompt ?? 0) * 1000,
      outputCostPer1k: (m.pricing?.completion ?? 0) * 1000,
    }))
  }
}
