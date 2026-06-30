export class PromptOptimizer {
  optimize(prompt: string): string {
    return prompt
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  minifyJson(json: string): string {
    try { return JSON.stringify(JSON.parse(json)) }
    catch { return json }
  }

  removeFiller(text: string): string {
    return text
      .replace(/^(Alright|Okay|Sure|Let me|I'll|I can|I would|Basically|Actually|Simply|Just)\b/gi, '')
      .trim()
  }

  optimizeMessages(messages: { role: string; content: string }[]): { role: string; content: string }[] {
    return messages.map(m => ({
      ...m,
      content: this.optimize(this.removeFiller(m.content)),
    }))
  }
}
