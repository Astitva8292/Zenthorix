'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'

interface SettingsProps {
  open: boolean
  onClose: () => void
}

export function SettingsDialog({ open, onClose }: SettingsProps) {
  const [tab, setTab] = useState<'general' | 'providers' | 'budget'>('general')
  const [openaiKey, setOpenaiKey] = useState(() => sessionStorage.getItem('zenthorix_openai_key') ?? '')
  const [anthropicKey, setAnthropicKey] = useState(() => sessionStorage.getItem('zenthorix_anthropic_key') ?? '')
  const [dailyBudget, setDailyBudget] = useState(() => sessionStorage.getItem('zenthorix_daily_budget') ?? '5.00')
  const { theme, setTheme } = useTheme()

  if (!open) return null

  const handleSave = () => {
    sessionStorage.setItem('zenthorix_openai_key', openaiKey)
    sessionStorage.setItem('zenthorix_anthropic_key', anthropicKey)
    sessionStorage.setItem('zenthorix_daily_budget', dailyBudget)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <div className="flex border-b border-border">
          {(['general', 'providers', 'budget'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                tab === t ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === 'general' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Theme</label>
              <select
                value={theme ?? 'dark'}
                onChange={e => setTheme(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          )}
          {tab === 'providers' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">OpenAI API Key</label>
              <input type="password" value={openaiKey} onChange={e => setOpenaiKey(e.target.value)}
                placeholder="sk-..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              <label className="block text-sm font-medium">Anthropic API Key</label>
              <input type="password" value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
          )}
          {tab === 'budget' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Max Daily Budget ($)</label>
              <input type="number" value={dailyBudget} onChange={e => setDailyBudget(e.target.value)}
                step="0.01" min="0" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              <p className="text-xs text-muted-foreground">Agent tasks will halt if the daily cost exceeds this limit.</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  )
}
