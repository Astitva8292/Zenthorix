import { BaseAgent, safeParse } from './agent'

export class APIConsumptionAgent extends BaseAgent {
  protected async doExecute(input: string): Promise<unknown> {
    const spec = safeParse<{ info?: { title?: string }; paths?: Record<string, unknown>; servers?: { url?: string }[] }>(input, {})
    const title = spec.info?.title ?? 'API'
    const baseUrl = spec.servers?.[0]?.url ?? 'http://localhost:3000'
    const endpoints = Object.keys(spec.paths ?? {}).slice(0, 10)
    const code = `// Auto-generated API client from ${title}
const BASE_URL = '${baseUrl}'
export async function fetchApi(endpoint: string, options?: RequestInit) {
  const res = await fetch(\`\${BASE_URL}\${endpoint}\`, options)
  if (!res.ok) throw new Error(\`API error: \${res.status}\`)
  return res.json()
}

export const endpoints = ${JSON.stringify(endpoints, null, 2)}
`
    return { files: { 'src/lib/api-client.ts': code } }
  }
}
