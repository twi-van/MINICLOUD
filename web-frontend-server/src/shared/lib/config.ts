export const config = {
  dataSource: import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, ''),
}
