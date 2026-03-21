import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      company?: any
    } & DefaultSession['user']
  }

  interface User {
    role: string
    company?: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    company?: any
  }
}