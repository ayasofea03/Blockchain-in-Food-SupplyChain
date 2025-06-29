"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  name: string
  email: string
  role: string
  businessName?: string
  phone?: string
  location?: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  walletAddress?: string
  loginMethod: "wallet" | "email"
  loginTime: string
  registeredAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  canAccess: (feature: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const login = (userData: User) => {
    const userWithTimestamp = {
      ...userData,
      loginTime: new Date().toISOString(),
    }
    setUser(userWithTimestamp)
    setIsAuthenticated(true)
    localStorage.setItem("currentUser", JSON.stringify(userWithTimestamp))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  const canAccess = (feature: string): boolean => {
    if (!user) return false

    const role = user.role.toLowerCase()
    const permissions: Record<string, string[]> = {
      "all-items": ["processor", "retailer"],
      participants: ["processor", "retailer"],
      "consumer-tracker": ["consumer"],
      harvest: ["farmer"],
      "manage-items": ["farmer", "processor", "retailer"],
      profile: ["farmer", "processor", "retailer", "consumer"],
      analytics: ["farmer", "processor", "retailer"],
      "my-items": ["farmer"],
    }

    return permissions[feature]?.includes(role) || false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    canAccess,
  }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
