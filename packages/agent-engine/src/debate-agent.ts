import { BaseAgent, safeParse } from './agent'
import type { CodeProposal } from './developer-agent'

export class DebateAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const parsed = safeParse<{ proposalA: CodeProposal; proposalB: CodeProposal; criteria: string }>(
      input,
      { proposalA: { filePath: '', content: '', description: '' }, proposalB: { filePath: '', content: '', description: '' }, criteria: 'correctness' }
    )
    const { proposalA, proposalB, criteria } = parsed
    const aScore = proposalA.content.length + (proposalA.description.includes('fix') ? 10 : 0)
    const bScore = proposalB.content.length + (proposalB.description.includes('fix') ? 10 : 0)
    const winner = aScore >= bScore ? proposalA : proposalB
    const reason = `Selected ${winner === proposalA ? 'A' : 'B'} based on ${criteria}: ${aScore >= bScore ? 'better content depth' : 'more targeted solution'}`
    return { winner, reason }
  }
}
