import type { ZenthorixPlugin } from '@zenthorix/plugin-sdk'

export class LinterPlugin implements ZenthorixPlugin {
  readonly name = 'auto-linter'
  readonly version = '1.0.0'
  readonly hooks = ['onPostMerge'] as const

  async onPostMerge(files: Map<string, string>): Promise<Map<string, string>> {
    const formatted = new Map<string, string>()
    for (const [path, content] of files) {
      if (/\.(ts|tsx|js|jsx|json|css)$/.test(path)) {
        formatted.set(path, content.trimEnd() + '\n')
      } else {
        formatted.set(path, content)
      }
    }
    return formatted
  }
}
