import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/auth/Login"
import { Dashboard } from "./pages/Dashboard"
import { Home } from "./pages/Home"
import { Tasks } from "./pages/Tasks"
import { Settings } from "./pages/Settings"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { AppLayout } from "./layouts/AppLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* login */}
        <Route path="/login" element={<Login />} />

        {/* app protegido */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Tasks />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}