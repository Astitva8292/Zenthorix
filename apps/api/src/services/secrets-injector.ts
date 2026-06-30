import { SecretsManager } from './secrets'

export class SecretsInjector {
  constructor(private secrets: SecretsManager) {}

  getEnvVars(): string[] {
    return this.secrets.toEnvArray()
  }

  sanitizeLogs(output: string): string {
    let sanitized = output
    for (const [key, value] of this.secrets.list().map(k => [k, this.secrets.get(k)] as [string, string])) {
      sanitized = sanitized.split(value).join('***')
    }
    return sanitized
  }
}
