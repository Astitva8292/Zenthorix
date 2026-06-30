export interface Chunk {
  id: string
  content: string
  filePath: string
  tokens: number
}

export class KnowledgeIngester {
  chunkSize = 512

  chunkFile(path: string, content: string): Chunk[] {
    const chunks: Chunk[] = []
    const lines = content.split('\n')
    let current = ''
    let tokenCount = 0

    for (const line of lines) {
      const lineTokens = Math.ceil(line.length / 4)
      if (tokenCount + lineTokens > this.chunkSize && current.length > 0) {
        chunks.push({ id: `${path}:${chunks.length}`, content: current.trim(), filePath: path, tokens: tokenCount })
        current = ''
        tokenCount = 0
      }
      current += line + '\n'
      tokenCount += lineTokens
    }
    if (current.trim()) {
      chunks.push({ id: `${path}:${chunks.length}`, content: current.trim(), filePath: path, tokens: tokenCount })
    }
    return chunks
  }

  async ingest(files: Map<string, string>): Promise<Chunk[]> {
    const allChunks: Chunk[] = []
    for (const [path, content] of files) {
      allChunks.push(...this.chunkFile(path, content))
    }
    return allChunks
  }
}
