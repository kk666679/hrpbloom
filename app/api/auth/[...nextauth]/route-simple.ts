export const runtime = "nodejs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Demo users for testing
        const DEMO_USERS = [
          { id: "1", email: "admin@company.com", name: "Admin User", role: "admin", companyId: "1" },
          { id: "2", email: "hr@company.com", name: "HR Manager", role: "hr", companyId: "1" },
          { id: "3", email: "employee@company.com", name: "John Doe", role: "employee", companyId: "1" },
        ]

        if (credentials.password === "demo123") {
          const user = DEMO_USERS.find((user) => user.email === credentials.email)
          return user ? { id: user.id, name: user.name, email: user.email } : null
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
