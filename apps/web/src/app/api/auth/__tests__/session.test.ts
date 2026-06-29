import { describe, it, expect, vi } from 'vitest'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

describe('Session', () => {
  it('exports getSession function', async () => {
    const { getSession } = await import('@/lib/session')
    expect(typeof getSession).toBe('function')
  })

  it('exports getRequiredSession function', async () => {
    const { getRequiredSession } = await import('@/lib/session')
    expect(typeof getRequiredSession).toBe('function')
  })
})
