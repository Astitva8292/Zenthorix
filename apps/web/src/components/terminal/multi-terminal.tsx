'use client'

import { useState } from 'react'

interface TerminalTab { id: string; name: string; active: boolean }

export function MultiTerminal() {
  const [tabs, setTabs] = useState<TerminalTab[]>([{ id: '1', name: 'bash', active: true }])
  const [activeTab, setActiveTab] = useState('1')

  function addTab() {
    const id = crypto.randomUUID()
    setTabs(prev => [...prev, { id, name: `bash (${prev.length + 1})`, active: false }])
    setActiveTab(id)
  }

  function closeTab(id: string) {
    setTabs(prev => { const next = prev.filter(t => t.id !== id); if (activeTab === id) setActiveTab(next[0]?.id ?? ''); return next })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-border bg-secondary">
        {tabs.map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex cursor-pointer items-center gap-1 border-r border-border px-3 py-1 text-xs ${
              t.id === activeTab ? 'bg-background text-foreground' : 'text-muted-foreground'
            }`}>
            <span>{t.name}</span>
            <button onClick={e => { e.stopPropagation(); closeTab(t.id) }} className="hover:text-foreground">✕</button>
          </div>
        ))}
        <button onClick={addTab} className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground">+</button>
      </div>
      <div className="flex-1 bg-[#1e1e2e] p-3 font-mono text-xs text-[#cdd6f4]">
        <p>$ Terminal ready (tab {activeTab})</p>
      </div>
    </div>
  )
}
