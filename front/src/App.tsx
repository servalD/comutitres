import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from './auth/auth-context'
import { AppShell } from './components/layout/AppShell'
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage'
import { LoginPage } from './pages/auth/LoginPage'
import { AddIdentityPage } from './pages/mobility/AddIdentityPage'
import { IdentityDetailPage } from './pages/mobility/IdentityDetailPage'
import { MobilityHubPage } from './pages/mobility/MobilityHubPage'
import { SubscribePage } from './pages/mobility/SubscribePage'
import { ProtectedRoute } from './routes/ProtectedRoute'

function IdentityDetailRoute() {
  const { id } = useParams()
  return <IdentityDetailPage key={id} />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/mobility" replace />} />
              <Route path="/mobility" element={<MobilityHubPage />} />
              <Route path="/mobility/new" element={<AddIdentityPage />} />
              <Route path="/mobility/:id/subscribe" element={<SubscribePage />} />
              <Route path="/mobility/:id" element={<IdentityDetailRoute />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/mobility" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
