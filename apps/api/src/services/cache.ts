export class CacheService {
  private store = new Map<string, { value: unknown; expiresAt: number }>()

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key)
    if (!entry || Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.value as T
  }

  async set(key: string, value: unknown, ttlMs = 60000): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }
}
