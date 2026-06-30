// Largest-context model used as ultimate fallback
const FALLBACK_MODEL = 'claude-3-5-sonnet'
const FALLBACK_MAX_TOKENS = 200000

export class AdaptiveRouter {
  private modelMap: Record<string, { maxTokens: number }> = {
    'claude-3-5-haiku': { maxTokens: 200000 },
    'claude-3-5-sonnet': { maxTokens: 200000 },
    'gpt-4o': { maxTokens: 128000 },
    'gpt-4o-mini': { maxTokens: 128000 },
    'deepseek-chat': { maxTokens: 128000 },
  }

  selectModel(estimatedTokens: number, preferredModel: string): string {
    const preferred = this.modelMap[preferredModel]
    if (!preferred) {
      return estimatedTokens <= FALLBACK_MAX_TOKENS ? FALLBACK_MODEL : FALLBACK_MODEL
    }
    if (estimatedTokens <= preferred.maxTokens) return preferredModel
    if (estimatedTokens <= FALLBACK_MAX_TOKENS) return FALLBACK_MODEL
    return FALLBACK_MODEL
  }
}
