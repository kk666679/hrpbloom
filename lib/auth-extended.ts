// Extended authentication utilities for server-side token verification and generation

import { User, DEMO_USERS } from "./auth"

// Server-side token verification (for middleware)
export function verifyToken(token: string): User | null {
  try {
    // In a real app, you'd verify JWT or session token
    // For demo, we'll use a simple token format: userId:timestamp
    const parts = token.split(':')
    if (parts.length !== 2) return null
    const userId = parts[0]
    return DEMO_USERS.find(user => user.id === userId) || null
  } catch {
    return null
  }
}

// Generate token for demo (server-side)
export function generateToken(user: User): string {
  // Simple token format for demo: userId:timestamp
  return `${user.id}:${Date.now()}`
}
