const dataSource = import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock'

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
    url: (import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost/auth').replace(/\/$/, ''),
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'minicloud',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'web-frontend',
  },
}
