import Keycloak from 'keycloak-js'
import { config } from '../../../shared/lib/config'
import type { AuthUser } from '../types'

type AuthSession = { user: AuthUser | null; error?: string }

let client: Keycloak | undefined
let initialization: Promise<void> | undefined
let session: AuthSession = { user: null }
const listeners = new Set<() => void>()
const sessionMarker = 'minihome:keycloak-session'

// Only a boolean SSO hint is persisted. Access/refresh tokens stay in the adapter's memory.
function rememberSession(authenticated: boolean) {
  try {
    if (authenticated) sessionStorage.setItem(sessionMarker, 'true')
    else sessionStorage.removeItem(sessionMarker)
  } catch {
    // Login still works when storage is unavailable.
  }
}

function hadSession() {
  try {
    return sessionStorage.getItem(sessionMarker) === 'true'
  } catch {
    return false
  }
}

function publish(error?: string) {
  const claims = client?.idTokenParsed || client?.tokenParsed
  session = {
    user:
      client?.authenticated && claims
        ? {
            id: client.subject,
            name: String(claims.name || claims.preferred_username || 'Bạn'),
            email: String(claims.email || ''),
            mode: 'keycloak',
          }
        : null,
    error,
  }
  rememberSession(Boolean(session.user))
  listeners.forEach((listener) => listener())
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getAuthSession = () => session

// Bootstrap before BrowserRouter: the adapter consumes/cleans the OIDC callback URL.
// The shared promise also prevents duplicate init during React StrictMode renders.
export function initializeKeycloak(): Promise<void> {
  if (config.authMode !== 'keycloak') return Promise.resolve()
  if (initialization) return initialization

  const active = new Keycloak(config.keycloak)
  client = active
  active.onAuthSuccess = () => publish()
  active.onAuthRefreshSuccess = () => publish()
  active.onAuthLogout = () => publish()
  active.onAuthRefreshError = () => {
    active.clearToken()
    publish('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  }
  active.onTokenExpired = () => {
    void getAccessToken().catch(() => {
      // getAccessToken publishes a visible session error without logging tokens.
    })
  }

  initialization = active
    .init({
      // Restore a known session on reload, while public pages remain usable for guests.
      onLoad: hadSession() ? 'check-sso' : undefined,
      flow: 'standard',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      scope: 'openid profile email',
    })
    .then(() => publish())
    .catch(() => {
      active.clearToken()
      client = undefined
      initialization = undefined
      publish('Không thể khôi phục đăng nhập. Vui lòng thử đăng nhập lại.')
      throw new Error('Không thể kết nối dịch vụ đăng nhập.')
    })
  return initialization
}

export function safeRedirect(path = '/rooms') {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return '/rooms'
  const target = new URL(path, window.location.origin)
  return target.origin === window.location.origin
    ? `${target.pathname}${target.search}${target.hash}`
    : '/rooms'
}

export async function loginWithKeycloak(path?: string) {
  await initializeKeycloak()
  if (!client) throw new Error('Dịch vụ đăng nhập chưa sẵn sàng.')
  await client.login({ redirectUri: new URL(safeRedirect(path), window.location.origin).href })
}

export async function logoutFromKeycloak() {
  if (!client) return
  rememberSession(false)
  try {
    await client.logout({ redirectUri: `${window.location.origin}/` })
  } catch {
    publish('Không thể đăng xuất. Vui lòng thử lại.')
    throw new Error('Không thể đăng xuất. Vui lòng thử lại.')
  }
}

export async function getAccessToken(): Promise<string | undefined> {
  const active = client
  if (config.authMode !== 'keycloak' || !active?.authenticated) return undefined
  try {
    await active.updateToken(30)
    return active.token
  } catch {
    active.clearToken()
    publish('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  }
}
