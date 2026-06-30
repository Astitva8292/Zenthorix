'use client'

interface EditorTab {
  path: string
  name: string
  dirty: boolean
}

interface EditorTabsProps {
  tabs: EditorTab[]
  activeFile: string | null
  onSelect: (path: string) => void
  onClose: (path: string) => void
}

export function EditorTabs({ tabs, activeFile, onSelect, onClose }: EditorTabsProps) {
  return (
    <div className="flex items-center border-b border-border bg-secondary">
      {tabs.map(tab => (
        <div key={tab.path}
          className={`group flex cursor-pointer items-center gap-1 border-r border-border px-3 py-1.5 text-xs ${
            tab.path === activeFile ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onSelect(tab.path)}
        >
          <span>{tab.name}</span>
          {tab.dirty && <span className="text-yellow-500">●</span>}
          <button onClick={e => { e.stopPropagation(); onClose(tab.path) }}
            className="ml-1 opacity-0 group-hover:opacity-100 hover:text-foreground">✕</button>
        </div>
      ))}
      {tabs.length === 0 && <span className="px-3 py-1.5 text-xs text-muted-foreground">No tabs open</span>}
    </div>
  )
}
