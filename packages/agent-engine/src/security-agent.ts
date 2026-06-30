import { BaseAgent } from './agent'

export interface SecurityFinding {
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: string
  file: string
  line?: number
  description: string
}

export class SecurityAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const findings: SecurityFinding[] = []
    const code = input

    if (code.includes('eval(')) findings.push({ severity: 'critical', type: 'code-injection', file: 'input', description: 'eval() usage is dangerous' })
    if (code.includes('innerHTML')) findings.push({ severity: 'high', type: 'xss', file: 'input', description: 'innerHTML can lead to XSS' })
    if (code.includes('process.env')) findings.push({ severity: 'low', type: 'secrets', file: 'input', description: 'Ensure env vars are not exposed' })
    if (code.includes('SELECT') && code.includes('+')) findings.push({ severity: 'critical', type: 'sql-injection', file: 'input', description: 'SQL injection risk' })

    return { approved: findings.filter(f => f.severity === 'critical').length === 0, vulnerabilities: findings }
  }
}
