// Simple authentication utilities
export interface User {
  id: string
  email: string
  name: string
  role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE" | "EMPLOYER" | "JOB_SEEKER"
  companyId: string
}

// Demo users for testing
export const DEMO_USERS: User[] = [
  { id: "1", email: "admin@company.com", name: "Admin User", role: "ADMIN", companyId: "1" },
  { id: "2", email: "hr@company.com", name: "HR Manager", role: "HR", companyId: "1" },
  { id: "3", email: "employee@company.com", name: "John Doe", role: "EMPLOYEE", companyId: "1" },
]

export function validateCredentials(email: string, password: string): User | null {
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

// Server-side function to get user from request
export function getUserFromRequest(request: Request): User | null {
  // For demo purposes, return the first demo user
  // In a real app, you'd extract and verify JWT from Authorization header
  return DEMO_USERS[0]
}
