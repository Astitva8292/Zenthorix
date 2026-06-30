export interface Snippet {
  id: string
  name: string
  code: string
  language: string
  description: string
  createdAt: number
  tags: string[]
}

export class SnippetManager {
  private snippets: Snippet[] = []

  add(snippet: Omit<Snippet, 'id' | 'createdAt'>): Snippet {
    const entry: Snippet = { ...snippet, id: crypto.randomUUID(), createdAt: Date.now() }
    this.snippets.push(entry)
    return entry
  }

  getAll(): Snippet[] {
    return [...this.snippets]
  }

  getById(id: string): Snippet | undefined {
    return this.snippets.find(s => s.id === id)
  }

  search(query: string): Snippet[] {
    const q = query.toLowerCase()
    return this.snippets.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  delete(id: string): boolean {
    const idx = this.snippets.findIndex(s => s.id === id)
    if (idx === -1) return false
    this.snippets.splice(idx, 1)
    return true
  }
}
