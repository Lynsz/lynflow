import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/auth/Login"
import { Dashboard } from "./pages/Dashboard"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { AppLayout } from "./layouts/AppLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

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
      </Routes>
    </BrowserRouter>
  )
}