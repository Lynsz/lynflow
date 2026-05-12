import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

type Task = {
    id: string
    title: string
    user_id: string
    done: boolean
}

export function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const navigate = useNavigate()

    // 📥 buscar tarefas
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

    // ➕ criar tarefa
    async function handleAddTask(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const { data: userData } = await supabase.auth.getUser()

        if (!userData?.user) {
            setLoading(false)
            return
        }

        await supabase.from("tasks").insert({
            title,
            user_id: userData.user.id,
            done: false,
        })

        setTitle("")
        await getTasks()
        setLoading(false)
    }

    // 🗑 deletar tarefa
    async function handleDelete(id: string) {
        await supabase.from("tasks").delete().eq("id", id)
        await getTasks()
    }

    // ✔ toggle done
    async function toggleDone(task: Task) {
        await supabase
            .from("tasks")
            .update({ done: !task.done })
            .eq("id", task.id)

        await getTasks()
    }

    // ✏ editar tarefa
    async function handleEdit(id: string, newTitle: string) {
        await supabase
            .from("tasks")
            .update({ title: newTitle })
            .eq("id", id)

        setEditingId(null)
        await getTasks()
    }

    // 🚪 logout
    async function handleLogout() {
        await supabase.auth.signOut()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            {/* HEADER */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <button
                    onClick={handleLogout}
                    className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-80 transition"
                >
                    Logout
                </button>
            </header>

            {/* FORM */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nova tarefa"
                    aria-label="Nova tarefa"
                    className="flex-1 p-2 rounded bg-zinc-900 border border-zinc-700 outline-none"
                />

                <button
                    disabled={loading}
                    className="bg-green-500 px-4 rounded disabled:opacity-50"
                >
                    {loading ? "Adicionando..." : "Add"}
                </button>
            </form>

            {/* LISTA */}
            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <p className="text-zinc-500 text-center">
                        Nenhuma tarefa ainda
                    </p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition"
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-3 flex-1">
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => toggleDone(task)}
                                    aria-label="Marcar como concluída"
                                />

                                {editingId === task.id ? (
                                    <input
                                        defaultValue={task.title}
                                        onBlur={(e) =>
                                            handleEdit(task.id, e.target.value)
                                        }
                                        placeholder="Editar tarefa"
                                        aria-label="Editar tarefa"
                                        className="bg-zinc-800 p-2 rounded w-full outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                        onDoubleClick={() => setEditingId(task.id)}
                                        className={`cursor-pointer ${task.done
                                                ? "line-through text-zinc-500"
                                                : "text-white"
                                            }`}
                                    >
                                        {task.title}
                                    </span>
                                )}
                            </div>

                            {/* DELETE */}
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="text-red-400 hover:text-red-300 transition"
                                aria-label="Deletar tarefa"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}