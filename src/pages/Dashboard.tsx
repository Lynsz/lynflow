import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

type Task = {
    id: string
    title: string
    user_id: string
}

export function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    // 🔁 buscar tasks
    async function getTasks() {
        const { data } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", { ascending: false })

        setTasks(data || [])
    }

    useEffect(() => {
        getTasks()
    }, [])

    // ➕ criar task
    async function handleAddTask(e: React.FormEvent) {
        e.preventDefault()
        if (!title) return

        setLoading(true)

        const { data: userData } = await supabase.auth.getUser()

        await supabase.from("tasks").insert({
            title,
            user_id: userData.user?.id,
        })

        setTitle("")
        setLoading(false)
        getTasks()
    }

    // 🗑 deletar task
    async function handleDelete(id: string) {
        await supabase.from("tasks").delete().eq("id", id)
        getTasks()
    }

    // 🚪 logout
    async function handleLogout() {
        await supabase.auth.signOut()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <button
                    onClick={handleLogout}
                    className="bg-white text-black px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </div>

            {/* form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nova task"
                    className="flex-1 p-2 rounded bg-zinc-900 border border-zinc-700"
                />

                <button
                    disabled={loading}
                    className="bg-white text-black px-4 rounded"
                >
                    Add
                </button>
            </form>

            {/* lista */}
            <div className="space-y-2">
                {tasks.length === 0 && (
                    <p className="text-zinc-400">Nenhuma task</p>
                )}

                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex justify-between items-center bg-zinc-900 p-3 rounded border border-zinc-800"
                    >
                        <span>{task.title}</span>

                        <button
                            onClick={() => handleDelete(task.id)}
                            className="text-red-400"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}