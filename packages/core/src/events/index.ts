import { EventBus } from './event-bus'
import type { AgentEvent } from '../types'

export type AppEvents = {
  agent: AgentEvent
  workspace: { type: 'file_changed' | 'file_saved'; path: string }
}

export const appBus = new EventBus<AppEvents>()

export { EventBus }
