export type Priority = "low" | "medium" | "high"
export type TaskRecurrence = "none" | "daily" | "weekly" | "monthly"

export type Task = {
    id: string
    title: string
    category: string
    priority: Priority
    done: boolean
    createdAt: string
    order: number
    dueDate?: string | null
    recurrence?: TaskRecurrence
}
