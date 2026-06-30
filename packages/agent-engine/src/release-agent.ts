import { BaseAgent, safeParse } from './agent'

export interface ChangelogEntry {
  version: string
  date: string
  changes: {
    type: 'feat' | 'fix' | 'refactor' | 'docs' | 'chore'
    description: string
    scope?: string
  }[]
}

export class ReleaseAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const parsed = safeParse<{ commits: string[]; version: string }>(input, { commits: [], version: '0.1.0' })
    const entries: ChangelogEntry['changes'] = []

    for (const commit of parsed.commits) {
      const match = commit.match(/^(feat|fix|refactor|docs|chore)(\((\w+)\))?:\s+(.+)$/i)
      if (match) {
        entries.push({
          type: match[1].toLowerCase() as ChangelogEntry['changes'][0]['type'],
          scope: match[3],
          description: match[4],
        })
      }
    }

    const changelog: ChangelogEntry = {
      version: parsed.version,
      date: new Date().toISOString().split('T')[0],
      changes: entries,
    }

    const markdown = this.formatMarkdown(changelog)
    return { changelog, markdown, path: 'CHANGELOG.md' }
  }

  private formatMarkdown(entry: ChangelogEntry): string {
    const lines: string[] = [`## ${entry.version} (${entry.date})`]
    const groups: Record<string, string[]> = { feat: [], fix: [], refactor: [], docs: [], chore: [] }

    for (const change of entry.changes) {
      const prefix = change.scope ? `**${change.scope}:** ` : ''
      groups[change.type]?.push(`- ${prefix}${change.description}`)
    }

    const labels: Record<string, string> = { feat: 'Features', fix: 'Bug Fixes', refactor: 'Refactoring', docs: 'Documentation', chore: 'Chores' }

    for (const [type, label] of Object.entries(labels)) {
      if (groups[type]?.length) {
        lines.push(`\n### ${label}`)
        lines.push(...groups[type])
      }
    }

    return lines.join('\n')
  }
}
