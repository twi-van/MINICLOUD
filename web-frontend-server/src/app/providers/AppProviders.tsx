import { App, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { AuthProvider } from '../../features/auth/components/AuthProvider'
import { FavoritesProvider } from '../../features/rooms/components/FavoritesProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        cssVar: {},
        token: {
          colorPrimary: '#203b4b',
          colorPrimaryHover: '#305467',
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f7f5f0',
          colorInfo: '#355e78',
          colorText: '#203b4b',
          colorTextSecondary: '#737e84',
          colorBorder: '#d2dade',
          colorLink: '#203b4b',
          colorLinkHover: '#b66b43',
          borderRadius: 8,
          controlHeight: 40,
          fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
          fontSize: 14,
        },
        components: {
          Button: { primaryShadow: 'none', fontWeight: 500 },
          Input: {
            hoverBorderColor: '#305467',
            activeBorderColor: '#203b4b',
            activeShadow: '0 0 0 3px #203b4b14',
          },
          Select: {
            optionSelectedBg: '#eef2f4',
            hoverBorderColor: '#305467',
            activeBorderColor: '#203b4b',
            activeOutlineColor: '#203b4b14',
          },
          Slider: {
            trackBg: '#203b4b',
            trackHoverBg: '#305467',
            handleColor: '#203b4b',
            handleActiveColor: '#203b4b',
            railBg: '#edf0f1',
            railHoverBg: '#e3e8ea',
          },
          Table: { headerBg: '#f6f7f5' },
        },
      }}
    >
      <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <App>
          <AuthProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </AuthProvider>
        </App>
      </MotionConfig>
    </ConfigProvider>
  )
}
