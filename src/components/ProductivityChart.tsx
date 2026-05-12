import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

import { useTaskStore } from "../store/taskStore"

export function ProductivityChart() {
    const { tasks } = useTaskStore()

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

    const data = [
        {
            name: "Completed",
            value: completedTasks,
        },
        {
            name: "Pending",
            value: pendingTasks,
        },
        {
            name: "Productivity",
            value: productivity,
        },
    ]

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">
                Productivity Analytics
            </h2>

            <div className="h-80">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#a1a1aa"
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#ffffff"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}