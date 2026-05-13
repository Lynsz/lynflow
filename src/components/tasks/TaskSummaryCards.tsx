import type { ReactNode } from "react"
import { CheckCircle2, Circle, ClipboardList, TriangleAlert } from "lucide-react"
import type { Task } from "../../types/task"
import { getTaskSummary } from "../../utils/taskStatus"

type TaskSummaryCardsProps = {
    tasks: Task[]
}

type SummaryCard = {
    title: string
    value: number
    description: string
    icon: ReactNode
}

export function TaskSummaryCards({ tasks }: TaskSummaryCardsProps) {
    const summary = getTaskSummary(tasks)

    const cards: SummaryCard[] = [
        {
            title: "Total",
            value: summary.total,
            description: `${summary.completionRate}% de conclusão geral`,
            icon: <ClipboardList size={18} />,
        },
        {
            title: "Pendentes",
            value: summary.pending,
            description: "Tarefas abertas dentro do prazo",
            icon: <Circle size={18} />,
        },
        {
            title: "Atrasadas",
            value: summary.overdue,
            description: "Tarefas pendentes fora do prazo",
            icon: <TriangleAlert size={18} />,
        },
        {
            title: "Concluídas",
            value: summary.completed,
            description: "Tarefas finalizadas",
            icon: <CheckCircle2 size={18} />,
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <article key={card.title} className="ly-card-strong rounded-3xl p-5">
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
                </article>
            ))}
        </div>
    )
}