import type { Metadata } from 'next'
import { Providers } from './providers'
import { auth } from '@/auth'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zenthorix',
  description: 'AI-powered development environment',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}
