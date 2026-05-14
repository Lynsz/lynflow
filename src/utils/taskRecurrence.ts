import type { Task, TaskRecurrence } from "../types/task"
import { createLocalDate } from "./date"
import { formatDateKey } from "./taskCalendar"

export type RecurrenceOption = "tomorrow" | "next-week" | "next-month"

export type RecurrenceSuggestion = {
    option: RecurrenceOption
    label: string
    description: string
    nextDueDate: string
}

export type GeneratedRecurringTaskUpdate = {
    dueDate: string
    done: false
}

export const taskRecurrences: TaskRecurrence[] = [
    "none",
    "daily",
    "weekly",
    "monthly",
]

function addDays(date: Date, days: number) {
    const nextDate = new Date(date)

    nextDate.setDate(nextDate.getDate() + days)

    return nextDate
}

function addMonths(date: Date, months: number) {
    const nextDate = new Date(date)

    nextDate.setMonth(nextDate.getMonth() + months)

    return nextDate
}

function getBaseDate(task: Task, referenceDate: Date) {
    if (task.dueDate) {
        return createLocalDate(task.dueDate)
    }

    return referenceDate
}

export function isTaskRecurrence(value: unknown): value is TaskRecurrence {
    return (
        typeof value === "string" &&
        taskRecurrences.includes(value as TaskRecurrence)
    )
}

export function normalizeTaskRecurrence(value: unknown): TaskRecurrence {
    return isTaskRecurrence(value) ? value : "none"
}

export function hasActiveRecurrence(task: Pick<Task, "recurrence">) {
    return normalizeTaskRecurrence(task.recurrence) !== "none"
}

export function getTaskRecurrenceLabel(recurrence: TaskRecurrence) {
    if (recurrence === "daily") return "Diária"
    if (recurrence === "weekly") return "Semanal"
    if (recurrence === "monthly") return "Mensal"

    return "Sem recorrência"
}

export function getNextDueDateByRecurrence(
    dueDate: string,
    recurrence: TaskRecurrence
) {
    const baseDate = createLocalDate(dueDate)

    if (recurrence === "daily") {
        return formatDateKey(addDays(baseDate, 1))
    }

    if (recurrence === "weekly") {
        return formatDateKey(addDays(baseDate, 7))
    }

    if (recurrence === "monthly") {
        return formatDateKey(addMonths(baseDate, 1))
    }

    return null
}

export function generateNextRecurringTaskUpdate(
    task: Task
): GeneratedRecurringTaskUpdate | null {
    if (!task.dueDate || !hasActiveRecurrence(task)) {
        return null
    }

    const nextDueDate = getNextDueDateByRecurrence(
        task.dueDate,
        normalizeTaskRecurrence(task.recurrence)
    )

    if (!nextDueDate) {
        return null
    }

    return {
        dueDate: nextDueDate,
        done: false,
    }
}

export function getNextRecurringDate(
    task: Task,
    option: RecurrenceOption,
    referenceDate = new Date()
) {
    const baseDate = getBaseDate(task, referenceDate)

    if (option === "tomorrow") {
        return formatDateKey(addDays(baseDate, 1))
    }

    if (option === "next-week") {
        return formatDateKey(addDays(baseDate, 7))
    }

    return formatDateKey(addMonths(baseDate, 1))
}

export function getRecurrenceOptionLabel(option: RecurrenceOption) {
    if (option === "tomorrow") {
        return "Amanhã"
    }

    if (option === "next-week") {
        return "Próxima semana"
    }

    return "Próximo mês"
}

export function getRecurrenceOptionDescription(
    option: RecurrenceOption,
    nextDueDate: string
) {
    if (option === "tomorrow") {
        return `Reagendar para amanhã: ${nextDueDate}.`
    }

    if (option === "next-week") {
        return `Reagendar para a próxima semana: ${nextDueDate}.`
    }

    return `Reagendar para o próximo mês: ${nextDueDate}.`
}

export function getTaskRecurrenceSuggestions(
    task: Task,
    referenceDate = new Date()
): RecurrenceSuggestion[] {
    const options: RecurrenceOption[] = ["tomorrow", "next-week", "next-month"]

    return options.map((option) => {
        const nextDueDate = getNextRecurringDate(task, option, referenceDate)

        return {
            option,
            nextDueDate,
            label: getRecurrenceOptionLabel(option),
            description: getRecurrenceOptionDescription(option, nextDueDate),
        }
    })
}
