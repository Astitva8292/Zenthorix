'use client'

import { useEffect, useState } from 'react'

interface RemoteCursor {
  userId: string
  name: string
  color: string
  line: number
  column: number
}

export function CollabCursorsDisplay({ cursors }: { cursors: RemoteCursor[] }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {cursors.map(c => (
        <div key={c.userId} className="absolute flex items-center gap-1 transition-all duration-100"
          style={{ top: `${c.line * 20}px`, left: `${c.column * 8}px` }}>
          <div className="h-4 w-0.5" style={{ backgroundColor: c.color }} />
          <span className="rounded bg-opacity-80 px-1 text-[10px] text-white" style={{ backgroundColor: c.color }}>
            {c.name}
          </span>
        </div>
      ))}
    </div>
  )
}
