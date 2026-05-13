import { Download } from "lucide-react"
import { useTasks } from "../../hooks/useTasks"
import {
    createTasksCsv,
    downloadCsvFile,
    getTasksCsvFileName,
} from "../../utils/taskCsv"
import { Button } from "../ui/Button"
import { useToast } from "../ui/ToastProvider"

export function TaskExportActions() {
    const { tasks } = useTasks()
    const { showToast } = useToast()

    const hasTasks = tasks.length > 0

    function handleExportCsv() {
        if (!hasTasks) {
            showToast({
                type: "warning",
                title: "Nenhuma tarefa para exportar",
                description: "Crie pelo menos uma tarefa antes de gerar o CSV.",
            })

            return
        }

        const csv = createTasksCsv(tasks)
        const fileName = getTasksCsvFileName()

        downloadCsvFile(fileName, csv)

        showToast({
            type: "success",
            title: "CSV exportado",
            description: `${tasks.length} tarefa(s) foram exportadas.`,
        })
    }

    return (
        <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="font-medium text-[var(--text)]">
                    Exportação rápida
                </p>

                <p className="ly-muted-soft mt-1 text-sm">
                    Gere um arquivo CSV com título, categoria, prioridade,
                    status, vencimento e data de criação.
                </p>
            </div>

            <Button
                variant="secondary"
                size="sm"
                icon={<Download size={16} />}
                disabled={!hasTasks}
                onClick={handleExportCsv}
                title="Exportar tarefas em CSV"
                aria-label="Exportar tarefas em CSV"
            >
                Exportar CSV ({tasks.length})
            </Button>
        </div>
    )
}