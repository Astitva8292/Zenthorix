export function formatCode(code: string, language: string): string {
  try {
    if (language === 'json') return JSON.stringify(JSON.parse(code), null, 2)
    return code.trimEnd() + '\n'
  } catch {
    return code.trimEnd() + '\n'
  }
}
