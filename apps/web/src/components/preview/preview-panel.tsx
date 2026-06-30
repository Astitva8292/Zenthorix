'use client'

import { useState } from 'react'

export function PreviewPanel() {
  const [url, setUrl] = useState('http://localhost:3000')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1">
        <input value={url} onChange={e => setUrl(e.target.value)}
          className="flex-1 rounded bg-secondary px-2 py-0.5 text-xs text-foreground outline-none" />
        <button onClick={() => window.open(url, '_blank')} className="text-xs text-muted-foreground hover:text-foreground">↗</button>
        <button onClick={() => {}} className="text-xs text-muted-foreground hover:text-foreground">↻</button>
      </div>
      <iframe src={url} className="flex-1 bg-white" />
    </div>
  )
}
