'use client'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useWorkspaceStore, useAppearanceStore } from '@zenthorix/core/stores'
import { ThemeToggle } from '@zenthorix/ui'

function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-secondary p-2">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-sm font-semibold">Explorer</span>
        <ThemeToggle />
      </div>
      <div className="flex-1 overflow-auto py-2">
        <p className="text-xs text-muted-foreground">No files open</p>
      </div>
    </div>
  )
}

function EditorPanel() {
  const { activeFile, files } = useWorkspaceStore()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-border bg-secondary px-2">
        {files.map((file) => (
          <span
            key={file.path}
            className={`cursor-pointer border-r border-border px-3 py-1.5 text-xs ${
              file.path === activeFile ? 'bg-background text-foreground' : 'text-muted-foreground'
            }`}
          >
            {file.name}
            {file.dirty && <span className="ml-1 text-yellow-500">●</span>}
          </span>
        ))}
        {files.length === 0 && (
          <span className="px-3 py-1.5 text-xs text-muted-foreground">No tabs open</span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {activeFile ? (
          <div className="font-mono text-sm">// Editing: {activeFile}</div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p className="text-lg">Welcome to Zenthorix</p>
          </div>
        )}
      </div>
    </div>
  )
}

function BottomPanel() {
  return (
    <div className="flex h-full flex-col bg-secondary">
      <div className="flex items-center border-b border-border px-3 py-1">
        <span className="text-xs font-medium">Terminal</span>
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-xs text-muted-foreground">
        <p>$ Zenthorix IDE ready</p>
      </div>
    </div>
  )
}

export function IDELayout() {
  const { sidebarOpen, bottomPanelOpen } = useAppearanceStore()

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <PanelGroup direction="horizontal" autoSaveId="ide-main">
        {sidebarOpen && (
          <>
            <Panel defaultSize={20} minSize={15} maxSize={40}>
              <Sidebar />
            </Panel>
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />
          </>
        )}
        <Panel minSize={30}>
          <PanelGroup direction="vertical" autoSaveId="ide-editor-terminal">
            <Panel minSize={20}>
              <EditorPanel />
            </Panel>
            {bottomPanelOpen && (
              <>
                <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors" />
                <Panel defaultSize={25} minSize={10} maxSize={50}>
                  <BottomPanel />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  )
}
