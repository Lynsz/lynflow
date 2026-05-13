import type { Task } from "../types/task"
import { getTaskFlowStatus } from "./taskStatus"

export type TaskInsights = {
    total: number
    completed: number
    pending: number
    overdue: number
    highPriority: number
    completionRate: number
    topCategory: string | null
    topCategoryCount: number
}

function calculateCompletionRate(total: number, completed: number) {
    if (total === 0) {
        return 0
    }

    return Math.round((completed / total) * 100)
}

function getTopCategory(tasks: Task[]) {
    const categoryCount = tasks.reduce<Record<string, number>>((acc, task) => {
        const category = task.category.trim() || "Geral"

        acc[category] = (acc[category] ?? 0) + 1

        return acc
    }, {})

    const [topCategory, topCategoryCount] =
        Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0] ?? []

    return {
        topCategory: topCategory ?? null,
        topCategoryCount: topCategoryCount ?? 0,
    }
}

export function getTaskInsights(
    tasks: Task[],
    referenceDate = new Date()
): TaskInsights {
    const completed = tasks.filter((task) => task.done).length

    const overdue = tasks.filter((task) => {
        return getTaskFlowStatus(task, referenceDate) === "overdue"
    }).length

    const pending = tasks.filter((task) => {
        return getTaskFlowStatus(task, referenceDate) === "pending"
    }).length

    const highPriority = tasks.filter((task) => task.priority === "high").length

    const { topCategory, topCategoryCount } = getTopCategory(tasks)

    return {
        total: tasks.length,
        completed,
        pending,
        overdue,
        highPriority,
        completionRate: calculateCompletionRate(tasks.length, completed),
        topCategory,
        topCategoryCount,
    }
}