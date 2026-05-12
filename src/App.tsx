import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Sidebar } from "./components/Sidebar"
import { AuthGuard } from "./components/AuthGuard"

import { Dashboard } from "./pages/Dashboard"
import { Tasks } from "./pages/Tasks"
import { Analytics } from "./pages/Analytics"
import { Settings } from "./pages/Settings"

export default function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <div className="flex min-h-screen bg-white dark:bg-black transition-colors">
          <Sidebar />

          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </AuthGuard>
    </BrowserRouter>
  )
}