import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Button, Result, Spin } from 'antd'
import { AppProviders } from './app/providers/AppProviders'
import { AppLayout } from './app/layout/AppLayout'
import './App.css'
import './shared/styles/motion.css'

const HomePage = lazy(() => import('./features/home/pages/HomePage'))
const RoomsPage = lazy(() => import('./features/rooms/pages/RoomsPage'))
const RoomDetailPage = lazy(() => import('./features/rooms/pages/RoomDetailPage'))
const BlogPage = lazy(() => import('./features/blog/pages/BlogPage'))
const BlogDetailPage = lazy(() => import('./features/blog/pages/BlogDetailPage'))
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'))
const StudentsPage = lazy(() => import('./features/students/pages/StudentsPage'))

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <Spin size="large" />
            </div>
          }
        >
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="rooms/:id" element={<RoomDetailPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="login" element={<AuthPage />} />
              <Route path="register" element={<AuthPage register />} />
              <Route path="students" element={<StudentsPage />} />
              <Route
                path="*"
                element={
                  <Result
                    status="404"
                    title="Bạn đã đi lạc một chút rồi"
                    subTitle="Trang này chưa có. Cùng trở lại tìm chốn về nhé."
                    extra={
                      <Link to="/">
                        <Button type="primary">Về trang chủ</Button>
                      </Link>
                    }
                  />
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  )
}
