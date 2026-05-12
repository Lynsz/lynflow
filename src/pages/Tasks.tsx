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
    if (priority === "high") {
        return "border-red-500/20 bg-red-500/10 text-red-500"
    }

    if (priority === "medium") {
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
    }

    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
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
        <div className="ly-page px-4 py-6 md:px-8">
            <header className="mb-8">
                <p className="ly-muted-soft text-sm">Task system</p>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Tasks
                </h1>

                <p className="ly-muted mt-2">
                    Crie, organize, edite e conclua tarefas com prioridade e categoria.
                </p>
            </header>

            <section className="ly-card rounded-3xl p-5">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Lista de tarefas</h2>

                        <p className="ly-muted-soft text-sm">
                            Clique duas vezes no título para editar.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: "all", label: "Todas" },
                            { key: "todo", label: "Pendentes" },
                            { key: "done", label: "Concluídas" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => setFilter(item.key as "all" | "todo" | "done")}
                                className={`rounded-full border px-4 py-2 text-sm transition ${filter === item.key
                                        ? "ly-button-primary"
                                        : "ly-button-secondary"
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
                        title="Criar nova tarefa"
                        aria-label="Criar nova tarefa"
                        className="ly-input rounded-2xl px-4 py-3"
                    />

                    <label htmlFor="task-category" className="sr-only">
                        Categoria
                    </label>
                    <input
                        id="task-category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        placeholder="Categoria"
                        title="Categoria da tarefa"
                        aria-label="Categoria da tarefa"
                        className="ly-input rounded-2xl px-4 py-3"
                    />

                    <label htmlFor="task-priority" className="sr-only">
                        Prioridade
                    </label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value as Priority)}
                        title="Prioridade da tarefa"
                        aria-label="Prioridade da tarefa"
                        className="ly-input rounded-2xl px-4 py-3"
                    >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>

                    <button
                        type="submit"
                        className="ly-button-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium active:scale-[0.98]"
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
                                className="ly-card-strong rounded-2xl p-4"
                            >
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => toggleTask(task.id)}
                                        aria-label="Concluir tarefa"
                                        title="Concluir tarefa"
                                        className="mt-1 h-4 w-4 accent-emerald-500"
                                    />

                                    <div className="min-w-0 flex-1">
                                        {editingId === task.id ? (
                                            <input
                                                value={editingTitle}
                                                onChange={(event) =>
                                                    setEditingTitle(event.target.value)
                                                }
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
                                                className="ly-input rounded-xl px-3 py-2"
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onDoubleClick={() => startEdit(task)}
                                                className={`block text-left ${task.done
                                                        ? "ly-muted-soft line-through"
                                                        : "text-[var(--text)]"
                                                    }`}
                                            >
                                                {task.title}
                                            </button>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
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
                                        type="button"
                                        onClick={() => deleteTask(task.id)}
                                        aria-label="Deletar tarefa"
                                        title="Deletar tarefa"
                                        className="rounded-xl p-2 text-[var(--muted-soft)] transition hover:bg-red-500/10 hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredTasks.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted-soft)]">
                            Nenhuma tarefa encontrada.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}