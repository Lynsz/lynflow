import type { ReactNode } from "react"
import { CheckCircle2, Circle, ClipboardList, TriangleAlert } from "lucide-react"
import type { Task } from "../../types/task"
import { getTaskSummary } from "../../utils/taskStatus"
import type { StatusFilter } from "../../utils/taskFilters"

type TaskSummaryCardsProps = {
    tasks: Task[]
    activeStatus: StatusFilter
    onStatusSelect: (status: StatusFilter) => void
}

type SummaryCard = {
    title: string
    value: number
    description: string
    icon: ReactNode
    status: StatusFilter
}

export function TaskSummaryCards({
    tasks,
    activeStatus,
    onStatusSelect,
}: TaskSummaryCardsProps) {
    const summary = getTaskSummary(tasks)

    const cards: SummaryCard[] = [
        {
            title: "Total",
            value: summary.total,
            description: `${summary.completionRate}% de conclusão geral`,
            icon: <ClipboardList size={18} />,
            status: "all",
        },
        {
            title: "Pendentes",
            value: summary.pending,
            description: "Tarefas abertas dentro do prazo",
            icon: <Circle size={18} />,
            status: "todo",
        },
        {
            title: "Atrasadas",
            value: summary.overdue,
            description: "Tarefas pendentes fora do prazo",
            icon: <TriangleAlert size={18} />,
            status: "overdue",
        },
        {
            title: "Concluídas",
            value: summary.completed,
            description: "Tarefas finalizadas",
            icon: <CheckCircle2 size={18} />,
            status: "done",
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const isActive = activeStatus === card.status

                return (
                    <button
                        key={card.title}
                        type="button"
                        aria-pressed={isActive ? "true" : "false"}
                        aria-label={`Filtrar por ${card.title}`}
                        title={`Filtrar por ${card.title}`}
                        onClick={() => onStatusSelect(card.status)}
                        className={`ly-card-strong rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-xl ${isActive
                                ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                                : ""
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="ly-muted-soft text-sm">{card.title}</p>

                                <strong className="mt-2 block text-3xl font-semibold text-[var(--text)]">
                                    {card.value}
                                </strong>
                            </div>

                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-[var(--text)]">
                                {card.icon}
                            </span>
                        </div>

                        <p className="ly-muted-soft mt-4 text-sm leading-6">
                            {card.description}
                        </p>

                        {isActive && (
                            <span className="mt-4 inline-flex rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
                                Filtro ativo
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}