import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    formatDateKey,
    getCalendarMonthDays,
    getCalendarMonthLabel,
    getCalendarSummary,
    getTasksByDueDate,
    sortCalendarTasks,
} from "../../src/utils/taskCalendar"

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

describe("taskCalendar", () => {
    it("formats date key using local date values", () => {
        const date = new Date(2026, 4, 13)

        expect(formatDateKey(date)).toBe("2026-05-13")
    })

    it("returns month label in pt-BR", () => {
        const label = getCalendarMonthLabel(new Date(2026, 4, 13))

        expect(label).toContain("maio")
        expect(label).toContain("2026")
    })

    it("creates 42 days for calendar grid", () => {
        const days = getCalendarMonthDays(new Date(2026, 4, 13))

        expect(days).toHaveLength(42)
        expect(days.some((day) => day.dateKey === "2026-05-13")).toBe(true)
    })

    it("groups tasks by due date", () => {
        const tasks = [
            createTask({
                id: "task-1",
                title: "Primeira tarefa",
                dueDate: "2026-05-13",
            }),
            createTask({
                id: "task-2",
                title: "Segunda tarefa",
                dueDate: "2026-05-13",
            }),
            createTask({
                id: "task-3",
                title: "Sem vencimento",
                dueDate: null,
            }),
        ]

        const groupedTasks = getTasksByDueDate(tasks)

        expect(groupedTasks["2026-05-13"]).toHaveLength(2)
        expect(groupedTasks["2026-05-14"]).toBeUndefined()
    })

    it("sorts pending high priority tasks first", () => {
        const tasks = [
            createTask({
                id: "done-high",
                title: "Concluída alta",
                priority: "high",
                done: true,
            }),
            createTask({
                id: "pending-low",
                title: "Pendente baixa",
                priority: "low",
                done: false,
            }),
            createTask({
                id: "pending-high",
                title: "Pendente alta",
                priority: "high",
                done: false,
            }),
        ]

        const sortedTasks = sortCalendarTasks(tasks)

        expect(sortedTasks.map((task) => task.id)).toEqual([
            "pending-high",
            "pending-low",
            "done-high",
        ])
    })

    it("calculates calendar summary", () => {
        const summary = getCalendarSummary(
            [
                createTask({
                    id: "task-1",
                    done: false,
                    dueDate: "2026-05-13",
                }),
                createTask({
                    id: "task-2",
                    done: true,
                    dueDate: "2026-05-14",
                }),
                createTask({
                    id: "task-3",
                    done: false,
                    dueDate: "2026-05-12",
                }),
                createTask({
                    id: "task-4",
                    done: false,
                    dueDate: null,
                }),
            ],
            new Date("2026-05-13T12:00:00.000Z")
        )

        expect(summary.tasksWithDueDate).toBe(3)
        expect(summary.dueThisMonth).toBe(3)
        expect(summary.dueToday).toBe(1)
        expect(summary.overdue).toBe(1)
        expect(summary.completedThisMonth).toBe(1)
    })
})