import type { Task } from "../types/task"
import { createLocalDate } from "./date"
import { isTaskOverdue } from "./taskStatus"

export type CalendarDay = {
    date: Date
    dateKey: string
    dayNumber: number
    isCurrentMonth: boolean
    isToday: boolean
}

export type CalendarSummary = {
    tasksWithDueDate: number
    dueThisMonth: number
    dueToday: number
    overdue: number
    completedThisMonth: number
}

const priorityWeight: Record<Task["priority"], number> = {
    high: 3,
    medium: 2,
    low: 1,
}

function padDateValue(value: number) {
    return String(value).padStart(2, "0")
}

export function formatDateKey(date: Date) {
    const year = date.getFullYear()
    const month = padDateValue(date.getMonth() + 1)
    const day = padDateValue(date.getDate())

    return `${year}-${month}-${day}`
}

export function getCalendarMonthLabel(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
    }).format(date)
}

export function getCalendarMonthDays(referenceDate: Date): CalendarDay[] {
    const year = referenceDate.getFullYear()
    const month = referenceDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const calendarStart = new Date(firstDayOfMonth)

    calendarStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())

    const todayKey = formatDateKey(new Date())

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(calendarStart)

        date.setDate(calendarStart.getDate() + index)

        const dateKey = formatDateKey(date)

        return {
            date,
            dateKey,
            dayNumber: date.getDate(),
            isCurrentMonth: date.getMonth() === month,
            isToday: dateKey === todayKey,
        }
    })
}

export function getTasksByDueDate(tasks: Task[]) {
    return tasks.reduce<Record<string, Task[]>>((acc, task) => {
        if (!task.dueDate) {
            return acc
        }

        acc[task.dueDate] = [...(acc[task.dueDate] ?? []), task]

        return acc
    }, {})
}

export function sortCalendarTasks(tasks: Task[]) {
    return [...tasks].sort((a, b) => {
        if (a.done !== b.done) {
            return Number(a.done) - Number(b.done)
        }

        if (a.priority !== b.priority) {
            return priorityWeight[b.priority] - priorityWeight[a.priority]
        }

        return a.title.localeCompare(b.title)
    })
}

export function getCalendarSummary(
    tasks: Task[],
    referenceDate = new Date()
): CalendarSummary {
    const referenceYear = referenceDate.getFullYear()
    const referenceMonth = referenceDate.getMonth()
    const todayKey = formatDateKey(referenceDate)

    const tasksWithDueDate = tasks.filter((task) => task.dueDate)

    const dueThisMonth = tasksWithDueDate.filter((task) => {
        if (!task.dueDate) {
            return false
        }

        const dueDate = createLocalDate(task.dueDate)

        return (
            dueDate.getFullYear() === referenceYear &&
            dueDate.getMonth() === referenceMonth
        )
    })

    const dueToday = tasksWithDueDate.filter((task) => {
        return task.dueDate === todayKey && !task.done
    })

    const overdue = tasks.filter((task) => {
        return isTaskOverdue(task, referenceDate)
    })

    const completedThisMonth = dueThisMonth.filter((task) => task.done)

    return {
        tasksWithDueDate: tasksWithDueDate.length,
        dueThisMonth: dueThisMonth.length,
        dueToday: dueToday.length,
        overdue: overdue.length,
        completedThisMonth: completedThisMonth.length,
    }
}