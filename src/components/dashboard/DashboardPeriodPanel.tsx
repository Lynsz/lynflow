import { useMemo, useState, type ReactNode } from "react"
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Flame,
    FolderKanban,
    ListChecks,
    Minus,
    TrendingUp,
} from "lucide-react"
import type { Task } from "../../types/task"
import {
    dashboardPeriods,
    getTaskPeriodAnalytics,
    type DashboardPeriod,
    type PeriodTrendStatus,
} from "../../utils/taskPeriodAnalytics"

type DashboardPeriodPanelProps = {
    tasks: Task[]
    referenceDate?: Date
}

type PeriodMetricProps = {
    label: string
    value: string | number
    description: string
    icon: ReactNode
}

function PeriodMetric({ label, value, description, icon }: PeriodMetricProps) {
    return (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <p className="ly-muted-soft text-sm">{label}</p>

                    <p className="mt-2 text-2xl font-semibold text-[var(--text)]">
                        {value}
                    </p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--primary)]">
                    {icon}
                </div>
            </div>

            <p className="ly-muted-soft text-sm leading-6">{description}</p>
        </div>
    )
}

function getTrendIcon(status: PeriodTrendStatus) {
    if (status === "up") {
        return <ArrowUpRight size={18} aria-hidden="true" />
    }

    if (status === "down") {
        return <ArrowDownRight size={18} aria-hidden="true" />
    }

    return <Minus size={18} aria-hidden="true" />
}

function getTrendClasses(status: PeriodTrendStatus) {
    if (status === "up") {
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
    }

    if (status === "down") {
        return "border-red-500/20 bg-red-500/10 text-red-400"
    }

    if (status === "stable") {
        return "border-amber-500/20 bg-amber-500/10 text-amber-400"
    }

    return "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
}

function getPriorityLabel(priority: Task["priority"]) {
    if (priority === "high") {
        return "Alta"
    }

    if (priority === "medium") {
        return "Média"
    }

    return "Baixa"
}

function getTaskStatusLabel(task: Task) {
    if (task.done) {
        return "Concluída"
    }

    return "Pendente"
}

export function DashboardPeriodPanel({
    tasks,
    referenceDate = new Date(),
}: DashboardPeriodPanelProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>("30d")

    const analytics = useMemo(() => {
        return getTaskPeriodAnalytics(tasks, selectedPeriod, referenceDate)
    }, [tasks, selectedPeriod, referenceDate])

    const hasPeriodTasks = analytics.total > 0

    return (
        <section
            className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5"
            aria-labelledby="dashboard-period-title"
        >
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <CalendarDays
                            size={18}
                            className="text-[var(--primary)]"
                            aria-hidden="true"
                        />

                        <p
                            id="dashboard-period-title"
                            className="font-medium text-[var(--text)]"
                        >
                            Dashboard por período
                        </p>
                    </div>

                    <p className="ly-muted-soft max-w-3xl text-sm leading-6">
                        Analise produtividade, pendências, atrasos, categorias e
                        evolução de acordo com o recorte selecionado.
                    </p>
                </div>

                <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Selecionar período do dashboard"
                >
                    {dashboardPeriods.map((period) => (
                        <button
                            key={period.key}
                            type="button"
                            onClick={() => setSelectedPeriod(period.key)}
                            className={`rounded-2xl border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${selectedPeriod === period.key
                                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                    : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--text)]"
                                }`}
                            aria-pressed={
                                selectedPeriod === period.key ? "true" : "false"
                            }
                            aria-label={`Selecionar período ${period.label}`}
                            title={`Selecionar período ${period.label}`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.8fr]">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--text)]">
                                {analytics.label}
                            </p>

                            <p className="ly-muted-soft mt-1 text-sm">
                                Recorte: {analytics.rangeLabel}
                            </p>

                            <p className="ly-muted-soft mt-1 text-sm">
                                {analytics.total} tarefa(s) criadas nesse período.
                            </p>
                        </div>

                        <div className="min-w-48">
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="ly-muted-soft">Conclusão</span>

                                <span className="font-semibold text-[var(--primary)]">
                                    {analytics.completionRate}%
                                </span>
                            </div>

                            <div
                                className="h-3 overflow-hidden rounded-full bg-[var(--surface)]"
                                role="progressbar"
                                aria-label="Taxa de conclusão no período"
                                aria-valuenow={analytics.completionRate}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="h-full rounded-full bg-[var(--primary)] transition-all"
                                    style={{
                                        width: `${analytics.completionRate}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`rounded-3xl border p-4 ${getTrendClasses(
                        analytics.comparison.trendStatus
                    )}`}
                >
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold">
                                {analytics.comparison.label}
                            </p>

                            <p className="mt-1 text-sm opacity-80">
                                {analytics.comparison.description}
                            </p>
                        </div>

                        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-black/10">
                            {getTrendIcon(analytics.comparison.trendStatus)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-2xl bg-black/10 p-3">
                            <p className="opacity-75">Variação tarefas</p>

                            <strong className="mt-1 block">
                                {analytics.comparison.taskDelta > 0 ? "+" : ""}
                                {analytics.comparison.taskDelta}
                            </strong>
                        </div>

                        <div className="rounded-2xl bg-black/10 p-3">
                            <p className="opacity-75">Variação conclusão</p>

                            <strong className="mt-1 block">
                                {analytics.comparison.completionRateDelta > 0
                                    ? "+"
                                    : ""}
                                {analytics.comparison.completionRateDelta}%
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <PeriodMetric
                    label="Concluídas"
                    value={analytics.completed}
                    description={`${analytics.pending} tarefa(s) ainda em aberto.`}
                    icon={<CheckCircle2 size={20} aria-hidden="true" />}
                />

                <PeriodMetric
                    label="Atrasadas"
                    value={analytics.overdue}
                    description="Tarefas vencidas e ainda não concluídas."
                    icon={<AlertTriangle size={20} aria-hidden="true" />}
                />

                <PeriodMetric
                    label="Alta prioridade"
                    value={analytics.highPriority}
                    description="Itens críticos criados nesse período."
                    icon={<Flame size={20} aria-hidden="true" />}
                />

                <PeriodMetric
                    label="Categoria principal"
                    value={analytics.topCategory ?? "Sem dados"}
                    description={
                        analytics.topCategory
                            ? `${analytics.topCategoryCount} tarefa(s) nessa categoria.`
                            : "Crie tarefas para gerar análise."
                    }
                    icon={<FolderKanban size={20} aria-hidden="true" />}
                />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <BarChart3
                            size={18}
                            className="text-[var(--primary)]"
                            aria-hidden="true"
                        />

                        <p className="text-sm font-medium text-[var(--text)]">
                            Categorias do período
                        </p>
                    </div>

                    {!hasPeriodTasks ? (
                        <p className="ly-muted-soft text-sm leading-6">
                            Nenhuma tarefa encontrada nesse período.
                        </p>
                    ) : (
                        <div className="ly-scrollbar max-h-72 space-y-3 overflow-y-auto pr-1">
                            {analytics.categoryBreakdown.map((category) => {
                                const percentage =
                                    analytics.total === 0
                                        ? 0
                                        : Math.round(
                                            (category.total / analytics.total) *
                                            100
                                        )

                                return (
                                    <div
                                        key={category.category}
                                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-medium text-[var(--text)]">
                                                {category.category}
                                            </p>

                                            <span className="text-xs text-[var(--muted)]">
                                                {category.total}
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                                            <div
                                                className="h-full rounded-full bg-[var(--primary)]"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="ly-muted-soft mt-2 text-xs">
                                            {category.completed} concluída(s) ·{" "}
                                            {category.pending} pendente(s)
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <ListChecks
                            size={18}
                            className="text-[var(--primary)]"
                            aria-hidden="true"
                        />

                        <p className="text-sm font-medium text-[var(--text)]">
                            Tarefas recentes do período
                        </p>
                    </div>

                    {!hasPeriodTasks ? (
                        <p className="ly-muted-soft text-sm leading-6">
                            Nenhuma tarefa recente para mostrar nesse recorte.
                        </p>
                    ) : (
                        <div className="ly-scrollbar max-h-72 space-y-3 overflow-y-auto pr-1">
                            {analytics.recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-[var(--text)]">
                                                {task.title}
                                            </p>

                                            <p className="ly-muted-soft mt-1 text-xs">
                                                {task.category}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2 py-1 text-[10px] text-[var(--muted)]">
                                            {getTaskStatusLabel(task)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2 py-1 text-[10px] text-[var(--muted)]">
                                            Prioridade {getPriorityLabel(task.priority)}
                                        </span>

                                        {task.dueDate && (
                                            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2 py-1 text-[10px] text-[var(--muted)]">
                                                Prazo definido
                                            </span>
                                        )}

                                        {task.recurrence &&
                                            task.recurrence !== "none" && (
                                                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[10px] text-violet-400">
                                                    Recorrente
                                                </span>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <TrendingUp
                        size={18}
                        className="mb-3 text-[var(--primary)]"
                        aria-hidden="true"
                    />

                    <p className="text-sm font-medium text-[var(--text)]">
                        Leitura do período
                    </p>

                    <p className="ly-muted-soft mt-2 text-sm leading-6">
                        {analytics.completionRate >= 70
                            ? "O recorte atual mostra boa consistência de entrega."
                            : "O recorte atual ainda tem espaço para melhorar a taxa de conclusão."}
                    </p>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <Clock3
                        size={18}
                        className="mb-3 text-[var(--primary)]"
                        aria-hidden="true"
                    />

                    <p className="text-sm font-medium text-[var(--text)]">
                        Ritmo de execução
                    </p>

                    <p className="ly-muted-soft mt-2 text-sm leading-6">
                        {analytics.pending > analytics.completed
                            ? "Há mais tarefas abertas do que concluídas nesse período."
                            : "As entregas estão superando ou acompanhando as pendências."}
                    </p>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <CalendarDays
                        size={18}
                        className="mb-3 text-[var(--primary)]"
                        aria-hidden="true"
                    />

                    <p className="text-sm font-medium text-[var(--text)]">
                        Próximo ajuste
                    </p>

                    <p className="ly-muted-soft mt-2 text-sm leading-6">
                        {analytics.overdue > 0
                            ? "Comece eliminando tarefas atrasadas para recuperar controle."
                            : "Mantenha o fluxo atual e revise as próximas prioridades."}
                    </p>
                </div>
            </div>
        </section>
    )
}