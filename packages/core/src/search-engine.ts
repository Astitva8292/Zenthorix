export interface SearchResult {
  filePath: string
  line: number
  column: number
  match: string
  context: string
}

export class SearchEngine {
  search(files: Record<string, string>, query: string): SearchResult[] {
    const results: SearchResult[] = []
    const lowerQuery = query.toLowerCase()

    for (const [filePath, content] of Object.entries(files)) {
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const col = line.toLowerCase().indexOf(lowerQuery)
        if (col !== -1) {
          const start = Math.max(0, col - 20)
          const end = Math.min(line.length, col + query.length + 20)
          results.push({
            filePath,
            line: i + 1,
            column: col + 1,
            match: line.slice(col, col + query.length),
            context: (start > 0 ? '...' : '') + line.slice(start, end) + (end < line.length ? '...' : ''),
          })
        }
      }
    }

    return results
  }
}
