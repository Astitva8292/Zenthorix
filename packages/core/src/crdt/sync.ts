export class CRDTDocument {
  private state = new Map<string, string>()
  private observers = new Set<(path: string, content: string) => void>()

  get(path: string): string | undefined { return this.state.get(path) }
  set(path: string, content: string): void {
    this.state.set(path, content)
    this.observers.forEach(cb => cb(path, content))
  }
  delete(path: string): void { this.state.delete(path) }
  snapshot(): Map<string, string> { return new Map(this.state) }
  load(snapshot: Map<string, string>): void {
    this.state = new Map(snapshot)
    for (const [path, content] of this.state) {
      this.observers.forEach(cb => cb(path, content))
    }
  }
  observe(cb: (path: string, content: string) => void): () => void {
    this.observers.add(cb)
    return () => this.observers.delete(cb)
  }
}
