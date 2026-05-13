import { Download, Filter } from "lucide-react"
import { useTasks } from "../../hooks/useTasks"
import type { Task } from "../../types/task"
import {
    createTasksCsv,
    downloadCsvFile,
    getTasksCsvFileName,
} from "../../utils/taskCsv"
import { Button } from "../ui/Button"
import { useToast } from "../ui/ToastProvider"

type TaskExportActionsProps = {
    visibleTasks: Task[]
}

export function TaskExportActions({ visibleTasks }: TaskExportActionsProps) {
    const { tasks } = useTasks()
    const { showToast } = useToast()

    const hasTasks = tasks.length > 0
    const hasVisibleTasks = visibleTasks.length > 0

    function exportTasksToCsv(tasksToExport: Task[], exportType: "all" | "filtered") {
        if (tasksToExport.length === 0) {
            showToast({
                type: "warning",
                title:
                    exportType === "filtered"
                        ? "Nenhuma tarefa filtrada para exportar"
                        : "Nenhuma tarefa para exportar",
                description:
                    exportType === "filtered"
                        ? "Ajuste os filtros ou limpe a busca antes de gerar o CSV."
                        : "Crie pelo menos uma tarefa antes de gerar o CSV.",
            })

            return
        }

        const csv = createTasksCsv(tasksToExport)
        const fileName = getTasksCsvFileName()

        downloadCsvFile(fileName, csv)

        showToast({
            type: "success",
            title:
                exportType === "filtered"
                    ? "CSV filtrado exportado"
                    : "CSV exportado",
            description: `${tasksToExport.length} tarefa(s) foram exportadas.`,
        })
    }

    return (
        <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <p className="font-medium text-[var(--text)]">
                    Exportação rápida
                </p>

                <p className="ly-muted-soft mt-1 text-sm">
                    Gere um arquivo CSV com todas as tarefas ou apenas com o
                    resultado atual dos filtros.
                </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download size={16} />}
                    disabled={!hasTasks}
                    onClick={() => exportTasksToCsv(tasks, "all")}
                    title="Exportar todas as tarefas em CSV"
                    aria-label="Exportar todas as tarefas em CSV"
                >
                    Todas ({tasks.length})
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    icon={<Filter size={16} />}
                    disabled={!hasVisibleTasks}
                    onClick={() => exportTasksToCsv(visibleTasks, "filtered")}
                    title="Exportar tarefas filtradas em CSV"
                    aria-label="Exportar tarefas filtradas em CSV"
                >
                    Filtradas ({visibleTasks.length})
                </Button>
            </div>
        </div>
    )
}