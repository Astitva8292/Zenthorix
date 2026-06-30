export class BillingService {
  async createCheckoutSession(userId: string, priceId: string): Promise<string | null> {
    return `checkout_session_${userId}_${Date.now()}`
  }

  async handleWebhook(event: unknown): Promise<void> {
    console.log('[Billing] Webhook received:', (event as any)?.type)
  }
}
