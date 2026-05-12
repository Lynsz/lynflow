import { motion } from "framer-motion"
import {
    BarChart3,
    CheckCircle2,
    Clock3,
    Sparkles,
    Target,
} from "lucide-react"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"
import { useTasks } from "../hooks/useTasks"

const weeklyData = [
    { day: "Seg", productivity: 35 },
    { day: "Ter", productivity: 48 },
    { day: "Qua", productivity: 62 },
    { day: "Qui", productivity: 58 },
    { day: "Sex", productivity: 76 },
    { day: "Sáb", productivity: 68 },
    { day: "Dom", productivity: 84 },
]

export function Dashboard() {
    const {
        tasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        productivity,
    } = useTasks()

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <motion.header
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
                <div>
                    <p className="ly-muted-soft text-sm">Welcome back</p>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Dashboard
                    </h1>
                    <p className="ly-muted mt-2">
                        Visão geral da sua rotina, tarefas e progresso.
                    </p>
                </div>

                <button className="ly-button-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium active:scale-[0.98]">
                    <Sparkles size={18} />
                    Gerar rotina IA
                </button>
            </motion.header>

            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ly-card rounded-3xl p-5 shadow-2xl shadow-black/10"
                >
                    <div className="flex items-center justify-between">
                        <p className="ly-muted text-sm">Produtividade</p>
                        <BarChart3 size={20} className="ly-accent" />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">{productivity}%</h2>
                    <p className="ly-muted-soft mt-2 text-xs">
                        Baseado nas tarefas concluídas.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="ly-card rounded-3xl p-5 shadow-2xl shadow-black/10"
                >
                    <div className="flex items-center justify-between">
                        <p className="ly-muted text-sm">Concluídas</p>
                        <CheckCircle2 size={20} className="ly-accent" />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">{completedTasks}</h2>
                    <p className="ly-muted-soft mt-2 text-xs">Tarefas finalizadas.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="ly-card rounded-3xl p-5 shadow-2xl shadow-black/10"
                >
                    <div className="flex items-center justify-between">
                        <p className="ly-muted text-sm">Pendentes</p>
                        <Clock3 size={20} className="ly-warning" />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">{pendingTasks}</h2>
                    <p className="ly-muted-soft mt-2 text-xs">Tarefas em aberto.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="ly-card rounded-3xl p-5 shadow-2xl shadow-black/10"
                >
                    <div className="flex items-center justify-between">
                        <p className="ly-muted text-sm">Alta prioridade</p>
                        <Target size={20} className="ly-danger" />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">{highPriorityTasks}</h2>
                    <p className="ly-muted-soft mt-2 text-xs">Itens críticos.</p>
                </motion.div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <div className="ly-card rounded-3xl p-5">
                    <h2 className="text-xl font-semibold">Produtividade semanal</h2>
                    <p className="ly-muted-soft mb-6 mt-1 text-sm">
                        Visualização simples para acompanhar evolução.
                    </p>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="day" stroke="var(--muted-soft)" />
                                <Tooltip
                                    contentStyle={{
                                        background: "var(--surface-strong)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "12px",
                                        color: "var(--text)",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="productivity"
                                    stroke="var(--accent)"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="ly-accent" />
                            <h2 className="text-xl font-semibold">IA Insights</h2>
                        </div>

                        <p className="text-sm leading-6 text-[var(--text)] opacity-80">
                            Seu foco agora deve ser finalizar as tarefas de alta prioridade e
                            manter o projeto visualmente consistente para o deploy.
                        </p>
                    </div>

                    <div className="ly-card rounded-3xl p-5">
                        <h2 className="text-xl font-semibold">Resumo</h2>
                        <div className="ly-muted mt-4 space-y-3 text-sm">
                            <p>Total de tarefas: {tasks.length}</p>
                            <p>Concluídas: {completedTasks}</p>
                            <p>Pendentes: {pendingTasks}</p>
                            <p>Produtividade atual: {productivity}%</p>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    )
}