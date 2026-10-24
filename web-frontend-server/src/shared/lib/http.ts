import { config } from './config'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// All backend traffic goes through this boundary. Add bearer-token handling here
// when the team's Keycloak realm/client contract is available.
export async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new ApiError('Không thể tải dữ liệu. Vui lòng thử lại.', response.status)
  }
  return response.json()
}

export async function mockResponse<T>(data: T, signal?: AbortSignal): Promise<T> {
  signal?.throwIfAborted()
  await new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, 250)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
  return structuredClone(data)
}
