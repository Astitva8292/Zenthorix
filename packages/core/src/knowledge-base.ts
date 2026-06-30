export interface KnowledgeEntry {
  id: string
  title: string
  content: string
  tags: string[]
  source: string
  createdAt: number
}

export class KnowledgeBaseService {
  private entries: KnowledgeEntry[] = []

  add(entry: Omit<KnowledgeEntry, 'id' | 'createdAt'>): KnowledgeEntry {
    const newEntry: KnowledgeEntry = { ...entry, id: crypto.randomUUID(), createdAt: Date.now() }
    this.entries.push(newEntry)
    return newEntry
  }

  search(query: string): KnowledgeEntry[] {
    const q = query.toLowerCase()
    return this.entries.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  getBySource(source: string): KnowledgeEntry[] {
    return this.entries.filter(e => e.source === source)
  }

  getAll(): KnowledgeEntry[] {
    return [...this.entries]
  }

  delete(id: string): boolean {
    const idx = this.entries.findIndex(e => e.id === id)
    if (idx === -1) return false
    this.entries.splice(idx, 1)
    return true
  }
}
