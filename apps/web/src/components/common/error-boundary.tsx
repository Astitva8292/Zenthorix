'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode; name?: string }
interface State { hasError: boolean; error?: Error }

export class PanelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State { return { hasError: true, error } }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex h-full items-center justify-center bg-secondary p-4">
          <div className="text-center">
            <p className="text-sm text-red-500">Something went wrong in {this.props.name ?? 'this panel'}</p>
            <button onClick={() => this.setState({ hasError: false })}
              className="mt-2 rounded bg-primary px-3 py-1 text-xs text-primary-foreground">Reload Panel</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
