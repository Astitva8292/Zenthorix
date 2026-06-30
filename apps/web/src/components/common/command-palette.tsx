'use client'

import { useState, useEffect, useCallback } from 'react'

interface Command {
  id: string
  label: string
  action: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const commands: Command[] = [
    { id: 'goto-file', label: 'Go to File...', action: () => {} },
    { id: 'run-build', label: 'Run Build', action: () => {} },
    { id: 'toggle-theme', label: 'Toggle Theme', action: () => document.documentElement.classList.toggle('dark') },
    { id: 'open-settings', label: 'Open Settings', action: () => {} },
  ]

  const filtered = query ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())) : commands

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={() => setOpen(false)}>
      <div className="w-full max-w-md rounded-xl border border-border bg-background shadow-2xl" onClick={e => e.stopPropagation()}>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Type a command..."
          autoFocus
          className="w-full rounded-t-xl border-b border-border px-4 py-3 text-sm outline-none bg-background" />
        <div className="max-h-60 overflow-auto p-2">
          {filtered.map(cmd => (
            <div key={cmd.id} onClick={() => { cmd.action(); setOpen(false) }}
              className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-accent">
              {cmd.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
