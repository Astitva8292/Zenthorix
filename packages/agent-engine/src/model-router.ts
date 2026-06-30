export type TaskComplexity = 'trivial' | 'simple' | 'complex'

export interface RouteConfig {
  trivial: string
  simple: string
  complex: string
}

export class ModelRouter {
  private defaultConfig: RouteConfig = {
    trivial: 'claude-3-5-haiku-20241022',
    simple: 'claude-3-5-sonnet-20241022',
    complex: 'gpt-4o',
  }

  constructor(private config: RouteConfig = this.defaultConfig) {}

  evaluateComplexity(task: string): TaskComplexity {
    const length = task.length
    if (length < 100) return 'trivial'
    if (length < 500) return 'simple'
    return 'complex'
  }

  selectModel(task: string): string {
    const complexity = this.evaluateComplexity(task)
    return this.config[complexity]
  }
}

export class Dispatcher {
  async executeAll<T>(tasks: (() => Promise<T>)[]): Promise<PromiseSettledResult<T>[]> {
    return Promise.allSettled(tasks.map(t => t()))
  }
}
