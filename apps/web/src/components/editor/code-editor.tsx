'use client'

import { useRef, useEffect } from 'react'

interface CodeEditorProps {
  value: string
  language?: string
  onChange?: (value: string) => void
  path?: string
}

export function CodeEditor({ value, language = 'typescript', onChange, path }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="relative h-full w-full overflow-hidden font-mono text-sm">
      <div className="flex items-center border-b border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
        {path ?? 'untitled.ts'}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="h-[calc(100%-28px)] w-full resize-none border-0 bg-background p-4 font-mono text-sm text-foreground focus:outline-none"
        spellCheck={false}
      />
    </div>
  )
}
