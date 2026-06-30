import { BaseProvider, type ChatCompletionOptions, type ChatCompletionResult, type ModelInfo } from '@zenthorix/provider-sdk'

export class DeepSeekProvider extends BaseProvider {
  readonly name = 'deepseek'
  constructor(private apiKey: string) { super() }

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
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(this.buildBody(options, false)),
    })
    if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`)
    const json: any = await res.json()
    return {
      id: json.id, model: json.model,
      content: json.choices[0].message.content,
      usage: { promptTokens: json.usage.prompt_tokens, completionTokens: json.usage.completion_tokens, totalTokens: json.usage.total_tokens },
    }
  }

  async *stream(options: ChatCompletionOptions): AsyncIterable<string> {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(this.buildBody(options, true)),
    })
    if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`)
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
            if (delta) {
              const thought = delta.match(/<think>(.*?)<\/think>/)?.[1]
              if (thought) yield `[THOUGHT]${thought}[/THOUGHT]`
              else yield delta
            }
          } catch {}
        }
      }
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    return [
      { id: 'deepseek-chat', name: 'DeepSeek V3', provider: 'deepseek', contextWindow: 128000, maxOutput: 4096, inputCostPer1k: 0.0005, outputCostPer1k: 0.002 },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1', provider: 'deepseek', contextWindow: 128000, maxOutput: 8192, inputCostPer1k: 0.00055, outputCostPer1k: 0.0022 },
    ]
  }
}
