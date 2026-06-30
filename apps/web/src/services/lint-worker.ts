export interface LintResult {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

export function lintCode(code: string, language: string): LintResult[] {
  const results: LintResult[] = []
  if (code.includes('debugger;')) results.push({ line: code.split('\n').findIndex(l => l.includes('debugger;')) + 1, column: 0, message: 'Unexpected debugger statement', severity: 'warning' })
  if (code.includes('var ')) results.push({ line: code.split('\n').findIndex(l => l.includes('var ')) + 1, column: 0, message: 'Use const or let instead of var', severity: 'warning' })
  return results
}
