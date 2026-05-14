import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    filterTasksByPeriod,
    getTaskPeriodAnalytics,
} from "../../src/utils/taskPeriodAnalytics"

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

describe("taskPeriodAnalytics", () => {
    it("filters tasks by last 7 days", () => {
        const tasks = [
            createTask({
                id: "inside-period",
                createdAt: "2026-05-10T10:00:00.000Z",
            }),
            createTask({
                id: "outside-period",
                createdAt: "2026-05-01T10:00:00.000Z",
            }),
        ]

        const filteredTasks = filterTasksByPeriod(tasks, "7d", referenceDate)

        expect(filteredTasks.map((task) => task.id)).toEqual(["inside-period"])
    })

    it("keeps all tasks when period is all", () => {
        const tasks = [
            createTask({
                id: "task-1",
                createdAt: "2026-01-01T10:00:00.000Z",
            }),
            createTask({
                id: "task-2",
                createdAt: "2026-05-13T10:00:00.000Z",
            }),
        ]

        const filteredTasks = filterTasksByPeriod(tasks, "all", referenceDate)

        expect(filteredTasks).toHaveLength(2)
    })

    it("calculates period analytics", () => {
        const analytics = getTaskPeriodAnalytics(
            [
                createTask({
                    id: "task-1",
                    category: "Portfolio",
                    priority: "high",
                    done: true,
                    createdAt: "2026-05-10T10:00:00.000Z",
                    dueDate: "2026-05-10",
                }),
                createTask({
                    id: "task-2",
                    category: "Portfolio",
                    priority: "high",
                    done: false,
                    createdAt: "2026-05-11T10:00:00.000Z",
                    dueDate: "2026-05-12",
                }),
                createTask({
                    id: "task-3",
                    category: "Estudos",
                    priority: "medium",
                    done: false,
                    createdAt: "2026-05-12T10:00:00.000Z",
                    dueDate: "2026-05-14",
                }),
                createTask({
                    id: "task-4",
                    category: "Antiga",
                    priority: "low",
                    done: false,
                    createdAt: "2026-04-01T10:00:00.000Z",
                }),
            ],
            "7d",
            referenceDate
        )

        expect(analytics.period).toBe("7d")
        expect(analytics.label).toBe("Últimos 7 dias")
        expect(analytics.total).toBe(3)
        expect(analytics.completed).toBe(1)
        expect(analytics.pending).toBe(2)
        expect(analytics.highPriority).toBe(2)
        expect(analytics.overdue).toBe(1)
        expect(analytics.completionRate).toBe(33)
        expect(analytics.topCategory).toBe("Portfolio")
        expect(analytics.topCategoryCount).toBe(2)
    })

    it("returns empty analytics when there are no tasks in period", () => {
        const analytics = getTaskPeriodAnalytics(
            [
                createTask({
                    id: "old-task",
                    createdAt: "2026-01-01T10:00:00.000Z",
                }),
            ],
            "7d",
            referenceDate
        )

        expect(analytics.total).toBe(0)
        expect(analytics.completed).toBe(0)
        expect(analytics.pending).toBe(0)
        expect(analytics.completionRate).toBe(0)
        expect(analytics.topCategory).toBeNull()
    })
})