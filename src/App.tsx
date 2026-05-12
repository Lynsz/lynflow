import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { Dashboard } from "./pages/Dashboard"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { AppLayout } from "./layouts/AppLayout"

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedPage />} />
        <Route path="/tasks" element={<ProtectedPage />} />
        <Route path="/goals" element={<ProtectedPage />} />
        <Route path="/insights" element={<ProtectedPage />} />
        <Route path="/settings" element={<ProtectedPage />} />
      </Routes>
    </BrowserRouter>
  )
}