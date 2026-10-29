import { mockResponse } from '../../../shared/lib/http'
import { config } from '../../../shared/lib/config'
import type { DemoUser, LoginInput, RegisterInput } from '../types'

// Optional offline demo only. Real login is handled by the Keycloak adapter.
function assertMock() {
  if (config.authMode !== 'mock')
    throw new Error('Dịch vụ đăng nhập hiện chưa khả dụng. Vui lòng thử lại sau.')
}
export const authService = {
  async login(input: LoginInput): Promise<DemoUser> {
    assertMock()
    return mockResponse({ name: input.email.split('@')[0], email: input.email, mode: 'demo' })
  },
  async register(input: RegisterInput): Promise<DemoUser> {
    assertMock()
    return mockResponse({ name: input.name.trim(), email: input.email, mode: 'demo' })
  },
}
