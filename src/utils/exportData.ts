import type { SessionUser } from "../services/auth"
import type { TaskActivity } from "../types/activity"
import type { Task } from "../types/task"

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

function padDatePart(value: number) {
    return String(value).padStart(2, "0")
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
