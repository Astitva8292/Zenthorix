import type { EventBus } from '@zenthorix/core'

export type PluginHook = 'onStartup' | 'onShutdown' | 'onAgentEvent' | 'onMessage'

export interface ZenthorixPlugin {
  readonly name: string
  readonly version: string
  readonly hooks: PluginHook[]
  onStartup?(eventBus: EventBus<any>): void | Promise<void>
  onShutdown?(): void | Promise<void>
  onAgentEvent?(event: unknown): void | Promise<void>
  onMessage?(message: unknown): unknown | Promise<unknown>
}

export class PluginRegistry {
  private plugins = new Map<string, ZenthorixPlugin>()

  register(plugin: ZenthorixPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`)
    }
    this.plugins.set(plugin.name, plugin)
  }

  unregister(name: string): void {
    this.plugins.delete(name)
  }

  get(name: string): ZenthorixPlugin | undefined {
    return this.plugins.get(name)
  }

  getAll(): ZenthorixPlugin[] {
    return Array.from(this.plugins.values())
  }

  getByHook(hook: PluginHook): ZenthorixPlugin[] {
    return this.getAll().filter((p) => p.hooks.includes(hook))
  }
}
