import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

export function createDbClient(url?: string) {
  const client = createClient({
    url: url ?? process.env.DATABASE_URL ?? 'file:local.db',
  })
  return drizzle(client, { schema })
}

export const db = createDbClient()
