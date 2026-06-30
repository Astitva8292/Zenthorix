interface RateLimitEntry {
  count: number
  resetAt: number
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>()

  constructor(private limit: number, private windowMs: number) {}

  check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs })
      return { allowed: true, remaining: this.limit - 1, resetAt: now + this.windowMs }
    }

    entry.count++
    return {
      allowed: entry.count <= this.limit,
      remaining: Math.max(0, this.limit - entry.count),
      resetAt: entry.resetAt,
    }
  }
}

export const apiLimiter = new RateLimiter(100, 60000)
export const agentLimiter = new RateLimiter(20, 60000)
