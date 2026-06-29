export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface VfsEntry {
  path: string
  type: 'file' | 'directory'
  content?: string
  children?: VfsEntry[]
  size?: number
  executable?: boolean
}

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'completed'

export type AgentEventType =
  | 'status_change'
  | 'message'
  | 'error'
  | 'tool_call'
  | 'tool_result'
  | 'vfs_change'

export interface AgentEvent {
  type: AgentEventType
  agentId: string
  timestamp: number
  data: unknown
}
