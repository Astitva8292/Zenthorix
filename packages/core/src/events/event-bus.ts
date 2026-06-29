type Handler<T = unknown> = (event: T) => void | Promise<void>

export class EventBus<EventMap extends Record<string, unknown>> {
  private handlers = new Map<keyof EventMap, Set<Handler<EventMap[keyof EventMap]>>>()

  on<K extends keyof EventMap>(type: K, handler: Handler<EventMap[K]>): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler as Handler)
  }

  off<K extends keyof EventMap>(type: K, handler: Handler<EventMap[K]>): void {
    this.handlers.get(type)?.delete(handler as Handler)
  }

  emit<K extends keyof EventMap>(type: K, event: EventMap[K]): void {
    this.handlers.get(type)?.forEach((handler) => {
      void handler(event)
    })
  }
}
