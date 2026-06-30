'use client'

import { useState } from 'react'
import { DiffView } from './diff-view'

interface Snapshot { timestamp: number; label: string; content: string }

export function FileHistoryView({ snapshots, current, filename }: { snapshots: Snapshot[]; current: string; filename: string }) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">History: {filename}</span>
        <select value={selected} onChange={e => setSelected(Number(e.target.value))} className="ml-auto rounded bg-secondary px-2 py-0.5 text-xs outline-none">
          {snapshots.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <DiffView original={snapshots[selected]?.content ?? ''} modified={current} filename={filename}
          onAccept={() => {}} onReject={() => {}} />
      </div>
    </div>
  )
}
