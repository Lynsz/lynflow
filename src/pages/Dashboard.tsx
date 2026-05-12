import { Header } from "../components/Header"
import { Card } from "../components/Card"
import { TaskList } from "../components/TaskList"
import { ProductivityChart } from "../components/ProductivityChart"

export function Dashboard() {
    return (
        <>
            <Header />

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card title="Tasks Completed" value="24" />
                <Card title="Focus Hours" value="18h" />
                <Card title="Productivity" value="92%" />
            </section>

            <ProductivityChart />

            <TaskList />
        </>
    )
}