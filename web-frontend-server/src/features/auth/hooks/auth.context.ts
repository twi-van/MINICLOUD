import { createContext, useContext } from 'react'
import type { AuthUser, DemoUser } from '../types'
export const AuthContext = createContext<{
  user: AuthUser | null
  error?: string
  signIn: (user: DemoUser) => void
  signOut: () => Promise<void>
}>({ user: null, signIn: () => {}, signOut: async () => {} })
export const useAuth = () => useContext(AuthContext)
