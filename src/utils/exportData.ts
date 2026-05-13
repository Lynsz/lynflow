import type { SessionUser } from "../services/auth"
import type { ActivityType, TaskActivity } from "../types/activity"
import type { Priority, Task } from "../types/task"

export type LynflowExportPayload = {
    app: "Lynflow"
    version: 1
    exportedAt: string
    dataMode: "local" | "supabase"
    user: Pick<SessionUser, "name" | "email"> | null
    summary: {
        totalTasks: number
        completedTasks: number
        pendingTasks: number
        totalActivities: number
    }
    tasks: Task[]
    activities: TaskActivity[]
}

type CreateExportPayloadParams = {
    dataMode: "local" | "supabase"
    user: SessionUser | null
    tasks: Task[]
    activities: TaskActivity[]
    exportedAt?: string
}

const priorities: Priority[] = ["low", "medium", "high"]
const activityTypes: ActivityType[] = [
    "created",
    "completed",
    "reopened",
    "deleted",
    "reordered",
    "cleared",
    "reset",
]

function padDatePart(value: number) {
    return String(value).padStart(2, "0")
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isPriority(value: unknown): value is Priority {
    return typeof value === "string" && priorities.includes(value as Priority)
}

function isActivityType(value: unknown): value is ActivityType {
    return typeof value === "string" && activityTypes.includes(value as ActivityType)
}

function isTask(value: unknown): value is Task {
    if (!isRecord(value)) {
        return false
    }

    return (
        typeof value.id === "string" &&
        typeof value.title === "string" &&
        typeof value.category === "string" &&
        isPriority(value.priority) &&
        typeof value.done === "boolean" &&
        typeof value.createdAt === "string" &&
        typeof value.order === "number" &&
        (typeof value.dueDate === "string" ||
            value.dueDate === null ||
            typeof value.dueDate === "undefined")
    )
}

function isTaskActivity(value: unknown): value is TaskActivity {
    if (!isRecord(value)) {
        return false
    }

    return (
        typeof value.id === "string" &&
        isActivityType(value.type) &&
        typeof value.title === "string" &&
        typeof value.description === "string" &&
        typeof value.createdAt === "string"
    )
}

export function getLynflowExportFileName(date = new Date()) {
    const year = date.getFullYear()
    const month = padDatePart(date.getMonth() + 1)
    const day = padDatePart(date.getDate())
    const hour = padDatePart(date.getHours())
    const minute = padDatePart(date.getMinutes())

    return `lynflow-backup-${year}-${month}-${day}-${hour}${minute}.json`
}

export function createLynflowExportPayload({
    dataMode,
    user,
    tasks,
    activities,
    exportedAt = new Date().toISOString(),
}: CreateExportPayloadParams): LynflowExportPayload {
    const completedTasks = tasks.filter((task) => task.done).length

    return {
        app: "Lynflow",
        version: 1,
        exportedAt,
        dataMode,
        user: user
            ? {
                name: user.name,
                email: user.email,
            }
            : null,
        summary: {
            totalTasks: tasks.length,
            completedTasks,
            pendingTasks: tasks.length - completedTasks,
            totalActivities: activities.length,
        },
        tasks,
        activities,
    }
}

export function parseLynflowExportPayload(value: unknown): LynflowExportPayload {
    if (!isRecord(value)) {
        throw new Error("Arquivo de backup invalido.")
    }

    if (value.app !== "Lynflow" || value.version !== 1) {
        throw new Error("Este arquivo nao parece ser um backup valido do Lynflow.")
    }

    if (value.dataMode !== "local" && value.dataMode !== "supabase") {
        throw new Error("Modo de dados do backup invalido.")
    }

    if (!Array.isArray(value.tasks) || !value.tasks.every(isTask)) {
        throw new Error("O backup contem tarefas invalidas.")
    }

    if (!Array.isArray(value.activities) || !value.activities.every(isTaskActivity)) {
        throw new Error("O backup contem atividades invalidas.")
    }

    return createLynflowExportPayload({
        dataMode: value.dataMode,
        user: null,
        tasks: value.tasks,
        activities: value.activities,
        exportedAt:
            typeof value.exportedAt === "string"
                ? value.exportedAt
                : new Date().toISOString(),
    })
}

export function parseLynflowBackupFileContent(content: string) {
    try {
        return parseLynflowExportPayload(JSON.parse(content))
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }

        throw new Error("Nao foi possivel ler o arquivo de backup.", {
            cause: error,
        })
    }
}

export function downloadJsonFile(payload: unknown, fileName: string) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
}
