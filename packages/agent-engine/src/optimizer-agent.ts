import { BaseAgent } from './agent'

export interface OptimizationSuggestion {
  type: 'performance' | 'memory' | 'bundle'
  file: string
  line?: number
  suggestion: string
  severity: 'warning' | 'info'
}

export class OptimizerAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const suggestions: OptimizationSuggestion[] = []
    const code = input

    if (code.includes('.map(') && code.includes('.filter(')) {
      suggestions.push({ type: 'performance', file: 'input', suggestion: 'Combine map+filter into reduce for single pass', severity: 'warning' })
    }
    if (code.includes('useState') && code.includes('useEffect')) {
      suggestions.push({ type: 'performance', file: 'input', suggestion: 'Consider useMemo for expensive computations', severity: 'info' })
    }
    if ((code.match(/console\.log/g)?.length ?? 0) > 3) {
      suggestions.push({ type: 'performance', file: 'input', suggestion: 'Remove console.log in production', severity: 'warning' })
    }

    return { approved: true, warnings: suggestions, errors: [] }
  }
}
