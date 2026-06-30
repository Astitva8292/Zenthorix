'use client'

import { useState } from 'react'

interface Activity {
  id: string
  agent: string
  action: string
  timestamp: number
  icon?: string
}

export function ActivityFeed() {
  const [activities] = useState<Activity[]>([
    { id: '1', agent: 'Planner', action: 'Analyzed request: build authentication', timestamp: Date.now() - 5000, icon: '🧠' },
    { id: '2', agent: 'Developer', action: 'Created src/auth/login.tsx', timestamp: Date.now() - 3000, icon: '✏️' },
    { id: '3', agent: 'Security', action: 'No vulnerabilities found', timestamp: Date.now() - 1000, icon: '🛡️' },
  ])

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">ACTIVITY</div>
      <div className="flex-1 overflow-auto">
        {activities.map(a => (
          <div key={a.id} className="flex items-start gap-2 border-b border-border px-3 py-2 text-xs">
            <span>{a.icon}</span>
            <div>
              <span className="font-medium text-foreground">{a.agent}</span>
              <span className="ml-1 text-muted-foreground">{a.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
