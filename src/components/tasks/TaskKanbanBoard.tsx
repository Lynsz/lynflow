import type { ReactNode } from "react"
import { CheckCircle2, ClipboardList, TriangleAlert } from "lucide-react"
import type { Task } from "../../types/task"
import { EmptyState } from "../ui/EmptyState"
import { TaskCard } from "./TaskCard"

type TaskKanbanBoardProps = {
    tasks: Task[]
    editingId: string | null
    editingTitle: string
    onEditingTitleChange: (value: string) => void
    onStartEdit: (task: Task) => void
    onSaveEdit: (id: string) => void
    onCancelEdit: () => void
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

type KanbanColumn = {
    id: string
    title: string
    description: string
    icon: ReactNode
    tasks: Task[]
}

function isTaskOverdue(task: Task) {
    if (!task.dueDate || task.done) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDate = new Date(`${task.dueDate}T00:00:00`)

    return dueDate.getTime() < today.getTime()
}

export function TaskKanbanBoard({
    tasks,
    editingId,
    editingTitle,
    onEditingTitleChange,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onToggle,
    onDelete,
}: TaskKanbanBoardProps) {
    const overdueTasks = tasks.filter(isTaskOverdue)
    const pendingTasks = tasks.filter((task) => !task.done && !isTaskOverdue(task))
    const completedTasks = tasks.filter((task) => task.done)

    const columns: KanbanColumn[] = [
        {
            id: "overdue",
            title: "Atrasadas",
            description: "Tarefas pendentes com vencimento passado.",
            icon: <TriangleAlert size={18} />,
            tasks: overdueTasks,
        },
        {
            id: "pending",
            title: "Pendentes",
            description: "Tarefas abertas dentro do prazo.",
            icon: <ClipboardList size={18} />,
            tasks: pendingTasks,
        },
        {
            id: "completed",
            title: "Concluídas",
            description: "Tarefas finalizadas.",
            icon: <CheckCircle2 size={18} />,
            tasks: completedTasks,
        },
    ]

    if (tasks.length === 0) {
        return (
            <EmptyState
                icon={<ClipboardList size={20} />}
                title="Nenhuma tarefa para exibir"
                description="Crie uma tarefa ou ajuste os filtros para visualizar o Kanban."
            />
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {columns.map((column) => (
                <article
                    key={column.id}
                    className="min-h-[360px] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                    <header className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-[var(--text)]">
                                    {column.icon}
                                </span>

                                <div>
                                    <h3 className="font-semibold">{column.title}</h3>

                                    <p className="ly-muted-soft text-xs">
                                        {column.tasks.length} tarefa(s)
                                    </p>
                                </div>
                            </div>

                            <p className="ly-muted-soft mt-3 text-sm leading-6">
                                {column.description}
                            </p>
                        </div>
                    </header>

                    <div className="space-y-3">
                        {column.tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                isEditing={editingId === task.id}
                                editingTitle={editingTitle}
                                onEditingTitleChange={onEditingTitleChange}
                                onStartEdit={onStartEdit}
                                onSaveEdit={onSaveEdit}
                                onCancelEdit={onCancelEdit}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                isDragDisabled
                            />
                        ))}

                        {column.tasks.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-[var(--border)] p-4">
                                <p className="ly-muted-soft text-sm">
                                    Nenhuma tarefa nesta coluna.
                                </p>
                            </div>
                        )}
                    </div>
                </article>
            ))}
        </div>
    )
}