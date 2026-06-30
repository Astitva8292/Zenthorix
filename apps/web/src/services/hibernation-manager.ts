export interface HibernatableSession {
  id: string
  state: Record<string, unknown>
  lastActive: number
  ttlMs: number
}

export class HibernationManager {
  private sessions = new Map<string, HibernatableSession>()
  private checkInterval: ReturnType<typeof setInterval> | null = null

  constructor(private defaultTtlMs = 30 * 60 * 1000) {
    this.startCleanup()
  }

  register(id: string, initialState: Record<string, unknown>, ttlMs?: number): void {
    this.sessions.set(id, {
      id,
      state: initialState,
      lastActive: Date.now(),
      ttlMs: ttlMs ?? this.defaultTtlMs,
    })
  }

  touch(id: string): void {
    const session = this.sessions.get(id)
    if (session) session.lastActive = Date.now()
  }

  get(id: string): Record<string, unknown> | undefined {
    return this.sessions.get(id)?.state
  }

  destroy(id: string): void {
    this.sessions.delete(id)
  }

  private startCleanup(): void {
    this.checkInterval = setInterval(() => {
      const now = Date.now()
      for (const [id, session] of this.sessions) {
        if (now - session.lastActive > session.ttlMs) {
          this.sessions.delete(id)
        }
      }
    }, 60 * 1000)
  }

  destroy(): void {
    if (this.checkInterval) clearInterval(this.checkInterval)
    this.sessions.clear()
  }
}
