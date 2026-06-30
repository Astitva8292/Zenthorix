export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export class MCPService {
  private tools = new Map<string, MCPTool>()

  registerTool(tool: MCPTool): void { this.tools.set(tool.name, tool) }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.get(name)
    if (!tool) throw new Error(`MCP tool "${name}" not found`)
    return { tool: name, args, status: 'executed' }
  }

  listTools(): MCPTool[] { return Array.from(this.tools.values()) }
}
