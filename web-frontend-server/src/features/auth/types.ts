export interface AuthUser {
  id?: string
  name: string
  email: string
  mode: 'demo' | 'keycloak'
}
export interface DemoUser extends AuthUser {
  mode: 'demo'
}
export interface LoginInput {
  email: string
  password: string
}
export interface RegisterInput extends LoginInput {
  name: string
}
