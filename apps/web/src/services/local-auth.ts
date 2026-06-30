export interface LocalUser {
  id: string
  username: string
  passwordHash: string
  createdAt: number
}

export class LocalAuthService {
  private users: LocalUser[] = []
  private currentUserId: string | null = null

  async register(username: string, password: string): Promise<boolean> {
    if (this.users.find(u => u.username === username)) return false
    const hash = await this.hashPassword(password)
    this.users.push({ id: crypto.randomUUID(), username, passwordHash: hash, createdAt: Date.now() })
    return true
  }

  async login(username: string, password: string): Promise<boolean> {
    const user = this.users.find(u => u.username === username)
    if (!user) return false
    const hash = await this.hashPassword(password)
    if (user.passwordHash !== hash) return false
    this.currentUserId = user.id
    return true
  }

  logout(): void {
    this.currentUserId = null
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
  }
}
