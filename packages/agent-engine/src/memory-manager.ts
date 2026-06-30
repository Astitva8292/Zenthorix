const MAX_MEMORIES = 100

export interface Memory {
  id: string
  content: string
  category: string
  createdAt: number
}

export class MemoryManager {
  private memories: Memory[] = []

  add(content: string, category: string): void {
    this.memories.push({ id: crypto.randomUUID(), content, category, createdAt: Date.now() })
    if (this.memories.length > MAX_MEMORIES) {
      this.memories = this.memories.slice(-MAX_MEMORIES)
    }
  }

  getByCategory(category: string): Memory[] {
    return this.memories.filter(m => m.category === category)
  }

  getAll(): Memory[] { return this.memories }

  delete(id: string): void { this.memories = this.memories.filter(m => m.id !== id) }

  injectIntoPrompt(prompt: string): string {
    const relevant = this.memories.slice(-5)
    if (relevant.length === 0) return prompt
    const memoryBlock = relevant.map(m => `- ${m.content}`).join('\n')
    return `${prompt}\n\n[Agent Memory]\n${memoryBlock}`
  }
}
