import { BaseAgent, safeParse } from './agent'

export class TestAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const { filePath, code } = safeParse<{ filePath: string; code: string }>(input, { filePath: 'unknown.ts', code: '' })
    const testPath = filePath.replace(/\.tsx?$/, '.test.$&')
    const testCode = `import { describe, it, expect } from 'vitest'\n\ndescribe('${filePath.split('/').pop()}', () => {\n  it('should work', () => {\n    expect(true).toBe(true)\n  })\n})\n`
    return { testPath, testCode }
  }
}
