export interface TerminalSession {
  id: string
  workspaceId: string
  createdAt: number
}

export class TerminalService {
  private sessions = new Map<string, TerminalSession>()

  createSession(workspaceId: string): TerminalSession {
    const session: TerminalSession = { id: crypto.randomUUID(), workspaceId, createdAt: Date.now() }
    this.sessions.set(session.id, session)
    return session
  }

  getSession(id: string): TerminalSession | undefined {
    return this.sessions.get(id)
  }

  destroySession(id: string): void {
    this.sessions.delete(id)
  }
}
