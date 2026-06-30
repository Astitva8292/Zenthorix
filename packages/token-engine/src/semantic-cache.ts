const MAX_CACHE_SIZE = 1000
const DEFAULT_TTL_MS = 30 * 60 * 1000

export interface CacheEntry {
  query: string
  response: string
  model: string
  embedding?: number[]
  createdAt: number
}

export class SemanticCache {
  private cache = new Map<string, CacheEntry>()

  generateKey(query: string, model: string): string {
    return `${model}:${query.trim().toLowerCase().slice(0, 100)}`
  }

  get(query: string, model: string): CacheEntry | undefined {
    const key = this.generateKey(query, model)
    const entry = this.cache.get(key)
    if (!entry) return undefined
    if (Date.now() - entry.createdAt > DEFAULT_TTL_MS) {
      this.cache.delete(key)
      return undefined
    }
    return entry
  }

  set(query: string, model: string, response: string): void {
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const oldest = this.cache.entries().next().value
      if (oldest) this.cache.delete(oldest[0])
    }
    const key = this.generateKey(query, model)
    this.cache.set(key, { query, response, model, createdAt: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }
}
