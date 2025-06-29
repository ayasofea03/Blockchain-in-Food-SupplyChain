"use client"

import type React from "react"
import { AuthContext, useAuthProvider } from "@/lib/use-auth"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authValue = useAuthProvider()

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}
