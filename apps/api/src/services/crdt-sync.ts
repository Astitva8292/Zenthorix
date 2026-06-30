import { CRDTDocument } from '@zenthorix/core/crdt'

interface SyncClient {
  id: string
  send: (data: string) => void
}

export class CRDTSyncServer {
  private documents = new Map<string, CRDTDocument>()
  private clients = new Map<string, SyncClient[]>()

  getOrCreateDocument(workspaceId: string): CRDTDocument {
    if (!this.documents.has(workspaceId)) {
      this.documents.set(workspaceId, new CRDTDocument())
    }
    return this.documents.get(workspaceId)!
  }

  addClient(workspaceId: string, client: SyncClient): void {
    const clients = this.clients.get(workspaceId) ?? []
    clients.push(client)
    this.clients.set(workspaceId, clients)
  }

  removeClient(workspaceId: string, clientId: string): void {
    const clients = this.clients.get(workspaceId) ?? []
    this.clients.set(workspaceId, clients.filter(c => c.id !== clientId))
  }

  broadcast(workspaceId: string, event: string, data: unknown): void {
    const msg = JSON.stringify({ event, data })
    this.clients.get(workspaceId)?.forEach(c => c.send(msg))
  }
}

export const crdtSyncServer = new CRDTSyncServer()
