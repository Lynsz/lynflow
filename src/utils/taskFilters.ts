import type { Priority, Task } from "../types/task"

export type StatusFilter = "all" | "todo" | "done"
export type PriorityFilter = "all" | Priority
export type SortOption = "manual" | "newest" | "oldest" | "priority" | "title"

type FilterTasksParams = {
    tasks: Task[]
    search: string
    status: StatusFilter
    priority: PriorityFilter
    category: string
    sortBy: SortOption
}

const priorityWeight: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
}

export function filterAndSortTasks({
    tasks,
    search,
    status,
    priority,
    category,
    sortBy,
}: FilterTasksParams) {
    const normalizedSearch = search.trim().toLowerCase()

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(normalizedSearch) ||
            task.category.toLowerCase().includes(normalizedSearch)

        const matchesStatus =
            status === "all" ||
            (status === "done" && task.done) ||
            (status === "todo" && !task.done)

        const matchesPriority = priority === "all" || task.priority === priority

        const matchesCategory = category === "all" || task.category === category

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })

    return [...filteredTasks].sort((a, b) => {
        if (sortBy === "manual") {
            return a.order - b.order
        }

        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }

        if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }

        if (sortBy === "priority") {
            return priorityWeight[b.priority] - priorityWeight[a.priority]
        }

        return a.title.localeCompare(b.title)
    })
}