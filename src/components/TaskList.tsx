import { useState } from "react"

type Task = {
    id: number
    title: string
    completed: boolean
}

export function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Finish dashboard UI",
            completed: true,
        },
        {
            id: 2,
            title: "Build task system",
            completed: false,
        },
    ])

    const [newTask, setNewTask] = useState("")

    function handleAddTask() {
        if (!newTask.trim()) return

        const task: Task = {
            id: Date.now(),
            title: newTask,
            completed: false,
        }

        setTasks([...tasks, task])
        setNewTask("")
    }

    function toggleTask(id: number) {
        const updatedTasks = tasks.map((task) =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        )

        setTasks(updatedTasks)
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">
                Tasks
            </h2>

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none"
                />

                <button
                    onClick={handleAddTask}
                    className="bg-white text-black px-5 rounded-xl font-medium hover:opacity-80 transition"
                >
                    Add
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-xl"
                    >
                        <span
                            className={`${task.completed
                                ? "line-through text-zinc-500"
                                : "text-white"
                                }`}
                        >
                            {task.title}
                        </span>

                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${task.completed
                                ? "bg-green-500 text-black"
                                : "bg-zinc-800 text-white"
                                }`}
                        >
                            {task.completed ? "Done" : "Pending"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}