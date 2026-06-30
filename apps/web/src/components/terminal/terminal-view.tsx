'use client'

import { useRef, useEffect, useState } from 'react'

export function TerminalView() {
  const [lines, setLines] = useState<string[]>(['$ Zenthorix IDE ready', '> Type commands or wait for build output...'])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  function executeCommand() {
    if (!input.trim()) return
    setLines(prev => [...prev, `$ ${input}`, `zsh: command not found: ${input.split(' ')[0]}`])
    setInput('')
  }

  return (
    <div className="flex h-full flex-col bg-[#1e1e2e] font-mono text-xs text-[#cdd6f4]">
      <div className="flex items-center border-b border-[#313244] px-3 py-1 text-xs text-[#6c7086]">
        <span>Terminal</span>
      </div>
      <div className="flex-1 overflow-auto p-3">
        {lines.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap ${line.startsWith('$') ? 'text-[#a6e3a1]' : ''}`}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-[#313244] p-2">
        <div className="flex items-center gap-1 text-[#6c7086]">
          <span>$</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && executeCommand()}
            className="flex-1 bg-transparent text-[#cdd6f4] outline-none"
          />
        </div>
      </div>
    </div>
  )
}
