import { BaseProvider, type ChatCompletionOptions, type ChatCompletionResult, type ModelInfo } from '@zenthorix/provider-sdk'

export class AnthropicProvider extends BaseProvider {
  readonly name = 'anthropic'
  private apiKey: string

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  async generate(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    const systemMessages = options.messages.filter(m => m.role === 'system')
    const nonSystemMessages = options.messages.filter(m => m.role !== 'system')
    const messages = nonSystemMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user' as const, content: m.content }))

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: options.model,
        messages,
        system: systemMessages.map(m => m.content).join('\n'),
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature,
      }),
    })
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`)
    const json = await res.json()
    return {
      id: json.id,
      model: json.model,
      content: json.content[0].text,
      usage: { promptTokens: json.usage.input_tokens, completionTokens: json.usage.output_tokens, totalTokens: json.usage.input_tokens + json.usage.output_tokens },
    }
  }

  async *stream(options: ChatCompletionOptions): AsyncIterable<string> {
    const systemMessages = options.messages.filter(m => m.role === 'system')
    const nonSystemMessages = options.messages.filter(m => m.role !== 'system')
    const messages = nonSystemMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user' as const, content: m.content }))

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: options.model, messages, system: systemMessages.map(m => m.content).join('\n'), max_tokens: options.maxTokens ?? 4096, temperature: options.temperature, stream: true }),
    })
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`)
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
          try {
            const json = JSON.parse(line.slice(6))
            if (json.type === 'content_block_delta' && json.delta?.text) yield json.delta.text
          } catch {}
        }
      }
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    return [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', contextWindow: 200000, maxOutput: 8192, inputCostPer1k: 0.003, outputCostPer1k: 0.015 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic', contextWindow: 200000, maxOutput: 8192, inputCostPer1k: 0.0008, outputCostPer1k: 0.004 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', contextWindow: 200000, maxOutput: 4096, inputCostPer1k: 0.015, outputCostPer1k: 0.075 },
    ]
  }
}
