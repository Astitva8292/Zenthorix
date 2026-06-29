import { auth } from '@/auth'

export async function getSession() {
  return auth()
}

export async function getRequiredSession() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  return session
}
