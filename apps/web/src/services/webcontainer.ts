export class WebContainerService {
  private booted = false

  async boot(): Promise<void> {
    if (this.booted) return
    this.booted = true
    console.log('[WebContainer] Booted')
  }

  async mount(files: Record<string, string>): Promise<void> {
    console.log(`[WebContainer] Mounted ${Object.keys(files).length} files`)
  }

  async runCommand(command: string): Promise<string> {
    return `[WebContainer] Running: ${command}\nDone.`
  }

  async destroy(): Promise<void> {
    this.booted = false
    console.log('[WebContainer] Destroyed')
  }
}
