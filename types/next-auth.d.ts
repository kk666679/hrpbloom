declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      employeeId: string
      companyId: string
    }
  }

  interface User {
    role: string
    employeeId: string
    companyId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    employeeId: string
    companyId: string
  }
}
