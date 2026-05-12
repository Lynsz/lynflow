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

export function TaskList() {
    const [newTask, setNewTask] = useState("")
    const [loading, setLoading] = useState(true)

    const { tasks, setTasks } = useTaskStore()

    useEffect(() => {
        async function load() {
            const data = await getTasks()
            setTasks(data || [])
            setLoading(false)
        }

        load()
    }, [setTasks])

    useEffect(() => {
        const channel = supabase
            .channel("tasks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "tasks",
                },
                async () => {
                    const data = await getTasks()
                    setTasks(data || [])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [setTasks])

    async function handleAddTask() {
        if (!newTask.trim()) return

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const tempTask = {
            id: crypto.randomUUID(),
            title: newTask,
            completed: false,
        }

        setTasks([tempTask, ...tasks])
        setNewTask("")

        await createTask(newTask, user.id)
    }

    function SkeletonItem() {
        return (
            <div className="h-14 bg-zinc-800/40 rounded-xl animate-pulse" />
        )
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
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
                    className="bg-white text-black px-5 rounded-xl font-medium"
                >
                    Add
                </button>
            </div>

            {/* SKELETON */}
            {loading && (
                <div className="flex flex-col gap-3">
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
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
                            <span
                                className={`${task.completed
                                        ? "line-through text-zinc-500"
                                        : "text-white"
                                    }`}
                            >
                                {task.title}
                            </span>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        toggleTask(
                                            task.id,
                                            !task.completed
                                        )
                                    }
                                    className="px-3 py-1 rounded-lg text-sm bg-zinc-800 text-white"
                                >
                                    Toggle
                                </button>

                                <button
                                    onClick={() =>
                                        deleteTask(task.id)
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