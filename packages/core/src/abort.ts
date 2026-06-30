export class TaskCancellation {
  private controllers = new Map<string, AbortController>()

  create(taskId: string): AbortSignal {
    const controller = new AbortController()
    this.controllers.set(taskId, controller)
    return controller.signal
  }

  cancel(taskId: string): boolean {
    const controller = this.controllers.get(taskId)
    if (!controller) return false
    controller.abort()
    this.controllers.delete(taskId)
    return true
  }

  cancelAll(): void {
    for (const [id, controller] of this.controllers) {
      controller.abort()
    }
    this.controllers.clear()
  }
}
