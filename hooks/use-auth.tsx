"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface User {
  id: number
  email: string
  name: string
  role: string
  companyId: number
  employeeId?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    if (token && email) {
      // For now, create user object from stored data
      // In real app, decode JWT to get user info
      const user: User = {
        id: 1, // placeholder
        email,
        name: email.split('@')[0],
        role: email.includes("admin") ? "ADMIN" : email.includes("hr") ? "HR" : "EMPLOYEE",
        companyId: 1, // placeholder
      }
      setUser(user)
    }
    setIsLoading(false)
  }, [])

  const login = (user: User) => {
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
