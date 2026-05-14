import {
    Activity,
    BarChart3,
    CheckCircle2,
    Clock3,
    FolderKanban,
    PieChart as PieChartIcon,
    Sparkles,
    Target,
} from "lucide-react"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { useTasks } from "../hooks/useTasks"
import {
    getCategoryDistribution,
    getMostUsedCategory,
    getPriorityDistribution,
    getProductivityStatus,
    getWeeklyProductivity,
} from "../utils/taskAnalytics"
import { DashboardFocusPanel } from "../components/dashboard/DashboardFocusPanel"
import { DashboardPeriodPanel } from "../components/dashboard/DashboardPeriodPanel"
import { ActivityFeed } from "../components/tasks/ActivityFeed"
import { Button } from "../components/ui/Button"
import { EmptyState } from "../components/ui/EmptyState"
import { InfoRow } from "../components/ui/InfoRow"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton"

export function Dashboard() {
    const {
        isReady,
        tasks,
        activities,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        productivity,
    } = useTasks()

    const weeklyData = getWeeklyProductivity(tasks)
    const priorityData = getPriorityDistribution(tasks)
    const categoryData = getCategoryDistribution(tasks)

    const mostUsedCategory = getMostUsedCategory(tasks)
    const productivityStatus = getProductivityStatus(productivity)

    if (!isReady) {
        return <DashboardSkeleton />
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="Welcome back"
                title="Dashboard"
                description="Visão geral da sua rotina, tarefas, progresso e analytics."
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
                    description={productivityStatus}
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

            <DashboardFocusPanel
                productivity={productivity}
                pendingTasks={pendingTasks}
                highPriorityTasks={highPriorityTasks}
                totalTasks={tasks.length}
            />

            <DashboardPeriodPanel tasks={tasks} />

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <SectionCard
                    title="Produtividade semanal"
                    description="Cálculo baseado nas tarefas criadas e concluídas por dia."
                >
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                                <XAxis dataKey="day" stroke="var(--muted-soft)" />

                                <YAxis
                                    stroke="var(--muted-soft)"
                                    domain={[0, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "var(--surface-strong)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "12px",
                                        color: "var(--text)",
                                    }}
                                    formatter={(value) => [`${value}%`, "Produtividade"]}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="productivity"
                                    stroke="var(--accent)"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
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
                            Sua categoria mais usada é{" "}
                            <strong>{mostUsedCategory}</strong>. O foco agora deve ser reduzir
                            tarefas pendentes e priorizar itens de maior impacto.
                        </p>
                    </section>

                    <SectionCard title="Resumo">
                        <div className="space-y-4">
                            <InfoRow label="Total de tarefas" value={tasks.length} />
                            <InfoRow label="Concluídas" value={completedTasks} />
                            <InfoRow label="Pendentes" value={pendingTasks} />
                            <InfoRow
                                label="Produtividade"
                                value={`${productivity}%`}
                                bordered={false}
                            />
                        </div>
                    </SectionCard>
                </aside>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <SectionCard
                    title="Distribuição por prioridade"
                    description="Entenda o peso das tarefas por nível de urgência."
                >
                    {tasks.length === 0 ? (
                        <EmptyState
                            icon={<PieChartIcon size={20} />}
                            title="Sem dados de prioridade"
                            description="Crie tarefas para visualizar a distribuição."
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_220px] md:items-center">
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={priorityData}
                                            dataKey="value"
                                            nameKey="priority"
                                            innerRadius={58}
                                            outerRadius={92}
                                            paddingAngle={4}
                                        >
                                            {priorityData.map((item) => (
                                                <Cell key={item.priority} fill={item.color} />
                                            ))}
                                        </Pie>

                                        <Tooltip
                                            contentStyle={{
                                                background: "var(--surface-strong)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                                color: "var(--text)",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-3">
                                {priorityData.map((item) => (
                                    <div
                                        key={item.priority}
                                        className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="h-3 w-3 rounded-full"
                                                style={{ background: item.color }}
                                            />

                                            <span>{item.priority}</span>
                                        </div>

                                        <strong>{item.value}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </SectionCard>

                <SectionCard
                    title="Tarefas por categoria"
                    description="Veja quais áreas estão consumindo mais atenção."
                >
                    {categoryData.length === 0 ? (
                        <EmptyState
                            icon={<FolderKanban size={20} />}
                            title="Sem categorias"
                            description="Crie tarefas com categorias para visualizar este gráfico."
                        />
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                                    <XAxis dataKey="category" stroke="var(--muted-soft)" />

                                    <YAxis stroke="var(--muted-soft)" allowDecimals={false} />

                                    <Tooltip
                                        contentStyle={{
                                            background: "var(--surface-strong)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "12px",
                                            color: "var(--text)",
                                        }}
                                    />

                                    <Bar
                                        dataKey="total"
                                        name="Tarefas"
                                        fill="var(--accent)"
                                        radius={[10, 10, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </SectionCard>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
                <SectionCard
                    title="Análise rápida"
                    description="Leitura automática dos dados atuais do projeto."
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Activity size={18} className="ly-accent" />
                                <h3 className="font-semibold">Status</h3>
                            </div>

                            <p className="ly-muted text-sm leading-6">
                                O status atual é <strong>{productivityStatus}</strong>, com{" "}
                                {productivity}% de produtividade geral.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <FolderKanban size={18} className="ly-accent" />
                                <h3 className="font-semibold">Categoria dominante</h3>
                            </div>

                            <p className="ly-muted text-sm leading-6">
                                A categoria com mais tarefas é{" "}
                                <strong>{mostUsedCategory}</strong>.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Target size={18} className="ly-danger" />
                                <h3 className="font-semibold">Prioridade</h3>
                            </div>

                            <p className="ly-muted text-sm leading-6">
                                Existem <strong>{highPriorityTasks}</strong> tarefa(s) de alta
                                prioridade para revisar.
                            </p>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Atividade recente"
                    description="Histórico local das últimas ações feitas nas tarefas."
                >
                    <ActivityFeed activities={activities} limit={6} />
                </SectionCard>
            </section>
        </div>
    )
}