import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { validateCredentials } from "@/lib/auth-clean"

// Centralized NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await validateCredentials(credentials.email, credentials.password)
        return user ? { id: user.id, name: user.name, email: user.email } : null
      },
    }),
  ],
  pages: {
    signIn: "/login", // optional custom login page
  },
}
