import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { ThemeProvider } from "./components/ThemeProvider"
import { Skeleton } from "./components/ui/Skeleton"
import { ToastProvider } from "./components/ui/ToastProvider"
import { AppLayout } from "./layouts/AppLayout"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { AuthProvider } from "./store/AuthProvider"
import { TasksProvider } from "./store/TasksProvider"

const Landing = lazy(() =>
  import("./pages/Landing").then((module) => ({ default: module.Landing }))
)
const Login = lazy(() =>
  import("./pages/auth/Login").then((module) => ({ default: module.Login }))
)
const Register = lazy(() =>
  import("./pages/auth/Register").then((module) => ({
    default: module.Register,
  }))
)
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard }))
)
const Tasks = lazy(() =>
  import("./pages/Tasks").then((module) => ({ default: module.Tasks }))
)
const Goals = lazy(() =>
  import("./pages/Goals").then((module) => ({ default: module.Goals }))
)
const Insights = lazy(() =>
  import("./pages/Insights").then((module) => ({ default: module.Insights }))
)
const ActivityPage = lazy(() =>
  import("./pages/Activity").then((module) => ({
    default: module.ActivityPage,
  }))
)
const Profile = lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.Profile }))
)
const Settings = lazy(() =>
  import("./pages/Settings").then((module) => ({ default: module.Settings }))
)
const NotFound = lazy(() =>
  import("./pages/NotFound").then((module) => ({ default: module.NotFound }))
)

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

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6 text-[var(--text)]">
      <div className="mx-auto max-w-6xl space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <TasksProvider>
              <BrowserRouter>
                <Suspense fallback={<RouteFallback />}>
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
                </Suspense>
              </BrowserRouter>
            </TasksProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
