'use client'

import { useState } from 'react'

interface SearchResult {
  path: string
  line: number
  content: string
  match: string
}

export function SearchPanel() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  function search() {
    setResults([
      { path: 'src/example.ts', line: 5, content: '  const x = 1', match: 'x' },
      { path: 'src/example.ts', line: 12, content: '  return x + y', match: 'x' },
    ])
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-2">
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search files..."
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <div className="flex-1 overflow-auto">
        {results.map((r, i) => (
          <div key={i} className="cursor-pointer border-b border-border px-3 py-2 text-xs hover:bg-accent">
            <div className="font-medium text-foreground">{r.path}:{r.line}</div>
            <div className="mt-0.5 text-muted-foreground">{r.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
