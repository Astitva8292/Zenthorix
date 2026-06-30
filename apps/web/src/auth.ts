import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: requireEnv('AUTH_GITHUB_ID'),
      clientSecret: requireEnv('AUTH_GITHUB_SECRET'),
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt({ token }) {
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
})
