'use client'

import { useState } from 'react'

interface TreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: TreeNode[]
}

interface FileTreeProps {
  nodes: TreeNode[]
  onSelect: (path: string) => void
  activeFile?: string | null
}

function FileTreeItem({ node, onSelect, activeFile, depth = 0 }: { node: TreeNode; onSelect: (path: string) => void; activeFile?: string | null; depth?: number }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1 px-2 py-0.5 text-xs hover:bg-accent ${
          activeFile === node.path ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => node.type === 'directory' ? setExpanded(!expanded) : onSelect(node.path)}
      >
        <span>{node.type === 'directory' ? (expanded ? '▾' : '▸') : '○'}</span>
        <span>{node.name}</span>
      </div>
      {node.type === 'directory' && expanded && node.children?.map(child => (
        <FileTreeItem key={child.path} node={child} onSelect={onSelect} activeFile={activeFile} depth={depth + 1} />
      ))}
    </div>
  )
}

export function FileTree({ nodes, onSelect, activeFile }: FileTreeProps) {
  return (
    <div className="py-1">
      {nodes.map(node => (
        <FileTreeItem key={node.path} node={node} onSelect={onSelect} activeFile={activeFile} />
      ))}
    </div>
  )
}
