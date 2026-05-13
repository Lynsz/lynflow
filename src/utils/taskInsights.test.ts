import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import { getTaskInsights } from "../../src/utils/taskInsights"

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

describe("taskInsights", () => {
    it("returns empty insights when there are no tasks", () => {
        const insights = getTaskInsights([], referenceDate)

        expect(insights).toEqual({
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
            highPriority: 0,
            completionRate: 0,
            topCategory: null,
            topCategoryCount: 0,
        })
    })

    it("calculates task insights", () => {
        const insights = getTaskInsights(
            [
                createTask({
                    id: "task-1",
                    category: "Portfolio",
                    priority: "high",
                    done: true,
                    dueDate: "2026-05-10",
                }),
                createTask({
                    id: "task-2",
                    category: "Portfolio",
                    priority: "high",
                    done: false,
                    dueDate: "2026-05-12",
                }),
                createTask({
                    id: "task-3",
                    category: "Estudos",
                    priority: "medium",
                    done: false,
                    dueDate: "2026-05-14",
                }),
                createTask({
                    id: "task-4",
                    category: "Geral",
                    priority: "low",
                    done: true,
                    dueDate: null,
                }),
            ],
            referenceDate
        )

        expect(insights.total).toBe(4)
        expect(insights.completed).toBe(2)
        expect(insights.pending).toBe(1)
        expect(insights.overdue).toBe(1)
        expect(insights.highPriority).toBe(2)
        expect(insights.completionRate).toBe(50)
        expect(insights.topCategory).toBe("Portfolio")
        expect(insights.topCategoryCount).toBe(2)
    })

    it("does not count completed overdue tasks as overdue", () => {
        const insights = getTaskInsights(
            [
                createTask({
                    id: "completed-overdue",
                    done: true,
                    dueDate: "2026-05-10",
                }),
            ],
            referenceDate
        )

        expect(insights.completed).toBe(1)
        expect(insights.overdue).toBe(0)
        expect(insights.pending).toBe(0)
    })
})