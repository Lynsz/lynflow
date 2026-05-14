import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import { normalizeTasks } from "../../src/store/TasksProvider"
import {
    generateNextRecurringTaskUpdate,
    getNextDueDateByRecurrence,
    getNextRecurringDate,
    getRecurrenceOptionDescription,
    getRecurrenceOptionLabel,
    getTaskRecurrenceLabel,
    getTaskRecurrenceSuggestions,
    normalizeTaskRecurrence,
} from "../../src/utils/taskRecurrence"

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

describe("taskRecurrence", () => {
    it("calculates daily recurrence", () => {
        expect(getNextDueDateByRecurrence("2026-05-13", "daily")).toBe(
            "2026-05-14"
        )
    })

    it("calculates weekly recurrence", () => {
        expect(getNextDueDateByRecurrence("2026-05-13", "weekly")).toBe(
            "2026-05-20"
        )
    })

    it("calculates monthly recurrence", () => {
        expect(getNextDueDateByRecurrence("2026-05-13", "monthly")).toBe(
            "2026-06-13"
        )
    })

    it("returns null when there is no recurrence", () => {
        expect(getNextDueDateByRecurrence("2026-05-13", "none")).toBeNull()
    })

    it("does not generate next occurrence when task has no due date", () => {
        const task = createTask({
            dueDate: null,
            recurrence: "daily",
        })

        expect(generateNextRecurringTaskUpdate(task)).toBeNull()
    })

    it("generates next occurrence when a recurring task is completed", () => {
        const task = createTask({
            dueDate: "2026-05-13",
            recurrence: "weekly",
        })

        expect(generateNextRecurringTaskUpdate(task)).toEqual({
            dueDate: "2026-05-20",
            done: false,
        })
    })

    it("returns recurrence labels in pt-BR", () => {
        expect(getTaskRecurrenceLabel("none")).toBe("Sem recorrência")
        expect(getTaskRecurrenceLabel("daily")).toBe("Diária")
        expect(getTaskRecurrenceLabel("weekly")).toBe("Semanal")
        expect(getTaskRecurrenceLabel("monthly")).toBe("Mensal")
    })

    it("validates recurrence values", () => {
        expect(normalizeTaskRecurrence("daily")).toBe("daily")
        expect(normalizeTaskRecurrence("invalid")).toBe("none")
        expect(normalizeTaskRecurrence(undefined)).toBe("none")
    })

    it("normalizes legacy tasks without recurrence", () => {
        const [task] = normalizeTasks([
            {
                id: "legacy",
                title: "Tarefa antiga",
                category: "Geral",
                priority: "medium",
                done: false,
                dueDate: "2026-05-13",
                createdAt: "2026-05-13T00:00:00.000Z",
                order: 0,
            },
        ])

        expect(task.recurrence).toBe("none")
    })

    it("calculates next day from task due date", () => {
        const task = createTask({
            dueDate: "2026-05-13",
        })

        expect(getNextRecurringDate(task, "tomorrow", referenceDate)).toBe(
            "2026-05-14"
        )
    })

    it("calculates next week from task due date", () => {
        const task = createTask({
            dueDate: "2026-05-13",
        })

        expect(getNextRecurringDate(task, "next-week", referenceDate)).toBe(
            "2026-05-20"
        )
    })

    it("calculates next month from task due date", () => {
        const task = createTask({
            dueDate: "2026-05-13",
        })

        expect(getNextRecurringDate(task, "next-month", referenceDate)).toBe(
            "2026-06-13"
        )
    })

    it("uses reference date when task has no due date", () => {
        const task = createTask({
            dueDate: null,
        })

        expect(getNextRecurringDate(task, "tomorrow", referenceDate)).toBe(
            "2026-05-14"
        )
    })

    it("returns quick date labels", () => {
        expect(getRecurrenceOptionLabel("tomorrow")).toBe("Amanhã")
        expect(getRecurrenceOptionLabel("next-week")).toBe("Próxima semana")
        expect(getRecurrenceOptionLabel("next-month")).toBe("Próximo mês")
    })

    it("returns quick date descriptions", () => {
        expect(
            getRecurrenceOptionDescription("next-week", "2026-05-20")
        ).toContain("2026-05-20")
    })

    it("returns all quick date suggestions for a task", () => {
        const suggestions = getTaskRecurrenceSuggestions(
            createTask({
                dueDate: "2026-05-13",
            }),
            referenceDate
        )

        expect(suggestions).toHaveLength(3)
        expect(suggestions.map((suggestion) => suggestion.option)).toEqual([
            "tomorrow",
            "next-week",
            "next-month",
        ])
    })
})
