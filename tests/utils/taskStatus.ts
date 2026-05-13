import type { Task } from "../types/task"
import { isBeforeLocalDay } from "./date"

export type TaskFlowStatus = "overdue" | "pending" | "completed"

export type TaskSummary = {
    total: number
    pending: number
    overdue: number
    completed: number
    completionRate: number
}

export function isTaskOverdue(task: Task, referenceDate = new Date()) {
    if (!task.dueDate || task.done) {
        return false
    }

    return isBeforeLocalDay(task.dueDate, referenceDate)
}

export function getTaskFlowStatus(
    task: Task,
    referenceDate = new Date()
): TaskFlowStatus {
    if (task.done) {
        return "completed"
    }

    if (isTaskOverdue(task, referenceDate)) {
        return "overdue"
    }

    return "pending"
}

export function getCompletionRate(tasks: Task[]) {
    if (tasks.length === 0) {
        return 0
    }

    const completedTasks = tasks.filter((task) => task.done).length

    return Math.round((completedTasks / tasks.length) * 100)
}

export function getTaskSummary(
    tasks: Task[],
    referenceDate = new Date()
): TaskSummary {
    return tasks.reduce<TaskSummary>(
        (summary, task) => {
            const status = getTaskFlowStatus(task, referenceDate)

            summary.total += 1

            if (status === "pending") {
                summary.pending += 1
            }

            if (status === "overdue") {
                summary.overdue += 1
            }

            if (status === "completed") {
                summary.completed += 1
            }

            summary.completionRate = getCompletionRate(tasks)

            return summary
        },
        {
            total: 0,
            pending: 0,
            overdue: 0,
            completed: 0,
            completionRate: 0,
        }
    )
}

export function groupTasksByFlowStatus(tasks: Task[], referenceDate = new Date()) {
    return {
        overdue: tasks.filter(
            (task) => getTaskFlowStatus(task, referenceDate) === "overdue"
        ),
        pending: tasks.filter(
            (task) => getTaskFlowStatus(task, referenceDate) === "pending"
        ),
        completed: tasks.filter(
            (task) => getTaskFlowStatus(task, referenceDate) === "completed"
        ),
    }
}