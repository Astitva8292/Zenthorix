'use client'

import { useState } from 'react'
import { CodeEditor } from './code-editor'

interface DiffViewProps {
  original: string
  modified: string
  filename: string
  onAccept: () => void
  onReject: () => void
}

export function DiffView({ original, modified, filename, onAccept, onReject }: DiffViewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-secondary px-3 py-1">
        <span className="text-xs font-medium">{filename}</span>
        <div className="flex gap-2">
          <button onClick={onReject} className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-500/10">Reject</button>
          <button onClick={onAccept} className="rounded px-2 py-0.5 text-xs text-green-500 hover:bg-green-500/10">Accept</button>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 border-r border-border">
          <div className="bg-red-500/10 px-3 py-0.5 text-xs text-red-500">Original</div>
          <CodeEditor value={original} path={filename} />
        </div>
        <div className="flex-1">
          <div className="bg-green-500/10 px-3 py-0.5 text-xs text-green-500">Modified</div>
          <CodeEditor value={modified} path={filename} />
        </div>
      </div>
    </div>
  )
}
