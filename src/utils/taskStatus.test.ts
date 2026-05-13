import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    getCompletionRate,
    getTaskFlowStatus,
    getTaskSummary,
    groupTasksByFlowStatus,
    isTaskOverdue,
} from "../../src/utils/taskStatus"

function createTask(overrides: Partial<Task>): Task {
    return {
        id: "task-id",
        title: "Tarefa teste",
        category: "Geral",
        priority: "medium",
        done: false,
        createdAt: "2026-05-13T00:00:00.000Z",
        order: 1,
        dueDate: null,
        ...overrides,
    }
}

const referenceDate = new Date("2026-05-13T12:00:00.000Z")

describe("taskStatus", () => {
    it("detects overdue tasks", () => {
        const task = createTask({
            dueDate: "2026-05-12",
            done: false,
        })

        expect(isTaskOverdue(task, referenceDate)).toBe(true)
    })

    it("does not mark completed tasks as overdue", () => {
        const task = createTask({
            dueDate: "2026-05-12",
            done: true,
        })

        expect(isTaskOverdue(task, referenceDate)).toBe(false)
    })

    it("returns completed status for done tasks", () => {
        const task = createTask({
            done: true,
            dueDate: "2026-05-12",
        })

        expect(getTaskFlowStatus(task, referenceDate)).toBe("completed")
    })

    it("returns overdue status for pending tasks with past due date", () => {
        const task = createTask({
            done: false,
            dueDate: "2026-05-12",
        })

        expect(getTaskFlowStatus(task, referenceDate)).toBe("overdue")
    })

    it("returns pending status for open tasks inside deadline", () => {
        const task = createTask({
            done: false,
            dueDate: "2026-05-14",
        })

        expect(getTaskFlowStatus(task, referenceDate)).toBe("pending")
    })

    it("calculates completion rate", () => {
        const tasks = [
            createTask({ id: "1", done: true }),
            createTask({ id: "2", done: false }),
            createTask({ id: "3", done: true }),
            createTask({ id: "4", done: false }),
        ]

        expect(getCompletionRate(tasks)).toBe(50)
    })

    it("returns zero completion rate for empty list", () => {
        expect(getCompletionRate([])).toBe(0)
    })

    it("creates task summary", () => {
        const tasks = [
            createTask({
                id: "pending-task",
                done: false,
                dueDate: "2026-05-14",
            }),
            createTask({
                id: "overdue-task",
                done: false,
                dueDate: "2026-05-12",
            }),
            createTask({
                id: "completed-task",
                done: true,
                dueDate: "2026-05-12",
            }),
        ]

        expect(getTaskSummary(tasks, referenceDate)).toEqual({
            total: 3,
            pending: 1,
            overdue: 1,
            completed: 1,
            completionRate: 33,
        })
    })

    it("groups tasks by flow status", () => {
        const pendingTask = createTask({
            id: "pending-task",
            done: false,
            dueDate: "2026-05-14",
        })

        const overdueTask = createTask({
            id: "overdue-task",
            done: false,
            dueDate: "2026-05-12",
        })

        const completedTask = createTask({
            id: "completed-task",
            done: true,
            dueDate: "2026-05-12",
        })

        const groupedTasks = groupTasksByFlowStatus(
            [pendingTask, overdueTask, completedTask],
            referenceDate
        )

        expect(groupedTasks.pending).toEqual([pendingTask])
        expect(groupedTasks.overdue).toEqual([overdueTask])
        expect(groupedTasks.completed).toEqual([completedTask])
    })
})