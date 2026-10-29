import { useEffect, useState } from 'react'
import { Alert, App, Button, Form, Input } from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/auth.context'
import { authService } from '../services/auth.service'
import type { RegisterInput } from '../types'
import { SafeImage } from '../../../shared/components/SafeImage'
import { config } from '../../../shared/lib/config'
import { loginWithKeycloak, safeRedirect } from '../services/keycloak'

export default function AuthPage({ register = false }: { register?: boolean }) {
  const [loading, setLoading] = useState(false)
  const { signIn, user, error } = useAuth()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = safeRedirect(params.get('redirect') || '/rooms')
  const keycloakMode = config.authMode === 'keycloak'
  useEffect(() => {
    if (keycloakMode && user) navigate(redirect, { replace: true })
  }, [keycloakMode, user, navigate, redirect])

  const login = async () => {
    setLoading(true)
    try {
      await loginWithKeycloak(redirect)
    } catch {
      message.error('Không thể mở trang đăng nhập. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }
  const submit = async (values: RegisterInput) => {
    setLoading(true)
    try {
      const user = register ? await authService.register(values) : await authService.login(values)
      signIn(user)
      message.success(`Chào ${user.name}!`)
      navigate(redirect, { replace: true })
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="page-container py-10 md:py-16">
      <div className="auth-grid">
        <div className="relative hidden min-h-155 overflow-hidden rounded-2xl md:block">
          <SafeImage
            src="/images/room-1.jpg"
            alt="Không gian sống sáng và yên bình"
            eager
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <span className="eyebrow !text-[#e7c9ab]">CHÀO MỪNG BẠN ĐẾN VỚI MINIHOME</span>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Một góc nhỏ.
              <br />
              Một khởi đầu lớn.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
              Tìm nơi ở phù hợp, lưu những căn phòng yêu thích và sẵn sàng cho hành trình của bạn.
            </p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md py-3 md:py-8">
          <Link to="/" className="mb-9 inline-flex items-center gap-2 text-sm text-muted">
            <ArrowLeftOutlined /> Về trang chủ
          </Link>
          <span className="eyebrow block">
            {register ? 'BẮT ĐẦU CÙNG NHAU' : 'THẬT VUI KHI BẠN TRỞ LẠI'}
          </span>
          <h1 className="mb-3 mt-3 text-3xl font-semibold">
            {register ? 'Tạo tài khoản của bạn' : 'Chào bạn, lại là mình đây!'}
          </h1>
          <p className="mb-6 text-sm text-muted">
            {register
              ? 'Một bước nhỏ để tìm chốn về mới.'
              : 'Đăng nhập để tiếp tục hành trình tìm phòng.'}
          </p>
          {keycloakMode ? (
            <div className="space-y-5">
              {error && <Alert type="warning" showIcon title={error} />}
              <p className="text-sm leading-6 text-muted">
                {register
                  ? 'Tài khoản được cấp bởi quản trị viên. Nếu đã có tài khoản, bạn có thể đăng nhập bên dưới.'
                  : 'Bạn sẽ được chuyển đến trang Keycloak để đăng nhập và quay lại trang đang xem.'}
              </p>
              <Button
                block
                type="primary"
                size="large"
                loading={loading}
                onClick={login}
                icon={<ArrowRightOutlined />}
                iconPlacement="end"
              >
                Đăng nhập qua Keycloak
              </Button>
              <Link className="text-link" to="/rooms">
                Tiếp tục xem phòng
              </Link>
            </div>
          ) : (
            <Form
              layout="vertical"
              requiredMark={false}
              onFinish={submit}
              size="large"
              key={register ? 'register' : 'login'}
            >
              {register && (
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[
                    { required: true, whitespace: true, message: 'Vui lòng nhập họ và tên.' },
                    { max: 80, message: 'Họ và tên không được vượt quá 80 ký tự.' },
                  ]}
                >
                  <Input
                    autoComplete="name"
                    prefix={<UserOutlined className="text-muted" />}
                    placeholder="Nhập họ và tên đầy đủ"
                  />
                </Form.Item>
              )}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ email.' },
                  { type: 'email', message: 'Nhập email hợp lệ, ví dụ: ten@gmail.com.' },
                ]}
              >
                <Input
                  type="email"
                  autoComplete="email"
                  prefix={<MailOutlined className="text-muted" />}
                  placeholder="Nhập địa chỉ email của bạn"
                />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu.' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
                ]}
              >
                <Input.Password
                  autoComplete="off"
                  prefix={<LockOutlined className="text-muted" />}
                  placeholder={register ? 'Tạo mật khẩu từ 6 ký tự' : 'Nhập mật khẩu của bạn'}
                />
              </Form.Item>
              {register && (
                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirm"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu.' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        return !value || getFieldValue('password') === value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error('Mật khẩu chưa khớp. Nhập lại mật khẩu ở trên.'),
                            )
                      },
                    }),
                  ]}
                >
                  <Input.Password autoComplete="off" placeholder="Nhập lại mật khẩu vừa tạo" />
                </Form.Item>
              )}
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<ArrowRightOutlined />}
                iconPlacement="end"
              >
                {register ? 'Đăng ký' : 'Đăng nhập'}
              </Button>
            </Form>
          )}
          {!keycloakMode && (
            <p className="mt-6 text-center text-sm text-muted">
              {register ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
              <Link
                className="font-semibold text-brand"
                to={`${register ? '/login' : '/register'}?redirect=${encodeURIComponent(redirect)}`}
              >
                {register ? 'Đăng nhập' : 'Đăng ký ngay'}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
