import type { ReactNode } from "react"
import { CheckCircle2, Circle, ClipboardList, TriangleAlert } from "lucide-react"
import type { Task } from "../../types/task"

type TaskSummaryCardsProps = {
    tasks: Task[]
}

type SummaryCard = {
    title: string
    value: number
    description: string
    icon: ReactNode
}

function isTaskOverdue(task: Task) {
    if (!task.dueDate || task.done) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDate = new Date(`${task.dueDate}T00:00:00`)

    return dueDate.getTime() < today.getTime()
}

function getCompletionRate(tasks: Task[]) {
    if (tasks.length === 0) return 0

    const completedTasks = tasks.filter((task) => task.done).length

    return Math.round((completedTasks / tasks.length) * 100)
}

export function TaskSummaryCards({ tasks }: TaskSummaryCardsProps) {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.done).length
    const overdueTasks = tasks.filter(isTaskOverdue).length
    const pendingTasks = tasks.filter((task) => !task.done && !isTaskOverdue(task)).length
    const completionRate = getCompletionRate(tasks)

    const cards: SummaryCard[] = [
        {
            title: "Total",
            value: totalTasks,
            description: `${completionRate}% de conclusão geral`,
            icon: <ClipboardList size={18} />,
        },
        {
            title: "Pendentes",
            value: pendingTasks,
            description: "Tarefas abertas dentro do prazo",
            icon: <Circle size={18} />,
        },
        {
            title: "Atrasadas",
            value: overdueTasks,
            description: "Tarefas pendentes fora do prazo",
            icon: <TriangleAlert size={18} />,
        },
        {
            title: "Concluídas",
            value: completedTasks,
            description: "Tarefas finalizadas",
            icon: <CheckCircle2 size={18} />,
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <article
                    key={card.title}
                    className="ly-card-strong rounded-3xl p-5"
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
                </article>
            ))}
        </div>
    )
}