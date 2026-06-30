import { BaseAgent } from './agent'

export class CustomAgent extends BaseAgent {
  constructor(
    config: { id: string; name: string; model: string; systemPrompt?: string },
    private customRole: string,
  ) {
    super(config)
  }

  protected async doExecute(input: string): Promise<unknown> {
    return { role: this.customRole, result: `Processed: ${input.slice(0, 100)}` }
  }
}
