import { BaseAgent } from './agent'

export class UXAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const issues: string[] = []
    if (!input.includes('aria-')) issues.push('Missing ARIA attributes')
    if (!input.includes('role=')) issues.push('Missing semantic roles')
    if (!input.includes('<nav') && !input.includes('role="navigation"')) issues.push('Consider adding navigation landmarks')
    if (input.includes('<div') && !input.includes('<button') && !input.includes('<a')) issues.push('Use semantic HTML instead of divs')
    return { approved: issues.length === 0, issues }
  }
}
