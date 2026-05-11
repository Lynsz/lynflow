import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"
import { Card } from "./components/Card"
import { TaskList } from "./components/TaskList"

export default function App() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="Tasks Completed" value="24" />
          <Card title="Focus Hours" value="18h" />
          <Card title="Productivity" value="92%" />
        </section>

        <TaskList />
      </main>
    </div>
  )
}