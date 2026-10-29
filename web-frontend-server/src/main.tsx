import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeKeycloak } from './features/auth/services/keycloak'

const root = createRoot(document.getElementById('root')!)
root.render(
  <div className="flex min-h-screen items-center justify-center" role="status">
    Đang mở MiniHome…
  </div>,
)

void initializeKeycloak()
  .catch(() => {
    // AuthProvider exposes the error; public content can still be displayed.
  })
  .then(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
