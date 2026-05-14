import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    filterTasksByPeriod,
    filterTasksByPreviousPeriod,
    getPeriodDateRange,
    getPeriodRangeLabel,
    getPreviousPeriodDateRange,
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
        recurrence: "none",
        ...overrides,
    }
}

const referenceDate = new Date("2026-05-13T12:00:00.000Z")

describe("taskPeriodAnalytics", () => {
    it("returns period date range", () => {
        const range = getPeriodDateRange("7d", referenceDate)

        expect(range?.startDate.toISOString()).toContain("2026-05-07")
        expect(range?.endDate.toISOString()).toContain("2026-05-13")
    })

    it("returns previous period date range", () => {
        const range = getPreviousPeriodDateRange("7d", referenceDate)

        expect(range?.startDate.toISOString()).toContain("2026-04-30")
        expect(range?.endDate.toISOString()).toContain("2026-05-06")
    })

    it("returns null range for all period", () => {
        expect(getPeriodDateRange("all", referenceDate)).toBeNull()
        expect(getPreviousPeriodDateRange("all", referenceDate)).toBeNull()
    })

    it("returns period range label", () => {
        expect(getPeriodRangeLabel("7d", referenceDate)).toBe(
            "07/05 até 13/05"
        )

        expect(getPeriodRangeLabel("all", referenceDate)).toBe(
            "Todo o histórico salvo"
        )
    })

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

    it("filters tasks by previous period", () => {
        const tasks = [
            createTask({
                id: "current-period",
                createdAt: "2026-05-10T10:00:00.000Z",
            }),
            createTask({
                id: "previous-period",
                createdAt: "2026-05-03T10:00:00.000Z",
            }),
            createTask({
                id: "outside-period",
                createdAt: "2026-04-20T10:00:00.000Z",
            }),
        ]

        const filteredTasks = filterTasksByPreviousPeriod(
            tasks,
            "7d",
            referenceDate
        )

        expect(filteredTasks.map((task) => task.id)).toEqual([
            "previous-period",
        ])
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
        expect(analytics.rangeLabel).toBe("07/05 até 13/05")
        expect(analytics.total).toBe(3)
        expect(analytics.completed).toBe(1)
        expect(analytics.pending).toBe(2)
        expect(analytics.highPriority).toBe(2)
        expect(analytics.overdue).toBe(1)
        expect(analytics.completionRate).toBe(33)
        expect(analytics.topCategory).toBe("Portfolio")
        expect(analytics.topCategoryCount).toBe(2)
        expect(analytics.categoryBreakdown).toHaveLength(2)
        expect(analytics.categoryBreakdown[0]).toEqual({
            category: "Portfolio",
            total: 2,
            completed: 1,
            pending: 1,
        })
        expect(analytics.recentTasks.map((task) => task.id)).toEqual([
            "task-3",
            "task-2",
            "task-1",
        ])
    })

    it("compares current period with previous period", () => {
        const analytics = getTaskPeriodAnalytics(
            [
                createTask({
                    id: "current-1",
                    done: true,
                    createdAt: "2026-05-10T10:00:00.000Z",
                }),
                createTask({
                    id: "current-2",
                    done: true,
                    createdAt: "2026-05-11T10:00:00.000Z",
                }),
                createTask({
                    id: "previous-1",
                    done: false,
                    createdAt: "2026-05-03T10:00:00.000Z",
                }),
                createTask({
                    id: "previous-2",
                    done: false,
                    createdAt: "2026-05-04T10:00:00.000Z",
                }),
            ],
            "7d",
            referenceDate
        )

        expect(analytics.comparison.previousTotal).toBe(2)
        expect(analytics.comparison.previousCompleted).toBe(0)
        expect(analytics.comparison.previousCompletionRate).toBe(0)
        expect(analytics.comparison.taskDelta).toBe(0)
        expect(analytics.comparison.completionRateDelta).toBe(100)
        expect(analytics.comparison.trendStatus).toBe("up")
        expect(analytics.comparison.label).toBe("Evolução positiva")
    })

    it("returns neutral comparison for all period", () => {
        const analytics = getTaskPeriodAnalytics(
            [
                createTask({
                    id: "task-1",
                    done: true,
                    createdAt: "2026-05-10T10:00:00.000Z",
                }),
            ],
            "all",
            referenceDate
        )

        expect(analytics.comparison.trendStatus).toBe("neutral")
        expect(analytics.comparison.label).toBe("Histórico completo")
        expect(analytics.comparison.taskDelta).toBe(0)
        expect(analytics.comparison.completionRateDelta).toBe(0)
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
        expect(analytics.categoryBreakdown).toEqual([])
        expect(analytics.recentTasks).toEqual([])
    })
})