import { Suspense, useEffect, useState } from 'react'
import { Avatar, Button, Drawer, Dropdown, Spin } from 'antd'
import {
  ArrowRightOutlined,
  CloudOutlined,
  HeartOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../../features/auth/hooks/auth.context'
import { useFavorites } from '../../features/rooms/hooks/favorites.context'
import { QuickSearch } from '../../features/rooms/components/QuickSearch'
import { VisualEffects } from '../../shared/components/VisualEffects'
import { ScrollProgress } from '../../shared/components/ScrollProgress'

const nav = [
  { to: '/', label: 'Trang chủ' },
  { to: '/rooms', label: 'Tìm phòng' },
  { to: '/blog', label: 'Góc sinh viên' },
  { to: '/students', label: 'Sinh viên' },
]

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const outlet = useOutlet()
  const { user, signOut } = useAuth()
  const { ids } = useFavorites()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !event.repeat) {
        event.preventDefault()
        setSearchOpen((value) => !value)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  const links = nav.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === '/'}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
    >
      {item.label}
    </NavLink>
  ))
  return (
    <>
      <ScrollProgress />
      <VisualEffects />
      <a href="#main-content" className="skip-link">
        Bỏ qua điều hướng
      </a>
      <div className="topbar">
        <div className="page-container flex items-center justify-between gap-3">
          <span>
            <CloudOutlined className="mr-2" />
            Một dự án từ MyMiniCloud <span className="mx-2 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Kết nối chốn ở, mở lối tương lai</span>
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="page-container flex h-20 items-center justify-between gap-5">
          <Link to="/" className="brand" aria-label="MiniHome — Trang chủ">
            <span className="brand-symbol">
              <img src="/minihome.svg" alt="" aria-hidden="true" className="brand-icon" />
            </span>
            <span>
              mini<span className="brand-home font-normal">home</span>
              <small>by MyMiniCloud</small>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Điều hướng chính">
            {links}
          </nav>
          <div className="flex items-center gap-3">
            <button
              className="header-search"
              aria-label="Tìm nhanh"
              aria-keyshortcuts="Control+k Meta+k"
              onClick={() => setSearchOpen(true)}
            >
              <SearchOutlined />
              <kbd className="hidden xl:inline">Ctrl K</kbd>
            </button>
            <Link
              to="/rooms?saved=true"
              className="header-favorites"
              aria-label={`Phòng đã lưu: ${ids.length}`}
            >
              <HeartOutlined />
              {ids.length > 0 && <span className="favorites-count">{ids.length}</span>}
            </Link>
            <div className="mx-1 hidden h-6 w-px bg-line sm:block" />
            {user ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'saved',
                      label: <Link to="/rooms?saved=true">Phòng đã lưu</Link>,
                      icon: <HeartOutlined />,
                    },
                    {
                      key: 'logout',
                      label: 'Đăng xuất',
                      icon: <LogoutOutlined />,
                      onClick: signOut,
                    },
                  ],
                }}
                trigger={['click']}
              >
                <Button type="text" className="!h-auto !px-1">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span className="hidden max-w-25 truncate sm:inline">{user.name}</span>
                </Button>
              </Dropdown>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-medium text-navy sm:block">
                  Đăng nhập
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button type="primary" className="header-join">
                    Bắt đầu ngay <ArrowRightOutlined />
                  </Button>
                </Link>
              </>
            )}
            <Button
              className="lg:!hidden"
              type="text"
              icon={<MenuOutlined />}
              aria-label="Mở menu"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>
      </header>
      <Drawer title="Khám phá MiniHome" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <nav className="flex flex-col gap-5" aria-label="Điều hướng di động">
          {links}
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Đăng nhập
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </Drawer>
      <main id="main-content" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="route-stage"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Suspense
              fallback={
                <div className="flex min-h-100 items-center justify-center">
                  <Spin />
                </div>
              }
            >
              {outlet}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="site-footer">
        <div className="page-container">
          <div className="grid gap-6 pb-6 md:grid-cols-[1.7fr_1fr_1fr]">
            <div>
              <Link to="/" className="brand">
                <span className="brand-symbol">
                  <img src="/minihome.svg" alt="" aria-hidden="true" className="brand-icon" />
                </span>
                <span>
                  mini<span className="brand-home font-normal">home</span>
                  <small>by MyMiniCloud</small>
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                Không chỉ là tìm phòng.
                <br />
                Là tìm một nơi để bắt đầu và lớn lên.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-semibold">Khám phá</h2>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <Link to="/rooms">Tìm phòng phù hợp</Link>
                <Link to="/rooms?saved=true">Phòng bạn đã lưu</Link>
                <Link to="/blog">Góc nhỏ sinh viên</Link>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-semibold">Cùng MiniHome</h2>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <Link to="/students">Cộng đồng sinh viên</Link>
                <Link to="/register">Bắt đầu hành trình</Link>
                <p>TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3 text-xs text-muted">
            <p>© 2026 MiniHome · Một dự án MyMiniCloud.</p>
            <p>Được xây dựng cùng những khởi đầu mới.</p>
          </div>
        </div>
      </footer>
      {searchOpen && <QuickSearch open onClose={() => setSearchOpen(false)} />}
    </>
  )
}
