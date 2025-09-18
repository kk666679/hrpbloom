import type { Session, User } from "next-auth"
type NextAuthOptions = any
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"

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

        // Find user in database
        const user = await prisma.employee.findUnique({
          where: { email: credentials.email },
          include: { company: true },
        })

        if (!user) return null

        // For demo purposes, check against simple passwords
        // In production, use proper password hashing
        const validPasswords = {
          ADMIN: "admin123",
          HR: "hr123",
          EMPLOYEE: "employee123",
        }

        const expectedPassword = validPasswords[user.role as keyof typeof validPasswords]
        if (!expectedPassword || credentials.password !== expectedPassword) return null

        return {
          id: user.id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          companyId: user.companyId.toString(),
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // optional custom login page
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub!,
          role: token.role as string,
          companyId: token.companyId as string
        }
      }
      return session
    },
    async jwt({ token, user }: { token: any; user: User | undefined }) {
      if (user) {
        token.role = (user as any).role
        token.companyId = (user as any).companyId
      }
      return token
    }
  }
}
