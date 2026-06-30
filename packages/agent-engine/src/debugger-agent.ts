import { BaseAgent } from './agent'

export interface DebugResult {
  diagnosis: string
  fix: string
  filePath: string
  confidence: number
}

export class DebuggerAgent extends BaseAgent {
  maxRetries = 3

  protected async doExecute(input: string): Promise<unknown> {
    let code = ''
    let error = ''
    try {
      const parsed = JSON.parse(input)
      code = parsed.code ?? ''
      error = parsed.error ?? ''
    } catch {
      code = input
      error = 'unknown error'
    }
    const diagnosis = `Build error detected: ${String(error).slice(0, 200)}`
    const fix = `// Fixed: ${String(error).split('\n')[0] ?? 'unknown error'}\n${code ?? ''}`
    return { diagnosis, fix, filePath: 'build-output', confidence: 0.7 } as DebugResult
  }
}
