import { useMemo, useState } from "react"
import { Trash2 } from "lucide-react"
import { useTasks } from "../../hooks/useTasks"
import { Button } from "../ui/Button"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { useToast } from "../ui/ToastProvider"

export function CompletedTasksCleanup() {
    const { tasks, deleteTask } = useTasks()
    const { showToast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const completedTasks = useMemo(() => {
        return tasks.filter((task) => task.done)
    }, [tasks])

    const completedTasksCount = completedTasks.length

    function confirmClearCompletedTasks() {
        completedTasks.forEach((task) => {
            deleteTask(task.id)
        })

        setIsDialogOpen(false)

        showToast({
            type: "success",
            title: "Tarefas concluídas removidas",
            description: `${completedTasksCount} tarefa(s) concluída(s) foram removidas.`,
        })
    }

    return (
        <>
            <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-medium text-[var(--text)]">
                        Limpeza rápida
                    </p>

                    <p className="ly-muted-soft mt-1 text-sm">
                        Remova apenas tarefas concluídas e mantenha pendentes,
                        atrasadas e novas tarefas na lista.
                    </p>
                </div>

                <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    disabled={completedTasksCount === 0}
                    onClick={() => setIsDialogOpen(true)}
                    title="Limpar tarefas concluídas"
                    aria-label="Limpar tarefas concluídas"
                >
                    Limpar concluídas ({completedTasksCount})
                </Button>
            </div>

            <ConfirmDialog
                isOpen={isDialogOpen}
                title="Limpar tarefas concluídas?"
                description={
                    completedTasksCount > 0
                        ? `${completedTasksCount} tarefa(s) concluída(s) serão removidas permanentemente.`
                        : "Nenhuma tarefa concluída para remover."
                }
                confirmLabel="Limpar concluídas"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={confirmClearCompletedTasks}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    )
}