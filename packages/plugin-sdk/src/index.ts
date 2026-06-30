export type PluginHook = 'onPreTask' | 'onAgentDebate' | 'onPostMerge' | 'onBuildSuccess' | 'onVfsUpdate'

export interface ZenthorixPlugin {
  readonly name: string
  readonly version: string
  readonly hooks: PluginHook[]
  onPreTask?(task: unknown): Promise<unknown>
  onAgentDebate?(proposals: unknown[]): Promise<unknown[]>
  onPostMerge?(files: Map<string, string>): Promise<Map<string, string>>
  onBuildSuccess?(result: unknown): Promise<void>
  onVfsUpdate?(path: string, content: string): Promise<void>
}

export class PluginRegistry {
  private plugins = new Map<string, ZenthorixPlugin>()

  register(plugin: ZenthorixPlugin): void {
    if (this.plugins.has(plugin.name)) throw new Error(`Plugin "${plugin.name}" already registered`)
    this.plugins.set(plugin.name, plugin)
  }

  unregister(name: string): void { this.plugins.delete(name) }
  get(name: string): ZenthorixPlugin | undefined { return this.plugins.get(name) }
  getAll(): ZenthorixPlugin[] { return Array.from(this.plugins.values()) }

  getByHook(hook: PluginHook): ZenthorixPlugin[] {
    return this.getAll().filter(p => p.hooks.includes(hook))
  }
}
