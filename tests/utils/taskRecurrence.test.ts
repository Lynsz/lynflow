import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    getNextRecurringDate,
    getRecurrenceOptionDescription,
    getRecurrenceOptionLabel,
    getTaskRecurrenceSuggestions,
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
        ...overrides,
    }
}

const referenceDate = new Date("2026-05-13T12:00:00.000Z")

describe("taskRecurrence", () => {
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

    it("returns recurrence labels", () => {
        expect(getRecurrenceOptionLabel("tomorrow")).toBe("Amanhã")
        expect(getRecurrenceOptionLabel("next-week")).toBe("Próxima semana")
        expect(getRecurrenceOptionLabel("next-month")).toBe("Próximo mês")
    })

    it("returns recurrence descriptions", () => {
        expect(
            getRecurrenceOptionDescription("next-week", "2026-05-20")
        ).toContain("2026-05-20")
    })

    it("returns all suggestions for a task", () => {
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