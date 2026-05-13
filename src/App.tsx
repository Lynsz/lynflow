import type { ReactNode } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { ToastProvider } from "./components/ui/ToastProvider"
import { TasksProvider } from "./store/TasksProvider"
import { Landing } from "./pages/Landing"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { Dashboard } from "./pages/Dashboard"
import { Tasks } from "./pages/Tasks"
import { Goals } from "./pages/Goals"
import { Insights } from "./pages/Insights"
import { Settings } from "./pages/Settings"
import { Profile } from "./pages/Profile"
import { ActivityPage } from "./pages/Activity"
import { NotFound } from "./pages/NotFound"
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
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <TasksProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
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
                  path="/activity"
                  element={
                    <ProtectedScreen>
                      <ActivityPage />
                    </ProtectedScreen>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedScreen>
                      <Profile />
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

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TasksProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}