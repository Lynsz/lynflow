import type { ReactNode } from "react"
import {
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    Flame,
    Tag,
} from "lucide-react"
import type { Task } from "../../types/task"
import { getTaskInsights } from "../../utils/taskInsights"

type TaskInsightsPanelProps = {
    visibleTasks: Task[]
    totalTasks: number
    referenceDate?: Date
}

type InsightCardProps = {
    icon: ReactNode
    label: string
    value: string | number
    description: string
}

function InsightCard({ icon, label, value, description }: InsightCardProps) {
    return (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <div className="flex items-center justify-between gap-3">
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

            <p className="ly-muted-soft mt-3 text-sm">{description}</p>
        </div>
    )
}

export function TaskInsightsPanel({
    visibleTasks,
    totalTasks,
    referenceDate = new Date(),
}: TaskInsightsPanelProps) {
    const insights = getTaskInsights(visibleTasks, referenceDate)

    const visibleDescription =
        totalTasks === visibleTasks.length
            ? `${visibleTasks.length} tarefa(s) no total.`
            : `${visibleTasks.length} de ${totalTasks} tarefa(s) visível(is) após filtros.`

    return (
        <div className="mt-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-[var(--primary)]" />

                        <p className="font-medium text-[var(--text)]">
                            Insights do filtro atual
                        </p>
                    </div>

                    <p className="ly-muted-soft mt-1 text-sm">
                        Analise rapidamente o recorte atual da sua lista de
                        tarefas.
                    </p>
                </div>

                <span className="w-fit rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                    {visibleDescription}
                </span>
            </div>

            {visibleTasks.length === 0 ? (
                <div className="mt-4 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] p-5 text-sm text-[var(--muted)]">
                    Nenhuma tarefa visível para analisar.
                </div>
            ) : (
                <>
                    <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium text-[var(--text)]">
                                Progresso das tarefas visíveis
                            </span>

                            <span className="font-semibold text-[var(--primary)]">
                                {insights.completionRate}%
                            </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                            <div
                                className="h-full rounded-full bg-[var(--primary)] transition-all"
                                style={{
                                    width: `${insights.completionRate}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <InsightCard
                            icon={<CheckCircle2 size={20} />}
                            label="Concluídas"
                            value={insights.completed}
                            description={`${insights.pending} pendente(s) no filtro atual.`}
                        />

                        <InsightCard
                            icon={<AlertTriangle size={20} />}
                            label="Atrasadas"
                            value={insights.overdue}
                            description="Tarefas vencidas que ainda não foram concluídas."
                        />

                        <InsightCard
                            icon={<Flame size={20} />}
                            label="Alta prioridade"
                            value={insights.highPriority}
                            description="Itens que exigem mais atenção no recorte atual."
                        />

                        <InsightCard
                            icon={<Tag size={20} />}
                            label="Categoria principal"
                            value={insights.topCategory ?? "Sem categoria"}
                            description={`${insights.topCategoryCount} tarefa(s) nessa categoria.`}
                        />
                    </div>
                </>
            )}
        </div>
    )
}