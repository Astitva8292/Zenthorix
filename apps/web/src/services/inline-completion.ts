export interface CompletionContext {
  prefix: string
  suffix: string
  language: string
  filePath: string
}

export class InlineCompletionService {
  private cache = new Map<string, string>()

  async getCompletion(context: CompletionContext): Promise<string | null> {
    const key = `${context.filePath}:${context.prefix.slice(-50)}:${context.suffix.slice(0, 50)}`
    const cached = this.cache.get(key)
    if (cached) return cached

    try {
      const res = await fetch('/api/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      })
      if (!res.ok) return null
      const json = await res.json()
      if (json.completion) {
        this.cache.set(key, json.completion)
      }
      return json.completion ?? null
    } catch {
      return null
    }
  }

  clearCache(): void {
    this.cache.clear()
  }
}
