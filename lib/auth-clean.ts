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

export async function validateCredentials(email: string, password: string): Promise<User | null> {
  if (password === "demo123") {
    return DEMO_USERS.find((user) => user.email === email) || null
  }
  return null
}

export function setAuthToken(user: User) {
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
