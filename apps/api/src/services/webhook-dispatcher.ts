import { createHmac } from 'crypto'

export class WebhookDispatcher {
  async dispatch(url: string, secret: string, event: string, payload: unknown): Promise<boolean> {
    const body = JSON.stringify({ event, payload, timestamp: Date.now() })
    const signature = createHmac('sha256', secret).update(body).digest('hex')

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Zenthorix-Signature': signature, 'X-Zenthorix-Event': event },
        body,
      })
      return res.ok
    } catch { return false }
  }
}
