import { createContext, useContext } from 'react'
import type { DemoUser } from '../types'
export const AuthContext = createContext<{
  user: DemoUser | null
  signIn: (user: DemoUser) => void
  signOut: () => void
}>({ user: null, signIn: () => {}, signOut: () => {} })
export const useAuth = () => useContext(AuthContext)
