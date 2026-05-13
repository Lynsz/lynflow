import { useMemo, useState } from "react"
import { CheckSquare2, Trash2 } from "lucide-react"
import { useTasks } from "../../hooks/useTasks"
import type { Task } from "../../types/task"
import { Button } from "../ui/Button"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { useToast } from "../ui/ToastProvider"

type TaskBulkActionsProps = {
    visibleTasks: Task[]
}

export function TaskBulkActions({ visibleTasks }: TaskBulkActionsProps) {
    const { deleteTask, toggleTask } = useTasks()
    const { showToast } = useToast()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const pendingVisibleTasks = useMemo(() => {
        return visibleTasks.filter((task) => !task.done)
    }, [visibleTasks])

    const visibleTasksCount = visibleTasks.length
    const pendingVisibleTasksCount = pendingVisibleTasks.length

    const hasVisibleTasks = visibleTasksCount > 0
    const hasPendingVisibleTasks = pendingVisibleTasksCount > 0

    function completeVisibleTasks() {
        pendingVisibleTasks.forEach((task) => {
            toggleTask(task.id)
        })

        showToast({
            type: "success",
            title: "Tarefas visíveis concluídas",
            description: `${pendingVisibleTasksCount} tarefa(s) visível(is) foram marcadas como concluídas.`,
        })
    }

    function confirmDeleteVisibleTasks() {
        visibleTasks.forEach((task) => {
            deleteTask(task.id)
        })

        setIsDeleteDialogOpen(false)

        showToast({
            type: "success",
            title: "Tarefas visíveis deletadas",
            description: `${visibleTasksCount} tarefa(s) visível(is) foram removidas.`,
        })
    }

    return (
        <>
            <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="font-medium text-[var(--text)]">
                        Ações em massa
                    </p>

                    <p className="ly-muted-soft mt-1 text-sm">
                        Aplique ações apenas nas tarefas visíveis após busca,
                        filtros e ordenação.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={<CheckSquare2 size={16} />}
                        disabled={!hasPendingVisibleTasks}
                        onClick={completeVisibleTasks}
                        title="Marcar tarefas visíveis como concluídas"
                        aria-label="Marcar tarefas visíveis como concluídas"
                    >
                        Concluir visíveis ({pendingVisibleTasksCount})
                    </Button>

                    <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        disabled={!hasVisibleTasks}
                        onClick={() => setIsDeleteDialogOpen(true)}
                        title="Deletar tarefas visíveis"
                        aria-label="Deletar tarefas visíveis"
                    >
                        Deletar visíveis ({visibleTasksCount})
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="Deletar tarefas visíveis?"
                description={
                    visibleTasksCount > 0
                        ? `${visibleTasksCount} tarefa(s) visível(is) serão removidas permanentemente.`
                        : "Nenhuma tarefa visível para remover."
                }
                confirmLabel="Deletar visíveis"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={confirmDeleteVisibleTasks}
                onClose={() => setIsDeleteDialogOpen(false)}
            />
        </>
    )
}