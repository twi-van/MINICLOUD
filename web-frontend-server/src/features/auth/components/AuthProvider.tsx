import { useState, useSyncExternalStore, type ReactNode } from 'react'
import { AuthContext } from '../hooks/auth.context'
import type { DemoUser } from '../types'
import { config } from '../../../shared/lib/config'
import { getAuthSession, logoutFromKeycloak, subscribeAuth } from '../services/keycloak'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const session = useSyncExternalStore(subscribeAuth, getAuthSession)
  const keycloakMode = config.authMode === 'keycloak'
  return (
    <AuthContext.Provider
      value={{
        user: keycloakMode ? session.user : user,
        error: keycloakMode ? session.error : undefined,
        signIn: (demoUser) => {
          if (!keycloakMode) setUser(demoUser)
        },
        signOut: async () => {
          if (keycloakMode) await logoutFromKeycloak()
          else setUser(null)
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
