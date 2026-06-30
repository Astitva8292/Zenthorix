'use client'

import { useState } from 'react'

export function BranchManager() {
  const [branches] = useState(['main', 'feature/auth', 'fix/build'])
  const [active, setActive] = useState('main')

  return (
    <div className="border-t border-border px-3 py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">⎇</span>
        <select value={active} onChange={e => setActive(e.target.value)} className="bg-transparent text-xs outline-none">
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
    </div>
  )
}
