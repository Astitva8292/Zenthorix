interface Job {
  id: string
  type: string
  data: unknown
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: number
}

export class Queue {
  private jobs: Job[] = []
  private processing = false

  async add(type: string, data: unknown): Promise<string> {
    const id = crypto.randomUUID()
    this.jobs.push({ id, type, data, status: 'pending', createdAt: Date.now() })
    if (!this.processing) this.processNext()
    return id
  }

  private async processNext(): Promise<void> {
    if (this.processing) return
    this.processing = true
    const job = this.jobs.find(j => j.status === 'pending')
    if (!job) { this.processing = false; return }
    job.status = 'processing'
    try {
      await this.execute(job)
      job.status = 'completed'
    } catch { job.status = 'failed' }
    this.processing = false
    this.processNext()
  }

  private async execute(job: Job): Promise<void> {
    await new Promise(r => setTimeout(r, 100))
    console.log(`[Queue] Processed job ${job.id}: ${job.type}`)
  }

  getStatus(id: string): Job | undefined {
    return this.jobs.find(j => j.id === id)
  }
}

export const buildQueue = new Queue()
export const agentQueue = new Queue()
