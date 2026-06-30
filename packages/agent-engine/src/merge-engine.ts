import { BaseAgent } from './agent'
import type { CodeProposal } from './developer-agent'

export interface MergeResult {
  accepted: boolean
  merged: CodeProposal[]
  rejected: CodeProposal[]
  critique?: string
}

export class MergeEngine {
  private readonly maxRetries = 3

  async evaluate(proposals: CodeProposal[][]): Promise<MergeResult> {
    const flatProposals = proposals.flat()
    const conflicts: string[] = []
    const merged = new Map<string, CodeProposal>()
    const rejected: CodeProposal[] = []

    for (const p of flatProposals) {
      if (merged.has(p.filePath)) {
        conflicts.push(p.filePath)
        rejected.push(p)
      } else {
        merged.set(p.filePath, p)
      }
    }

    const accepted = conflicts.length === 0
    return {
      accepted,
      merged: Array.from(merged.values()),
      rejected,
      critique: accepted ? undefined : `Conflicts detected in: ${conflicts.join(', ')}`,
    }
  }

  async debate(currentProposals: CodeProposal[][], retryCount = 0): Promise<MergeResult> {
    const result = await this.evaluate(currentProposals)
    if (!result.accepted && retryCount < this.maxRetries) {
      return this.debate(currentProposals, retryCount + 1)
    }
    return result
  }
}

export class ReviewerAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const proposals: CodeProposal[] = JSON.parse(input)
    const issues: string[] = []
    for (const p of proposals) {
      if (!p.filePath || !p.content) {
        issues.push(`Invalid proposal missing filePath or content`)
        continue
      }
      if (p.content.includes('TODO') || p.content.includes('FIXME')) {
        issues.push(`${p.filePath} contains incomplete code`)
      }
      if (p.content.includes('eval(')) {
        issues.push(`${p.filePath} contains eval() - security risk`)
      }
      if (p.content.includes('debugger')) {
        issues.push(`${p.filePath} contains debugger statement`)
      }
    }
    return { approved: issues.length === 0, issues, proposals }
  }
}
