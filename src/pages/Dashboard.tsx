import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BarChart3,
    CheckCircle2,
    Clock3,
    Plus,
    Sparkles,
    Target,
    Trash2,
    Edit3,
} from "lucide-react"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"

type Priority = "low" | "medium" | "high"

type Task = {
    id: string
    title: string
    category: string
    priority: Priority
    done: boolean
}

const weeklyData = [
    { day: "Seg", productivity: 35 },
    { day: "Ter", productivity: 48 },
    { day: "Qua", productivity: 62 },
    { day: "Qui", productivity: 58 },
    { day: "Sex", productivity: 76 },
    { day: "Sáb", productivity: 68 },
    { day: "Dom", productivity: 84 },
]

const initialTasks: Task[] = [
    {
        id: crypto.randomUUID(),
        title: "Finalizar layout do dashboard",
        category: "Projeto",
        priority: "high",
        done: false,
    },
    {
        id: crypto.randomUUID(),
        title: "Estudar React Router por 30 minutos",
        category: "Estudos",
        priority: "medium",
        done: true,
    },
    {
        id: crypto.randomUUID(),
        title: "Organizar README do GitHub",
        category: "Portfólio",
        priority: "medium",
        done: false,
    },
]

function getPriorityLabel(priority: Priority) {
    if (priority === "high") return "Alta"
    if (priority === "medium") return "Média"
    return "Baixa"
}

function getPriorityClass(priority: Priority) {
    if (priority === "high") return "bg-red-500/10 text-red-400 border-red-500/20"
    if (priority === "medium") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
}

export function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("Geral")
    const [priority, setPriority] = useState<Priority>("medium")
    const [filter, setFilter] = useState<"all" | "todo" | "done">("all")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingTitle, setEditingTitle] = useState("")

    useEffect(() => {
        const savedTasks = localStorage.getItem("lynflow-tasks")

        if (savedTasks) {
            setTasks(JSON.parse(savedTasks))
        } else {
            setTasks(initialTasks)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("lynflow-tasks", JSON.stringify(tasks))
    }, [tasks])

    const completedTasks = tasks.filter((task) => task.done).length
    const pendingTasks = tasks.filter((task) => !task.done).length

    const productivity =
        tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (filter === "done") return task.done
            if (filter === "todo") return !task.done
            return true
        })
    }, [tasks, filter])

    function handleAddTask(event: React.FormEvent) {
        event.preventDefault()

        if (!title.trim()) return

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            category,
            priority,
            done: false,
        }

        setTasks((current) => [newTask, ...current])
        setTitle("")
        setCategory("Geral")
        setPriority("medium")
    }

    function toggleTask(id: string) {
        setTasks((current) =>
            current.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        )
    }

    function deleteTask(id: string) {
        setTasks((current) => current.filter((task) => task.id !== id))
    }

    function startEdit(task: Task) {
        setEditingId(task.id)
        setEditingTitle(task.title)
    }

    function saveEdit(id: string) {
        if (!editingTitle.trim()) return

        setTasks((current) =>
            current.map((task) =>
                task.id === id ? { ...task, title: editingTitle } : task
            )
        )

        setEditingId(null)
        setEditingTitle("")
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1f2937_0,#09090b_40%,#000_100%)] px-4 py-6 md:px-8">
            <motion.header
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8"
            >
                <div>
                    <p className="text-sm text-zinc-500">Welcome back</p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        Organize tarefas, acompanhe produtividade e receba insights.
                    </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200 active:scale-[0.98] transition">
                    <Sparkles size={18} />
                    Gerar rotina IA
                </button>
            </motion.header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/20"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-400 text-sm">Produtividade</p>
                        <BarChart3 size={20} className="text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold mt-4">{productivity}%</h2>
                    <p className="text-xs text-zinc-500 mt-2">
                        Baseado nas tarefas concluídas.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/20"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-400 text-sm">Concluídas</p>
                        <CheckCircle2 size={20} className="text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold mt-4">{completedTasks}</h2>
                    <p className="text-xs text-zinc-500 mt-2">
                        Tarefas finalizadas no fluxo atual.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/20"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-400 text-sm">Pendentes</p>
                        <Clock3 size={20} className="text-yellow-400" />
                    </div>
                    <h2 className="text-3xl font-bold mt-4">{pendingTasks}</h2>
                    <p className="text-xs text-zinc-500 mt-2">
                        Próximas ações para manter consistência.
                    </p>
                </motion.div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Produtividade semanal
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    Visualização simples para acompanhar evolução.
                                </p>
                            </div>
                        </div>

                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                    <XAxis dataKey="day" stroke="#71717a" />
                                    <Tooltip
                                        contentStyle={{
                                            background: "#09090b",
                                            border: "1px solid #27272a",
                                            borderRadius: "12px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="productivity"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-semibold">Tarefas</h2>
                                <p className="text-sm text-zinc-500">
                                    Clique duas vezes para editar.
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
                            className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px_auto] gap-3 mb-5"
                        >
                            <label htmlFor="task-title" className="sr-only">
                                Nova tarefa
                            </label>
                            <input
                                id="task-title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Criar nova tarefa..."
                                aria-label="Criar nova tarefa"
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
                                aria-label="Categoria da tarefa"
                                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
                            />

                            <label htmlFor="task-priority" className="sr-only">
                                Prioridade
                            </label>
                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(event) =>
                                    setPriority(event.target.value as Priority)
                                }
                                aria-label="Prioridade da tarefa"
                                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                            </select>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black hover:bg-emerald-400 active:scale-[0.98] transition"
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

                                            <div className="flex-1 min-w-0">
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
                                                        aria-label="Editar tarefa"
                                                        placeholder="Editar tarefa"
                                                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:border-emerald-500"
                                                    />
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onDoubleClick={() => startEdit(task)}
                                                        className={`block text-left ${task.done
                                                                ? "text-zinc-500 line-through"
                                                                : "text-white"
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
                                                className="rounded-xl p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition"
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
                    </motion.div>
                </div>

                <aside className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Target size={20} className="text-emerald-400" />
                            <h2 className="text-xl font-semibold">Metas</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-zinc-400">Projeto Lynflow</span>
                                    <span>{productivity}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${productivity}%` }}
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-zinc-500">
                                Meta da semana: manter consistência e finalizar uma versão
                                publicável.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                        className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={20} className="text-emerald-400" />
                            <h2 className="text-xl font-semibold">IA Insights</h2>
                        </div>

                        <p className="text-sm text-zinc-300 leading-6">
                            Seu foco agora deve ser concluir as tarefas de alta prioridade e
                            manter o projeto visualmente consistente. Depois disso, faça o
                            deploy e escreva um README profissional.
                        </p>

                        <button className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition">
                            Gerar sugestão
                        </button>
                    </motion.div>
                </aside>
            </section>
        </div>
    )
}