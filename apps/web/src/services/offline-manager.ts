export class OfflineManager {
  private listeners: ((online: boolean) => void)[] = []

  constructor() {
    window.addEventListener('online', () => this.notify(true))
    window.addEventListener('offline', () => this.notify(false))
  }

  isOnline(): boolean { return navigator.onLine }
  onChange(cb: (online: boolean) => void): () => void { this.listeners.push(cb); return () => { this.listeners = this.listeners.filter(l => l !== cb) } }
  private notify(online: boolean): void { this.listeners.forEach(cb => cb(online)) }
}
