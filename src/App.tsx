import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { RouteGuard } from '@/components/common/RouteGuard'
import { Header } from '@/components/layouts/Header'
import { Footer } from '@/components/layouts/Footer'
import { Toaster } from '@/components/ui/toaster'
import routes from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />

        <Routes>
          {routes.map((route, i) =>
            route.protected ? (
              <Route
                key={i}
                path={route.path}
                element={
                  <RouteGuard>
                    {route.element}
                  </RouteGuard>
                }
              />
            ) : (
              <Route
                key={i}
                path={route.path}
                element={route.element}
              />
            )
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}
