import type { Task } from "../types/task"
import { isTaskOverdue } from "./taskStatus"

export type DashboardPeriod = "7d" | "30d" | "90d" | "all"

export type PeriodAnalytics = {
    period: DashboardPeriod
    label: string
    total: number
    completed: number
    pending: number
    highPriority: number
    overdue: number
    completionRate: number
    topCategory: string | null
    topCategoryCount: number
}

export const dashboardPeriods: Array<{
    key: DashboardPeriod
    label: string
}> = [
        { key: "7d", label: "7 dias" },
        { key: "30d", label: "30 dias" },
        { key: "90d", label: "90 dias" },
        { key: "all", label: "Tudo" },
    ]

function getPeriodLabel(period: DashboardPeriod) {
    if (period === "7d") return "Últimos 7 dias"
    if (period === "30d") return "Últimos 30 dias"
    if (period === "90d") return "Últimos 90 dias"

    return "Todo o histórico"
}

function getPeriodDays(period: DashboardPeriod) {
    if (period === "7d") return 7
    if (period === "30d") return 30
    if (period === "90d") return 90

    return null
}

function normalizeStartOfDay(date: Date) {
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    return normalizedDate
}

function isTaskInsidePeriod(
    task: Task,
    period: DashboardPeriod,
    referenceDate: Date
) {
    const periodDays = getPeriodDays(period)

    if (!periodDays) {
        return true
    }

    const taskDate = normalizeStartOfDay(new Date(task.createdAt))
    const endDate = normalizeStartOfDay(referenceDate)
    const startDate = normalizeStartOfDay(referenceDate)

    startDate.setDate(endDate.getDate() - (periodDays - 1))

    return taskDate.getTime() >= startDate.getTime() && taskDate.getTime() <= endDate.getTime()
}

function getCompletionRate(total: number, completed: number) {
    if (total === 0) {
        return 0
    }

    return Math.round((completed / total) * 100)
}

function getTopCategory(tasks: Task[]) {
    const categories = tasks.reduce<Record<string, number>>((acc, task) => {
        const category = task.category.trim() || "Geral"

        acc[category] = (acc[category] ?? 0) + 1

        return acc
    }, {})

    const [topCategory, topCategoryCount] =
        Object.entries(categories).sort((a, b) => b[1] - a[1])[0] ?? []

    return {
        topCategory: topCategory ?? null,
        topCategoryCount: topCategoryCount ?? 0,
    }
}

export function filterTasksByPeriod(
    tasks: Task[],
    period: DashboardPeriod,
    referenceDate = new Date()
) {
    return tasks.filter((task) => {
        return isTaskInsidePeriod(task, period, referenceDate)
    })
}

export function getTaskPeriodAnalytics(
    tasks: Task[],
    period: DashboardPeriod,
    referenceDate = new Date()
): PeriodAnalytics {
    const periodTasks = filterTasksByPeriod(tasks, period, referenceDate)

    const completed = periodTasks.filter((task) => task.done).length
    const pending = periodTasks.filter((task) => !task.done).length
    const highPriority = periodTasks.filter((task) => task.priority === "high").length
    const overdue = periodTasks.filter((task) =>
        isTaskOverdue(task, referenceDate)
    ).length

    const { topCategory, topCategoryCount } = getTopCategory(periodTasks)

    return {
        period,
        label: getPeriodLabel(period),
        total: periodTasks.length,
        completed,
        pending,
        highPriority,
        overdue,
        completionRate: getCompletionRate(periodTasks.length, completed),
        topCategory,
        topCategoryCount,
    }
}