import { useEffect } from "react"

import { Header } from "../components/Header"
import { Card } from "../components/Card"
import { TaskList } from "../components/TaskList"
import { ProductivityChart } from "../components/ProductivityChart"

import { useTaskStore } from "../store/taskStore"
import { supabase } from "../lib/supabase"
import { getTasks } from "../services/tasksService"

export function Dashboard() {
    const { tasks, setTasks } = useTaskStore()

    useEffect(() => {
        async function loadTasks() {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) return

            const data = await getTasks()

            setTasks(data || [])
        }

        loadTasks()
    }, [setTasks])

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length

    const pendingTasks = tasks.filter(
        (task) => !task.completed
    ).length

    const productivity =
        tasks.length > 0
            ? Math.round(
                (completedTasks / tasks.length) * 100
            )
            : 0

    return (
        <>
            <Header />

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card
                    title="Tasks Completed"
                    value={completedTasks}
                />

                <Card
                    title="Pending Tasks"
                    value={pendingTasks}
                />

                <Card
                    title="Productivity"
                    value={`${productivity}%`}
                />
            </section>

            <ProductivityChart />

            <TaskList />
        </>
    )
}