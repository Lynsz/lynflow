import type { Task } from "../types/task"
import { createLocalDate } from "./date"
import { formatDateKey } from "./taskCalendar"

export type RecurrenceOption = "tomorrow" | "next-week" | "next-month"

export type RecurrenceSuggestion = {
    option: RecurrenceOption
    label: string
    description: string
    nextDueDate: string
}

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