import type { Task } from "../types/task"
import { createLocalDate, formatDatePtBr, normalizeDateToStartOfDay } from "./date"
import { isTaskOverdue } from "./taskStatus"

export type TaskNotificationType =
    | "overdue"
    | "due-today"
    | "due-soon"
    | "high-priority"

export type TaskNotification = {
    id: string
    taskId: string
    type: TaskNotificationType
    title: string
    description: string
    priority: number
}

const dayInMilliseconds = 1000 * 60 * 60 * 24

function isTaskNotification(
    notification: TaskNotification | null
): notification is TaskNotification {
    return notification !== null
}

function getDaysUntilDueDate(dueDate: string, referenceDate: Date) {
    const due = createLocalDate(dueDate)
    const today = normalizeDateToStartOfDay(referenceDate)

    return Math.round((due.getTime() - today.getTime()) / dayInMilliseconds)
}

function createNotificationId(task: Task, type: TaskNotificationType) {
    return `${type}:${task.id}`
}

function createOverdueNotification(
    task: Task,
    referenceDate: Date
): TaskNotification | null {
    if (!task.dueDate || task.done || !isTaskOverdue(task, referenceDate)) {
        return null
    }

    const daysLate = Math.abs(getDaysUntilDueDate(task.dueDate, referenceDate))

    return {
        id: createNotificationId(task, "overdue"),
        taskId: task.id,
        type: "overdue",
        title: "Tarefa atrasada",
        description: `${task.title} venceu em ${formatDatePtBr(
            task.dueDate
        )} há ${daysLate} dia(s).`,
        priority: 4,
    }
}

function createDueTodayNotification(
    task: Task,
    referenceDate: Date
): TaskNotification | null {
    if (!task.dueDate || task.done) {
        return null
    }

    const daysUntilDue = getDaysUntilDueDate(task.dueDate, referenceDate)

    if (daysUntilDue !== 0) {
        return null
    }

    return {
        id: createNotificationId(task, "due-today"),
        taskId: task.id,
        type: "due-today",
        title: "Vence hoje",
        description: `${task.title} precisa ser finalizada hoje.`,
        priority: 3,
    }
}

function createDueSoonNotification(
    task: Task,
    referenceDate: Date
): TaskNotification | null {
    if (!task.dueDate || task.done) {
        return null
    }

    const daysUntilDue = getDaysUntilDueDate(task.dueDate, referenceDate)

    if (daysUntilDue < 1 || daysUntilDue > 3) {
        return null
    }

    return {
        id: createNotificationId(task, "due-soon"),
        taskId: task.id,
        type: "due-soon",
        title: "Vencimento próximo",
        description: `${task.title} vence em ${daysUntilDue} dia(s), em ${formatDatePtBr(
            task.dueDate
        )}.`,
        priority: 2,
    }
}

function createHighPriorityNotification(task: Task): TaskNotification | null {
    if (task.done || task.priority !== "high" || task.dueDate) {
        return null
    }

    return {
        id: createNotificationId(task, "high-priority"),
        taskId: task.id,
        type: "high-priority",
        title: "Alta prioridade sem prazo",
        description: `${task.title} está como alta prioridade, mas ainda não tem vencimento definido.`,
        priority: 1,
    }
}

export function getTaskNotifications(
    tasks: Task[],
    referenceDate = new Date()
): TaskNotification[] {
    return tasks
        .flatMap((task) => {
            return [
                createOverdueNotification(task, referenceDate),
                createDueTodayNotification(task, referenceDate),
                createDueSoonNotification(task, referenceDate),
                createHighPriorityNotification(task),
            ].filter(isTaskNotification)
        })
        .sort((a, b) => {
            if (b.priority !== a.priority) {
                return b.priority - a.priority
            }

            return a.title.localeCompare(b.title)
        })
}