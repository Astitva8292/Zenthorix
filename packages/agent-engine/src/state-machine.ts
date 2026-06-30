export type State = 'idle' | 'planning' | 'proposing' | 'reviewing' | 'merging' | 'building' | 'debugging' | 'success' | 'error'

export type Event = 
  | { type: 'START' }
  | { type: 'PLAN_COMPLETE' }
  | { type: 'PROPOSE_COMPLETE' }
  | { type: 'REVIEW_COMPLETE'; approved: boolean }
  | { type: 'MERGE_COMPLETE' }
  | { type: 'BUILD_COMPLETE'; success: boolean }
  | { type: 'DEBUG_COMPLETE' }
  | { type: 'FAIL'; error: string }
  | { type: 'RESET' }

export class AgentStateMachine {
  current: State = 'idle'
  context: Record<string, unknown> = {}
  private stepCount = 0
  private onTransition?: (from: State, to: State, event: Event) => void

  constructor(onTransition?: (from: State, to: State, event: Event) => void) {
    this.onTransition = onTransition
  }

  transition(event: Event): State {
    const from = this.current
    const transitions: Record<string, Record<string, State>> = {
      idle: { START: 'planning' },
      planning: { PLAN_COMPLETE: 'proposing', FAIL: 'error' },
      proposing: { PROPOSE_COMPLETE: 'reviewing', FAIL: 'error' },
      reviewing: { REVIEW_COMPLETE: 'merging', FAIL: 'error' },
      merging: { MERGE_COMPLETE: 'building', REVIEW_COMPLETE: 'reviewing', FAIL: 'error' },
      building: { BUILD_COMPLETE: 'success', FAIL: 'debugging' },
      debugging: { DEBUG_COMPLETE: 'building', FAIL: 'error' },
      success: { RESET: 'idle' },
      error: { RESET: 'idle' },
    }

    const target = transitions[from]?.[event.type]

    if (event.type === 'REVIEW_COMPLETE') {
      if (!event.approved) {
        this.stepCount++
        if (this.stepCount > 5) {
          this.current = 'error'
          this.context = { error: 'Max review cycles exceeded' }
          this.onTransition?.(from, this.current, event)
          return this.current
        }
        this.current = transitions.reviewing?.FAIL ?? 'error'
        this.onTransition?.(from, this.current, event)
        return this.current
      }
      this.stepCount = 0
    }

    if (event.type === 'BUILD_COMPLETE') {
      this.current = event.success && target ? target : 'debugging'
      this.onTransition?.(from, this.current, event)
      return this.current
    }

    this.current = target ?? (event.type === 'FAIL' ? 'error' : from)
    this.onTransition?.(from, this.current, event)
    return this.current
  }

  can(event: Event): boolean {
    const transitions: Record<string, string[]> = {
      idle: ['START'],
      planning: ['PLAN_COMPLETE', 'FAIL'],
      proposing: ['PROPOSE_COMPLETE', 'FAIL'],
      reviewing: ['REVIEW_COMPLETE', 'FAIL'],
      merging: ['MERGE_COMPLETE', 'REVIEW_COMPLETE', 'FAIL'],
      building: ['BUILD_COMPLETE', 'FAIL'],
      debugging: ['DEBUG_COMPLETE', 'FAIL'],
      success: ['RESET'],
      error: ['RESET'],
    }
    return transitions[this.current]?.includes(event.type) ?? false
  }

  reset(): void {
    this.current = 'idle'
    this.context = {}
    this.stepCount = 0
  }
}
