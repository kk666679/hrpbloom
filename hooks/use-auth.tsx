"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type User, getAuthToken, clearAuthToken } from "@/lib/auth-utils"

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
    const existingUser = getAuthToken()
    setUser(existingUser)
    setIsLoading(false)
  }, [])

  const login = (user: User) => {
    setUser(user)
  }

  const logout = () => {
    clearAuthToken()
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
