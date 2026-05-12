import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import type { Priority, Task } from "../types/task"

function getPriorityLabel(priority: Priority) {
    if (priority === "high") return "Alta"
    if (priority === "medium") return "Média"
    return "Baixa"
}

function getPriorityClass(priority: Priority) {
    if (priority === "high") return "border-red-500/20 bg-red-500/10 text-red-400"
    if (priority === "medium") return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
}

export function Tasks() {
    const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks()

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("Geral")
    const [priority, setPriority] = useState<Priority>("medium")
    const [filter, setFilter] = useState<"all" | "todo" | "done">("all")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingTitle, setEditingTitle] = useState("")

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (filter === "done") return task.done
            if (filter === "todo") return !task.done
            return true
        })
    }, [tasks, filter])

    function handleAddTask(event: React.FormEvent) {
        event.preventDefault()

        addTask({
            title,
            category,
            priority,
        })

        setTitle("")
        setCategory("Geral")
        setPriority("medium")
    }

    function startEdit(task: Task) {
        setEditingId(task.id)
        setEditingTitle(task.title)
    }

    function saveEdit(id: string) {
        if (!editingTitle.trim()) return

        updateTask(id, {
            title: editingTitle,
        })

        setEditingId(null)
        setEditingTitle("")
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1f2937_0,#09090b_40%,#000_100%)] px-4 py-6 md:px-8">
            <header className="mb-8">
                <p className="text-sm text-zinc-500">Task system</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Tasks
                </h1>
                <p className="mt-2 text-zinc-400">
                    Crie, organize, edite e conclua tarefas com prioridade e categoria.
                </p>
            </header>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Lista de tarefas</h2>
                        <p className="text-sm text-zinc-500">
                            Clique duas vezes no título para editar.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {[
                            { key: "all", label: "Todas" },
                            { key: "todo", label: "Pendentes" },
                            { key: "done", label: "Concluídas" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setFilter(item.key as "all" | "todo" | "done")}
                                className={`rounded-full border px-4 py-2 text-sm transition ${filter === item.key
                                    ? "border-white bg-white text-black"
                                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form
                    onSubmit={handleAddTask}
                    className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px_140px_auto]"
                >
                    <label htmlFor="task-title" className="sr-only">
                        Nova tarefa
                    </label>
                    <input
                        id="task-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Criar nova tarefa..."
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <label htmlFor="task-category" className="sr-only">
                        Categoria
                    </label>
                    <input
                        id="task-category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        placeholder="Categoria"
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <label htmlFor="task-priority" className="sr-only">
                        Prioridade
                    </label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value as Priority)}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
                    >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black transition hover:bg-emerald-400 active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        Add
                    </button>
                </form>

                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -2 }}
                                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                            >
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => toggleTask(task.id)}
                                        aria-label="Concluir tarefa"
                                        className="mt-1 h-4 w-4 accent-emerald-500"
                                    />

                                    <div className="min-w-0 flex-1">
                                        {editingId === task.id ? (
                                            <input
                                                value={editingTitle}
                                                onChange={(event) => setEditingTitle(event.target.value)}
                                                onBlur={() => saveEdit(task.id)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") saveEdit(task.id)

                                                    if (event.key === "Escape") {
                                                        setEditingId(null)
                                                        setEditingTitle("")
                                                    }
                                                }}
                                                autoFocus
                                                aria-label="Editar título da tarefa"
                                                title="Editar título da tarefa"
                                                placeholder="Editar título da tarefa"
                                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:border-emerald-500"
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onDoubleClick={() => startEdit(task)}
                                                className={`block text-left ${task.done ? "text-zinc-500 line-through" : "text-white"
                                                    }`}
                                            >
                                                {task.title}
                                            </button>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                                                {task.category}
                                            </span>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs ${getPriorityClass(
                                                    task.priority
                                                )}`}
                                            >
                                                {getPriorityLabel(task.priority)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        aria-label="Deletar tarefa"
                                        className="rounded-xl p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredTasks.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center text-zinc-500">
                            Nenhuma tarefa encontrada.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}