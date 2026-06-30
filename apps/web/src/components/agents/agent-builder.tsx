'use client'

import { useState } from 'react'

export function AgentBuilder() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('claude-3-5-sonnet')

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Custom Agent Builder</h2>
      <div>
        <label className="block text-sm font-medium">Agent Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium">Role</label>
        <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., CSS Expert" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium">System Prompt</label>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={6} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none font-mono" />
      </div>
      <div>
        <label className="block text-sm font-medium">Model</label>
        <select value={model} onChange={e => setModel(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="claude-3-5-haiku">Claude 3.5 Haiku</option>
          <option value="gpt-4o">GPT-4o</option>
        </select>
      </div>
      <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Create Agent</button>
    </div>
  )
}
