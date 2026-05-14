import { useMemo, useState } from "react"
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Flame,
    FolderKanban,
    TrendingUp,
} from "lucide-react"
import type { Task } from "../../types/task"
import {
    dashboardPeriods,
    getTaskPeriodAnalytics,
    type DashboardPeriod,
} from "../../utils/taskPeriodAnalytics"

type DashboardPeriodPanelProps = {
    tasks: Task[]
    referenceDate?: Date
}

type PeriodMetricProps = {
    label: string
    value: string | number
    description: string
    icon: React.ReactNode
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

export function DashboardPeriodPanel({
    tasks,
    referenceDate = new Date(),
}: DashboardPeriodPanelProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>("30d")

    const analytics = useMemo(() => {
        return getTaskPeriodAnalytics(tasks, selectedPeriod, referenceDate)
    }, [tasks, selectedPeriod, referenceDate])

    return (
        <section className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <CalendarDays size={18} className="text-[var(--primary)]" />

                        <p className="font-medium text-[var(--text)]">
                            Dashboard por período
                        </p>
                    </div>

                    <p className="ly-muted-soft max-w-3xl text-sm leading-6">
                        Analise produtividade, pendências, atrasos e categorias de
                        acordo com o recorte selecionado.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {dashboardPeriods.map((period) => (
                        <button
                            key={period.key}
                            type="button"
                            onClick={() => setSelectedPeriod(period.key)}
                            className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${selectedPeriod === period.key
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

            <div className="mb-5 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-[var(--text)]">
                            {analytics.label}
                        </p>

                        <p className="ly-muted-soft mt-1 text-sm">
                            {analytics.total} tarefa(s) criadas nesse recorte.
                        </p>
                    </div>

                    <div className="min-w-48">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="ly-muted-soft">Conclusão</span>
                            <span className="font-semibold text-[var(--primary)]">
                                {analytics.completionRate}%
                            </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-[var(--surface)]">
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <PeriodMetric
                    label="Concluídas"
                    value={analytics.completed}
                    description={`${analytics.pending} tarefa(s) ainda em aberto.`}
                    icon={<CheckCircle2 size={20} />}
                />

                <PeriodMetric
                    label="Atrasadas"
                    value={analytics.overdue}
                    description="Tarefas vencidas e ainda não concluídas."
                    icon={<AlertTriangle size={20} />}
                />

                <PeriodMetric
                    label="Alta prioridade"
                    value={analytics.highPriority}
                    description="Itens críticos criados nesse período."
                    icon={<Flame size={20} />}
                />

                <PeriodMetric
                    label="Categoria principal"
                    value={analytics.topCategory ?? "Sem dados"}
                    description={
                        analytics.topCategory
                            ? `${analytics.topCategoryCount} tarefa(s) nessa categoria.`
                            : "Crie tarefas para gerar análise."
                    }
                    icon={<FolderKanban size={20} />}
                />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <TrendingUp size={18} className="mb-3 text-[var(--primary)]" />

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
                    <Clock3 size={18} className="mb-3 text-[var(--primary)]" />

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
                    <CalendarDays size={18} className="mb-3 text-[var(--primary)]" />

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