import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { useTaskStore } from "../store/taskStore"
import { supabase } from "../lib/supabase"
import {
    createTask,
    toggleTask,
    deleteTask,
    getTasks,
} from "../services/tasksService"

type LegacyTask = {
    id: string
    title: string
    completed: boolean
}

export function TaskList() {
    const [newTask, setNewTask] = useState("")
    const [loading, setLoading] = useState(true)

    const { tasks, setTasks } = useTaskStore()

    // 🔄 função central de sync
    const refresh = async () => {
        const data = await getTasks()
        setTasks(data || [])
    }

    // 🔄 load inicial
    useEffect(() => {
        async function load() {
            setLoading(true)
            await refresh()
            setLoading(false)
        }

        load()
    }, [])

    // ➕ CREATE
    async function handleAddTask() {
        if (!newTask.trim()) return
        if (!supabase) return

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        await createTask(newTask, user.id)
        setNewTask("")

        await refresh()
    }

    // 🔁 TOGGLE
    async function handleToggle(task: LegacyTask) {
        await toggleTask(task.id, !task.completed)
        await refresh()
    }

    // 🗑 DELETE
    async function handleDelete(id: string) {
        await deleteTask(id)
        await refresh()
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
            {/* HEADER */}
            <h2 className="text-2xl font-bold text-white mb-6">
                Tasks
            </h2>

            {/* INPUT */}
            <div className="flex gap-3 mb-6">
                <input
                    value={newTask}
                    onChange={(e) =>
                        setNewTask(e.target.value)
                    }
                    placeholder="Add a new task..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none"
                />

                <button
                    onClick={handleAddTask}
                    className="bg-white text-black px-5 rounded-xl font-medium hover:opacity-80 transition"
                >
                    Add
                </button>
            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-zinc-400">
                    Loading tasks...
                </p>
            )}

            {/* EMPTY STATE */}
            {!loading && tasks.length === 0 && (
                <div className="text-zinc-500 text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                    No tasks yet 🚀
                </div>
            )}

            {/* LIST */}
            <div className="flex flex-col gap-4">
                {!loading &&
                    tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-xl"
                        >
                            {/* TITLE */}
                            <span
                                className={`${task.completed
                                        ? "line-through text-zinc-500"
                                        : "text-white"
                                    }`}
                            >
                                {task.title}
                            </span>

                            {/* ACTIONS */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleToggle(task)
                                    }
                                    className={`px-3 py-1 rounded-lg text-sm ${task.completed
                                            ? "bg-green-500 text-black"
                                            : "bg-zinc-800 text-white"
                                        }`}
                                >
                                    Toggle
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(task.id)
                                    }
                                    className="px-3 py-1 rounded-lg text-sm bg-red-500 text-black"
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
