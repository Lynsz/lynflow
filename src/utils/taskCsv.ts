import type { Task } from "../types/task"
import { formatDatePtBr } from "./date"
import { getTaskFlowStatus } from "./taskStatus"

function escapeCsvValue(value: string | number | null | undefined) {
    const stringValue = String(value ?? "")
    const escapedValue = stringValue.replace(/"/g, '""')

    return `"${escapedValue}"`
}

function formatPriority(priority: Task["priority"]) {
    if (priority === "high") return "Alta"
    if (priority === "medium") return "Média"

    return "Baixa"
}

function formatTaskStatus(task: Task, referenceDate = new Date()) {
    const status = getTaskFlowStatus(task, referenceDate)

    if (status === "completed") return "Concluída"
    if (status === "overdue") return "Atrasada"

    return "Pendente"
}

function formatOptionalDate(date?: string | null) {
    if (!date) return ""

    return formatDatePtBr(date)
}

function formatCreatedAt(createdAt: string) {
    const dateOnly = createdAt.slice(0, 10)

    if (!dateOnly) return ""

    return formatDatePtBr(dateOnly)
}

export function createTasksCsv(tasks: Task[], referenceDate = new Date()) {
    const headers = [
        "Título",
        "Categoria",
        "Prioridade",
        "Status",
        "Vencimento",
        "Criada em",
    ]

    const rows = tasks.map((task) => [
        task.title,
        task.category,
        formatPriority(task.priority),
        formatTaskStatus(task, referenceDate),
        formatOptionalDate(task.dueDate),
        formatCreatedAt(task.createdAt),
    ])

    return [headers, ...rows]
        .map((row) => row.map(escapeCsvValue).join(";"))
        .join("\n")
}

export function getTasksCsvFileName(date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `lynflow-tasks-${year}-${month}-${day}.csv`
}

export function downloadCsvFile(fileName: string, content: string) {
    const blob = new Blob([content], {
        type: "text/csv;charset=utf-8",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
}