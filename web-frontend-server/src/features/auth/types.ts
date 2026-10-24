export interface DemoUser {
  name: string
  email: string
  mode: 'demo'
}
export interface LoginInput {
  email: string
  password: string
}
export interface RegisterInput extends LoginInput {
  name: string
}
