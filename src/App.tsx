import type { ReactNode } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { Dashboard } from "./pages/Dashboard"
import { Tasks } from "./pages/Tasks"
import { Goals } from "./pages/Goals"
import { Insights } from "./pages/Insights"
import { Settings } from "./pages/Settings"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { AppLayout } from "./layouts/AppLayout"

type ProtectedScreenProps = {
  children: ReactNode
}

function ProtectedScreen({ children }: ProtectedScreenProps) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedScreen>
              <Dashboard />
            </ProtectedScreen>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedScreen>
              <Tasks />
            </ProtectedScreen>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedScreen>
              <Goals />
            </ProtectedScreen>
          }
        />

        <Route
          path="/insights"
          element={
            <ProtectedScreen>
              <Insights />
            </ProtectedScreen>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedScreen>
              <Settings />
            </ProtectedScreen>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}