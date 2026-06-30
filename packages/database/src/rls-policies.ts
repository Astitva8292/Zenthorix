import type { SQL } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { conversations } from './schema'

export interface RLSPolicy {
  table: string
  policyName: string
  using: (userId: string) => SQL
}

export const RLS_POLICIES: RLSPolicy[] = [
  {
    table: 'conversations',
    policyName: 'users_own_conversations',
    using: (userId: string) => eq(conversations.userId, userId),
  },
]

export function applyUserFilter(userId: string): SQL {
  return eq(conversations.userId, userId)
}
