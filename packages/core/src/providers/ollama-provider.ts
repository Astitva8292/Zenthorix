import { BaseProvider, type ChatCompletionOptions, type ChatCompletionResult, type ModelInfo } from '@zenthorix/provider-sdk'

export class OllamaProvider extends BaseProvider {
  readonly name = 'ollama'

  constructor(private baseUrl: string = 'http://localhost:11434') {
    super()
  }

  private async request(options: ChatCompletionOptions, stream: boolean): Promise<Response> {
    return fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
        stream,
      }),
    })
  }

  async generate(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    const res = await this.request(options, false)
    if (!res.ok) throw new Error(`Ollama API error: ${res.status}`)
    const json = await res.json()
    return {
      id: json.created_at ?? Date.now().toString(),
      model: json.model,
      content: json.message?.content ?? '',
      usage: { promptTokens: json.prompt_eval_count ?? 0, completionTokens: json.eval_count ?? 0, totalTokens: (json.prompt_eval_count ?? 0) + (json.eval_count ?? 0) },
    }
  }

  async *stream(options: ChatCompletionOptions): AsyncIterable<string> {
    const res = await this.request(options, true)
    if (!res.ok) throw new Error(`Ollama API error: ${res.status}`)
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
        if (!line.trim()) continue
        try {
          const json = JSON.parse(line)
          const content = json.message?.content
          if (content) yield content
          if (json.done) return
        } catch {}
      }
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`)
      if (!res.ok) return []
      const json = await res.json()
      return (json.models ?? []).map((m: { name: string; details?: { parameter_size?: string } }) => ({
        id: m.name,
        name: m.name,
        provider: 'ollama',
        contextWindow: 8192,
        maxOutput: 4096,
        inputCostPer1k: 0,
        outputCostPer1k: 0,
      }))
    } catch {
      return []
    }
  }
}
