const dataSource = import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock'

function resolveKeycloakUrl(): string {
  if (typeof window !== 'undefined') {
    const envUrl = import.meta.env.VITE_KEYCLOAK_URL
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.replace(/\/$/, '')
    }
    const { protocol, hostname, port } = window.location
    if (port === '8080' || port === '8083') {
      return `${protocol}//${hostname}/auth`
    }
    return `${protocol}//${hostname}${port ? `:${port}` : ''}/auth`
  }
  return (import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost/auth').replace(/\/$/, '')
}

export const config = {
  dataSource,
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, ''),
  authMode:
    import.meta.env.VITE_AUTH_MODE === 'mock'
      ? 'mock'
      : import.meta.env.VITE_AUTH_MODE === 'keycloak' || dataSource === 'api'
        ? 'keycloak'
        : 'mock',
  keycloak: {
    get url(): string {
      return resolveKeycloakUrl()
    },
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'realm_52400211',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'web-frontend',
  },
}
