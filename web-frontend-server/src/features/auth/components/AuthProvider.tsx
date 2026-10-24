import { useState, type ReactNode } from 'react'
import { AuthContext } from '../hooks/auth.context'
import type { DemoUser } from '../types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  return (
    <AuthContext.Provider value={{ user, signIn: setUser, signOut: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  )
}
