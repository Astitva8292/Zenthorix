'use client'

import { useState, useCallback } from 'react'

interface CanvasNode { id: string; type: string; label: string; x: number; y: number }

export function VisualCanvas() {
  const [nodes] = useState<CanvasNode[]>([
    { id: '1', type: 'header', label: 'Header', x: 200, y: 50 },
    { id: '2', type: 'form', label: 'Login Form', x: 200, y: 200 },
    { id: '3', type: 'footer', label: 'Footer', x: 200, y: 350 },
  ])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1e1e2e]">
      <div className="p-4 text-xs text-muted-foreground">Visual Canvas (React Flow ready)</div>
      {nodes.map(n => (
        <div key={n.id} className="absolute cursor-move rounded-lg border border-border bg-secondary px-4 py-2 text-sm shadow-lg"
          style={{ left: n.x, top: n.y }}>
          <div className="font-medium">{n.label}</div>
          <div className="text-xs text-muted-foreground">{n.type}</div>
        </div>
      ))}
    </div>
  )
}
