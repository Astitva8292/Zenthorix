import type { Chunk } from './knowledge-ingester'

export class RetrievalEngine {
  private chunks: Chunk[] = []

  index(chunks: Chunk[]): void {
    this.chunks = chunks
  }

  search(query: string, topK = 5): Chunk[] {
    const queryTerms = query.toLowerCase().split(/\s+/)
    const scored = this.chunks.map(chunk => {
      const lower = chunk.content.toLowerCase()
      const score = queryTerms.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0)
      return { chunk, score }
    })
    return scored.sort((a, b) => b.score - a.score).slice(0, topK).map(s => s.chunk)
  }
}
