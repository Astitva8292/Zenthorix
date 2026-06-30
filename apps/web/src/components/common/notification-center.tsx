'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
  read: boolean
}

let listeners: Array<(notifications: Notification[]) => void> = []
let globalNotifications: Notification[] = []

export function notify(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const entry: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    read: false,
  }
  globalNotifications = [entry, ...globalNotifications].slice(0, 50)
  listeners.forEach(l => l(globalNotifications))
}

export function markAsRead(id: string) {
  globalNotifications = globalNotifications.map(n => n.id === id ? { ...n, read: true } : n)
  listeners.forEach(l => l(globalNotifications))
}

export function clearNotifications() {
  globalNotifications = []
  listeners.forEach(l => l(globalNotifications))
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setNotifications(globalNotifications)
    listeners.push(setNotifications)
    return () => { listeners = listeners.filter(l => l !== setNotifications) }
  }, [])

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative rounded-md px-3 py-1 text-sm hover:bg-accent">
        Notifications
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-sm font-medium">Notifications</span>
            <button onClick={clearNotifications} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
            )}
            {notifications.map(n => (
              <div key={n.id} onClick={() => markAsRead(n.id)}
                className={`cursor-pointer border-b border-border px-4 py-3 last:border-0 ${n.read ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className={`ml-2 mt-0.5 h-2 w-2 rounded-full ${n.type === 'error' ? 'bg-destructive' : n.type === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
