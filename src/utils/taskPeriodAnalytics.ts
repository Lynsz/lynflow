import type { Task } from "../types/task"
import { isTaskOverdue } from "./taskStatus"

export type DashboardPeriod = "7d" | "30d" | "90d" | "all"

export type PeriodTrendStatus = "up" | "down" | "stable" | "neutral"

export type PeriodCategoryBreakdown = {
    category: string
    total: number
    completed: number
    pending: number
}

export type PeriodComparison = {
    previousTotal: number
    previousCompleted: number
    previousCompletionRate: number
    taskDelta: number
    completionRateDelta: number
    trendStatus: PeriodTrendStatus
    label: string
    description: string
}

export type PeriodDateRange = {
    startDate: Date
    endDate: Date
}

export type PeriodAnalytics = {
    period: DashboardPeriod
    label: string
    rangeLabel: string
    total: number
    completed: number
    pending: number
    highPriority: number
    overdue: number
    completionRate: number
    topCategory: string | null
    topCategoryCount: number
    categoryBreakdown: PeriodCategoryBreakdown[]
    recentTasks: Task[]
    comparison: PeriodComparison
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

function formatShortDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
    }).format(date)
}

function getCompletionRate(total: number, completed: number) {
    if (total === 0) {
        return 0
    }

    return Math.round((completed / total) * 100)
}

function getTaskDate(task: Task) {
    return normalizeStartOfDay(new Date(task.createdAt))
}

function isTaskInsideRange(task: Task, range: PeriodDateRange) {
    const taskDate = getTaskDate(task)

    return (
        taskDate.getTime() >= range.startDate.getTime() &&
        taskDate.getTime() <= range.endDate.getTime()
    )
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

function getCategoryBreakdown(tasks: Task[]): PeriodCategoryBreakdown[] {
    const categories = tasks.reduce<Record<string, PeriodCategoryBreakdown>>(
        (acc, task) => {
            const category = task.category.trim() || "Geral"

            if (!acc[category]) {
                acc[category] = {
                    category,
                    total: 0,
                    completed: 0,
                    pending: 0,
                }
            }

            acc[category].total += 1

            if (task.done) {
                acc[category].completed += 1
            } else {
                acc[category].pending += 1
            }

            return acc
        },
        {}
    )

    return Object.values(categories).sort((a, b) => {
        if (b.total !== a.total) {
            return b.total - a.total
        }

        return a.category.localeCompare(b.category)
    })
}

function getRecentTasks(tasks: Task[]) {
    return [...tasks]
        .sort((a, b) => {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
        })
        .slice(0, 5)
}

function getPeriodComparison(
    currentTasks: Task[],
    previousTasks: Task[],
    period: DashboardPeriod
): PeriodComparison {
    if (period === "all") {
        return {
            previousTotal: 0,
            previousCompleted: 0,
            previousCompletionRate: 0,
            taskDelta: 0,
            completionRateDelta: 0,
            trendStatus: "neutral",
            label: "Histórico completo",
            description:
                "O modo Tudo mostra todos os dados salvos, sem comparação com período anterior.",
        }
    }

    const currentCompleted = currentTasks.filter((task) => task.done).length
    const previousCompleted = previousTasks.filter((task) => task.done).length

    const currentCompletionRate = getCompletionRate(
        currentTasks.length,
        currentCompleted
    )

    const previousCompletionRate = getCompletionRate(
        previousTasks.length,
        previousCompleted
    )

    const taskDelta = currentTasks.length - previousTasks.length
    const completionRateDelta = currentCompletionRate - previousCompletionRate

    if (completionRateDelta > 0) {
        return {
            previousTotal: previousTasks.length,
            previousCompleted,
            previousCompletionRate,
            taskDelta,
            completionRateDelta,
            trendStatus: "up",
            label: "Evolução positiva",
            description:
                "A taxa de conclusão subiu em relação ao período anterior.",
        }
    }

    if (completionRateDelta < 0) {
        return {
            previousTotal: previousTasks.length,
            previousCompleted,
            previousCompletionRate,
            taskDelta,
            completionRateDelta,
            trendStatus: "down",
            label: "Atenção ao ritmo",
            description:
                "A taxa de conclusão caiu em relação ao período anterior.",
        }
    }

    return {
        previousTotal: previousTasks.length,
        previousCompleted,
        previousCompletionRate,
        taskDelta,
        completionRateDelta,
        trendStatus: "stable",
        label: "Ritmo estável",
        description:
            "A taxa de conclusão ficou estável em relação ao período anterior.",
    }
}

export function getPeriodDateRange(
    period: DashboardPeriod,
    referenceDate = new Date()
): PeriodDateRange | null {
    const periodDays = getPeriodDays(period)

    if (!periodDays) {
        return null
    }

    const endDate = normalizeStartOfDay(referenceDate)
    const startDate = normalizeStartOfDay(referenceDate)

    startDate.setDate(endDate.getDate() - (periodDays - 1))

    return {
        startDate,
        endDate,
    }
}

export function getPreviousPeriodDateRange(
    period: DashboardPeriod,
    referenceDate = new Date()
): PeriodDateRange | null {
    const periodDays = getPeriodDays(period)

    if (!periodDays) {
        return null
    }

    const currentRange = getPeriodDateRange(period, referenceDate)

    if (!currentRange) {
        return null
    }

    const previousEndDate = normalizeStartOfDay(currentRange.startDate)
    previousEndDate.setDate(previousEndDate.getDate() - 1)

    const previousStartDate = normalizeStartOfDay(previousEndDate)
    previousStartDate.setDate(previousEndDate.getDate() - (periodDays - 1))

    return {
        startDate: previousStartDate,
        endDate: previousEndDate,
    }
}

export function getPeriodRangeLabel(
    period: DashboardPeriod,
    referenceDate = new Date()
) {
    const range = getPeriodDateRange(period, referenceDate)

    if (!range) {
        return "Todo o histórico salvo"
    }

    return `${formatShortDate(range.startDate)} até ${formatShortDate(
        range.endDate
    )}`
}

export function filterTasksByPeriod(
    tasks: Task[],
    period: DashboardPeriod,
    referenceDate = new Date()
) {
    const range = getPeriodDateRange(period, referenceDate)

    if (!range) {
        return tasks
    }

    return tasks.filter((task) => {
        return isTaskInsideRange(task, range)
    })
}

export function filterTasksByPreviousPeriod(
    tasks: Task[],
    period: DashboardPeriod,
    referenceDate = new Date()
) {
    const range = getPreviousPeriodDateRange(period, referenceDate)

    if (!range) {
        return []
    }

    return tasks.filter((task) => {
        return isTaskInsideRange(task, range)
    })
}

export function getTaskPeriodAnalytics(
    tasks: Task[],
    period: DashboardPeriod,
    referenceDate = new Date()
): PeriodAnalytics {
    const periodTasks = filterTasksByPeriod(tasks, period, referenceDate)
    const previousPeriodTasks = filterTasksByPreviousPeriod(
        tasks,
        period,
        referenceDate
    )

    const completed = periodTasks.filter((task) => task.done).length
    const pending = periodTasks.filter((task) => !task.done).length

    const highPriority = periodTasks.filter((task) => {
        return task.priority === "high"
    }).length

    const overdue = periodTasks.filter((task) => {
        return isTaskOverdue(task, referenceDate)
    }).length

    const { topCategory, topCategoryCount } = getTopCategory(periodTasks)

    return {
        period,
        label: getPeriodLabel(period),
        rangeLabel: getPeriodRangeLabel(period, referenceDate),
        total: periodTasks.length,
        completed,
        pending,
        highPriority,
        overdue,
        completionRate: getCompletionRate(periodTasks.length, completed),
        topCategory,
        topCategoryCount,
        categoryBreakdown: getCategoryBreakdown(periodTasks),
        recentTasks: getRecentTasks(periodTasks),
        comparison: getPeriodComparison(periodTasks, previousPeriodTasks, period),
    }
}