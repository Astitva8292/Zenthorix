'use client'

import { useState } from 'react'

export function ContextInspector() {
  const [open, setOpen] = useState(false)
  const [context] = useState(`System: You are an expert developer.

User: Build a login page with NextAuth.

Files:
- src/auth.ts:
  import NextAuth from 'next-auth'
  ...`)

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-4 right-4 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
        Inspect Context
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="h-[80vh] w-[80vw] rounded-xl border border-border bg-background shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-sm font-medium">AI Context Inspector</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <textarea readOnly value={context} className="h-[calc(100%-40px)] w-full resize-none bg-background p-4 font-mono text-xs text-foreground outline-none" />
          </div>
        </div>
      )}
    </>
  )
}
