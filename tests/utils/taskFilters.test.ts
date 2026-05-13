import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import { filterAndSortTasks } from "../../src/utils/taskFilters"

const referenceDate = new Date("2026-05-13T12:00:00.000Z")

const tasks: Task[] = [
    {
        id: "1",
        title: "Deploy Vercel",
        category: "Deploy",
        priority: "high",
        done: false,
        dueDate: "2026-05-20",
        createdAt: "2026-05-13T10:00:00.000Z",
        order: 2,
    },
    {
        id: "2",
        title: "Criar README",
        category: "Portfolio",
        priority: "medium",
        done: true,
        dueDate: "2026-05-15",
        createdAt: "2026-05-12T10:00:00.000Z",
        order: 1,
    },
    {
        id: "3",
        title: "Revisar UI",
        category: "Design",
        priority: "low",
        done: false,
        dueDate: null,
        createdAt: "2026-05-11T10:00:00.000Z",
        order: 0,
    },
    {
        id: "4",
        title: "Corrigir tarefa atrasada",
        category: "Bugfix",
        priority: "high",
        done: false,
        dueDate: "2026-05-12",
        createdAt: "2026-05-10T10:00:00.000Z",
        order: 3,
    },
]

describe("filterAndSortTasks", () => {
    it("filters tasks by search, status, priority, and category", () => {
        const result = filterAndSortTasks({
            tasks,
            search: "deploy",
            status: "todo",
            priority: "high",
            category: "Deploy",
            sortBy: "manual",
            referenceDate,
        })

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("1")
    })

    it("filters overdue tasks", () => {
        const result = filterAndSortTasks({
            tasks,
            search: "",
            status: "overdue",
            priority: "all",
            category: "all",
            sortBy: "manual",
            referenceDate,
        })

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("4")
    })

    it("does not include completed tasks in overdue filter", () => {
        const result = filterAndSortTasks({
            tasks: [
                {
                    id: "completed-overdue",
                    title: "Tarefa concluída vencida",
                    category: "Teste",
                    priority: "medium",
                    done: true,
                    dueDate: "2026-05-12",
                    createdAt: "2026-05-10T10:00:00.000Z",
                    order: 1,
                },
            ],
            search: "",
            status: "overdue",
            priority: "all",
            category: "all",
            sortBy: "manual",
            referenceDate,
        })

        expect(result).toHaveLength(0)
    })

    it("sorts tasks by manual order", () => {
        const result = filterAndSortTasks({
            tasks,
            search: "",
            status: "all",
            priority: "all",
            category: "all",
            sortBy: "manual",
            referenceDate,
        })

        expect(result.map((task) => task.id)).toEqual(["3", "2", "1", "4"])
    })

    it("sorts tasks by priority weight", () => {
        const result = filterAndSortTasks({
            tasks,
            search: "",
            status: "all",
            priority: "all",
            category: "all",
            sortBy: "priority",
            referenceDate,
        })

        expect(result.map((task) => task.priority)).toEqual([
            "high",
            "high",
            "medium",
            "low",
        ])
    })

    it("sorts tasks by due date with undated tasks last", () => {
        const result = filterAndSortTasks({
            tasks,
            search: "",
            status: "all",
            priority: "all",
            category: "all",
            sortBy: "dueDate",
            referenceDate,
        })

        expect(result.map((task) => task.id)).toEqual(["4", "2", "1", "3"])
    })
})