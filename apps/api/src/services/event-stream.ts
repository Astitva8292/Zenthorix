import { type IncomingMessage } from 'http'

interface StreamClient {
  id: string
  send: (data: string) => void
  close: () => void
}

class EventStreamService {
  private clients = new Map<string, StreamClient>()

  addClient(id: string, send: (data: string) => void, close: () => void): void {
    this.clients.set(id, { id, send, close })
  }

  removeClient(id: string): void {
    this.clients.delete(id)
  }

  broadcast(event: string, data: unknown): void {
    const message = JSON.stringify({ event, data, timestamp: Date.now() })
    for (const client of this.clients.values()) {
      try { client.send(message) } catch { this.removeClient(client.id) }
    }
  }

  sendTo(clientId: string, event: string, data: unknown): void {
    const client = this.clients.get(clientId)
    if (client) {
      client.send(JSON.stringify({ event, data, timestamp: Date.now() }))
    }
  }
}

export const eventStream = new EventStreamService()
