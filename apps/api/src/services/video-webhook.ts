export class VideoWebhookService {
  private pendingJobs = new Map<string, { status: string; url?: string }>()

  createJob(): string {
    const id = crypto.randomUUID()
    this.pendingJobs.set(id, { status: 'processing' })
    return id
  }

  completeJob(id: string, url: string): void {
    this.pendingJobs.set(id, { status: 'completed', url })
  }

  getJob(id: string) { return this.pendingJobs.get(id) }
}
