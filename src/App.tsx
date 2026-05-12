import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/auth/Login"
import { Dashboard } from "./pages/Dashboard"
import { ProtectedRoute } from "./routes/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 login público */}
        <Route path="/login" element={<Login />} />

        {/* 🧱 rota protegida */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}