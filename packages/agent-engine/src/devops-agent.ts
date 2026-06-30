import { BaseAgent, safeParse } from './agent'

export class DevOpsAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const parsed = safeParse<{ framework?: string; nodeVersion?: string }>(input, {})
    const nodeVersion = parsed.nodeVersion ?? '22'
    const ciYaml = `name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${nodeVersion} }
      - run: npm ci
      - run: npm run build
      - run: npm test
`
    return { path: '.github/workflows/ci.yml', content: ciYaml }
  }
}
