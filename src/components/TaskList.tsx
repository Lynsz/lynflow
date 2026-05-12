import { useState } from "react"
import { motion } from "framer-motion"

import { useTaskStore } from "../store/taskStore"
import {
    createTask,
    toggleTask,
    deleteTask,
    getTasks,
} from "../services/tasksService"
import { supabase } from "../lib/supabase"

export function TaskList() {
    const [newTask, setNewTask] = useState("")

    const { tasks, setTasks } = useTaskStore()

    async function reloadTasks() {
        const data = await getTasks()
        setTasks(data || [])
    }

    async function handleAddTask() {
        if (!newTask.trim()) return

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        await createTask(newTask, user.id)

        setNewTask("")
        await reloadTasks()
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">
                Tasks
            </h2>

            {/* INPUT */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) =>
                        setNewTask(e.target.value)
                    }
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none"
                />

                <button
                    onClick={handleAddTask}
                    className="bg-white text-black px-5 rounded-xl font-medium hover:opacity-80 transition"
                >
                    Add
                </button>
            </div>

            {/* TASKS */}
            <div className="flex flex-col gap-4">
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
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

                        <div className="flex gap-2">
                            {/* TOGGLE */}
                            <button
                                onClick={async () => {
                                    await toggleTask(
                                        task.id,
                                        !task.completed
                                    )
                                    await reloadTasks()
                                }}
                                className={`px-3 py-1 rounded-lg text-sm font-medium ${task.completed
                                        ? "bg-green-500 text-black"
                                        : "bg-zinc-800 text-white"
                                    }`}
                            >
                                {task.completed
                                    ? "Done"
                                    : "Pending"}
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={async () => {
                                    await deleteTask(task.id)
                                    await reloadTasks()
                                }}
                                className="bg-red-500 px-3 py-1 rounded-lg text-black text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}