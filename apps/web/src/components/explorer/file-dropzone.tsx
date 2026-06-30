'use client'

import { useState, type DragEvent } from 'react'

interface FileDropzoneProps {
  onFiles: (files: { path: string; content: string }[]) => void
}

export function FileDropzone({ onFiles }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const items = Array.from(e.dataTransfer.items)
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry?.() ?? item.getAsFile()
        if (entry) console.log('Dropped:', (entry as File).name ?? (entry as any).name)
      }
    }
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex h-full items-center justify-center border-2 border-dashed transition-colors ${
        dragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
    >
      <p className="text-sm text-muted-foreground">Drop files here to upload</p>
    </div>
  )
}
