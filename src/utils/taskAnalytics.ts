import type { Priority, Task } from "../types/task"

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

const priorityLabels: Record<Priority, string> = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
}

const priorityColors: Record<Priority, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
}

export function getWeeklyProductivity(tasks: Task[]) {
    const data = weekDays.map((day) => ({
        day,
        total: 0,
        completed: 0,
        productivity: 0,
    }))

    tasks.forEach((task) => {
        const date = new Date(task.createdAt)
        const dayIndex = date.getDay()

        data[dayIndex].total += 1

        if (task.done) {
            data[dayIndex].completed += 1
        }
    })

    return data.map((item) => ({
        ...item,
        productivity:
            item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0,
    }))
}

export function getPriorityDistribution(tasks: Task[]) {
    const counters: Record<Priority, number> = {
        high: 0,
        medium: 0,
        low: 0,
    }

    tasks.forEach((task) => {
        counters[task.priority] += 1
    })

    return Object.entries(counters).map(([priority, value]) => ({
        priority: priorityLabels[priority as Priority],
        value,
        color: priorityColors[priority as Priority],
    }))
}

export function getCategoryDistribution(tasks: Task[]) {
    const counters = new Map<string, number>()

    tasks.forEach((task) => {
        counters.set(task.category, (counters.get(task.category) ?? 0) + 1)
    })

    return Array.from(counters.entries())
        .map(([category, total]) => ({
            category,
            total,
        }))
        .sort((a, b) => b.total - a.total)
}

export function getMostUsedCategory(tasks: Task[]) {
    const categoryData = getCategoryDistribution(tasks)

    return categoryData[0]?.category ?? "Nenhuma categoria"
}

export function getProductivityStatus(productivity: number) {
    if (productivity >= 75) {
        return "Fluxo excelente"
    }

    if (productivity >= 50) {
        return "Bom progresso"
    }

    if (productivity >= 25) {
        return "Em evolução"
    }

    return "Precisa de foco"
}