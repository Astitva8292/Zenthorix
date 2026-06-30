export interface SharedContent {
  id: string
  title: string
  content: string
  language: string
  expiresAt: number | null
  createdAt: number
}

export class PublicShareService {
  async share(content: Omit<SharedContent, 'id' | 'createdAt'>, ttlHours = 24): Promise<SharedContent | null> {
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...content,
          expiresAt: ttlHours ? Date.now() + ttlHours * 60 * 60 * 1000 : null,
        }),
      })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  async get(id: string): Promise<SharedContent | null> {
    try {
      const res = await fetch(`/api/share/${id}`)
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  async revoke(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/share/${id}`, { method: 'DELETE' })
      return res.ok
    } catch {
      return false
    }
  }
}
