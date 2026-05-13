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
import { Button } from "../components/ui/Button"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton"

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
        isReady,
        tasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        productivity,
    } = useTasks()

    if (!isReady) {
        return <DashboardSkeleton />
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="Welcome back"
                title="Dashboard"
                description="Visão geral da sua rotina, tarefas e progresso."
                action={
                    <Button size="lg" icon={<Sparkles size={18} />}>
                        Gerar rotina IA
                    </Button>
                }
            />

            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <MetricCard
                    title="Produtividade"
                    value={`${productivity}%`}
                    description="Baseado nas tarefas concluídas."
                    icon={<BarChart3 size={20} className="ly-accent" />}
                />

                <MetricCard
                    title="Concluídas"
                    value={completedTasks}
                    description="Tarefas finalizadas."
                    icon={<CheckCircle2 size={20} className="ly-accent" />}
                    delay={0.05}
                />

                <MetricCard
                    title="Pendentes"
                    value={pendingTasks}
                    description="Tarefas em aberto."
                    icon={<Clock3 size={20} className="ly-warning" />}
                    delay={0.1}
                />

                <MetricCard
                    title="Alta prioridade"
                    value={highPriorityTasks}
                    description="Itens críticos."
                    icon={<Target size={20} className="ly-danger" />}
                    delay={0.15}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <SectionCard
                    title="Produtividade semanal"
                    description="Visualização simples para acompanhar evolução."
                >
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
                </SectionCard>

                <aside className="space-y-6">
                    <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="ly-accent" />
                            <h2 className="text-xl font-semibold">IA Insights</h2>
                        </div>

                        <p className="text-sm leading-6 text-[var(--text)] opacity-80">
                            Seu foco agora deve ser finalizar as tarefas de alta prioridade e
                            manter o projeto visualmente consistente para o deploy.
                        </p>
                    </section>

                    <SectionCard title="Resumo">
                        <div className="ly-muted space-y-3 text-sm">
                            <p>Total de tarefas: {tasks.length}</p>
                            <p>Concluídas: {completedTasks}</p>
                            <p>Pendentes: {pendingTasks}</p>
                            <p>Produtividade atual: {productivity}%</p>
                        </div>
                    </SectionCard>
                </aside>
            </section>
        </div>
    )
}