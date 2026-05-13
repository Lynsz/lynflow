import { CalendarClock, CheckCircle2, ChevronRight, TriangleAlert } from "lucide-react"
import type { Task } from "../../types/task"
import type { StatusFilter } from "../../utils/taskFilters"
import { isTaskOverdue } from "../../utils/taskStatus"
import { Button } from "../ui/Button"

type TaskDeadlineOverviewProps = {
    tasks: Task[]
    referenceDate?: Date
    onStatusSelect?: (status: StatusFilter) => void
}

function formatDueDate(dueDate: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(`${dueDate}T00:00:00`))
}

function getUpcomingTasks(tasks: Task[], referenceDate: Date) {
    return tasks
        .filter((task) => {
            if (!task.dueDate || task.done) {
                return false
            }

            return !isTaskOverdue(task, referenceDate)
        })
        .sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return a.order - b.order
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1

            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        .slice(0, 3)
}

export function TaskDeadlineOverview({
    tasks,
    referenceDate = new Date(),
    onStatusSelect,
}: TaskDeadlineOverviewProps) {
    const overdueTasks = tasks.filter((task) => isTaskOverdue(task, referenceDate))
    const upcomingTasks = getUpcomingTasks(tasks, referenceDate)
    const completedTasks = tasks.filter((task) => task.done)

    const hasOverdueTasks = overdueTasks.length > 0
    const hasUpcomingTasks = upcomingTasks.length > 0

    return (
        <section className="mt-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-[var(--text)]">
                            <CalendarClock size={18} />
                        </span>

                        <div>
                            <h3 className="font-semibold text-[var(--text)]">
                                Visão de prazos
                            </h3>

                            <p className="ly-muted-soft text-sm">
                                Acompanhe vencimentos e tarefas que precisam de atenção.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3">
                            <div className="flex items-center gap-2 text-red-500">
                                <TriangleAlert size={16} />

                                <span className="text-sm font-medium">
                                    Atrasadas
                                </span>
                            </div>

                            <strong className="mt-2 block text-2xl">
                                {overdueTasks.length}
                            </strong>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3">
                            <div className="flex items-center gap-2 text-[var(--text)]">
                                <CalendarClock size={16} />

                                <span className="text-sm font-medium">
                                    Próximas
                                </span>
                            </div>

                            <strong className="mt-2 block text-2xl">
                                {upcomingTasks.length}
                            </strong>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3">
                            <div className="flex items-center gap-2 text-emerald-500">
                                <CheckCircle2 size={16} />

                                <span className="text-sm font-medium">
                                    Concluídas
                                </span>
                            </div>

                            <strong className="mt-2 block text-2xl">
                                {completedTasks.length}
                            </strong>
                        </div>
                    </div>
                </div>

                <Button
                    variant={hasOverdueTasks ? "danger" : "secondary"}
                    size="sm"
                    icon={<TriangleAlert size={16} />}
                    disabled={!hasOverdueTasks}
                    onClick={() => onStatusSelect?.("overdue")}
                    title="Filtrar tarefas atrasadas"
                    aria-label="Filtrar tarefas atrasadas"
                >
                    Ver atrasadas
                </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[var(--text)]">
                        Próximos vencimentos
                    </p>

                    <span className="ly-muted-soft text-xs">
                        Até 3 tarefas
                    </span>
                </div>

                {hasUpcomingTasks ? (
                    <div className="space-y-2">
                        {upcomingTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[var(--text)]">
                                        {task.title}
                                    </p>

                                    <p className="ly-muted-soft text-xs">
                                        {task.category} • {task.priority}
                                    </p>
                                </div>

                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                                    {task.dueDate ? formatDueDate(task.dueDate) : "Sem data"}
                                    <ChevronRight size={13} />
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="ly-muted-soft text-sm">
                        Nenhuma tarefa pendente com prazo definido.
                    </p>
                )}
            </div>
        </section>
    )
}