export class SecretsManager {
  private store = new Map<string, string>()

  set(key: string, value: string): void { this.store.set(key, value) }
  get(key: string): string | undefined { return this.store.get(key) }
  delete(key: string): void { this.store.delete(key) }
  list(): string[] { return Array.from(this.store.keys()) }

  toEnvArray(): string[] {
    return Array.from(this.store.entries()).map(([k, v]) => `${k}=${v}`)
  }
}
