import type { Session, JWT } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"

// Centralized NextAuth configuration
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>> | undefined, request: Request) {
        if (!credentials?.email || !credentials?.password) return null

        // Find user in database
        const user = await prisma.employee.findUnique({
          where: { email: credentials.email as string },
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
          employeeId: user.id.toString(),
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
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = (user as any).role
        token.companyId = (user as any).companyId
      }
      return token
    }
  }
}
