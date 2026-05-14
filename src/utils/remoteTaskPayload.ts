import type { ActivityType } from "../types/activity"
import type { Priority, Task, TaskRecurrence } from "../types/task"
import { normalizeTaskRecurrence } from "./taskRecurrence"

export type RemoteTaskPayload = {
    user_id: string
    title: string
    category: string
    priority: Priority
    done: boolean
    due_date: string | null
    recurrence: TaskRecurrence
    order_index: number
}

export type RemoteTaskUpdatePayload = {
    title?: string
    category?: string
    priority?: Priority
    done?: boolean
    order_index?: number
    due_date?: string | null
    recurrence?: TaskRecurrence
}

export type RemoteActivityPayload = {
    user_id: string
    type: ActivityType
    title: string
    description: string
}

export function buildRemoteTaskPayload(
    userId: string,
    task: Task
): RemoteTaskPayload {
    return {
        user_id: userId,
        title: task.title,
        category: task.category,
        priority: task.priority,
        done: task.done,
        due_date: task.dueDate ?? null,
        recurrence: normalizeTaskRecurrence(task.recurrence),
        order_index: task.order,
    }
}

export function buildRemoteTaskUpdatePayload(
    data: Partial<Omit<Task, "id">>
): RemoteTaskUpdatePayload {
    const payload: RemoteTaskUpdatePayload = {}

    if (typeof data.title === "string") payload.title = data.title
    if (typeof data.category === "string") payload.category = data.category
    if (data.priority) payload.priority = data.priority
    if (typeof data.done === "boolean") payload.done = data.done
    if (typeof data.order === "number") payload.order_index = data.order
    if (typeof data.dueDate === "string" || data.dueDate === null) {
        payload.due_date = data.dueDate
    }
    if (data.recurrence) {
        payload.recurrence = normalizeTaskRecurrence(data.recurrence)
    }

    return payload
}

export function buildRemoteActivityPayload(
    userId: string,
    type: ActivityType,
    title: string,
    description: string
): RemoteActivityPayload {
    return {
        user_id: userId,
        type,
        title,
        description,
    }
}
