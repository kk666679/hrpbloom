import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// Simple authentication utilities
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "hr" | "employee"
  companyId: string
}

// Demo users for testing
export const DEMO_USERS: User[] = [
  { id: "1", email: "admin@company.com", name: "Admin User", role: "admin", companyId: "1" },
  { id: "2", email: "hr@company.com", name: "HR Manager", role: "hr", companyId: "1" },
  { id: "3", email: "employee@company.com", name: "John Doe", role: "employee", companyId: "1" },
]

export function validateCredentials(email: string, password: string): User | null {
  // Simple demo validation - in production, this would check against a database
  if (password === "demo123") {
    return DEMO_USERS.find((user) => user.email === email) || null
  }
  return null
}

export function setAuthToken(user: User) {
  // Store user data in localStorage for demo purposes
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_user", JSON.stringify(user))
  }
}

export function getAuthToken(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth_user")
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_user")
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Try to find employee in database
          const employee = await prisma.employee.findUnique({
            where: { email: credentials.email },
            include: { company: true }
          })

          if (employee && await bcrypt.compare(credentials.password, employee.password)) {
            return {
              id: employee.id.toString(),
              email: employee.email,
              name: `${employee.firstName} ${employee.lastName}`,
              role: employee.role,
              companyId: employee.companyId.toString()
            }
          }

          // Fallback to demo users for testing
          const demoUser = validateCredentials(credentials.email, credentials.password)
          if (demoUser) {
            return demoUser
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          // Fallback to demo users if database is not available
          return validateCredentials(credentials.email, credentials.password)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "demo-secret-key"
}
